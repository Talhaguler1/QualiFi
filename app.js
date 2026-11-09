const demo = document.querySelector('#demo-dialog');
const human = document.querySelector('#human-dialog');
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => demo.showModal()));
document.querySelectorAll('[data-human]').forEach(button => button.addEventListener('click', () => human.showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
});
document.querySelector('#switch-demo').addEventListener('click', () => { human.close(); demo.showModal(); });
const answers = {
  forecast: 'In an illustrative scenario, a new customer contract lifts expected revenue next quarter, while annual software renewals increase expenses. QualiFi’s intended workflow brings those commitments into the same conversation, helping your team understand what changed and plan its next move.',
  expense: 'Consider a software renewal mentioned in an email but missing from your spreadsheet. Connecting that context to your forecast could help your team spot the upcoming payment before it becomes a cash flow surprise. This is a sample scenario, not an analysis of live data.',
  context: 'The vision: connect your email, contracts, and enterprise cloud so your team can ask questions about revenue and expenses with the underlying business context in view. This landing page is a concept preview; integrations and a live AI model are not connected yet.'
};
const turkishAnswers = {
  forecast: 'Örnek bir senaryoda, yeni bir müşteri sözleşmesi gelecek çeyreğin beklenen gelirini artırırken yıllık yazılım yenilemeleri de giderleri yükseltiyor. QualiFi ile hedefimiz, bu taahhütleri aynı sohbette bir araya getirerek neyin değiştiğini görmenizi ve bir sonraki adımınızı planlamanızı kolaylaştırmak. Bu yanıt örnek verilere dayanır.',
  expense: 'Bir e-postada bahsi geçen ancak hesap tablonuza eklenmemiş yıllık yazılım yenilemesini düşünün. Bu bilgiyi tahmininize dahil etmek, yaklaşan ödemeyi nakit akışınızı etkilemeden önce görmenize yardımcı olabilir. Bu, canlı verilerin analizi değil, örnek bir senaryodur.',
  context: 'Hedefimiz; e-postalarınızı, sözleşmelerinizi ve kurumsal bulut verilerinizi birleştirerek gelir ve giderleriniz hakkında işinizin gerçek koşullarını dikkate alan sorular sorabilmeniz. Bu sayfa bir konsept önizlemesidir; entegrasyonlar ve canlı yapay zekâ modeli henüz bağlı değildir.'
};
const localizedAnswers = document.documentElement.lang === 'tr' ? turkishAnswers : answers;
document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => { const answer = document.querySelector('#demo-answer'); answer.textContent = localizedAnswers[button.dataset.question]; answer.hidden = false; }));
document.querySelector('#year').textContent = new Date().getFullYear();
