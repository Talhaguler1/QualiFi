const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
function openStore(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const filename = path.join(directory, 'qualifi.sqlite');
  const db = new DatabaseSync(filename); fs.chmodSync(filename, 0o600);
  db.exec(`PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY, kind TEXT NOT NULL, email TEXT NOT NULL, company TEXT,
      role TEXT, segment TEXT NOT NULL, solution TEXT NOT NULL, channel TEXT,
      file_mode TEXT, visitor_id TEXT, context TEXT NOT NULL, created_at TEXT NOT NULL,
      UNIQUE(kind, email, segment, solution));
    CREATE TABLE IF NOT EXISTS contracts (
      lead_id TEXT PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
      mime TEXT NOT NULL, size INTEGER NOT NULL, data BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, visitor_id TEXT, segment TEXT NOT NULL,
      context TEXT NOT NULL, properties TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS events_name ON events(name, segment);
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      starts_at TEXT NOT NULL, created_at TEXT NOT NULL);
  `);
  const insertEvent = db.prepare('INSERT OR IGNORE INTO events VALUES (?, ?, ?, ?, ?, ?, ?)');
  function event(id, name, context, properties = {}) {
    insertEvent.run(id, name, context.visitorId, context.segment, JSON.stringify(context), JSON.stringify(properties), new Date().toISOString());
  }
  function saveLead(lead, file) {
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('INSERT INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(lead.id, lead.kind, lead.email, lead.company, lead.role, lead.context.segment, lead.solution, lead.channel, lead.fileMode, lead.context.visitorId, JSON.stringify(lead.context), new Date().toISOString());
      if (file) { db.prepare('INSERT INTO contracts VALUES (?, ?, ?, ?)').run(lead.id, file.type, file.size, file.data); event(randomUUID(), 'contract_upload_completed', lead.context, { solution: lead.solution, fileMode: 'upload' }); }
      event(randomUUID(), { pilot: 'pilot_request_created', waitlist: 'waitlist_joined', meeting: 'meeting_requested' }[lead.kind], lead.context, { solution: lead.solution, fileMode: lead.fileMode });
      db.exec('COMMIT');
    } catch (e) { db.exec('ROLLBACK'); throw e; }
  }
  function confirmBooking(id, lead, startsAt) {
    db.exec('BEGIN IMMEDIATE');
    try {
      const existing = db.prepare('SELECT lead_id FROM bookings WHERE id = ?').get(id);
      if (existing && existing.lead_id !== lead.id) throw new Error('booking_conflict');
      if (!existing) { db.prepare('INSERT INTO bookings VALUES (?, ?, ?, ?)').run(id, lead.id, startsAt, new Date().toISOString()); event(randomUUID(), 'meeting_booked', JSON.parse(lead.context), { solution: lead.solution }); }
      db.exec('COMMIT');
    } catch (e) { db.exec('ROLLBACK'); throw e; }
  }
  return { db, event, saveLead, confirmBooking };
}
function summarize(db) {
  return {
    funnel: db.prepare(`WITH exposures AS (
      SELECT segment, visitor_id, json_extract(properties, '$.solution') AS solution, min(created_at) AS first_seen
      FROM events WHERE name = 'solution_viewed' AND visitor_id IS NOT NULL
      GROUP BY segment, visitor_id, solution
    ) SELECT x.segment, x.solution, count(*) AS exposed_visitors,
      sum(EXISTS(SELECT 1 FROM events e WHERE e.visitor_id = x.visitor_id AND e.segment = x.segment
        AND json_extract(e.properties, '$.solution') = x.solution AND e.name = 'solution_selected' AND e.created_at >= x.first_seen)) AS selected_visitors,
      sum(EXISTS(SELECT 1 FROM events e WHERE e.visitor_id = x.visitor_id AND e.segment = x.segment
        AND json_extract(e.properties, '$.solution') = x.solution AND e.name = 'pilot_request_created' AND e.created_at >= x.first_seen)) AS pilot_visitors
      FROM exposures x GROUP BY x.segment, x.solution`).all().map(row => ({ ...row,
        selection_percent: Number((100 * row.selected_visitors / row.exposed_visitors).toFixed(1)),
        pilot_percent: Number((100 * row.pilot_visitors / row.exposed_visitors).toFixed(1)) })),
    leads: db.prepare('SELECT segment, solution, kind, count(*) AS records, sum(visitor_id IS NOT NULL) AS attributed_records FROM leads GROUP BY segment, solution, kind').all(),
    events: db.prepare('SELECT segment, name, count(*) AS events, count(DISTINCT visitor_id) AS measured_visitors FROM events GROUP BY segment, name').all(),
    solutions: db.prepare("SELECT segment, json_extract(properties, '$.solution') AS solution, name, count(DISTINCT visitor_id) AS measured_visitors FROM events WHERE visitor_id IS NOT NULL AND json_extract(properties, '$.solution') IS NOT NULL GROUP BY segment, solution, name").all(),
    campaigns: db.prepare("SELECT segment, solution, kind, json_extract(context, '$.utm_source') AS source, json_extract(context, '$.utm_campaign') AS campaign, json_extract(context, '$.last_utm_source') AS last_source, json_extract(context, '$.last_utm_campaign') AS last_campaign, count(*) AS records FROM leads GROUP BY segment, solution, kind, source, campaign, last_source, last_campaign").all(),
    bookings: db.prepare('SELECT count(*) AS verified_bookings FROM bookings').get(),
    note: 'Only consented visitors enter measured visitor counts. Operational records include opt-outs. Compare within a segment/source; these counts do not establish a causal A/B winner.'
  };
}
module.exports = { openStore, summarize };
