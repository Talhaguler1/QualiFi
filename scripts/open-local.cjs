const { spawn } = require('node:child_process');
const { createApp } = require('../server.cjs');
const port = Number(process.env.PORT || 3000);
const app = createApp();
app.server.on('error', error => { console.error('QualiFi could not start:', error.message); process.exitCode = 1; });
app.server.listen(port, process.env.HOST || '127.0.0.1', () => {
  const url = `http://localhost:${app.server.address().port}/kampanyalar`;
  console.log(`QualiFi: ${url}\nDatabase: ${app.store.filename}\nView records: view-leads.cmd / npm run leads\nKeep this window open. Stop with Ctrl+C.`);
  if (process.platform === 'win32') {
    const browser = spawn('cmd.exe', ['/c', 'start', '', url], { stdio: 'ignore', windowsHide: true });
    browser.on('error', () => console.log('Open the address above in your browser.'));
    browser.unref();
  }
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => app.server.close());
