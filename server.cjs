const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = { '/': ['index.html', 'text/html; charset=utf-8'], '/index.html': ['index.html', 'text/html; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'], '/app.js': ['app.js', 'text/javascript; charset=utf-8'] };
const port = Number(process.env.PORT || 3000);
for (const route of ['/tr', '/tr/', '/tr.html']) files[route] = ['tr.html', 'text/html; charset=utf-8'];
http.createServer((req, res) => {
  const entry = files[new URL(req.url, 'http://localhost').pathname];
  if (!entry) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(path.join(__dirname, entry[0]), (error, data) => {
    if (error) { res.writeHead(500); res.end('Unable to load page'); return; }
    res.writeHead(200, { 'Content-Type': entry[1], 'Cache-Control': 'no-cache' }); res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`QualiFi is running at http://localhost:${port}`));
