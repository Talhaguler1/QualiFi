const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { randomUUID } = require('node:crypto');
const { JSDOM } = require('jsdom');
const { createApp } = require('../server.cjs');
const { openStore } = require('../store.cjs');
const { normalizeOrigin } = require('../seo.cjs');
const { exportLeads, csvCell } = require('../scripts/leads.cjs');
const { acknowledgement } = require('../email-templates.cjs');
const { CAMPAIGNS } = require('../campaigns.cjs');
async function fixture(t, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-launch-'));
  const app = createApp({ ...options, dataDir: directory }); app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
  const base = `http://127.0.0.1:${app.server.address().port}`;
  t.after(async () => { app.server.close(); await once(app.server, 'close'); fs.rmSync(directory, { recursive: true, force: true }); });
  async function post(extra = {}, origin) {
    const payload = { id: randomUUID(), kind: 'waitlist', email: 'lead@example.test', consent: true, solution: 'autopilot', context: { segment: 'business', locale: 'tr', campaignId: 'sales-follow-up', analyticsConsent: false }, ...extra };
    const r = await fetch(base + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(payload) });
    return { status: r.status, body: await r.json(), payload };
  }
  return { directory, app, base, post };
}

test('trailing slash in PUBLIC_ORIGIN is normalized and same-origin forms still save', async t => {
  assert.equal(normalizeOrigin('https://qualifi.example/'), 'https://qualifi.example');
  assert.throws(() => normalizeOrigin('javascript:alert(1)'));
  assert.throws(() => normalizeOrigin('https://user:password@qualifi.example'));
  const f = await fixture(t, { publicOrigin: 'https://qualifi.example/' });
  assert.equal((await f.post({}, 'https://qualifi.example')).status, 201);
});

test('acknowledgement is queued as an unsent draft atomically with the persisted lead', async t => {
  const f = await fixture(t); const saved = await f.post(); assert.equal(saved.status, 201);
  const draft = f.app.store.db.prepare('SELECT * FROM email_outbox WHERE lead_id = ?').get(saved.body.id);
  assert.equal(draft.status, 'draft'); assert.equal(draft.recipient, saved.payload.email);
  assert.match(draft.text_body, /20 dakikalık/); assert.match(draft.text_body, /geliştirme\/pilot/);
  assert.equal((await f.post()).body.duplicate, true);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM email_outbox').get().n, 1);
});

test('database failure returns no false success and logs a safe reference without contact/document data', async t => {
  const logs = []; const f = await fixture(t, { onError: message => logs.push(message) });
  f.app.store.db.exec('PRAGMA query_only = ON');
  const failed = await f.post(); assert.equal(failed.status, 500); assert.equal(failed.body.error, 'unable_to_save'); assert.match(failed.body.reference, /^[a-f0-9]{8}$/);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM leads').get().n, 0);
  assert.equal(f.app.store.db.prepare('SELECT count(*) AS n FROM email_outbox').get().n, 0);
  assert.equal(logs.length, 1); assert.doesNotMatch(logs[0], /lead@example|password|base64/);
  f.app.store.db.exec('PRAGMA query_only = OFF');
});

test('owner report reads actual saved emails and exports private escaped HTML, CSV and unsent EML', async t => {
  const f = await fixture(t); const response = await f.post({ company: '<script>alert(1)</script>' });
  assert.equal(response.status, 201);
  const report = exportLeads(f.directory); assert.equal(report.count, 1); assert.equal(report.draftCount, 1);
  const html = fs.readFileSync(report.output, 'utf8'); assert.match(html, /lead@example.test/); assert.doesNotMatch(html, /<script>alert/); assert.match(html, /gönderilmemiştir/);
  assert.match(fs.readFileSync(report.csvFile, 'utf8'), /sales-follow-up:tr/);
  assert.match(csvCell('=formula'), /^"'/);
  const eml = fs.readFileSync(path.join(f.directory, 'email-drafts', response.body.id + '.eml'), 'utf8');
  assert.match(eml, /To: lead@example.test/); assert.match(eml, /multipart\/alternative/);
  for (const route of ['/data/lead-report.html', '/data/leads.csv', `/data/email-drafts/${response.body.id}.eml`]) assert.equal((await fetch(f.base + route)).status, 404);
});

test('owner report does not create an empty database in the wrong project folder', () => {
  const directory = path.join(os.tmpdir(), 'missing-qualifi-' + randomUUID());
  assert.throws(() => exportLeads(directory), /Yeni boş veritabanı oluşturulmadı/); assert.equal(fs.existsSync(directory), false);
});

test('lead and acknowledgement survive close/reopen; deletion cascades to the outbox', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-outbox-')); const id = randomUUID();
  let store = openStore(directory);
  store.saveLead({ id, kind: 'waitlist', email: 'reopen@example.test', company: '', role: '', solution: 'forecast', channel: 'undecided', fileMode: null, context: { segment: 'freelance', locale: 'en', visitorId: null, campaignId: 'project-income', pageId: 'project-income:en' } }, null);
  store.db.close(); store = openStore(directory);
  try {
    assert.equal(store.db.prepare('SELECT status FROM email_outbox WHERE lead_id = ?').get(id).status, 'draft');
    store.db.prepare('DELETE FROM leads WHERE id = ?').run(id); assert.equal(store.db.prepare('SELECT count(*) AS n FROM email_outbox').get().n, 0);
  } finally { store.db.close(); fs.rmSync(directory, { recursive: true, force: true }); }
});

test('TR/EN acknowledgement copy states the real stage and does not invent booking or activation', () => {
  for (const locale of ['tr', 'en']) for (const kind of ['pilot', 'waitlist', 'meeting']) {
    const draft = acknowledgement({ id: randomUUID(), kind, context: { locale } });
    assert.ok(draft.text.length > 200); assert.ok(draft.html.includes(`lang="${locale}"`));
    assert.doesNotMatch(draft.text, /ajanınız aktif|your agent is active|ödemeniz alındı|payment received/i);
  }
});

test('domain-configured SEO serves absolute canonical/hreflang/social metadata and sitemap', async t => {
  const f = await fixture(t, { publicOrigin: 'https://qualifi.example/' });
  const page = await fetch(f.base + '/en/gmail-sales-follow-up?utm_source=test'); const html = await page.text(); const dom = new JSDOM(html); const d = dom.window.document;
  assert.equal(d.querySelector('[rel="canonical"]').getAttribute('href'), 'https://qualifi.example/en/gmail-sales-follow-up');
  assert.ok([...d.querySelectorAll('[hreflang]')].every(a => a.getAttribute('href').startsWith('https://qualifi.example/')));
  assert.equal(d.querySelector('meta[property="og:image"]').content, 'https://qualifi.example/social-preview.png');
  assert.equal(JSON.parse(d.querySelector('[type="application/ld+json"]').textContent)['@type'], 'WebSite'); dom.window.close();
  const xml = await (await fetch(f.base + '/sitemap.xml')).text();
  for (const c of CAMPAIGNS) for (const route of Object.values(c.routes)) assert.ok(xml.includes('https://qualifi.example' + route));
  assert.ok(xml.includes('/tr/hakkimizda')); assert.ok(!xml.includes('/kampanyalar'));
  const robots = await (await fetch(f.base + '/robots.txt')).text(); assert.match(robots, /Sitemap: https:\/\/qualifi.example\/sitemap.xml/);
  const directory = await fetch(f.base + '/kampanyalar'); assert.match(directory.headers.get('x-robots-tag'), /noindex/);
  const image = await fetch(f.base + '/social-preview.png'); assert.equal(image.status, 200); assert.equal(image.headers.get('content-type'), 'image/png');
});

test('local unconfigured pages stay out of indexing and do not publish a fake sitemap domain', async t => {
  const f = await fixture(t);
  assert.match((await fetch(f.base + '/tr/sozlesmeden-nakit-akisi')).headers.get('x-robots-tag'), /noindex/);
  assert.match(await (await fetch(f.base + '/robots.txt')).text(), /Disallow: \//);
  assert.equal((await fetch(f.base + '/sitemap.xml')).status, 503);
});

test('mission/vision and data-use pages are localized, reachable and linked from the campaign footer', async t => {
  const f = await fixture(t);
  for (const [route, lang] of [['/tr/hakkimizda', 'tr'], ['/en/about', 'en'], ['/tr/veri-kullanimi', 'tr'], ['/en/data-use', 'en']]) {
    const response = await fetch(f.base + route); assert.equal(response.status, 200); const html = await response.text(); assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.match(html, /Muhammed Talha Güler/); assert.match(html, /talha.guler@ozu.edu.tr/);
  }
  const html = await (await fetch(f.base + '/tr/gmail-satis-takibi')).text(); const d = new JSDOM(html);
  assert.ok(d.window.document.querySelector('footer a[href="/tr/hakkimizda"]'));
  assert.equal(d.window.document.querySelector('main a[href="/tr/hakkimizda"]'), null); d.window.close();
});
