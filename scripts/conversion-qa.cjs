const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { CAMPAIGNS, CONTACT, local } = require('../campaigns.cjs');
const { renderCampaign } = require('../campaign-site.cjs');

// Structural indicators only. This module cannot measure human comprehension or conversion lift.
function inspectPage(html, campaign, locale) {
  const dom = new JSDOM(html); const d = dom.window.document;
  const text = selector => d.querySelector(selector)?.textContent.trim() || '';
  const failures = [];
  const check = (condition, rule, reason) => { if (!condition) failures.push({ rule, reason }); };
  const h1s = d.querySelectorAll('h1');
  check(d.documentElement.lang === locale, 'relevance.locale', 'Page language must match the intended locale.');
  check(h1s.length === 1 && text('h1').length > 12, 'clarity.headline', 'Use one meaningful primary headline.');
  check(text('.campaign-audience').length > 8, 'five-second.audience-present', 'The first-screen source must name an audience.');
  check(text('.campaign-intro').length > 40, 'value.explanation', 'Include a specific explanation of the intended result.');
  check(text('h1').split(/\s+/).length <= 24, 'clarity.headline-length', 'Review an unusually long headline before shipping.');
  check(d.querySelector('.campaign-main-action .campaign-primary'), 'five-second.action-present', 'A primary action must appear in the hero source.');
  const primary = [...d.querySelectorAll('.campaign-primary')];
  const labels = primary.map(button => button.textContent.trim());
  check(primary.length >= 2 && new Set(labels).size === 1, 'distraction.one-primary-action', 'Repeated primary buttons must promise the same action.');
  check(primary.some(button => button.dataset.position === 'footer'), 'clarity.repeated-action', 'Repeat the same action after the explanation.');
  const expected = campaign.goal === 'contract' ? /sözleşme|contract/i : campaign.goal === 'interest' ? /pilot/i : /bekleme|listesine|waitlist/i;
  check(labels.every(label => expected.test(label)), 'clarity.commitment-label', 'The CTA must name the actual contract, waitlist or interest commitment.');
  check(!d.querySelector('main a[href]:not([href^="#"])'), 'distraction.no-competing-links', 'Campaign content should not send people to unrelated destinations.');
  check(!d.querySelector('nav'), 'distraction.no-broad-menu', 'Keep general site navigation outside focused ad pages.');
  check([...d.querySelectorAll('main button')].every(button => button.classList.contains('campaign-primary')), 'distraction.no-alternate-main-actions', 'Do not add a competing main action.');
  check(d.querySelectorAll('.campaign-steps article').length === 3, 'clarity.journey', 'Show three understandable journey steps.');
  check(text('.conversation-example').length > 0 && text('.conversation-source').length > 0, 'anxiety.example-disclosure', 'Label the example and distinguish it from live output.');
  check(!d.querySelector('.conversation-input, .conversation-scene input, .conversation-scene textarea, .conversation-scene [contenteditable], .conversation-scene [role="textbox"]'), 'distraction.no-fake-chat-input', 'A static example must not offer a nonfunctional chat composer.');
  check(text('.campaign-stage').length > 10, 'anxiety.product-stage', 'State the pilot/exploration stage near the primary action.');
  if (campaign.goal === 'contract') {
    check(/pilot|canlı analiz/i.test(text('.campaign-friction')), 'anxiety.upload-stage', 'State the pilot status next to the contract CTA.');
    check(d.querySelector('[name="fileMode"][value="sample"]'), 'anxiety.sample-alternative', 'Allow an illustrative alternative to a real customer document.');
  }
  const form = d.querySelector('#campaign-form');
  check(form && form.querySelector('[type="email"][required]'), 'clarity.contact-form', 'Use a labeled email field for the requested follow-up.');
  check(form && form.querySelector('[name="consent"][required]'), 'anxiety.contact-consent', 'Keep contact/data-use consent visible.');
  if (form) {
    for (const control of form.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
      if (control.name === 'website') continue;
      const label = control.closest('label') || (control.id && d.querySelector(`label[for="${control.id}"]`));
      check(label, 'clarity.form-labels', `Control ${control.id || control.name} needs a label.`);
    }
  }
  check(d.querySelector('#privacy-dialog') && text('.campaign-contact').includes(CONTACT.name) && text('.campaign-contact').includes(CONTACT.email), 'anxiety.real-contact', 'Provide the actual owner contact and data-use explanation.');
  check(d.querySelector('#campaign-language')?.getAttribute('href') === campaign.routes[locale === 'tr' ? 'en' : 'tr'], 'relevance.language-pair', 'Language switching must retain the same offer.');
  const price = d.querySelector('[data-price-variant]');
  check(Boolean(price) === Boolean(campaign.price && locale === 'en'), 'value.price-policy', 'Respect hidden TR prices and selected planned EN prices.');
  if (price) check(/planned price/i.test(price.textContent) && /no payment/i.test(price.textContent), 'anxiety.planned-price', 'Distinguish planned pricing from a purchasable package.');
  check(!/only\s+\d+\s+(?:spots|places)\s+left|son\s+\d+\s+(?:kişi|yer)|geri sayım|countdown/i.test(d.body.textContent), 'urgency.unverified-scarcity', 'No unverified quota/countdown is currently authorized for these campaigns.');
  check(!/backed by|trusted by \d|\b100%\s+(?:accurate|accuracy)/i.test(d.body.textContent), 'anxiety.unverified-proof', 'Do not add unsupported backing, customer counts or accuracy claims.');
  const ids = [...d.querySelectorAll('[id]')].map(element => element.id);
  check(new Set(ids).size === ids.length, 'clarity.unique-ids', 'Duplicate IDs can break forms and accessibility.');
  const result = {
    pageId: `${campaign.id}:${locale}`, route: campaign.routes[locale], automaticStatus: failures.length ? 'fail' : 'pass', failures,
    fiveSecond: { status: 'human_test_required', intendedAudience: local(campaign.audience, locale), intendedOutcome: text('h1'), intendedAction: labels[0] || '' },
    lift: {
      valueProposition: 'Human review: does this outcome matter, and is the promised scope believable?',
      relevance: 'Human review: does the target customer use this language and recognize this problem?',
      clarity: 'Source hierarchy checked; actual first-fold visibility and comprehension need rendered/human testing.',
      urgency: 'No unverified scarcity detected if automatic checks pass; usefulness of acting now needs customer evidence.',
      anxiety: 'Disclosure/contact structure checked; trust, real data handling and price value need review.',
      distraction: 'One-primary-action structure checked; visual competition needs rendered review.'
    },
    visualStatus: 'not_run_by_this_module'
  };
  dom.window.close(); return result;
}
function evaluateAll() { return CAMPAIGNS.flatMap(campaign => ['tr', 'en'].map(locale => inspectPage(renderCampaign(locale, campaign), campaign, locale))); }
if (require.main === module) {
  const pages = evaluateAll(); const failures = pages.flatMap(page => page.failures.map(issue => ({ page: page.pageId, ...issue })));
  const report = { scope: 'Structural proxies for the 5-second/LIFT review; not a human study or a conversion score.', pages };
  const destination = path.join(__dirname, '..', 'work', 'quality'); fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, 'latest.json'), JSON.stringify(report, null, 2));
  console.log(`Conversion structure: ${pages.length - pages.filter(p => p.failures.length).length}/${pages.length} pages passed.`);
  for (const issue of failures) console.error(`${issue.page} [${issue.rule}] ${issue.reason}`);
  console.log('Timed human 5-second test: NOT RUN. Visual/browser review: NOT RUN by this module.');
  console.log('See docs/conversion-quality.md for the human protocol and BackstopJS workflow.');
  if (failures.length) process.exitCode = 1;
}
module.exports = { inspectPage, evaluateAll };
