const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { DatabaseSync } = require('node:sqlite');
const { JSDOM } = require('jsdom');
const { createApp } = require('../server.cjs');
const { CAMPAIGNS, BY_ID, CONTACT, metadata } = require('../campaigns.cjs');
const { openStore, summarize } = require('../store.cjs');

test('campaign routes and page-specific measurement', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-campaign-api-'));
  const app = createApp({ dataDir: dir }); app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
  const base = `http://127.0.0.1:${app.server.address().port}`;
  t.after(async () => { app.server.close(); await once(app.server, 'close'); fs.rmSync(dir, { recursive: true, force: true }); });
  const visitorId = randomUUID();
  const ctx = (id, locale = 'tr', consent = true) => ({ campaignId: id, segment: BY_ID[id].segment, locale, visitorId, analyticsConsent: consent });
  const post = async (url, body) => { const r = await fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return { status: r.status, body: await r.json() }; };
  const event = (context, name) => post('/api/events', { id: randomUUID(), event: name, context, properties: { position: 'hero' } });
  const lead = (id, locale, extra = {}) => ({ id: randomUUID(), kind: BY_ID[id].goal === 'waitlist' ? 'waitlist' : 'pilot', solution: BY_ID[id].solution, email: 'campaign@example.test', fileMode: 'sample', consent: true, context: ctx(id, locale), ...extra });
  await t.test('14 localized pages have one repeated primary action, correct language pair, and no demo CTA', async () => {
    for (const campaign of CAMPAIGNS) for (const [locale, route] of Object.entries(campaign.routes)) {
      const response = await fetch(base + route); assert.equal(response.status, 200);
      const dom = new JSDOM(await response.text(), { url: base + route }); const d = dom.window.document;
      assert.equal(d.documentElement.lang, locale); assert.equal(d.body.dataset.campaignId, campaign.id);
      assert.ok(d.querySelectorAll('.campaign-primary').length >= 4);
      const labels = [...d.querySelectorAll('.campaign-primary')].map(button => button.textContent.trim());
      assert.equal(new Set(labels).size, 1);
      assert.equal(d.querySelector('#campaign-language').getAttribute('href'), campaign.routes[locale === 'tr' ? 'en' : 'tr']);
      assert.equal(d.querySelector('nav'), null); assert.equal(d.querySelector('[data-open="meeting"]'), null);
      assert.match(d.body.textContent, /Muhammed Talha Güler/); assert.ok(d.body.textContent.includes(CONTACT.email));
      const price = d.querySelector('[data-price-variant]');
      assert.equal(Boolean(price), Boolean(campaign.price && locale === 'en'));
      if (price) assert.equal(price.dataset.priceVariant, metadata(campaign, locale).priceVariant);
      const ids = [...d.querySelectorAll('[id]')].map(el => el.id); assert.equal(ids.length, new Set(ids).size);
      for (const a of d.querySelectorAll('a[href^="#"]')) assert.ok(d.getElementById(a.getAttribute('href').slice(1)));
      dom.window.close();
    }
  });
  await t.test('both directories link all 14 pages and legacy pages remain available', async () => {
    for (const route of ['/kampanyalar', '/en/campaigns']) {
      const response = await fetch(base + route); assert.equal(response.status, 200); const html = await response.text();
      for (const c of CAMPAIGNS) for (const r of Object.values(c.routes)) assert.ok(html.includes(`href="${r}"`));
    }
    for (const route of ['/', '/tr', '/isletmeler', '/freelancerlar', '/finans-ekipleri', '/bankalar', '/campaign.js', '/campaign.css']) assert.equal((await fetch(base + route)).status, 200);
    for (const route of ['/campaigns.cjs', '/campaign-site.cjs', '/data/qualifi.sqlite']) assert.equal((await fetch(base + route)).status, 404);
  });
  await t.test('CTA rate separates language, deduplicates repeated clicks, and does not require form completion', async () => {
    const tr = ctx('cashflow', 'tr'); const en = ctx('cashflow', 'en');
    await event(tr, 'landing_viewed'); await event(en, 'landing_viewed');
    await event(tr, 'primary_cta_clicked'); await event(tr, 'primary_cta_clicked');
    const report = summarize(app.store.db); const a = report.campaignCta.find(r => r.page_id === 'cashflow:tr'); const b = report.campaignCta.find(r => r.page_id === 'cashflow:en');
    assert.equal(a.measured_visitors, 1); assert.equal(a.cta_visitors, 1); assert.equal(a.cta_percent, 100); assert.equal(a.registered_visitors, 0);
    assert.equal(b.cta_visitors, 0); assert.equal(b.price_variant, 'planned-usd-29-analysis'); assert.equal(a.price_variant, 'none');
  });
  await t.test('page, price and goal metadata are derived on the server, not trusted from the payload', async () => {
    const context = { ...ctx('sales-follow-up', 'en'), pageId: 'forged', ctaGoal: 'purchase', priceVariant: 'free', offerId: 'forged' };
    const id = randomUUID(); assert.equal((await post('/api/events', { id, event: 'primary_cta_clicked', context })).status, 200);
    const saved = JSON.parse(app.store.db.prepare('SELECT context FROM events WHERE id = ?').get(id).context);
    assert.equal(saved.pageId, 'sales-follow-up:en'); assert.equal(saved.ctaGoal, 'waitlist'); assert.equal(saved.priceVariant, 'planned-usd-99-month');
    assert.equal((await post('/api/events', { id: randomUUID(), event: 'primary_cta_clicked', context: { ...context, segment: 'banks' } })).status, 400);
    assert.equal((await post('/api/events', { id: randomUUID(), event: 'primary_cta_clicked', context: { ...context, campaignId: 'missing' } })).status, 400);
  });
  await t.test('the same email can express interest on distinct campaign/language pages; retries still deduplicate', async () => {
    for (const locale of ['tr', 'en']) assert.equal((await post('/api/leads', lead('cashflow', locale))).status, 201);
    for (const id of ['sales-follow-up', 'whatsapp']) assert.equal((await post('/api/leads', lead(id, 'tr'))).status, 201);
    assert.equal(app.store.db.prepare('SELECT count(DISTINCT page_id) AS n FROM leads').get().n, 4);
    const retry = await post('/api/leads', lead('cashflow', 'tr')); assert.equal(retry.status, 200); assert.equal(retry.body.duplicate, true);
  });
  await t.test('campaign opt-outs can submit, retain page context and do not enter the measured visitor denominator', async () => {
    const context = ctx('project-income', 'tr', false);
    assert.equal((await event(context, 'primary_cta_clicked')).status, 400);
    const input = lead('project-income', 'tr', { email: 'optout@example.test', context });
    assert.equal((await post('/api/leads', input)).status, 201);
    const row = app.store.db.prepare('SELECT * FROM leads WHERE id = ?').get(input.id);
    assert.equal(row.page_id, 'project-income:tr'); assert.equal(row.visitor_id, null);
    assert.equal(summarize(app.store.db).campaignRecords.find(r => r.page_id === 'project-income:tr').measured_records, 0);
  });
  await t.test('wrong solution or form kind cannot be recorded for a campaign', async () => {
    assert.equal((await post('/api/leads', lead('sales-follow-up', 'tr', { solution: 'forecast' }))).status, 400);
    assert.equal((await post('/api/leads', lead('sales-follow-up', 'tr', { kind: 'pilot' }))).status, 400);
  });
});

test('original SQLite schema migrates with leads, contract blobs, bookings and cascade behavior intact', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-migration-'));
  const old = new DatabaseSync(path.join(directory, 'qualifi.sqlite'));
  const id = randomUUID();
  old.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE leads (id TEXT PRIMARY KEY, kind TEXT NOT NULL, email TEXT NOT NULL, company TEXT, role TEXT,
      segment TEXT NOT NULL, solution TEXT NOT NULL, channel TEXT, file_mode TEXT, visitor_id TEXT,
      context TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(kind,email,segment,solution));
    CREATE TABLE contracts (lead_id TEXT PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE, mime TEXT NOT NULL, size INTEGER NOT NULL, data BLOB NOT NULL);
    CREATE TABLE bookings (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE, starts_at TEXT NOT NULL, created_at TEXT NOT NULL);`);
  old.prepare('INSERT INTO leads VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(id, 'pilot', 'existing@example.test', '', '', 'business', 'forecast', 'email', 'upload', null, '{}', new Date().toISOString());
  old.prepare('INSERT INTO contracts VALUES (?,?,?,?)').run(id, 'text/plain', 3, Buffer.from('old'));
  old.prepare('INSERT INTO bookings VALUES (?,?,?,?)').run('old-booking', id, '2026-12-01T10:00:00Z', new Date().toISOString()); old.close();
  const store = openStore(directory);
  try {
    assert.equal(store.db.prepare('SELECT page_id FROM leads WHERE id = ?').get(id).page_id, 'legacy');
    assert.equal(Buffer.from(store.db.prepare('SELECT data FROM contracts WHERE lead_id = ?').get(id).data).toString(), 'old');
    assert.equal(store.db.prepare('SELECT count(*) AS n FROM bookings').get().n, 1);
    assert.deepEqual(store.db.prepare('PRAGMA foreign_key_check').all(), []);
    store.db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    assert.equal(store.db.prepare('SELECT count(*) AS n FROM contracts').get().n, 0);
    assert.equal(store.db.prepare('SELECT count(*) AS n FROM bookings').get().n, 0);
  } finally { store.db.close(); fs.rmSync(directory, { recursive: true, force: true }); }
});
