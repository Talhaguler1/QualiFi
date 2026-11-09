const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { isUtf8 } = require('node:buffer');
const { createHmac, timingSafeEqual } = require('node:crypto');
const { openStore } = require('./store.cjs');
const { renderPage, resolveRoute } = require('./site.cjs');
const EVENT_NAMES = new Set(['landing_viewed', 'solution_viewed', 'solution_selected', 'agent_cta_clicked', 'agent_setup_started', 'outcome_selected', 'contract_selected', 'channel_preference_selected', 'lead_form_opened', 'lead_form_started', 'calendar_opened']);
const SEGMENTS = new Set(['business', 'freelance', 'finance', 'banks']);
const SOLUTIONS = new Set(['forecast', 'autopilot', 'risk']);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const MAX_FILE = 5 * 1024 * 1024;
const security = {
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'Cache-Control': 'no-store'
};
function fail(status, code) { const e = new Error(code); e.status = status; return e; }
function clean(value, max = 100) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function safeCampaign(value) { const s = clean(value, 100); return /^[a-zA-Z0-9_. -]*$/.test(s) ? s : ''; }
function context(body) {
  const c = body.context || {};
  if (!SEGMENTS.has(c.segment) || !['en', 'tr'].includes(c.locale)) throw fail(400, 'invalid_context');
  const visitorId = c.analyticsConsent === true && UUID.test(c.visitorId || '') ? c.visitorId : null;
  const campaign = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    campaign[key] = safeCampaign(c[key]);
    campaign[`last_${key}`] = safeCampaign(c[`last_${key}`]);
  }
  return { segment: c.segment, locale: c.locale, visitorId, pageVersion: 'landing-v1', ...campaign, entryOffer: SOLUTIONS.has(c.entryOffer) ? c.entryOffer : null };
}
async function readJSON(req, limit = 32 * 1024) {
  if (!(req.headers['content-type'] || '').startsWith('application/json')) throw fail(415, 'json_required');
  let size = 0; const chunks = [];
  for await (const chunk of req.iterator({ destroyOnReturn: false })) { size += chunk.length; if (size > limit) throw fail(413, 'request_too_large'); chunks.push(chunk); }
  const raw = Buffer.concat(chunks);
  try { return { body: JSON.parse(raw.toString('utf8')), raw }; } catch { throw fail(400, 'invalid_json'); }
}
function decodeContract(file) {
  if (!file || !['application/pdf', 'text/plain'].includes(file.type) || typeof file.base64 !== 'string') throw fail(400, 'invalid_contract');
  if (file.base64.length > Math.ceil(MAX_FILE / 3) * 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.base64)) throw fail(413, 'invalid_file_size');
  const data = Buffer.from(file.base64, 'base64');
  if (data.length > MAX_FILE) throw fail(413, 'invalid_file_size');
  if (!data.length || data.toString('base64') !== file.base64) throw fail(400, 'invalid_contract');
  if (file.type === 'application/pdf' && !data.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw fail(400, 'invalid_pdf');
  if (file.type === 'text/plain' && (data.includes(0) || !isUtf8(data))) throw fail(400, 'invalid_text');
  return { data, type: file.type, size: data.length };
}
function createApp(options = {}) {
  const store = openStore(options.dataDir || process.env.DATA_DIR || path.join(__dirname, 'data'));
  const calendar = options.calendarUrl ?? process.env.CALENDAR_URL ?? '';
  let calendarUrl = '';
  try { const u = new URL(calendar); if (u.protocol === 'https:' && !u.username && !u.password) calendarUrl = u.href; } catch {}
  const publicOrigin = options.publicOrigin || process.env.PUBLIC_ORIGIN || '';
  const webhookSecret = options.webhookSecret || process.env.BOOKING_WEBHOOK_SECRET || '';
  const limits = new Map();
  const server = http.createServer(async (req, res) => {
    const send = (status, data, type = 'application/json; charset=utf-8') => {
      res.writeHead(status, { ...security, 'Content-Type': type });
      res.end(req.method === 'HEAD' ? undefined : type.startsWith('application/json') ? JSON.stringify(data) : data);
    };
    try {
      const url = new URL(req.url, 'http://localhost');
      const route = url.pathname.replace(/\/$/, '') || '/';
      if (req.method === 'GET' || req.method === 'HEAD') {
        if (route === '/api/config') return send(200, { calendarUrl, maxFileBytes: MAX_FILE, agentLive: false });
        if (route === '/api/health') return send(200, { ok: true });
        const page = resolveRoute(route);
        if (page) return send(200, renderPage(page.locale, page.segment), 'text/html; charset=utf-8');
        const assets = { '/style.css': 'text/css; charset=utf-8', '/app.js': 'text/javascript; charset=utf-8', '/favicon.svg': 'image/svg+xml' };
        if (assets[route]) return send(200, fs.readFileSync(path.join(__dirname, route.slice(1))), assets[route]);
        return send(404, { error: 'not_found' });
      }
      if (req.method !== 'POST') return send(405, { error: 'method_not_allowed' });
      if (!['/api/events', '/api/leads', '/api/booking-webhook'].includes(route)) return send(404, { error: 'not_found' });
      if (route !== '/api/booking-webhook') {
        const origin = req.headers.origin;
        const expectedOrigin = publicOrigin || `http://${req.headers.host}`;
        const sameHost = !publicOrigin && origin && (() => { try { return new URL(origin).host === req.headers.host; } catch { return false; } })();
        if (origin && origin !== expectedOrigin && !sameHost) throw fail(403, 'origin_not_allowed');
        if (req.headers['sec-fetch-site'] === 'cross-site') throw fail(403, 'origin_not_allowed');
        const now = Date.now();
        if (limits.size > 5000) for (const [key, entry] of limits) if (now - entry.start > 60000) limits.delete(key);
        const key = `${req.socket.remoteAddress}:${route}`;
        let entry = limits.get(key);
        if (!entry || now - entry.start > 60000) { entry = { start: now, count: 0 }; limits.set(key, entry); }
        if (++entry.count > (route === '/api/events' ? 180 : 25)) { res.setHeader('Retry-After', '60'); throw fail(429, 'rate_limited'); }
      }
      if (route === '/api/booking-webhook') {
        if (!webhookSecret) throw fail(503, 'booking_webhook_not_configured');
        const { body, raw } = await readJSON(req);
        const timestamp = req.headers['x-qualifi-timestamp'] || '';
        const signature = req.headers['x-qualifi-signature'] || '';
        if (!/^\d{10}$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300 || !/^[a-f0-9]{64}$/i.test(signature)) throw fail(401, 'invalid_signature');
        const expected = createHmac('sha256', webhookSecret).update(`${timestamp}.`).update(raw).digest();
        if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) throw fail(401, 'invalid_signature');
        if (!body || !UUID.test(body.leadId || '') || !/^[a-zA-Z0-9_-]{1,128}$/.test(body.bookingId || '')) throw fail(400, 'invalid_booking');
        const lead = store.db.prepare('SELECT * FROM leads WHERE id = ? AND kind = ?').get(body.leadId, 'meeting');
        if (!lead) throw fail(404, 'lead_not_found');
        const start = Date.parse(body.startsAt);
        if (!Number.isFinite(start)) throw fail(400, 'invalid_booking');
        store.confirmBooking(body.bookingId, lead, new Date(start).toISOString());
        return send(200, { ok: true });
      }
      const { body } = await readJSON(req, route === '/api/leads' ? 7 * 1024 * 1024 : 32 * 1024);
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail(400, 'invalid_payload');
      if (body.website) throw fail(400, 'invalid_submission');
      const ctx = context(body);
      if (route === '/api/events') {
        if (!ctx.visitorId) throw fail(400, 'analytics_consent_required');
        if (!EVENT_NAMES.has(body.event) || !UUID.test(body.id || '')) throw fail(400, 'invalid_event');
        const allowed = { cta: ['agent', 'meeting', 'waitlist'], solution: ['forecast', 'autopilot', 'risk'], position: ['hero', 'nav', 'offer', 'footer', 'dialog', '1', '2'], fileMode: ['sample', 'upload'], channel: ['email', 'whatsapp', 'undecided'] };
        const props = {};
        for (const [key, values] of Object.entries(allowed)) if (values.includes(body.properties?.[key])) props[key] = body.properties[key];
        store.event(body.id, body.event, ctx, props);
        return send(200, { ok: true });
      }
      if (!['pilot', 'waitlist', 'meeting'].includes(body.kind) || !UUID.test(body.id || '')) throw fail(400, 'invalid_submission');
      const email = clean(body.email, 254).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true) throw fail(400, 'email_and_consent_required');
      const solution = SOLUTIONS.has(body.solution) ? body.solution : 'forecast';
      if ((ctx.segment === 'banks') !== (solution === 'risk')) throw fail(400, 'invalid_solution');
      const channel = ['email', 'whatsapp', 'undecided'].includes(body.channel) ? body.channel : 'undecided';
      const fileMode = body.fileMode === 'upload' ? 'upload' : 'sample';
      if (body.kind !== 'pilot' && body.contract) throw fail(400, 'unexpected_contract');
      const duplicate = store.db.prepare('SELECT id FROM leads WHERE id = ? OR (kind = ? AND email = ? AND segment = ? AND solution = ?)').get(body.id, body.kind, email, ctx.segment, solution);
      if (duplicate) return send(200, { ok: true, id: duplicate.id, duplicate: true });
      const file = body.kind === 'pilot' && fileMode === 'upload' ? decodeContract(body.contract) : null;
      const lead = { id: body.id, kind: body.kind, email, company: clean(body.company, 120), role: clean(body.role, 60), solution, channel, fileMode: body.kind === 'pilot' ? fileMode : null, context: ctx };
      store.saveLead(lead, file);
      return send(201, { ok: true, id: lead.id });
    } catch (error) {
      if (!req.complete) req.resume();
      if (!res.headersSent) send(error.status || 500, { error: error.status ? error.message : 'unable_to_save' });
    }
  });
  server.requestTimeout = 30000; server.headersTimeout = 15000;
  server.on('close', () => store.db.close());
  return { server, store };
}
if (require.main === module) {
  const app = createApp(); const port = Number(process.env.PORT || 3000);
  app.server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`QualiFi: http://localhost:${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => app.server.close());
}
module.exports = { createApp };
