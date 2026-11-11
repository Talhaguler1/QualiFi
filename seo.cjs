const { CAMPAIGNS, CONTACT } = require('./campaigns.cjs');
const { escape } = require('./site.cjs');
function normalizeOrigin(value = '') {
  if (!value) return '';
  let url; try { url = new URL(value); } catch { throw new Error('PUBLIC_ORIGIN must be an absolute http(s) origin.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) throw new Error('PUBLIC_ORIGIN must contain only scheme and domain, without credentials, path, query or fragment.');
  return url.origin;
}
function canonicalPath(route) { return route === '/index.html' ? '/' : route === '/tr.html' ? '/tr' : route; }
function decorate(html, route, origin, noindex = false) {
  const canonical = origin ? new URL(canonicalPath(route), origin).href : canonicalPath(route);
  const canonicalTag = `<link rel="canonical" href="${escape(canonical)}">`;
  if (/<link rel="canonical"[^>]*>/.test(html)) html = html.replace(/<link rel="canonical"[^>]*>/, canonicalTag);
  else html = html.replace('</head>', canonicalTag + '</head>');
  if (origin) {
    html = html.replace(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\s*>/g, (_, lang, href) => `<link rel="alternate" hreflang="${lang}" href="${escape(new URL(href, origin).href)}">`);
    const image = `${origin}/social-preview.png`;
    const structured = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'QualiFi', url: origin, inLanguage: ['tr', 'en'], publisher: { '@type': 'Person', name: CONTACT.name, email: CONTACT.email } };
    const extra = `<meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>`;
    html = html.replace('</head>', extra + '</head>');
  }
  if (!origin || noindex) html = html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>');
  return html;
}
function sitemap(origin) {
  const paths = ['/', '/tr', '/tr/hakkimizda', '/en/about', '/tr/veri-kullanimi', '/en/data-use', ...CAMPAIGNS.flatMap(c => Object.values(c.routes))];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(route => `<url><loc>${escape(new URL(route, origin).href)}</loc></url>`).join('')}</urlset>`;
}
function robots(origin) { return origin ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /data/\nDisallow: /work/\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n'; }
module.exports = { normalizeOrigin, decorate, sitemap, robots };
