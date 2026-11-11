const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { randomUUID } = require('node:crypto');
const { JSDOM } = require('jsdom');
const { createApp } = require('../server.cjs');
const { renderPage } = require('../site.cjs');
const script = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const waitFor = async predicate => {
  for (let i = 0; i < 150; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 10)); }
  throw new Error('UI did not reach the expected state');
};
async function fixture(t, { calendarUrl = '', segment = 'business', locale = 'tr' } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-dom-'));
  const app = createApp({ dataDir: directory, calendarUrl });
  app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
  const origin = `http://127.0.0.1:${app.server.address().port}`;
  const calls = []; const pending = new Set(); let failNextLead = false;
  const dom = new JSDOM(renderPage(locale, segment), { url: origin + '/isletmeler?utm_source=test&utm_campaign=pilot', runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window;
  Object.defineProperty(win.crypto, 'randomUUID', { value: randomUUID });
  // This is a DOM behavior test, not a rendering/browser QA test.
  win.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(target) { this.cb([{ target, isIntersecting: true }]); } disconnect() {} };
  win.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  win.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new win.Event('close')); };
  function trackPending(promise) {
    pending.add(promise);
    promise.then(() => pending.delete(promise), () => pending.delete(promise));
    return promise;
  }
  win.fetch = (url, options = {}) => {
    if (options.body) calls.push({ url, body: JSON.parse(options.body) });
    let promise;
    if (failNextLead && url === '/api/leads') { failNextLead = false; promise = Promise.resolve(new Response(JSON.stringify({ error: 'unable_to_save' }), { status: 500 })); }
    else promise = fetch(new URL(url, origin), { ...options, headers: { ...options.headers, Origin: origin } });
    return trackPending(promise.then(response => {
      const json = response.json.bind(response);
      response.json = () => trackPending(json());
      return response;
    }));
  };
  win.eval(script);
  const $ = selector => win.document.querySelector(selector);
  const click = selector => $(selector).click();
  function fill(selector, value) { const el = $(selector); el.value = value; el.dispatchEvent(new win.Event('input', { bubbles: true })); }
  function contact(email, kind = 'agent') { fill(`#${kind === 'agent' ? 'pilot' : kind}-email`, email); $(`#${kind}-form [name="consent"]`).checked = true; }
  t.after(async () => {
    // Reading a response can start the next queued analytics request.
    do { await Promise.allSettled([...pending]); await new Promise(resolve => setImmediate(resolve)); } while (pending.size);
    dom.window.close(); app.server.close(); await once(app.server, 'close'); fs.rmSync(directory, { recursive: true, force: true });
  });
  return { app, $, click, fill, contact, calls, win, failLead: () => { failNextLead = true; } };
}

test('pilot wizard retains choices, submits a real record, and works after analytics opt-out', async t => {
  const f = await fixture(t);
  f.click('#consent-decline'); f.click('[data-select="autopilot"]'); f.click('[data-open="agent"]');
  assert.equal(f.$('#agent-dialog').open, true);
  f.click('#wizard-next'); assert.equal(f.$('[data-step="1"]').hidden, false);
  f.$('[name="channel"]').value = 'whatsapp'; f.$('[name="channel"]').dispatchEvent(new f.win.Event('change', { bubbles: true }));
  f.click('#wizard-next'); f.contact('wizard@example.test');
  f.click('#wizard-submit');
  await waitFor(() => !f.$('#agent-dialog .form-success').hidden);
  const lead = f.app.store.db.prepare('SELECT * FROM leads WHERE email = ?').get('wizard@example.test');
  assert.equal(lead.solution, 'autopilot'); assert.equal(lead.channel, 'whatsapp'); assert.equal(lead.visitor_id, null); assert.equal(lead.file_mode, 'sample');
  assert.equal(f.calls.filter(call => call.url === '/api/events').length, 0);
  assert.match(f.$('#agent-dialog .form-success').textContent, /canlı ajan etkinleştirmez/);
  f.click('#agent-dialog .restart-request');
  assert.equal(f.$('#agent-form').hidden, false); assert.equal(f.$('[data-step="0"]').hidden, false);
  f.click('#wizard-next'); f.click('#wizard-back'); assert.equal(f.$('[data-step="0"]').hidden, false);
});

test('network failure preserves fields and retry uses the same request ID', async t => {
  const f = await fixture(t); f.click('#consent-decline'); f.click('[data-open="waitlist"]'); f.contact('retry@example.test', 'waitlist');
  f.failLead(); f.click('#waitlist-form button[type="submit"]');
  await waitFor(() => !f.$('#waitlist-form .form-error').hidden);
  assert.equal(f.$('#waitlist-email').value, 'retry@example.test'); assert.equal(f.$('#waitlist-form').hidden, false);
  await waitFor(() => !f.$('#waitlist-form button[type="submit"]').disabled);
  f.click('#waitlist-form button[type="submit"]'); await waitFor(() => !f.$('#waitlist-dialog .form-success').hidden);
  const calls = f.calls.filter(call => call.url === '/api/leads');
  assert.equal(calls.length, 2); assert.equal(calls[0].body.id, calls[1].body.id);
  assert.equal(f.app.store.db.prepare("SELECT count(*) AS n FROM leads WHERE kind = 'waitlist'").get().n, 1);
});

test('measurement begins only after opt-in and revocation stops new client events', async t => {
  const f = await fixture(t); assert.equal(f.calls.length, 0);
  f.click('#consent-accept');
  await waitFor(() => f.calls.filter(call => call.url === '/api/events').length === 3);
  f.click('[data-select="forecast"]');
  assert.ok(f.calls.some(call => call.body.event === 'solution_selected'));
  assert.ok(f.calls.every(call => call.body.context.analyticsConsent === true));
  f.click('#analytics-settings'); f.click('#consent-decline'); const count = f.calls.length;
  f.click('[data-select="autopilot"]'); assert.equal(f.calls.length, count);
  assert.equal(f.win.localStorage.getItem('qualifi.visitor'), null);
});

test('missing calendar offers a real meeting request without claiming a reservation', async t => {
  const f = await fixture(t); f.click('#consent-decline'); f.click('[data-open="meeting"]');
  await waitFor(() => /henüz eklenmedi/.test(f.$('#calendar-description').textContent));
  assert.equal(f.$('#calendar-link').hidden, true);
  f.contact('meeting@example.test', 'meeting'); f.click('#meeting-form button[type="submit"]');
  await waitFor(() => !f.$('#meeting-dialog .form-success').hidden);
  assert.match(f.$('#meeting-dialog .form-success').textContent, /rezervasyonu yapılmadı/);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM bookings').get().n, 0);
});

test('configured Google scheduling URL is exposed as a real external calendar link', async t => {
  const calendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/test-schedule';
  const f = await fixture(t, { calendarUrl, segment: 'freelance', locale: 'en' });
  f.click('#consent-decline'); f.click('[data-open="meeting"]');
  await waitFor(() => !f.$('#calendar-link').hidden);
  assert.equal(f.$('#calendar-link').href, calendarUrl);
  assert.match(f.$('#calendar-description').textContent, /available date and time/);
});

test('own-document flow prevents advancing without a file; sample path remains available', async t => {
  const f = await fixture(t); f.click('#consent-decline'); f.click('[data-open="agent"]'); f.click('#wizard-next');
  f.click('[name="fileMode"][value="upload"]'); f.click('#wizard-next');
  assert.equal(f.$('[data-step="1"]').hidden, false); assert.equal(f.$('#agent-form .form-error').hidden, false);
  f.click('[name="fileMode"][value="sample"]'); f.click('#wizard-next');
  assert.equal(f.$('[data-step="2"]').hidden, false);
});
