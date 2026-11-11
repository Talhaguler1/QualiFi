const path = require('node:path');
const fs = require('node:fs');
const { openStore, summarize, dataDirectory } = require('../store.cjs');
const directory = dataDirectory();
if (!fs.existsSync(path.join(directory, 'qualifi.sqlite'))) {
  console.error(`No database found at ${path.join(directory, 'qualifi.sqlite')}. Check the active server folder and DATA_DIR; no empty database was created.`);
  process.exit(1);
}
const store = openStore(directory);
try {
  const deletion = process.argv.find(a => a.startsWith('--delete='));
  const prune = process.argv.find(a => a.startsWith('--prune='));
  if (deletion) {
    const id = deletion.slice('--delete='.length);
    if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error('Provide a valid lead UUID.');
    console.log('Deleted records:', store.db.prepare('DELETE FROM leads WHERE id = ?').run(id).changes);
  } else if (prune) {
    const days = Number(prune.split('=')[1]);
    if (!Number.isInteger(days) || days < 1) throw new Error('Prune days must be a positive integer.');
    const before = new Date(Date.now() - days * 86400000).toISOString();
    store.db.exec('BEGIN IMMEDIATE');
    try {
      const leads = store.db.prepare('DELETE FROM leads WHERE created_at < ?').run(before).changes;
      const events = store.db.prepare('DELETE FROM events WHERE created_at < ?').run(before).changes;
      store.db.exec('COMMIT'); console.log({ deletedLeads: leads, deletedEvents: events });
    } catch (e) { store.db.exec('ROLLBACK'); throw e; }
  } else if (process.argv.includes('--export-leads')) {
    // Owner-only CLI; this output includes contact information. Never expose as a public route.
    console.log(JSON.stringify(store.db.prepare('SELECT id, kind, email, company, role, segment, solution, channel, file_mode, page_id, context, created_at FROM leads ORDER BY created_at DESC').all(), null, 2));
  } else {
    const report = summarize(store.db);
    if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
    else {
      console.log('Database:', store.filename);
      console.log('QualiFi — recorded requests'); console.table(report.leads);
      console.log('Campaign pages: unique CTA click rate by page / language / price exposure'); console.table(report.campaignCta);
      console.log('Campaign form records (including analytics opt-outs)'); console.table(report.campaignRecords);
      console.log('Card exposure → selection → pilot (same visitors, after exposure)'); console.table(report.funnel);
      console.log('Measured visitor events'); console.table(report.events);
      console.log('Solution funnel (consented visitors)'); console.table(report.solutions);
      console.log('Campaign attribution'); console.table(report.campaigns);
      console.log('Verified bookings:', report.bookings.verified_bookings);
      console.log(report.note);
    }
  }
} finally { store.db.close(); }
