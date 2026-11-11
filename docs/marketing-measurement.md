# QualiFi: skill incelemesi ve pazarlama ölçüm planı

Tarih: 2026-11-12, Europe/Istanbul. Durum: kaynak/HTTP incelemesi ve uygulama taslağı.
Bu belge canlı etiket kurulumu, reklam yayını veya hesap erişimi kanıtı değildir.

## Kullanıcı hedefi

Organik ve ücretli trafiğin nereden geldiğini, kampanya tekliflerine ilgiyi,
CTA'dan forma geçişi ve gerçek başvuruları ayrı ölçmek. Yaklaşık 10.000 TL ve
9 günlük deney; TR/EN, Meta Ads ve kullanıcının doğrudan ulaşımı. Son tercih
olay ölçümüdür; ısı haritası/oturum kaydı kurulmayacak.

## Yüklenen paket nasıl kullanılacak?

`marketingskills-main.zip` içinde 53 adet `skills/*/SKILL.md` var.
README paketi Corey Haines'in MIT lisanslı Marketing Skills koleksiyonu olarak
tanımlıyor. Arşiv çalışma alanına açıldı; kurulum/CLI betikleri çalıştırılmadı.
Skill'ler hesap, token, trafik veya sonuç sağlamaz. Her görevde ilgili dosya ve
referansları okunur; değişken platform bilgileri resmî kaynaklarla kontrol edilir.

| İş | İlgili skill | Somut teslim |
|---|---|---|
| Ürün, kitle ve gerçek vaat | product-marketing | `.agents/product-marketing.md` ilk taslağı |
| Kaynak/olay sözlüğü ve hesaplama | analytics | Olay tablosu, UTM planı, eşleşen rapor pencereleri |
| Meta/GA4'e doğru olay gönderimi | conversion-tracking | Gerçek başarı tetikleyicisi, tekilleştirme, alıcıda doğrulama |
| Kanal katkısını yorumlama | attribution | Gerçek başvuru sayısı ile platformların verdiği krediyi ayırma |
| Kampanya ve bütçe taslağı | ads | Kitle/teklif/sayfa eşleşmesi ve veri geldikten sonra karar |
| Reklam metni/görseli | ad-creative | TR/EN kavram taslakları; sonuç iddiası olmadan üretim |
| Organik içerik ve erişim | social, content-strategy, customer-research, cold-email | Kanal bazlı içerik/araştırma/ulaşım taslakları |
| Site mimarisi ve SEO | site-architecture, seo-audit, schema | Rota, indeksleme, dil eşleşmesi ve iç bağlantı incelemesi |
| Sayfa ve form açıklığı | cro, copywriting, ab-testing | 5 saniye/LIFT incelemesi ve trafiğe uygun deney tasarımı |

Bu incelemede analytics, conversion-tracking, ads, attribution, product-marketing
ve cro ana metinleri ele alındı; diğerleri ilgili üretim işi başladığında tam
referanslarıyla uygulanacak. 53 skill'in hepsi kurulmuş/çalıştırılmış değildir.
Paketin "her zaman en az üç split test" gibi tavsiyeleri bu küçük deney için
otomatik kural yapılmaz. Varsayılan bütçe yüzdeleri, başarı örnekleri, platform
eşikleri ve partner araçları QualiFi için ölçülmüş sonuç veya zorunlu satın alma değildir.

## Kanıt ve sınırlar

### İncelenen kaynak: c6990eb

| Bulgu | Kanıt | Sınır |
|---|---|---|
| Ziyaret/CTA/form başlangıcı var | `campaign.js`: landing_viewed, primary_cta_clicked, lead_form_started | Yalnız izinli tarayıcı kimlikleri |
| Başvuru olayı gerçek kayıtla oluşuyor | `store.cjs`: lead + event + taslak aynı transaction'da | Canlı backend aynı davranıyor sonucu çıkmaz |
| Tekrar başvuru yeni kayıt/başarı olayı üretmiyor | `server.cjs` duplicate dalı, ilgili testler | Canlıda gerçek gönderim denenmedi |
| İlk/son UTM bağlamı var | `campaign.js` ve `server.cjs` | Oturum kapsamlı; cihazlar arası kişi takibi değildir |
| Başvuru için analitik izni zorunlu değil | `context()` ve kaynak testleri | Analitik paydasına opt-out kişiler katılmaz |
| Kaynak raporu eksik | `store.cjs`: campaignCta'da kaynak/dönem filtresi yok | Günlük reklam verimi bu ömür boyu toplamlarla hesaplanamaz |
| Referrer/organik sınıflaması yok | İstemci context ve sunucu allowlist'inde referrer yok | UTM'siz arama/referral/direct ayrılamaz |
| Scroll/form hata/step olayları eksik | Kampanya olayları ve sunucu allowlist'i | Form başlangıcı her adımın ölçüldüğü anlamına gelmez |
| Üçüncü taraf sağlayıcı bağlantısı görünmüyor | app/campaign JS ve sunucu kodunda ilgili çağrılar yok | Hesap tarafı/native/CAPI gönderimi görünmez olabilir |
| CSP üçüncü tarafları sınırlıyor | `server.cjs`: script-src/connect-src self | Koda pixel eklemek tek başına yeterli olmaz |

### Canlı HTTP: https://qualifilab.com/

- Gözlenen: ana sayfa, `/tr/sozlesmeden-nakit-akisi`, `/en/contract-cash-flow`,
  `/tr/gmail-satis-takibi`, `/kampanyalar`, app.js/campaign.js ve `/api/config` 200.
- Gözlenen: `/tr/hakkimizda`, `/en/about`, `/tr/veri-kullanimi`, `/sitemap.xml`
  ve `/api/health` 404. Health rotasının yokluğu başvuru API'sinin bozuk olduğunu kanıtlamaz.
- Gözlenen: robots.txt taramaya izin veriyor. Ana HTML'de TR/EN alternatifleri
  göreli URL; taranan ana HTML'de GTM/GA4/Meta/Clarity etiketleri görünmüyor.
- Gözlenen: canlı app.js/campaign.js kaynakla aynı dosya değil; son duplicate
  açıklaması canlıda yok. Yeni bilgi sayfaları yayına yansımamış görünüyor.
- Kullanıcı beyanı: bu sağlayıcıların kurulu olmadığını düşünüyor.
- Bilinmiyor: Lovable'ın bağlı GitHub deposu, yayın sürümü, backend/veri deposu,
  server-side/native dönüşüm gönderimi, gerçek veri kalıcılığı ve hesap olayları.
- Gerçek başvuru gönderilmedi, kayıt veya reklam olayı oluşturulmadı.
- Tarayıcı/render, mobil etkileşim ve insanla 5 saniye testi yapılmadı.

Canlıdan alınan özel olmayan yanıtlar ignored `work/live-audit/` altında.
GET kontrolü, form gönderimi veya alıcı platformda olay gelişinin yerine geçmez.

## Önerilen en küçük ölçüm mimarisi

1. **Önce mevcut Lovable kurulumunu incele.** Lovable Analytics temel trafik ve
   kaynakları gösterir; ziyaret tanımı tekil kişi değildir. Lovable'ın Meta
   bağlantısı/etiketi zaten varsa aynı Pixel ikinci kez kurulmaz.
2. **Tek olay sözlüğü ve tek gönderici yolu seç.** Mevcut birinci taraf olayları
   koru; gerekiyorsa GA4 ve Meta için tek bir doğrudan köprü veya GTM kullan.
   GTM tek başına analitik veya saklama sistemi değildir. İki kurulum yolu birden açılmaz.
3. **Kalıcı başvuruyu esas al.** Canlıdaki gerçek veritabanı/CRM başvuru sayısının
   kaynağı olsun. Depodaki SQLite'ın canlıdaki kayıt deposu olduğu varsayılmaz.
4. **GA4:** kaynak, sayfa ve olay hunisi. **Search Console:** arama sorgusu,
   gösterim ve Google organik tıklaması. Bunlar aynı ölçü değildir.
5. **Meta Pixel:** izinli PageView ve gerçek yeni başvuru için Lead. CTA araştırma
   olayı ayrı kalır. CAPI gerekirse native veya doğrudan sunucu entegrasyonu
   incelenir; tarayıcı/sunucu olay kimliği eşlenir, ikinci başvuru sayılmaz.
6. **İzinler:** mevcut tek analitik seçiminin reklam izni olduğu varsayılmaz.
   Analitik ve reklam paylaşımı açıkça ayrılır; reddeden kişi başvurabilir.
   Sunucu tarafı gönderim izin tercihini aşmak için kullanılmaz.

## Olay sözlüğü: mevcut ile planlananı ayır

| İç olay | Kampanya kaynağındaki durum | Doğru tetikleyici | Dış hedef önerisi |
|---|---|---|---|
| landing_viewed | Var | İzinli sayfa görünümü | GA4 page_view / Meta PageView; otomatik olayla iki kez sayma |
| primary_cta_clicked | Var | Ana CTA tıklaması | Araştırma olayı; Lead değildir |
| lead_form_opened | Sunucuda izinli, kampanyada henüz gönderilmiyor | Form gerçekten açıldı | GA4 özel olay |
| lead_form_started | Var | İlk gerçek girdi | GA4 özel olay; otomatik form_start ile çift gönderme yok |
| form_step_completed | Plan | Geçerli adım tamamlandı | Sabit step_id ile; tek adımlı formda yapay adım ekleme |
| form_validation_failed | Plan | Doğrulama engelledi | Yalnız allowlist hata kodu; alan içeriği yok |
| lead_save_failed | Plan | API/ağ kaydı tamamlanamadı | Güvenli hata sınıfı; e-posta/metin yok |
| waitlist_joined / pilot_request_created | Var, sunucu üretir | Yeni başvuru kalıcı kaydedildi | GA4 generate_lead / Meta Lead, izin varsa |
| contract_selected | Var | Yerel dosya seçildi | Yükleme başarısı değildir; dosya adı/icerik gönderme |
| contract_upload_completed | Var, sunucu üretir | Dosya başvuruyla kalıcı kaydedildi | Ayrı ikincil olay; Meta Purchase değildir |
| calendar_opened | Takvim varsa var | Gerçek takvim bağlantısı açıldı | Randevu sayılmaz |
| meeting_booked | Doğrulanmış webhook yolu var | Sağlayıcı rezervasyonu doğruladı | İkinci aşama; takvim görüntülenmesinden üretme |

Ortak boyutlar: campaign_id/page_id, dil, teklif, CTA amacı, sürüm, fiyat gösterimi,
izinli kaynak/medium/campaign/content, olay zamanı ve ilgili sabit adım/konum.
Hata mesajları, sözleşme metni, e-posta, telefon ve şirket form girdileri GA4/UTM
alanlarına gönderilmez. Meta advanced matching/hash kimlik paylaşımı ayrıca
değerlendirilir; bu taslak onu açmaz.

Form terkini kesin bir sayfa çıkış sinyali olarak toplama. Aynı sayfa/ziyaret
kapsamında form başlangıcı olup tanımlanmış takip penceresinde kayıt oluşmayanları
raporla; penceresi dolmamış kayıtlar pending olsun. İzin/kayıp ölçüm sınırını belirt.

## Kaynak ve UTM planı

`utm_source`, `utm_medium`, `utm_campaign` birlikte kullanılır; content reklam/post
varyantını ayırır. Kişi adı/adresi UTM'ye yazılmaz. Facebook ve Instagram kaynakları
ayrı, organik sosyal ve ücretli sosyal medium'ları ayrı tutulur. İç site bağlantılarına
UTM eklenerek gerçek edinme kaynağı ezilmez. URL'ler domain ve yönlendirme sonrası sınanır.

| Kanal | source | medium | campaign örneği | content örneği |
|---|---|---|---|---|
| Facebook reklamı | facebook | paid-social | qualifi-cashflow-tr-v1 | payment-dates-static |
| Instagram reklamı | instagram | paid-social | qualifi-cashflow-tr-v1 | payment-dates-static |
| LinkedIn organik post | linkedin | social | qualifi-discovery-tr-v1 | payment-planning-post |
| Instagram bio | instagram | social | qualifi-discovery-en-v1 | profile-bio |
| Kişisel LinkedIn ulaşımı | linkedin | outreach | qualifi-research-tr-v1 | founder-intro |
| İzinli e-posta | newsletter | email | qualifi-pilot-en-v1 | launch-note |

Medium'lar öneridir; GA4/Lovable sınıflaması doğrulanır, gerekirse özel kanal kuralı
eklenir. Outreach kaynakları ayrı raporlanır. Organik arama UTM'den icat edilmez;
referrer/GA4 ve Search Console kullanılır. Kaynak bilinmiyorsa direct/unknown olarak
kalır; etiketsiz ziyaretler otomatik organik başarı sayılmaz.

## Rapor ve karar

- Aynı kapalı dönem ve Europe/Istanbul gün sınırlarıyla kaynak/pazar/sayfa bazında:
  harcama, dış bağlantı tıklaması, oturum, ölçülen tekil ziyaretçi, CTA tıklayan,
  forma başlayan, yeni başvuru ve nitelikli görüşme.
- Meta reklam tıklaması sitedeki CTA tıklaması değildir. Platform tıklaması ve
  sitenin ölçülen ziyareti farklı paydalardır.
- Ana oran: aynı dönem/sayfa/kaynak kapsamındaki tekil CTA tıklayan /
  ölçülen tekil ziyaretçi. Opt-out başvurular ayrı operasyonel toplamda gösterilir.
- Mevcut CLI raporu dönem/kaynak kırılımı eklenene kadar günlük medya verimi
  hesaplamaya yeterli değildir. Platform/GA4/DB toplamları birbirine eklenmez.
- Başvuru maliyeti için harcama ve doğrulanmış yeni başvurular aynı kapsama getirilir;
  izlenemeyen kaynaklar ayrılır. Başvuru maliyeti müşteri edinme maliyeti değildir.
- TR/EN fiyat ve trafik farkları varken sonuçlar kontrollü ülke testi diye sunulmaz.
- Az veri veya geciken başvuru: kanıt yetersiz/bekliyor. Evrensel CTR/CPL eşiği,
  garanti trafik, 9 günde SEO sıralaması veya kesin kazanan sözü yok.

## Uygulama ve canlı doğrulama sırası

1. Lovable Settings → GitHub'da bağlı depo/dal ve yayın mekanizmasını doğrula.
   Kullanıcı çalışmaların canlıya aktarılmasını istedi; bugün bu zincir bilinmiyor.
2. Aynı kaynakta çalışıldığını doğrula; sonra seçilen iki sayfa ve başvuru API'sini
   incele. Ana site keşif, kampanyalar tek problem/tek CTA, bilgi/veri sayfaları güven
   katmanı olacak şekilde mimari taslağı hazırla; mevcut URL'leri gereksiz değiştirme.
3. Native analitik/Meta göndericisi var mı hesap tarafında kontrol et. Yoksa GA4
   ölçüm kimliği ve Meta Dataset/Pixel oluşturulur. Kimlikler erişim yetkisi sağlamaz;
   API sırları sohbet/Git dosyasına konmaz.
4. Olay köprüsü, kaynak/dönem raporu ve gereken güvenli sağlayıcı/CSP/izin ayarlarını
   gerçek stack üzerinde uygula. Bu belgedeki plan, çalışan kurulum değildir.
5. İzole ortamda: izin ret/kabul/geri alma, hatalı form, ağ/API hatası, yeni kayıt,
   duplicate, tekrar yükleme ve gerçek dosya kaydı senaryolarını doğrula.
6. Canlıda ayrıştırılabilir bir test ile DB kaydı, GA4 DebugView ve Meta Test Events
   alımını ayrı doğrula. Bir etiketin görünmesi veya HTTP 2xx tek başına olayın
   reklamla ilişkilendiğini kanıtlamaz. Test verileri gerçek talep sonuçlarından ayrılır.
7. Desteklenen yayın yolundan dağıt; URL/sürüm ve HTTP sonuçlarıyla doğrula.
   Git push veya kaynak senkronizasyonu tek başına canlı yayın başarısı sayılmaz.

## Skill'ler ve erişimle ilgili net sınır

Rehberlerin tamamı okunup uygulanabilir; yüzde 100 pazarlama performansı veya
ziyaretçilerin tamamının izlenmesi garanti edilemez. Bu oturumda Meta/GA4/GTM
hesabına doğrudan bağlanan araç yok; export ve kullanıcı tarafından doğrulanan
hesap ekranlarıyla çalışılabilir. Hesap bağlantısı kurulmadan otomatik reklam
yönetimi veya günlük rapor çekme çalışıyor denmez. Kullanıcı mesajları/reklamlar
hazırlanabilir; bu görevde gerçek kişilere gönderim veya reklam harcaması yapılmadı.

## Resmî kaynaklar

- [Lovable Analytics](https://docs.lovable.dev/features/analytics): temel trafik ve
  daha ayrıntılı adımlar için özel analitik ihtiyacı; visits tekil kişi değildir.
- [Lovable Ads](https://docs.lovable.dev/features/ads): Meta bağlantısı ve mevcut
  Pixel'i kullanma seçeneği; bağlantının kullanıcı projesinde açık olduğu doğrulanmadı.
- [Google kampanya URL'leri](https://support.google.com/analytics/answer/10917952?hl=en):
  UTM alanları ve tutarlı kaynak adlandırması.
- [Microsoft Clarity masking](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)
  ve [consent](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-management):
  ileride kapsam açılırsa referans; bu aşamada Clarity kurulmayacak.
- Meta deduplication resmî sayfasına erişim 429 verdi. CAPI uygulaması başladığında
  güncel resmî kurallar ve Events Manager kanıtı yeniden kontrol edilmeli.
