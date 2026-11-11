const { BY_ID, CONTACT, local } = require('./campaigns.cjs');
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function acknowledgement(lead) {
  const tr = lead.context.locale === 'tr'; const t = (a, b) => tr ? a : b;
  const campaign = BY_ID[lead.context.campaignId];
  const solution = campaign ? local(campaign.audience, lead.context.locale) : 'QualiFi';
  const subject = t('QualiFi talebiniz alındı', 'Your QualiFi request is saved');
  const paragraphs = [
    t('Merhaba,', 'Hello,'),
    ...(campaign ? [t('İlgilendiğiniz çözüm: ', 'The solution you selected: ') + local(campaign.title, lead.context.locale) + ' ' + local(campaign.accent, lead.context.locale)] : []),
    lead.kind === 'waitlist' ? t('QualiFi bekleme listesine kaydınız alındı. İlgilendiğiniz çözümün pilot ve erken erişim gelişmeleri için sizinle iletişim kurabiliriz.', 'Your interest in the QualiFi waitlist is saved. We may contact you about pilot and early-access updates for the solution you selected.') : lead.kind === 'meeting' ? t('QualiFi görüşme talebiniz alındı. Bu kayıt tek başına gün ve saat rezervasyonu oluşturmaz; görüşme zamanını ayrıca netleştireceğiz.', 'Your QualiFi conversation request is saved. This record does not reserve a date or time; we will arrange the timing separately.') : t('QualiFi pilot talebiniz alındı. Paylaştığınız bilgiler, ihtiyacınızı ve uygun pilot kapsamını değerlendirmemize yardımcı olacak.', 'Your QualiFi pilot request is saved. The information you shared will help us assess your needs and the appropriate pilot scope.'),
    t('QualiFi şu anda geliştirme/pilot aşamasında. Bu kayıt, çalışan bir ajanı etkinleştirmez, Gmail veya WhatsApp hesabınıza erişim vermez ve canlı finansal analiz başlatmaz.', 'QualiFi is in development/pilot stage. This request does not activate an agent, grant access to your Gmail or WhatsApp accounts, or start live financial analysis.'),
    t('İhtiyacınızı daha ayrıntılı değerlendirmek için sonraki aşamada 20 dakikalık bir demo görüşmesi yapabiliriz. İsterseniz mevcut takip yönteminizi ve çözmek istediğiniz problemi bu e-postaya yanıtlayarak paylaşabilirsiniz. Şifre veya gizli hesap erişimi göndermeyin.', 'A later 20-minute demo can explore your needs in more detail. You can reply with your current workflow and the problem you want to solve. Please do not send passwords or confidential account access.'),
    t(`Kayıt referansınız: ${lead.id.slice(0, 8)}. Verilerinize erişim, kaydınızı silme veya bekleme listesinden ayrılma talebi için ${CONTACT.email} adresine yazabilirsiniz.`, `Your reference: ${lead.id.slice(0, 8)}. For data access, deletion or leaving the waiting list, contact ${CONTACT.email}.`),
    `${CONTACT.name}\nQualiFi\n${CONTACT.email}`
  ];
  return { subject, text: paragraphs.join('\n\n'), html: `<!doctype html><html lang="${tr ? 'tr' : 'en'}"><body><h1>${escape(subject)}</h1>${paragraphs.map(p => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`).join('')}</body></html>`, solution };
}
module.exports = { acknowledgement, escape };
