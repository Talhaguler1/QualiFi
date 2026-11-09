module.exports = async (page, scenario) => {
  await page.evaluate(async () => { await document.fonts.ready; });
  if (scenario.openForm) {
    await page.click('.campaign-main-action .campaign-primary');
    await page.waitForSelector('#campaign-dialog[open]');
  }
};
