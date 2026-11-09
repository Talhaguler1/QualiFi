const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { randomUUID, createHmac } = require('node:crypto');
const { createApp } = require('../server.cjs');
const { renderPage, ROUTES } = require('../site.cjs');
const { summarize } = require('../store.cjs');

test('requests, files, measurement, and persistence', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-test-'));
  const secret = 'test-only-booking-secret';
  let app = createApp({ dataDir: directory, calendarUrl: 'https://calendar.example/qualifi', webhookSecret: secret, publicOrigin: 'https://qualifi.test' });
  async function listen() { app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening'); return `http://127.0.0.1:${app.server.address().port}`; }
  let base = await listen();
  t.after(async () => { if (app.server.listening) { app.server.close(); await once(app.server, 'close'); } fs.rmSync(directory, { recursive: true, force: true }); });
  const visitor = randomUUID();
  const ctx = { segment: 'business', locale: 'tr', analyticsConsent: true, visitorId: visitor, utm_source: 'search', utm_campaign: 'cash-plan' };
  const post = async (route, body, headers = {}) => {
    const res = await fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
    return { status: res.status, data: await res.json() };
  };
  const lead = overrides => ({ id: randomUUID(), kind: 'pilot', email: 'pilot@example.test', solution: 'forecast', consent: true, context: ctx, fileMode: 'sample', channel: 'email', ...overrides });
  let pilotId;
  await t.test('all audience routes render localized content and isolated assets', async () => {
    for (const [segment, routes] of Object.entries(ROUTES)) for (const [locale, route] of Object.entries(routes)) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, new RegExp(`<html lang="${locale}"`));
      assert.match(html, new RegExp(`data-segment="${segment}"`));
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
      assert.equal(new Set(ids).size, ids.length, 'IDs are unique');
      for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor), anchor);
      if (segment === 'banks') assert.doesNotMatch(html, /₺45.000/);
    }
    for (const route of ['/', '/tr', '/tr/', '/tr.html', '/index.html', '/app.js', '/style.css', '/favicon.svg']) assert.equal((await fetch(base + route)).status, 200);
    for (const route of ['/AGENTS.md', '/data/qualifi.sqlite', '/.env', '/store.cjs', '/docs/roadmap.md']) assert.equal((await fetch(base + route)).status, 404);
  });
  await t.test('configuration returns only public scheduling options', async () => {
    const config = await (await fetch(base + '/api/config')).json();
    assert.equal(config.calendarUrl, 'https://calendar.example/qualifi');
    assert.equal(config.agentLive, false);
    assert.ok(!JSON.stringify(config).includes(secret));
  });
  await t.test('submission is committed and source is attributed', async () => {
    const input = lead(); pilotId = input.id;
    const response = await post('/api/leads', input);
    assert.equal(response.status, 201);
    const saved = app.store.db.prepare('SELECT * FROM leads WHERE id = ?').get(pilotId);
    assert.equal(saved.email, input.email); assert.equal(saved.visitor_id, visitor);
    assert.equal(JSON.parse(saved.context).utm_campaign, 'cash-plan');
    assert.equal(app.store.db.prepare("SELECT count(*) AS n FROM events WHERE name = 'pilot_request_created'").get().n, 1);
  });
  await t.test('retries and duplicate email do not duplicate conversions', async () => {
    assert.equal((await post('/api/leads', lead({ id: pilotId }))).data.duplicate, true);
    assert.equal((await post('/api/leads', lead())).data.id, pilotId);
    assert.equal(app.store.db.prepare('SELECT count(*) AS n FROM leads').get().n, 1);
  });
  await t.test('separate CTAs retain distinct operational records', async () => {
    for (const kind of ['waitlist', 'meeting']) assert.equal((await post('/api/leads', lead({ kind }))).status, 201);
    assert.equal(app.store.db.prepare('SELECT count(DISTINCT kind) AS n FROM leads').get().n, 3);
    assert.equal(app.store.db.prepare("SELECT count(*) AS n FROM events WHERE name = 'meeting_booked'").get().n, 0);
  });
  await t.test('analytics opt-out does not block a request or retain visitor ID', async () => {
    const input = lead({ email: 'optout@example.test', context: { ...ctx, analyticsConsent: false } });
    assert.equal((await post('/api/leads', input)).status, 201);
    assert.equal(app.store.db.prepare('SELECT visitor_id FROM leads WHERE id = ?').get(input.id).visitor_id, null);
    assert.equal((await post('/api/events', { id: randomUUID(), event: 'landing_viewed', context: { ...ctx, analyticsConsent: false } })).status, 400);
  });
  await t.test('client cannot fabricate activation, confirmed bookings, or recorded leads', async () => {
    for (const event of ['agent_activated', 'meeting_booked', 'pilot_request_created', 'contract_upload_completed']) assert.equal((await post('/api/events', { id: randomUUID(), event, context: ctx })).status, 400);
  });
  await t.test('event retries are deduplicated and personal/free-text properties are dropped', async () => {
    const input = { id: randomUUID(), event: 'solution_selected', context: { ...ctx, utm_term: 'private@example.test' }, properties: { solution: 'forecast', position: '1', email: 'private@example.test', text: 'sensitive message' } };
    assert.equal((await post('/api/events', input)).status, 200);
    assert.equal((await post('/api/events', input)).status, 200);
    const row = app.store.db.prepare('SELECT * FROM events WHERE id = ?').get(input.id);
    assert.equal(app.store.db.prepare('SELECT count(*) AS n FROM events WHERE id = ?').get(input.id).n, 1);
    assert.doesNotMatch(row.properties + row.context, /private@|sensitive message/);
  });
  await t.test('invalid consent, context, email, origin, and honeypot are rejected', async () => {
    for (const extra of [{ consent: false }, { email: 'invalid' }, { website: 'spam' }, { context: { segment: 'unknown', locale: 'tr' } }, { solution: 'risk' }]) assert.equal((await post('/api/leads', lead(extra))).status, 400);
    assert.equal((await post('/api/leads', lead(), { Origin: 'https://unrelated.example' })).status, 403);
    assert.equal((await post('/api/leads', lead({ email: 'same-origin@example.test' }), { Origin: 'https://qualifi.test' })).status, 201);
  });
  await t.test('valid contract and conversion event commit atomically', async () => {
    const data = Buffer.from('%PDF-1.4\nTest agreement\n%%EOF');
    const input = lead({ email: 'file@example.test', fileMode: 'upload', contract: { type: 'application/pdf', base64: data.toString('base64') } });
    assert.equal((await post('/api/leads', input)).status, 201);
    const file = app.store.db.prepare('SELECT * FROM contracts WHERE lead_id = ?').get(input.id);
    assert.equal(file.size, data.length); assert.deepEqual(Buffer.from(file.data), data);
    assert.equal(app.store.db.prepare("SELECT count(*) AS n FROM events WHERE name = 'contract_upload_completed'").get().n, 1);
  });
  await t.test('invalid files are rejected without partial lead writes', async () => {
    for (const contract of [null, { type: 'application/pdf', base64: Buffer.from('not a pdf').toString('base64') }, { type: 'text/plain', base64: Buffer.from([0, 255]).toString('base64') }, { type: 'text/html', base64: Buffer.from('<script>').toString('base64') }]) {
      const input = lead({ email: 'invalid-file@example.test', fileMode: 'upload', contract });
      assert.equal((await post('/api/leads', input)).status, 400);
      assert.equal(app.store.db.prepare('SELECT id FROM leads WHERE id = ?').get(input.id), undefined);
    }
    const large = lead({ email: 'large@example.test', fileMode: 'upload', contract: { type: 'text/plain', base64: Buffer.alloc(5 * 1024 * 1024 + 1, 65).toString('base64') } });
    assert.equal((await post('/api/leads', large)).status, 413);
  });
  await t.test('bank pilot is a separate audience and risk offer', async () => {
    assert.equal((await post('/api/leads', lead({ email: 'bank@example.test', solution: 'risk', context: { ...ctx, segment: 'banks' } }))).status, 201);
  });
  await t.test('booking webhook requires signed recent payload and deduplicates callbacks', async () => {
    const meeting = app.store.db.prepare("SELECT id FROM leads WHERE kind = 'meeting'").get();
    const payload = { leadId: meeting.id, bookingId: 'test-reservation-1', startsAt: '2026-12-01T10:00:00Z' };
    assert.equal((await post('/api/booking-webhook', payload)).status, 401);
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = createHmac('sha256', secret).update(`${timestamp}.${JSON.stringify(payload)}`).digest('hex');
    const headers = { 'x-qualifi-timestamp': timestamp, 'x-qualifi-signature': signature };
    assert.equal((await post('/api/booking-webhook', payload, headers)).status, 200);
    assert.equal((await post('/api/booking-webhook', payload, headers)).status, 200);
    assert.equal(app.store.db.prepare('SELECT count(*) AS n FROM bookings').get().n, 1);
    assert.equal(app.store.db.prepare("SELECT count(*) AS n FROM events WHERE name = 'meeting_booked'").get().n, 1);
  });
  await t.test('owner summary contains counts, not email or file contents', () => {
    const report = summarize(app.store.db);
    assert.ok(report.leads.length > 0); assert.equal(report.bookings.verified_bookings, 1);
    assert.doesNotMatch(JSON.stringify(report), /pilot@example|Test agreement/);
  });
  await t.test('data survives server restart and still deduplicates', async () => {
    app.server.close(); await once(app.server, 'close');
    app = createApp({ dataDir: directory }); base = await listen();
    assert.ok(app.store.db.prepare('SELECT id FROM leads WHERE id = ?').get(pilotId));
    assert.equal((await post('/api/leads', lead())).data.id, pilotId);
    assert.equal((await (await fetch(base + '/api/config')).json()).calendarUrl, '');
    assert.equal((fs.statSync(path.join(directory, 'qualifi.sqlite')).mode & 0o777), 0o600);
  });
  await t.test('deleting a lead cascades to its uploaded file', () => {
    const { lead_id } = app.store.db.prepare('SELECT lead_id FROM contracts').get();
    app.store.db.prepare('DELETE FROM leads WHERE id = ?').run(lead_id);
    assert.equal(app.store.db.prepare('SELECT lead_id FROM contracts WHERE lead_id = ?').get(lead_id), undefined);
  });
});

test('committed HTML snapshots match server renderer', () => {
  for (const [file, locale] of [['index.html', 'en'], ['tr.html', 'tr']]) assert.equal(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), renderPage(locale, 'business'));
});

test('funnel denominator is unique exposure; anonymous and pre-exposure conversions stay separate', () => {
  const { openStore } = require('../store.cjs');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-report-'));
  const store = openStore(directory);
  try {
    const contexts = [randomUUID(), randomUUID()].map(visitorId => ({ visitorId, segment: 'business', locale: 'tr' }));
    for (const ctx of contexts) {
      for (let i = 0; i < 2; i++) {
        const id = randomUUID(); store.event(id, 'solution_viewed', ctx, { solution: 'forecast' });
        store.db.prepare('UPDATE events SET created_at = ? WHERE id = ?').run('2026-01-02T00:00:00.000Z', id);
      }
    }
    for (const [i, ctx] of contexts.entries()) {
      const id = randomUUID(); store.event(id, 'pilot_request_created', ctx, { solution: 'forecast' });
      store.db.prepare('UPDATE events SET created_at = ? WHERE id = ?').run(i === 0 ? '2026-01-03T00:00:00.000Z' : '2026-01-01T00:00:00.000Z', id);
    }
    store.event(randomUUID(), 'pilot_request_created', { visitorId: null, segment: 'business' }, { solution: 'forecast' });
    const row = summarize(store.db).funnel[0];
    assert.equal(row.exposed_visitors, 2); assert.equal(row.pilot_visitors, 1); assert.equal(row.pilot_percent, 50);
  } finally { store.db.close(); fs.rmSync(directory, { recursive: true, force: true }); }
});
