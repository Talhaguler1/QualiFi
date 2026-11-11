const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { randomUUID } = require('node:crypto');
const { JSDOM } = require('jsdom');
const { createApp } = require('../server.cjs');
const { BY_ID } = require('../campaigns.cjs');
const { renderCampaign } = require('../campaign-site.cjs');
const { summarize } = require('../store.cjs');
const source = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
async function waitFor(predicate) {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 10)); }
  throw new Error('Campaign UI did not reach expected state');
}
async function fixture(t, id = 'sales-follow-up', locale = 'tr', calendarUrl = '') {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-campaign-dom-'));
  const app = createApp({ dataDir: directory, calendarUrl }); app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
  const origin = `http://127.0.0.1:${app.server.address().port}`;
  const dom = new JSDOM(renderCampaign(locale, BY_ID[id]), { url: origin + BY_ID[id].routes[locale] + '?utm_source=search&utm_campaign=test&email=private@example.test', runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window; const calls = []; const pending = new Set(); let failNext = false;
  Object.defineProperty(win.crypto, 'randomUUID', { value: randomUUID });
  win.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  win.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new win.Event('close')); };
  function trackPending(promise) {
    pending.add(promise);
    promise.then(() => pending.delete(promise), () => pending.delete(promise));
    return promise;
  }
  win.fetch = (url, options = {}) => {
    if (options.body) calls.push({ url, payload: JSON.parse(options.body) });
    let promise;
    if (failNext && url === '/api/leads') { failNext = false; promise = Promise.resolve(new Response(JSON.stringify({ error: 'unable_to_save' }), { status: 500 })); }
    else promise = fetch(new URL(url, origin), { ...options, headers: { ...options.headers, Origin: origin } });
    return trackPending(promise.then(response => {
      const json = response.json.bind(response);
      response.json = () => trackPending(json());
      return response;
    }));
  };
  win.eval(source);
  const $ = selector => win.document.querySelector(selector);
  const click = selector => $(selector).click();
  const contact = email => { $('#campaign-email').value = email; $('#campaign-email').dispatchEvent(new win.Event('input', { bubbles: true })); $('[name="consent"]').checked = true; };
  t.after(async () => {
    // Reading a response can start the next queued analytics request.
    do { await Promise.allSettled([...pending]); await new Promise(resolve => setImmediate(resolve)); } while (pending.size);
    win.close(); app.server.close(); await once(app.server, 'close'); fs.rmSync(directory, { recursive: true, force: true });
  });
  return { app, win, $, click, contact, calls, fail: () => { failNext = true; } };
}

test('primary click is measured before any email or form completion; repeated buttons share one outcome', async t => {
  const f = await fixture(t); f.click('#consent-accept');
  f.click('.campaign-primary[data-position="hero"]');
  assert.equal(f.$('#campaign-dialog').open, true); assert.equal(f.$('#campaign-email').value, '');
  await waitFor(() => f.app.store.db.prepare("SELECT count(*) AS n FROM events WHERE name = 'primary_cta_clicked'").get().n === 1);
  let row = summarize(f.app.store.db).campaignCta[0];
  assert.equal(row.cta_percent, 100); assert.equal(row.registered_visitors, 0);
  f.click('#campaign-dialog [data-close]'); f.click('.campaign-primary[data-position="footer"]');
  await waitFor(() => f.app.store.db.prepare("SELECT count(*) AS n FROM events WHERE name = 'primary_cta_clicked'").get().n === 2);
  row = summarize(f.app.store.db).campaignCta[0]; assert.equal(row.cta_visitors, 1);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM leads').get().n, 0);
});

test('English priced page retains a working opt-out waitlist with no account connection', async t => {
  const f = await fixture(t, 'sales-follow-up', 'en'); f.click('#consent-decline'); f.click('.campaign-primary');
  assert.ok(f.$('[data-price-variant]')); f.contact('international@example.test'); f.click('#campaign-form button[type="submit"]');
  await waitFor(() => !f.$('#campaign-success').hidden);
  const row = f.app.store.db.prepare('SELECT * FROM leads').get();
  assert.equal(row.page_id, 'sales-follow-up:en'); assert.equal(row.kind, 'waitlist'); assert.equal(row.visitor_id, null);
  assert.equal(f.calls.filter(c => c.url === '/api/events').length, 0);
  assert.match(f.$('#campaign-success').textContent, /No live agent has been activated/);
});

test('contract CTA records intent before upload, validates missing files, and supports a sample alternative', async t => {
  const f = await fixture(t, 'cashflow'); f.click('#consent-decline'); f.click('.campaign-primary'); f.contact('sample@example.test');
  f.click('#campaign-form button[type="submit"]'); await waitFor(() => !f.$('.form-error').hidden);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM leads').get().n, 0);
  f.click('[name="fileMode"][value="sample"]');
  await waitFor(() => !f.$('#campaign-form button[type="submit"]').disabled);
  f.click('#campaign-form button[type="submit"]'); await waitFor(() => !f.$('#campaign-success').hidden);
  assert.equal(f.app.store.db.prepare('SELECT file_mode FROM leads').get().file_mode, 'sample');
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM contracts').get().n, 0);
});

test('actual contract file is saved only after final submission and outside analytics payloads', async t => {
  const f = await fixture(t, 'cashflow'); f.click('#consent-accept'); f.click('.campaign-primary');
  const bytes = Buffer.from('%PDF-1.4\nprivate agreement\n%%EOF');
  const file = new f.win.File([bytes], 'private-client-name.pdf', { type: 'application/pdf' });
  Object.defineProperty(file, 'arrayBuffer', { value: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
  Object.defineProperty(f.$('#campaign-file'), 'files', { value: [file], configurable: true });
  f.$('#campaign-file').dispatchEvent(new f.win.Event('change', { bubbles: true }));
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM contracts').get().n, 0);
  f.contact('contract@example.test'); f.click('#campaign-form button[type="submit"]');
  await waitFor(() => !f.$('#campaign-success').hidden);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM contracts').get().n, 1);
  assert.deepEqual(Buffer.from(f.app.store.db.prepare('SELECT data FROM contracts').get().data), bytes);
  for (const call of f.calls.filter(c => c.url === '/api/events')) assert.doesNotMatch(JSON.stringify(call.payload), /private-client-name|contract@example|private agreement/);
});

test('network failure retains email and retries the same request ID', async t => {
  const f = await fixture(t, 'project-income'); f.click('#consent-decline'); f.click('.campaign-primary'); f.contact('retry@example.test'); f.fail();
  f.click('#campaign-form button[type="submit"]'); await waitFor(() => !f.$('.form-error').hidden);
  assert.equal(f.$('#campaign-email').value, 'retry@example.test');
  await waitFor(() => !f.$('#campaign-form button[type="submit"]').disabled);
  f.click('#campaign-form button[type="submit"]'); await waitFor(() => !f.$('#campaign-success').hidden);
  const attempts = f.calls.filter(c => c.url === '/api/leads'); assert.equal(attempts.length, 2); assert.equal(attempts[0].payload.id, attempts[1].payload.id);
});

test('language switch retains only allowed campaign fields and demo appears only after interest', async t => {
  const f = await fixture(t, 'whatsapp', 'tr', 'https://calendar.google.com/calendar/appointments/schedules/example');
  const link = new URL(f.$('#campaign-language').href);
  assert.equal(link.pathname, BY_ID.whatsapp.routes.en); assert.equal(link.searchParams.get('utm_source'), 'search'); assert.equal(link.searchParams.has('email'), false);
  assert.equal(f.$('.campaign-post-demo'), null);
  f.click('#consent-decline'); f.click('.campaign-primary'); f.contact('whatsapp@example.test'); f.click('#campaign-form button[type="submit"]');
  await waitFor(() => f.$('.campaign-post-demo'));
  assert.match(f.$('.campaign-post-demo').href, /calendar.google.com/);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM bookings').get().n, 0);
});
