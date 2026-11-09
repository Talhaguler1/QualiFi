// Copy is a product hypothesis. Examples are illustrative, never live model output.
const CAMPAIGNS = [
  {
    id: 'cashflow', segment: 'business', solution: 'forecast', goal: 'contract', offerId: 'contract-cash-outlook',
    routes: { tr: '/tr/sozlesmeden-nakit-akisi', en: '/en/contract-cash-flow' }, price: { amount: 29, unit: 'analysis' },
    audience: ['Proje bazlı çalışan ajanslar için', 'For project-based agencies'],
    title: ['Ödemeler sözleşmede.', 'Your payments are in the contract.'], accent: ['Nakit planınız önünüzde olsun.', 'Put your cash plan in focus.'],
    intro: ['Avans, teslim ve vade koşullarını tek bir nakit zaman çizelgesinde buluşturmayı hedefliyoruz. Hangi haftada ne beklediğinizi, bir ödeme gecikirse neyin değişeceğini görün.', 'Bring deposits, milestones and payment terms into one cash timeline. Explore what to expect each week and what changes when a payment slips.'],
    cta: ['Sözleşmemi ekle', 'Add my contract'],
    friction: ['PDF veya TXT · Örnek sözleşmeyle de ilerleyebilirsiniz.', 'PDF or TXT · You can also use a sample agreement.'],
    problemTitle: ['Gelir belli. Tarihler dağınık.', 'The revenue is agreed. The dates are scattered.'],
    problem: ['Müşteri sözleşmesi ayrı yerde, ekip giderleri başka bir tabloda. Bir sonraki ödemenin ne zaman beklendiğini görmek için her seferinde aynı bilgileri birleştiriyorsunuz.', 'The client agreement is in one place and team expenses in another. You keep piecing the same information together to understand when the next payment is expected.'],
    question: ['Teslim ödemesi iki hafta gecikirse?', 'What if the milestone payment is two weeks late?'],
    reply: ['Örnek sözleşmede avans ve teslim ödemesini ayrı tarihlere yerleştirelim. Gecikme senaryosunu giderlerle birlikte değerlendirebiliriz.', 'Place the deposit and milestone payment on separate dates, then review a delayed-payment scenario alongside planned expenses.'],
    rows: [
      [['Proje avansı', 'Project deposit'], ['1. hafta', 'Week 1'], ['+ ₺45.000', '+ $4,500']],
      [['Planlanan gider', 'Planned expense'], ['2. hafta', 'Week 2'], ['− ₺18.000', '− $1,800']],
      [['Teslim ödemesi', 'Milestone payment'], ['4. hafta → 6. hafta', 'Week 4 → Week 6'], ['Senaryo', 'Scenario']]
    ],
    steps: [
      [['Sözleşme veya girdiyi ekleyin', 'Add an agreement or input'], ['Ödeme koşullarını içeren bir belgeyle ya da örnek senaryoyla başlayın.', 'Start with a document containing payment terms or an illustrative scenario.']],
      [['Tutarları ve tarihleri birleştirelim', 'Bring amounts and dates together'], ['Avans, teslim ve vade bilgisini kontrol edilebilir bir plana yerleştirelim.', 'Put deposits, milestones and terms into a plan you can review.']],
      [['Gecikmenin etkisini konuşalım', 'Explore the effect of a delay'], ['Beklenen ödeme ve giderlerinizi aynı zaman çizelgesinde değerlendirelim.', 'Review expected payments and expenses on the same timeline.']]
    ]
  },
  {
    id: 'project-income', segment: 'freelance', solution: 'forecast', goal: 'waitlist', offerId: 'freelance-income-plan',
    routes: { tr: '/tr/freelancer-gelir-plani', en: '/en/freelancer-income-plan' },
    audience: ['Birden çok müşterisi olan freelancerlar için', 'For freelancers with multiple clients'],
    title: ['Proje geliriniz değişir.', 'Project income changes.'], accent: ['Önünüzü planlayın.', 'Plan what comes next.'],
    intro: ['Bir müşteriden avans, diğerinden teslim ödemesi. Proje tutarlarını ve ödeme koşullarını tek gelir planında görmenize yardımcı olacak bir finans ajanı geliştiriyoruz.', 'A deposit from one client, a milestone payment from another. We’re building a finance agent to help you see project amounts and payment terms in one income plan.'],
    cta: ['Gelir planı listesine katıl', 'Join the income-plan waitlist'],
    friction: ['Yalnızca e-posta · İlk adımda belge paylaşmanız gerekmez.', 'Email only · No document required to express interest.'],
    problemTitle: ['İş var. Gelirin zamanı belirsiz.', 'The work is booked. The income timing is unclear.'],
    problem: ['Proje toplamı, bu ay hesabınıza girecek tutarı söylemiyor. Farklı teslim tarihleri ve ödeme koşulları arasında gelir planınızı sürekli yeniden kuruyorsunuz.', 'The total project value doesn’t tell you what will reach your account this month. Different milestones and payment terms keep changing the plan.'],
    question: ['Bu ay hangi proje ödemelerini bekliyorum?', 'Which project payments am I expecting this month?'],
    reply: ['Örnek projeleri avans ve teslim adımlarına ayıralım. Böylece aynı ayda beklenen gelirle sonraki aya kayan ödemeleri ayırt edebiliriz.', 'Split the sample projects into deposits and milestones to distinguish this month’s expected income from payments moving into next month.'],
    rows: [
      [['Tasarım projesi', 'Design project'], ['Avans', 'Deposit'], ['Bekleniyor', 'Expected']],
      [['Danışmanlık', 'Consulting'], ['Teslim + 14 gün', 'Delivery + 14 days'], ['Bu ay', 'This month']],
      [['Yazılım projesi', 'Software project'], ['Gecikme senaryosu', 'Delay scenario'], ['Sonraki ay', 'Next month']]
    ],
    steps: [
      [['Projelerinizi tanımlayın', 'Describe your projects'], ['Müşteri, tutar ve ödeme adımlarını birlikte ele alalım.', 'Bring client, amount and milestone details together.']],
      [['Ödemeleri takvime yerleştirelim', 'Place payments on a timeline'], ['Avans ve teslim ödemelerinin hangi döneme denk geldiğini görelim.', 'See where deposits and milestone payments fall.']],
      [['Bir sonraki ayı planlayın', 'Plan the next month'], ['Gecikme veya teslim değişikliğinin gelir planına etkisini inceleyelim.', 'Explore how delays or delivery changes affect your income plan.']]
    ]
  },
  {
    id: 'collections', segment: 'finance', solution: 'autopilot', goal: 'waitlist', offerId: 'receivables-follow-up',
    routes: { tr: '/tr/tahsilat-takibi', en: '/en/receivables-follow-up' },
    audience: ['Vadeli çalışan küçük B2B işletmeler için', 'For small B2B businesses selling on terms'],
    title: ['Ödeme sözü e-postada.', 'The payment promise is in an email.'], accent: ['Takibi aklınızda kalmasın.', 'Keep the follow-up off your mind.'],
    intro: ['“Gelecek hafta ödeyeceğiz” yazışmalarını, sözleşmedeki vadeleri ve takip gerektiren tahsilatları bir araya getiren bir ajan geliştiriyoruz.', 'We’re building an agent to connect “we’ll pay next week” messages, contractual due dates and receivables that need a follow-up.'],
    cta: ['Tahsilat takibine erken erişim al', 'Join the receivables pilot'],
    friction: ['Pilot listesi · Bu adım Gmail erişimi istemez.', 'Pilot waitlist · No Gmail access requested at this step.'],
    problemTitle: ['Vade geçtiğinde yeniden bilgi topluyorsunuz.', 'When a due date passes, the search starts again.'],
    problem: ['Son ödeme sözü hangi e-postadaydı? Sözleşmedeki vade neydi? Takip için gereken bilgiler farklı yerlerde kaldığında aynı müşteriye tekrar tekrar dönmek zorlaşıyor.', 'Which thread contained the latest promise? What did the contract say? Follow-ups get harder when the details are scattered across messages and documents.'],
    question: ['Bugün hangi tahsilatları takip etmeliyim?', 'Which receivables need attention today?'],
    reply: ['Örnek akışta sözleşme vadesini ve son ödeme taahhüdünü birlikte görelim. Öncelikle gözden geçirmeniz gereken işleri ayrı bir özette toplayabiliriz.', 'In this sample workflow, compare the contractual due date with the latest payment promise and gather items that need review into a short summary.'],
    rows: [
      [['Sözleşme vadesi', 'Contractual due date'], ['Kaynak: sözleşme', 'Source: agreement'], ['Gözden geçir', 'Review']],
      [['Son ödeme sözü', 'Latest payment promise'], ['Kaynak: e-posta', 'Source: email'], ['Eşleştir', 'Match']],
      [['Takip gerektiren iş', 'Follow-up item'], ['Önerilen sonraki adım', 'Suggested next step'], ['Siz onaylayın', 'You review']]
    ],
    steps: [
      [['İlgili bağlamı belirleyin', 'Define the relevant context'], ['Pilot görüşmesinde hangi sözleşme ve yazışmaların kullanılacağını seçelim.', 'Define which agreements and messages are relevant during the pilot discussion.']],
      [['Vadeleri ve taahhütleri eşleştirelim', 'Match due dates and commitments'], ['Sözleşmedeki tarih ile son yazışmadaki ödeme sözünü birlikte inceleyelim.', 'Review the date in the agreement alongside the latest written payment promise.']],
      [['Takip özetini alın', 'Get a follow-up summary'], ['Dikkat gerektiren tahsilat ve sonraki aksiyonları anlaşılır şekilde görelim.', 'See receivables needing attention and the next actions in a clear format.']]
    ]
  },
  {
    id: 'sales-follow-up', segment: 'business', solution: 'autopilot', goal: 'waitlist', offerId: 'gmail-sales-follow-up',
    routes: { tr: '/tr/gmail-satis-takibi', en: '/en/gmail-sales-follow-up' }, price: { amount: 99, unit: 'month' },
    audience: ['Satışını Gmail üzerinden yürüten işletmeler için', 'For business owners selling through Gmail'],
    title: ['Teklifi gönderdiniz.', 'You sent the proposal.'], accent: ['Sonraki adımı kaçırmayın.', 'Don’t lose the next step.'],
    intro: ['Yanıt bekleyen teklifleri, son temasları ve takip gerektiren fırsatları tek bir konuşmada görebileceğiniz bir Gmail follow-up ajanı geliştiriyoruz.', 'We’re building a Gmail follow-up agent that brings unanswered proposals, last contacts and opportunities needing attention into one conversation.'],
    cta: ['Follow-up ajanı listesine katıl', 'Join the follow-up agent waitlist'],
    friction: ['Erken erişim · Bu adımda Gmail hesabınız bağlanmaz.', 'Early access · Your Gmail account is not connected at this step.'],
    problemTitle: ['Yeni işler gelirken eski teklifler unutuluyor.', 'New work comes in. Earlier proposals get forgotten.'],
    problem: ['Teklifi hazırlayıp gönderdiniz. Sonra günlük işler başladı. Hangi müşteriye ne zaman dönmeniz gerektiğini hatırlamak, ayrı bir takip işine dönüşüyor.', 'You prepared and sent the proposal. Then the day got busy. Remembering who needs a reply and when becomes another job of its own.'],
    question: ['Hangi tekliflere yeniden dönmeliyim?', 'Which proposals should I follow up on?'],
    reply: ['Örnek yazışmalarda yanıt bekleyen teklifleri ve son temasları ayıralım. Bir sonraki takip adımını sizin belirleyeceğiniz kurallarla şekillendirebiliriz.', 'Separate proposals awaiting a reply from recent conversations. Shape the next follow-up step around rules that you define.'],
    rows: [
      [['Teklif gönderildi', 'Proposal sent'], ['Yanıt durumu', 'Reply status'], ['Yanıt bekliyor', 'Awaiting reply']],
      [['Son temas', 'Last contact'], ['Yazışma bağlamı', 'Conversation context'], ['İncele', 'Review']],
      [['Sonraki adım', 'Next step'], ['Pilot kapsamına göre', 'Defined in the pilot'], ['Takip önerisi', 'Follow-up suggestion']]
    ],
    steps: [
      [['Satış akışınızı tanımlayın', 'Describe your sales workflow'], ['Hangi tekliflerin ve yazışmaların takip edileceğini birlikte belirleyelim.', 'Define which proposals and conversations need follow-up.']],
      [['Yanıtları ve son temasları ayıralım', 'Review replies and last contacts'], ['Teklifin durumunu ilgili e-posta bağlamıyla birlikte değerlendirelim.', 'Review each proposal with the context from the relevant messages.']],
      [['Sonraki adımı görün', 'See the next step'], ['Takip önerisi ve kullanıcı kontrolünü pilotta açıkça tanımlayalım.', 'Define follow-up suggestions and user control clearly during the pilot.']]
    ]
  },
  {
    id: 'sales-forecast', segment: 'finance', solution: 'forecast', goal: 'waitlist', offerId: 'email-sales-outlook',
    routes: { tr: '/tr/satis-ongorusu', en: '/en/sales-outlook' },
    audience: ['Fırsatlarını e-postayla takip eden B2B satış ekipleri için', 'For B2B sales teams tracking opportunities in email'],
    title: ['Açık teklif,', 'An open proposal'], accent: ['gerçekleşmiş satış değil.', 'isn’t a closed sale.'],
    intro: ['Yazışmalardaki satış sinyallerini, fırsat aşamalarını ve varsayımları birlikte görmenizi sağlayacak bir satış öngörüsü deneyimi geliştiriyoruz.', 'We’re building a sales-outlook workflow that brings conversation signals, opportunity stages and assumptions into view together.'],
    cta: ['Satış öngörüsü listesine katıl', 'Join the sales-outlook waitlist'],
    friction: ['İlgi kaydı · Canlı satış tahmini henüz sunulmuyor.', 'Register interest · Live sales prediction is not available yet.'],
    problemTitle: ['Teklif toplamı, beklenen satışı açıklamıyor.', 'The proposal total doesn’t explain expected sales.'],
    problem: ['Hangi fırsat ilerliyor, hangisi beklemede? E-posta güncellemeleri plana yansımadığında satış beklentisi ile fırsatların gerçek durumu birbirinden uzaklaşıyor.', 'Which opportunity is progressing and which is waiting? When email updates don’t reach the plan, expectations drift away from the actual state of conversations.'],
    question: ['Gelecek ayki satış beklentimin dayanağı ne?', 'What supports next month’s sales outlook?'],
    reply: ['Örnek fırsatları aşama ve varsayımlarıyla birlikte görelim. İlerleyen görüşmelerle henüz onaylanmamış teklifleri ayrı değerlendirebiliriz.', 'Review sample opportunities with their stages and assumptions, separating progressing conversations from proposals that haven’t been confirmed.'],
    rows: [
      [['Görüşme devam ediyor', 'Conversation progressing'], ['Son yanıt bağlamı', 'Latest reply context'], ['Sinyal', 'Signal']],
      [['Teklif değerlendiriliyor', 'Proposal under review'], ['Varsayım açık', 'Assumption stated'], ['Senaryo', 'Scenario']],
      [['İmza / sipariş yok', 'No signature / order'], ['Kesinleşmiş gelir değil', 'Not confirmed revenue'], ['Ayrı göster', 'Keep separate']]
    ],
    steps: [
      [['Fırsat bağlamını paylaşın', 'Define the opportunity context'], ['İlgili teklif ve yazışmalardan hangi bilgilerin kullanılacağını belirleyelim.', 'Define which information from proposals and conversations is relevant.']],
      [['Varsayımları görünür kılalım', 'Make assumptions visible'], ['Aşama, tarih ve satış beklentisinin hangi girdilere dayandığını inceleyelim.', 'Review which inputs support the stage, timing and expected sales.']],
      [['Senaryoları karşılaştırın', 'Compare scenarios'], ['Beklenen satışın hangi fırsatlar ve koşullarla değiştiğini değerlendirelim.', 'Explore how opportunities and conditions change the sales outlook.']]
    ]
  },
  {
    id: 'whatsapp', segment: 'business', solution: 'autopilot', goal: 'waitlist', offerId: 'whatsapp-payment-follow-up',
    routes: { tr: '/tr/whatsapp-odeme-takibi', en: '/en/whatsapp-payment-follow-up' },
    audience: ['WhatsApp Business üzerinden sipariş alan işletmeler için', 'For businesses taking orders through WhatsApp Business'],
    title: ['Ödeme sözü sohbette.', 'The payment promise is in the chat.'], accent: ['Takibi kaybolmasın.', 'Keep the follow-up in sight.'],
    intro: ['Sipariş ve ödeme konuşmalarındaki taahhütleri anlaşılır bir takip özetine dönüştürmeyi araştırıyoruz. Desteklenebilecek hesap türlerini pilotta birlikte değerlendirelim.', 'We’re exploring how commitments in order and payment conversations could become a clear follow-up summary. Let’s evaluate supported account types during the pilot.'],
    cta: ['WhatsApp pilotuna ilgi bırak', 'Join the WhatsApp pilot waitlist'],
    friction: ['Keşif aşamasında · Hesap bağlantısı veya sohbet erişimi istenmez.', 'Exploration stage · No account connection or chat access requested.'],
    problemTitle: ['Konuşma ilerliyor. Finansal işler geride kalıyor.', 'The conversation moves on. Payment details get left behind.'],
    problem: ['Sipariş, teslim ve ödeme mesajları aynı sohbet akışında. Bir ödeme taahhüdünü tekrar bulmak için konuşmaları baştan taramak gerekiyor.', 'Orders, deliveries and payment messages share the same chat. Finding a payment promise again means searching through the conversation.'],
    question: ['Hangi sipariş için ödeme sözü verilmişti?', 'Which order had a payment promise?'],
    reply: ['Hedeflenen deneyimde, izinli ve desteklenen veri erişimiyle sipariş, ödeme taahhüdü ve takip gerektiren işi aynı özette buluşturmak istiyoruz.', 'In the intended workflow, permitted and supported data access could bring the order, payment promise and follow-up item into one summary.'],
    rows: [
      [['Sipariş bilgisi', 'Order details'], ['Örnek sohbet', 'Sample conversation'], ['Bağlam', 'Context']],
      [['Ödeme taahhüdü', 'Payment promise'], ['Tarih ve koşullar', 'Date and conditions'], ['Çıkarım hedefi', 'Extraction goal']],
      [['Hesap uyumluluğu', 'Account compatibility'], ['Pilot değerlendirmesi', 'Pilot assessment'], ['Henüz doğrulanmadı', 'Not verified yet']]
    ],
    steps: [
      [['İhtiyacınızı belirtin', 'Tell us what you need'], ['Hangi hesap türü ve sipariş akışıyla çalıştığınızı pilotta konuşalım.', 'Discuss your account type and order workflow during the pilot.']],
      [['Veri erişimini değerlendirelim', 'Evaluate data access'], ['Hangi veriye hangi izinlerle erişilebileceğini teknik olarak doğrulayalım.', 'Technically verify which data can be accessed and under which permissions.']],
      [['Takip özetini tasarlayalım', 'Design the follow-up summary'], ['Ödeme taahhüdü ve gerekli sonraki adımı anlaşılır bir çıktıda birleştirelim.', 'Bring payment commitments and next steps into a clear output.']]
    ]
  },
  {
    id: 'bank-risk', segment: 'banks', solution: 'risk', goal: 'interest', offerId: 'repayment-signal-pilot',
    routes: { tr: '/tr/banka-risk-pilotu', en: '/en/bank-risk-pilot' },
    audience: ['Bankaların KOBİ risk ve analitik ekipleri için', 'For SME risk and analytics teams at banks'],
    title: ['Geri ödeme davranışına', 'A closer look at'], accent: ['daha fazla bağlam.', 'repayment context.'],
    intro: ['İzinli iletişim ve sektör verilerindeki sinyallerin geri ödeme değerlendirmesine katkısını araştıracağımız bir kurumsal pilot. Veri kapsamı ve doğrulamayı birlikte tanımlayalım.', 'A corporate pilot to explore how signals in permitted communication and sector data could inform repayment assessment. Define data scope and validation together.'],
    cta: ['Kurumsal pilotla ilgileniyorum', 'Register interest in a corporate pilot'],
    friction: ['Kurumsal keşif · Bu sayfada müşteri verisi veya risk skoru alınmaz.', 'Corporate discovery · No customer data or risk scores collected here.'],
    problemTitle: ['Ek sinyalin değerini ölçülebilir kılın.', 'Make the value of an additional signal measurable.'],
    problem: ['İletişim bağlamının mevcut değerlendirmeye katkısı varsayımla belirlenemez. Önce erişilebilir veriyi, karşılaştırılacak geçmiş örnekleri ve başarı ölçütünü tanımlamak gerekir.', 'The contribution of communication context needs evaluation. Start by defining accessible data, historical comparison cases and evaluation criteria.'],
    question: ['Bu sinyaller değerlendirmeye katkı sağlar mı?', 'Could these signals improve the assessment?'],
    reply: ['Örnek pilot kapsamını veri, geçmiş örnekler ve uzman incelemesi etrafında oluşturalım. Katkıyı mevcut yöntemle karşılaştırarak değerlendirebiliriz.', 'Build the pilot scope around data, historical cases and expert review, then compare the contribution with the existing approach.'],
    rows: [
      [['Veri kapsamı', 'Data scope'], ['İzinli kaynaklar', 'Permitted sources'], ['Birlikte tanımla', 'Define together']],
      [['Karşılaştırma', 'Comparison'], ['Geçmiş örnekler', 'Historical cases'], ['Doğrula', 'Validate']],
      [['Değerlendirme', 'Assessment'], ['Uzman incelemesi', 'Expert review'], ['Pilot çıktısı', 'Pilot outcome']]
    ],
    steps: [
      [['İş sorusunu belirleyelim', 'Define the business question'], ['Hangi değerlendirme kararına ek bağlam aradığınızı netleştirelim.', 'Clarify which assessment decision needs additional context.']],
      [['Veri ve doğrulamayı tanımlayalım', 'Define data and validation'], ['İzinli kaynaklar, geçmiş örnekler ve karşılaştırma ölçütlerini belirleyelim.', 'Define permitted sources, historical cases and comparison criteria.']],
      [['Kurumsal pilotu kurgulayalım', 'Shape the corporate pilot'], ['Sonuçları uzman incelemesi ve mevcut yaklaşım bağlamında değerlendirelim.', 'Evaluate results through expert review and against the current approach.']]
    ]
  }
];
const BY_ID = Object.fromEntries(CAMPAIGNS.map(c => [c.id, c]));
const CONTACT = { name: 'Muhammed Talha Güler', email: 'talha.guler@ozu.edu.tr' };
function local(value, locale) { return Array.isArray(value) ? value[locale === 'tr' ? 0 : 1] : value; }
function resolveCampaign(route) {
  for (const campaign of CAMPAIGNS) for (const [locale, url] of Object.entries(campaign.routes)) if (url === route) return { campaign, locale };
  return null;
}
function metadata(campaign, locale) {
  return { campaignId: campaign.id, pageId: `${campaign.id}:${locale}`, offerId: campaign.offerId, ctaGoal: campaign.goal,
    pageVersion: 'campaign-v1', market: locale === 'tr' ? 'turkey' : 'international', priceVariant: campaign.price && locale === 'en' ? `planned-usd-${campaign.price.amount}-${campaign.price.unit}` : 'none' };
}
module.exports = { CAMPAIGNS, BY_ID, CONTACT, local, resolveCampaign, metadata };
