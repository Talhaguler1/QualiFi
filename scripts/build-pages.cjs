const fs = require('node:fs');
const path = require('node:path');
const { renderPage } = require('../site.cjs');
for (const [name, locale] of [['index.html', 'en'], ['tr.html', 'tr']]) fs.writeFileSync(path.join(__dirname, '..', name), renderPage(locale, 'business'));
console.log('English and Turkish HTML snapshots updated. Segment pages are rendered by the server.');
