const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { inspectPage, evaluateAll } = require('../scripts/conversion-qa.cjs');
const { CAMPAIGNS } = require('../campaigns.cjs');
const { renderCampaign } = require('../campaign-site.cjs');
const { buildConfig } = require('../backstop.config.cjs');
const campaign = CAMPAIGNS[0];
const html = renderCampaign('tr', campaign);
const rules = source => inspectPage(source, campaign, 'tr').failures.map(issue => issue.rule);

test('all campaign structures pass without claiming a human or rendered test', () => {
  const results = evaluateAll(); assert.equal(results.length, 14);
  for (const row of results) {
    assert.deepEqual(row.failures, [], row.pageId);
    assert.equal(row.fiveSecond.status, 'human_test_required');
    assert.equal(row.visualStatus, 'not_run_by_this_module');
  }
});
test('a competing CTA is caught', () => {
  const bad = html.replace('data-position="hero">Sözleşmemi ekle', 'data-position="hero">Demo planla');
  assert.ok(rules(bad).includes('distraction.one-primary-action'));
  assert.ok(rules(bad).includes('clarity.commitment-label'));
});
test('missing first-screen audience and action are caught', () => {
  const bad = html.replace(/<span class="campaign-audience">.*?<\/span>/, '<span class="campaign-audience"></span>').replace('class="campaign-main-action"', 'class="missing-main-action"');
  assert.ok(rules(bad).includes('five-second.audience-present'));
  assert.ok(rules(bad).includes('five-second.action-present'));
});
test('a nonfunctional chat affordance is caught', () => {
  const bad = html.replace('class="conversation-scene"', 'class="conversation-scene"><div role="textbox">Ask me anything</div><div');
  assert.ok(rules(bad).includes('distraction.no-fake-chat-input'));
});
test('unverified urgency and removed stage disclosure are caught', () => {
  const bad = html.replace('class="campaign-stage"', 'class="removed-stage"').replace('</main>', '<p>Only 3 spots left</p></main>');
  assert.ok(rules(bad).includes('anxiety.product-stage'));
  assert.ok(rules(bad).includes('urgency.unverified-scarcity'));
});
test('price exposure is checked against the selected TR/EN policy', () => {
  const bad = html.replace('</main>', '<section data-price-variant="unexpected">Price</section></main>');
  assert.ok(rules(bad).includes('value.price-policy'));
});
test('Backstop configuration covers every language in page/form states and two viewports', () => {
  const config = buildConfig('http://127.0.0.1:4567');
  assert.equal(config.scenarios.length, 32); assert.equal(config.viewports.length, 2);
  assert.equal(new Set(config.scenarios.map(s => s.label)).size, 32);
  for (const c of CAMPAIGNS) for (const locale of ['tr', 'en']) {
    const scenes = config.scenarios.filter(s => s.label.startsWith(`${c.id}-${locale}-`));
    assert.equal(scenes.length, 2);
    assert.ok(scenes.every(s => new URL(s.url).pathname === c.routes[locale]));
    assert.deepEqual(scenes.map(s => s.openForm).sort(), [false, true]);
  }
  for (const route of ['/tr/hakkimizda', '/en/about', '/tr/veri-kullanimi', '/en/data-use']) assert.ok(config.scenarios.some(scene => new URL(scene.url).pathname === route));
});
test('managed runner reports the unavailable browser path instead of claiming visual success', () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'visual.cjs'), 'test'], { env: { ...process.env, SITES_MANAGED_LINUX_CONTAINER: '1' }, encoding: 'utf8' });
  assert.equal(result.status, 2); assert.match(result.stderr, /screenshots were NOT run/);
});
