// Local/CI runner. Managed Sites QA must use that environment's supported browser interface.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
async function main() {
  const mode = process.argv[2];
  if (!['reference', 'test', 'approve', 'openReport'].includes(mode)) throw new Error('Use reference, test, approve, or openReport.');
  if (process.env.SITES_MANAGED_LINUX_CONTAINER === '1') {
    console.error('Visual screenshots were NOT run: this managed environment requires the Sites browser interface, which is unavailable in this session. Run the visual command locally or in a supported CI/browser environment.');
    process.exitCode = 2; return;
  }
  const backstop = require('backstopjs');
  const { buildConfig } = require('../backstop.config.cjs');
  if (mode === 'approve' || mode === 'openReport') { await backstop(mode, { config: buildConfig() }); return; }
  const { createApp } = require('../server.cjs');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qualifi-visual-'));
  const app = createApp({ dataDir: directory, calendarUrl: '' });
  try {
    app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
    const config = buildConfig(`http://127.0.0.1:${app.server.address().port}`);
    console.log('Visual QA uses an isolated temporary database and analytics opt-out. No lead forms are submitted.');
    await backstop(mode, { config });
  } finally {
    if (app.server.listening) { app.server.close(); await once(app.server, 'close'); }
    fs.rmSync(directory, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
