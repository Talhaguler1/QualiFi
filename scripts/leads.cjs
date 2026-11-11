const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');
const { dataDirectory } = require('../store.cjs');
const { escape } = require('../email-templates.cjs');
function csvCell(value) {
  let s = String(value ?? '');
  if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}
function base64Lines(value) { return Buffer.from(value).toString('base64').match(/.{1,76}/g)?.join('\r\n') || ''; }
function exportLeads(directory) {
  const database = path.join(directory, 'qualifi.sqlite');
  if (!fs.existsSync(database)) throw new Error(`Veritabanı bulunamadı: ${database}\nFormu çalıştırdığınız klasörü/DATA_DIR ayarını kontrol edin. Yeni boş veritabanı oluşturulmadı.`);
  const db = new DatabaseSync(database, { readOnly: true });
  try {
    const columns = db.prepare('PRAGMA table_info(leads)').all().map(c => c.name);
    const rows = db.prepare(`SELECT id, kind, email, company, segment, solution, ${columns.includes('page_id') ? 'page_id' : "'legacy' AS page_id"}, created_at FROM leads ORDER BY created_at DESC`).all();
    const hasOutbox = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='email_outbox'").get();
    const drafts = hasOutbox ? db.prepare('SELECT * FROM email_outbox').all() : [];
    const draftDir = path.join(directory, 'email-drafts'); fs.mkdirSync(draftDir, { recursive: true, mode: 0o700 });
    const draftLinks = new Map();
    for (const draft of drafts) {
      if (!/^[a-f0-9-]{36}$/i.test(draft.lead_id)) continue;
      const file = path.join(draftDir, `${draft.lead_id}.eml`);
      const boundary = `qualifi-${draft.lead_id}`;
      const subject = Buffer.from(draft.subject).toString('base64');
      const email = [
        `To: ${draft.recipient.replace(/[\r\n]/g, '')}`, `Subject: =?UTF-8?B?${subject}?=`, 'X-Unsent: 1', 'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`, '',
        `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', base64Lines(draft.text_body),
        `--${boundary}`, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', base64Lines(draft.html_body), `--${boundary}--`, ''
      ].join('\r\n');
      fs.writeFileSync(file, email, { mode: 0o600 }); draftLinks.set(draft.lead_id, pathToFileURL(file).href);
    }
    const headers = ['id', 'kind', 'email', 'company', 'segment', 'solution', 'page_id', 'created_at'];
    const csv = '\ufeff' + [headers.map(csvCell).join(','), ...rows.map(row => headers.map(key => csvCell(row[key])).join(','))].join('\r\n');
    const csvFile = path.join(directory, 'leads.csv'); fs.writeFileSync(csvFile, csv, { mode: 0o600 });
    const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>QualiFi — Yerel başvurular</title><style>body{font:15px system-ui;background:#f6f7f2;color:#203b30;margin:32px}h1{margin-bottom:8px}.note{line-height:1.8;max-width:850px;color:#526b4e}table{border-collapse:collapse;width:100%;background:white;margin-top:25px}th,td{padding:12px;border:1px solid #d7e0ce;text-align:left;font-size:12px}th{background:#e7eedc}a{color:#305f2d}.path{overflow-wrap:anywhere;font:12px monospace}.scroll{overflow:auto}</style></head><body><h1>QualiFi başvuru kayıtları</h1><p>${rows.length} kayıt · ${new Date().toISOString()}</p><p class="path">Veritabanı: ${escape(database)}</p><p class="note">Bu dosya yalnızca bilgisayarınızda oluşturulur; herkese açık bir yönetim sayfası değildir. Kayıtlar otomatik olarak Gmail veya GitHub'a aktarılmaz. E-posta taslakları henüz gönderilmemiştir. Aynı e-posta farklı sayfalara ilgi bırakabilir.</p><p><a href="${pathToFileURL(csvFile).href}">Excel/CSV dosyasını aç</a></p><div class="scroll"><table><thead><tr><th>Tarih</th><th>E-posta</th><th>Tür</th><th>Sayfa</th><th>Şirket</th><th>Yanıt taslağı</th></tr></thead><tbody>${rows.map(row => `<tr><td>${escape(row.created_at)}</td><td>${escape(row.email)}</td><td>${escape(row.kind)}</td><td>${escape(row.page_id)}</td><td>${escape(row.company || '')}</td><td>${draftLinks.has(row.id) ? `<a href="${draftLinks.get(row.id)}">E-posta taslağını aç (gönderilmedi)</a>` : 'Eski kayıt — taslak yok'}</td></tr>`).join('')}</tbody></table></div><p class="note">Bu rapor kişisel bilgi içerir. Raporu/CSV'yi herkese açık bir klasöre koymayın. Yeni kayıtları görmek için raporu yeniden oluşturun.</p></body></html>`;
    const output = path.join(directory, 'lead-report.html'); fs.writeFileSync(output, html, { mode: 0o600 });
    return { count: rows.length, draftCount: drafts.length, output, database, csvFile };
  } finally { db.close(); }
}
if (require.main === module) {
  try {
    const report = exportLeads(dataDirectory());
    console.log(`Veritabanı: ${report.database}\nKayıt: ${report.count}\nGönderilmemiş taslak: ${report.draftCount}\nRapor: ${report.output}`);
    if (process.argv.includes('--open') && process.platform === 'win32') {
      const browser = spawn('explorer.exe', [report.output], { stdio: 'ignore', windowsHide: true });
      browser.on('error', () => console.log('Rapor dosyasını tarayıcınızda açabilirsiniz.')); browser.unref();
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { exportLeads, csvCell };
