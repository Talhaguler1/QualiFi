# QualiFi: hedef kitle, teklifler ve landing page brief'i

Güncel yön: kullanıcı, her reklam sayfasının belirli bir probleme ve tek ana
CTA'ya hizmet etmesini istiyor. Son açıklanan demo kapsamı, Gmail teklifleri,
WhatsApp belirsizliği ve yedi sayfalık taslak
[`campaign-pages.md`](campaign-pages.md) dosyasındadır. Aşağıdaki üç CTA'lı yapı
mevcut ilk uygulamayı tarif eder; yeni kampanya sayfaları için son yön esas alınır.

Durum: Kullanıcının açıklamaları temel alınarak ilk uygulama tamamlandı.
TR/EN KOBİ, freelancer, finans ekibi ve banka pilot sayfaları; üç adımlı pilot
talebi, dosya kaydı, bekleme listesi, görüşme talebi ve izinli birinci taraf ölçüm
uygulandı. Takvim bağlantısı yapılandırılabilir; henüz gerçek bağlantı verilmedi.
Canlı ajanlar, dış veri entegrasyonları ve model analizi uygulanmadı.
Kullanıcının onayladığı yön doğrultusundaki uygulama sırası ve tamamlanma
ölçütleri [`roadmap.md`](roadmap.md) dosyasındadır.

## Kullanıcının belirttiği ihtiyaç

- Ana pazar: küçük ve orta büyüklükteki işletmelerin finansal takibi.
- Hedef kişiler: CEO, CFO, girişimci ve freelancer; özellikle proje bazlı veya
  değişen tarihlerde ödeme alan/ödeyen kişiler ve işletmeler.
- Her hedef gruba farklı reklam ve ilgili landing page ile ulaşılacak.
- Teklif 1: sözleşmeler ve en çok kullanılan iletişim kanalı (e-posta veya
  WhatsApp) üzerinden, sektör verileri/model desteğiyle tarih bazlı nakit akışı
  öngörüsü; müşteriye strateji için zaman kazandırma.
- Teklif 2: sözleşme, ek girdiler ve entegrasyonlarla tanımlı ajanın nakit
  takip sürecini yönetmesi.
- Teklif 3: bankalar için iletişim ve sektör verilerinden geri ödeme davranışı
  ve risk profili analizi.
- Ortak değer: dashboard kullanma zorunluluğu olmadan, istenen model ve sonucu
  belirleyip otomatik çıktı alma.
- Üç aksiyon korunacak: `Talk to a human` ve takvim seçenekleri;
  `Join waiting list` ve e-posta bırakma; sözleşme ekleyip ajan edinmeye yönelik
  ana buton. Ana butonun kullanım isteği ölçülecek.

## Önerilen konumlandırma

Ortak taslak: **Finansal takibi QualiFi'ye bırakın. Bir sonraki adımınıza odaklanın.**

Kısa açıklama: **Sözleşmeleriniz ve iş yazışmalarınızdaki finansal bilgileri
bir araya getiren, nakit akışınızı öngörmenize ve takip işlerini devretmenize
yardımcı olan bir finans ajanı geliştiriyoruz.**

Konsept/pilot aşaması görünür olmalı. WhatsApp, e-posta, bankacılık bağlantıları
ve otomatik ajan işlevleri gerçekten çalışmadan hazır entegrasyon olarak
gösterilmemeli. Tahminler kesin tahsilat tarihi veya doğruluk garantisi şeklinde
sunulmamalı; varsayımlar, veri kapsamı ve uygun olduğunda aralıklar gösterilmeli.

İlk adımda müşterinin istediği sonucu sor: `Hangi tarihte ne kadar nakdim olur?`
veya `Tahsilat ve ödemelerimi takip et`. Model seçimini gelişmiş bir seçenek
olarak ele almak önerilir; kullanıcının kastettiği model türü henüz net değil.

## Reklam ve sayfa eşleşmeleri

Aşağıdaki Türkçe yollar ve İngilizce karşılıkları sunucuda tanımlandı.

| Segment | Sayfa | Örnek ilk ekran mesajı | Gösterilecek senaryo |
| --- | --- | --- | --- |
| KOBİ sahibi / CEO / girişimci | `/isletmeler` | Önümüzdeki aylarda ne kadar nakdiniz olacağını öngörün. | Geciken müşteri ödemesi, yaklaşan giderler ve nakit açığı |
| CFO / finans ekibi | `/finans-ekipleri` | Sözleşmeden tahsilata, nakit takibini ajanınıza devredin. | Ödeme koşulları, takip ve istisnalar |
| Freelancer / proje bazlı çalışan | `/freelancerlar` | Proje ödemeleriniz değişse de önünüzü planlayın. | Avans, teslim ödemesi ve gecikme senaryosu |
| Banka / risk ekibi | `/bankalar` | Geri ödeme davranışını değerlendirmek için yeni veri sinyallerini keşfedin. | Veri kapsamı, geçmiş örneklerde değerlendirme ve uzman incelemesi |

Kişiler birden çok role sahip olabilir; reklam kampanyası hedeflemeyi, sayfa
ise problemi tanımlamalı. Aynı kişinin CEO ve girişimci olarak iki kez sayılması
veya aynı problemi farklı ürünmüş gibi sunma riski ölçümde ele alınmalı.

İlk uygulama için `/isletmeler` ve `/freelancerlar` öncelikli olabilir.
Finans ekiplerine ait metinler aynı bileşenlerden üretilebilir. Bankacılık teklifi
ayrı anlatım ve kurumsal pilot akışı gerektirir; KOBİ sayfasında eşit ağırlıklı
bir ürün kartı olarak gösterilmesi önerilmiyor. Bu öncelik sırası öneridir.

Ana sayfa genel giriş ve segment seçimi sunabilir. Reklam ziyaretçisini önce
genel sayfada tekrar seçim yapmaya zorlamadan ilgili sayfaya götür.
TR/EN karşılıklarını koru; dil seçimi ilgili çözüm bağlamını kaybetmesin.

## Aynı segmentte karşılaştırılacak iki teklif

1. **Nakit akışımı öngör:** Sözleşme ve yazışmalardaki ödeme koşullarından tarih
   bazlı öngörü ve senaryolar. Çıktı: zaman çizelgesi, beklenen giriş/çıkışlar ve
   dayanaklar.
2. **Nakit takibini ajanıma devret:** Ödeme yükümlülüklerini, yaklaşan vadeleri ve
   takip gerektiren durumları izleme. Çıktı: kullanıcının tercih ettiği kanalda
   özet, hatırlatma ve istisnalar; gerçek işlevler pilot kapsamına göre belirtilir.

Bu iki teklifin göreli ilgisini aynı müşteri grubunda karşılaştır. Dashboard
gerektirmeyen kullanım ikisini birleştiren deneyim vaadidir. Banka teklifi farklı
alıcılara hitap ettiği için aynı reklam bütçesi ve dönüşüm eşiğiyle kıyaslanmamalı.

## Üç CTA ve tamamlanma ölçütleri

| CTA | Yerleşim | Akış | Başarı ölçütü |
| --- | --- | --- | --- |
| Sözleşmeni ekle, ajanını kur | İlk ekran ve ilgili teklif bölümünde ana buton | Pilot durumu açıklaması → istenen sonuç → sözleşme/girdi → kanal tercihi → pilot kurulum talebi | Kalıcı kaydedilmiş tamamlanmış pilot talebi; çalışan ajan varsa ayrıca doğrulanmış aktivasyon |
| Talk to a human / Ekibimizle konuş | Üst menü ve destekleyici aksiyon | Gerçek takvim sağlayıcısından uygun gün/saatler → rezervasyon onayı | Doğrulanmış randevu ve sonrasında gerçekleşen görüşme |
| Join waiting list / Bekleme listesine katıl | İkincil metin bağlantısı ve sayfa sonu | E-posta → kalıcı kayıt → açık onay mesajı | Tekilleştirilmiş kayıt; çift onay kullanılırsa doğrulanmış e-posta ayrıca |

Ana butonun pilot durumunu kurulumdan önce açıkla. Henüz çalışan bir ajan yoksa
tamamlanan işlem `Pilot kurulum talebiniz alındı` olarak sunulmalı; `Ajanınız aktif`
gibi bir başarı mesajı kullanılmamalı.

Sözleşme yükleme tamamlandı olayı yalnızca güvenli sunucu yüklemeyi gerçekten
tamamladığında kaydedilmeli. Dosya seçme, yüklemeyi kabul etme ve örnek sözleşme
ile deneme farklı adımlardır. Başlangıçta örnek sözleşme yolu da sunmak, gerçek
belge paylaşma tereddüdüyle ürün ilgisini ayırmaya yardımcı olabilir.

## Takip ve değerlendirme

Ortak bağlam: segment, teklif kimliği, dil, sayfa sürümü, izin verilen UTM
alanları, CTA konumu ve varsa sabit deney varyantı. Reklam kaynağı, ilk ilgi ve
son başvurunun bağlı olduğu teklif birlikte korunmalı.

- `agent_cta_clicked`: buton ilgisi; aktivasyon değildir.
- `agent_setup_started`: kullanıcı ilk kurulum girdisini yaptı.
- `outcome_selected`: öngörü veya takip sonucu seçildi.
- `contract_selected`: yerel dosya seçildi; dosya gönderilmiş sayılmaz.
- `contract_upload_completed`: sunucu yüklemeyi doğruladı.
- `channel_preference_selected`: tercih belirtildi; entegrasyon kurulmuş sayılmaz.
- `integration_connected`: yalnızca gerçek bağlantı başarıyla doğrulandıysa.
- `pilot_request_created`: pilot talebi kalıcı kaydedildi.
- `agent_activated`: yalnızca çalışan ajan gerçekten etkinleştirildiyse.
- `calendar_opened`, `meeting_booked`, `meeting_held`: takvim açma, doğrulanmış
  rezervasyon ve gerçekleşen görüşme ayrı olaylar.
- `waitlist_joined`: kalıcı ve tekilleştirilmiş bekleme listesi kaydı.

Öncelikli değerlendirme: aynı segment/teklifi gören tekil ziyaretçilerden kaçı
kuruluma başladı, pilot talebini tamamladı ve nitelikli görüşmeye geldi?
Bekleme listesi, görüşme ve kurulum farklı niyet düzeyleridir; tek bir toplam
başarı sayısıyla yorumlanmamalı. Gerçek belge yerine örnek kullananları ayır.

Reklamla farklı teklifleri denemek hem kitle hem metin etkisini içerir. Teklif
tercihini daha temiz karşılaştırmak için aynı hedef kitle ve kaynaktan gelen
ziyaretçilerde kontrollü varyant ataması kullan. Küçük örneklerde kesin kazanan
ilan etme; oranları ham sayılar ve başvuru kalitesiyle birlikte değerlendir.

Dashboard gerektirmeyen müşteri deneyimiyle uyumlu olarak sonuç örneklerini
zaman çizelgesi veya mesaj/özet şeklinde göster. Şablondaki büyük yönetim paneli
görselleri yerine bu çıktıları öne çıkar.

## Uygulama öncesi eksik bağlantılar

- Takvim sağlayıcısı ve gerçek rezervasyon bağlantısı; yerel saat dilimiyle
  uygunluk gösterimi, rezervasyon doğrulaması için API/webhook erişimi.
- Kalıcı bekleme listesi/pilot kayıt hedefi ve varsa e-posta onay sağlayıcısı.
- Sözleşme yükleme altyapısı, erişim kontrolleri ve saklama/silme davranışı.
- Hangi entegrasyon ve ajan işlemlerinin pilotta gerçekten çalıştığı.
- Analitik hedefi ve deney atama yöntemi.
- Kullanıcının `model` ile hangi seçimleri kastettiği.

Eksik servisler bağlanana kadar arayüzde başarı veya canlı bağlantı taklidi
yapılmamalı. Bu belge yeni hizmet hesabı açma, siteyi yayınlama veya müşteri
belgelerini harici bir hizmete gönderme talimatı değildir.
