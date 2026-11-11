const path = require('node:path');
const { CAMPAIGNS } = require('./campaigns.cjs');
const { INFO_ROUTES } = require('./info-site.cjs');
const root = __dirname;
function buildConfig(baseUrl = 'http://127.0.0.1:3000') {
  const scenarios = CAMPAIGNS.flatMap(campaign => ['tr', 'en'].flatMap(locale => [false, true].map(openForm => ({
    label: `${campaign.id}-${locale}-${openForm ? 'form' : 'page'}`,
    url: new URL(campaign.routes[locale], baseUrl).href,
    readySelector: '.campaign-main-action .campaign-primary',
    selectors: openForm ? ['#campaign-dialog'] : ['document'], openForm,
    onBeforeScript: 'on-before.cjs', onReadyScript: 'on-ready.cjs',
    misMatchThreshold: 0.1, requireSameDimensions: true
  }))));
  for (const [kind, languages] of Object.entries(INFO_ROUTES)) for (const [locale, route] of Object.entries(languages)) scenarios.push({
    label: `info-${kind}-${locale}`, url: new URL(route, baseUrl).href,
    readySelector: 'h1', selectors: ['document'], openForm: false,
    onBeforeScript: 'on-before.cjs', onReadyScript: 'on-ready.cjs',
    misMatchThreshold: 0.1, requireSameDimensions: true
  });
  return {
    id: 'qualifi-campaigns',
    viewports: [{ label: 'mobile', width: 390, height: 844 }, { label: 'desktop', width: 1440, height: 1000 }],
    scenarios,
    paths: {
      bitmaps_reference: path.join(root, 'visual', 'baselines'),
      bitmaps_test: path.join(root, 'work', 'visual', 'test'),
      engine_scripts: path.join(root, 'visual'),
      html_report: path.join(root, 'work', 'visual', 'html-report'),
      ci_report: path.join(root, 'work', 'visual', 'ci-report')
    },
    report: ['browser'], engine: 'puppeteer',
    engineOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
    asyncCaptureLimit: 2, asyncCompareLimit: 5, debug: false, debugWindow: false
  };
}
module.exports = buildConfig();
module.exports.buildConfig = buildConfig;
