# QualiFi landing page: talep doğrulama ve ölçüm önerisi

Durum: İlk kaynak incelemesi ve ölçüm yaklaşımı. Aşağıdaki inceleme bulguları ilk
yüklenen sürüme aittir; mevcut uygulama durumunu `README.md` ve `roadmap.md` gösterir.
Kullanıcının açıkladığı gerçek çözüm
fikirleri, hedef gruplar ve üç CTA için güncel ürün brief'i
[`landing-brief.md`](landing-brief.md) dosyasındadır. İçerik ve aksiyon
önceliklerinde güncel brief esas alınmalı.

## İnceleme bulguları

- Mevcut `index.html` ve `tr.html`, tek bir CFO/finans ekibi anlatısı kullanıyor.
  Çözüm tercihlerini karşılaştırmaya yönelik bir seçim akışı bulunmuyor.
- `human-dialog` henüz iletişim bilgisi veya randevu toplamıyor. `app.js` yalnızca
  pencereleri açıyor ve hazırlanmış demo yanıtlarını gösteriyor.
- Mevcut uygulamada ziyaret, tercih veya tamamlanmış başvuru takibi yok.
- Kullanıcının yüklediği `shadcn-dashboard-landing-template-main.zip`, Next.js ve
  Vite sürümleri içeriyor. Landing page; hero, özellikler, logo, istatistik, ekip,
  fiyatlandırma, referans, blog, SSS, CTA ve iletişim bölümlerinden oluşuyor.
- Şablonun `contact-section.tsx` dosyasındaki form gönderimi yalnızca
  `console.log(values)` ve `form.reset()` yapıyor. Kalıcı kayıt veya gerçek
  gönderim henüz uygulanmamış.
- Hero içindeki demo bağlantıları `#` hedefli. Diğer bazı bağlantılar şablon
  sağlayıcısına gidiyor; QualiFi akışına göre değiştirilmeli.
- Vite sürümünde üretim ortamı ve `VITE_GTM_ID` koşuluyla çalışan bir GTM yükleyici
  var. Özel olay yardımcıları mevcut; incelenen kaynakta çözüm seçimi, başvuru
  kaydı veya doğrulanmış randevu için olay çağrıları bulunmuyor. Bu tek başına
  kurulmuş bir dönüşüm ölçüm sistemi anlamına gelmiyor.
- Şablondaki müşteri logoları, başarı sayıları, referanslar ve fiyatlar QualiFi
  için doğrulanmış bilgiler değil. Gerçek kanıtlar sağlanana kadar kullanılmamalı.
- Şablon MIT lisanslı. Kaynak/bileşen aktarılırsa telif ve lisans metni korunmalı.

İnceleme kaynak kod üzerinden yapıldı; şablon tarayıcıda çalıştırılmadı ve
dönüşüm performansı hakkında kullanıcı verisine dayalı bir sonuç çıkarılmadı.

## Önerilen sayfa akışı

1. **Değer önerisi:** Hedef müşteriyi, çözülen problemi ve beklenen sonucu kısa
   şekilde anlat. Ana aksiyon `Sözleşmeni ekle, ajanını kur` olsun. Görüşme ve
   bekleme listesi ayrı, daha düşük görsel öncelikte seçenekler olarak korunsun.
2. **Çözüm seçimi:** `Önce hangi sorunu çözmek istiyorsunuz?` altında en fazla
   üç veya dört eşit ağırlıklı seçenek sun. Her birinde aynı yapıda problem,
   beklenen sonuç ve `Bu çözümü incele` aksiyonu olsun.
3. **Seçime göre içerik:** İlgili kısa senaryoyu, örnek çıktıyı ve geliştirme
   durumunu göster. Örnek veriyi açıkça belirt. Seçim formda korunsun;
   seçenekler arasında geçiş mümkün olsun.
4. **Aksiyona uygun akış:** Ana CTA kısa bir pilot kurulumuna, görüşme CTA'sı
   takvim seçeneklerine, bekleme listesi e-posta formuna açılmalı. Her akışın
   tamamlanması ayrı ölçülmeli; üçü aynı uzun forma dönüştürülmemeli.
5. **Kayıt ve sonraki adım:** Form gerçekten kalıcı kaydedildikten sonra başarı
   göster. Ardından uygun randevu bağlantısı ve bundan sonra ne olacağı sunulsun.
6. **SSS ve son CTA:** Veri bağlantıları, ürünün mevcut aşaması, pilotun işleyişi
   gibi gerçek karar sorularını yanıtla. Ana aksiyonu tekrarla.

Kullanıcının belirttiği teklifler: nakit akışı öngörüsü, ajanla nakit takibi ve
bankalara yönelik geri ödeme/risk analizi. Dashboard gerektirmeyen kullanım
ortak konumlandırmadır. Segmentler ve örnek metinler güncel brief'tedir.

Fikirler farklı sektör veya müşteri gruplarına hitap ediyorsa ortak giriş
sayfasından ayrı çözüm sayfalarına yönlendir. Her çözüm için paylaşılabilir bir
URL kullan; kampanyadan gelen ziyaretçiyi doğrudan ilgili çözüme götür.

## Olaylar ve başarı tanımları

| Olay | Ne zaman kaydedilir? | Kullanımı |
| --- | --- | --- |
| `landing_viewed` | Sayfa ziyaret oturumunda ilk açıldığında | Genel dönüşümün paydası |
| `solution_viewed` | İlgili kart gerçekten görünür olduğunda | Çözüm bazında maruziyet |
| `solution_selected` | Kart veya ilgili çözüm bağlantısı seçildiğinde | İlk ilgi |
| `lead_form_started` | Form alanıyla ilk etkileşimde | Başlama ve vazgeçme |
| `lead_created` | Sunucu başvuruyu kalıcı kaydettiğinde | Gerçek talep |
| `meeting_booked` | Randevu sağlayıcısından doğrulanmış kayıt geldiğinde | Görüşmeye dönüşüm |
| `meeting_held` | Görüşmenin gerçekleştiği ekip tarafından doğrulandığında | Ciddi niyet |
| `lead_qualified` | Önceden tanımlanmış hedef müşteri ölçütleri karşılandığında | Talebin uygunluğu |

Bir randevu bağlantısına tıklamak `meeting_booked` değildir. Form gönder
butonuna basmak `lead_created` değildir. Tekrar denemeler ve yinelenen webhooklar
aynı başvuru/randevu kimliğiyle tekilleştirilmelidir.

Olay bağlamı: sabit `solution_id`, sayfa sürümü, dil, kart sırası, CTA konumu,
izin verilen UTM alanları ve varsa deney/varyant kimliği. İlk temas ve başvuru
anındaki kaynak ayrı tutulmalı. E-posta ve formdaki serbest metin analitik olay
özelliklerine veya URL'lere gönderilmemeli; başvuru sisteminde saklanmalı.

Başvurular için kalıcı sunucu/CRM kaydı, doğrulama, hata yanıtı, tekrar denemede
tekilleştirme ve temel spam kontrolü gerekir. Tarayıcı belleği, konsol veya
yalnızca analitik olayları başvuru kaynağı olarak kullanılmamalı.

Başlangıçta olay ve funnel incelemesi için PostHog değerlendirilebilir; birden
fazla analitik aracı eklemek gerekmiyor. Analitik tercihi/izin durumu ölçümlere
yansıtılmalı; ölçülemeyen ziyaretler yok sayılarak tam kapsama iddiası kurulmamalı.

## Hangi çözümün ilgi gördüğünü değerlendirme

- Tekilleştirilmiş seçim / çözümü gören ziyaretçi: merak ve ilk ilgi.
- Tekilleştirilmiş başvuru / çözümü gören ziyaretçi: talep sinyali.
- Başvuru / seçen ziyaretçi: seçimden sonraki anlatının ve formun etkisi.
- Gerçekleşen görüşme / başvuru: niyetin devamlılığı.
- Nitelikli başvuru / başvuru: hedef müşteriyle uyum.

Her oranla birlikte ham sayıları göster. Sonucu trafik kaynağı, hedef müşteri
grubu, dil ve cihaz bağlamında oku. Aynı kişinin birden fazla çözümü keşfetmesine
izin ver; başvuruya bağlanan çözümü ve önceki ilgileri ayrı tut.

Kartların konumu ve anlatım uzunluğu sonucu etkiler. Kartları benzer görsel
ağırlıkta tut; sıralamayı ziyaretçi düzeyinde dengeli dağıt ve o ziyaretçide sabit
tut. İlk aşamadaki bu tercih ölçümü bir A/B testi değildir. Az sayıda tıklamayla
kazanan ilan etme. Sonraki A/B testlerinde tek bir değişkeni, aynı hedef kitlede,
sabit varyant ataması ve önceden belirlenmiş başarı ölçütüyle karşılaştır.

## Uygulama sırası

1. Güncel brief'teki segment sayfaları, iki KOBİ teklifi ve üç CTA'yı tasarıma aktar.
2. Kısa sayfa ve çalışan başvuru akışını kur.
3. Kalıcı başvuru kaydı, analitik olayları ve kaynak ilişkilendirmesini doğrula.
4. Seçimden nitelikli görüşmeye kadar sonuçları incele; ardından sayfa deneyleri yap.

Şablondan hero, kart, form ve SSS düzenleri yararlanılabilir. QualiFi'nin mevcut
görsel kimliğiyle uyarlanmalı. Tüm yönetim panelini, giriş/kayıt ekranlarını ve
tema düzenleyicisini taşımak bu ilk hedef için gerekmiyor. Mevcut HTML/JS yapısı
ilk talep doğrulaması için yeterli; framework geçişi ayrıca gerekçelendirilmeli.
