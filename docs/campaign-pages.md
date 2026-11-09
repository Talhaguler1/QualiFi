# QualiFi: probleme göre kampanya sayfaları

Durum: Yedi kampanya, ayrı TR/EN adresleriyle uygulandı (14 sayfa). Sayfa dizini
`/kampanyalar`, İngilizce dizin `/en/campaigns`. Mevcut genel/segment sayfaları
korunuyor; reklamlar tek amaçlı yeni sayfalara yönlendirilebilir. Hedef gruplar ve
problemler müşteri görüşmeleriyle doğrulanmış kabul edilmemeli.

## Uygulanan sayfalar

| Kimlik | Türkçe | İngilizce | Tek ana CTA amacı |
| --- | --- | --- | --- |
| `cashflow` | `/tr/sozlesmeden-nakit-akisi` | `/en/contract-cash-flow` | Sözleşme ekleme ilgisi → pilot formu |
| `project-income` | `/tr/freelancer-gelir-plani` | `/en/freelancer-income-plan` | Gelir planı bekleme listesi |
| `collections` | `/tr/tahsilat-takibi` | `/en/receivables-follow-up` | Tahsilat takibi erken erişimi |
| `sales-follow-up` | `/tr/gmail-satis-takibi` | `/en/gmail-sales-follow-up` | Gmail follow-up bekleme listesi |
| `sales-forecast` | `/tr/satis-ongorusu` | `/en/sales-outlook` | Satış öngörüsü bekleme listesi |
| `whatsapp` | `/tr/whatsapp-odeme-takibi` | `/en/whatsapp-payment-follow-up` | WhatsApp pilot ilgisi |
| `bank-risk` | `/tr/banka-risk-pilotu` | `/en/bank-risk-pilot` | Kurumsal pilot ilgisi |

Kullanıcının son seçimleri uygulandı: TR sayfalarında fiyat yok. Yalnızca EN
`cashflow` sayfasında planlanan 29 USD/analiz ve EN `sales-follow-up` sayfasında
planlanan 99 USD/işletme/ay gösteriliyor. Nihai kapsam ve limitler henüz belirlenmedi;
ödeme alınmıyor. Görünür iletişim: Muhammed Talha Güler, talha.guler@ozu.edu.tr.

Brex referansından kısa form, Chert referansından konuşma içinde çıktı örneği
yaklaşımı alındı; QualiFi'nin mevcut yeşil görsel kimliği korundu. Kampanya
sayfalarında segment menüsü ve demo/bekleme listesi gibi yarışan ana CTA'lar yok.
Tüm baskın CTA tekrarları aynı forma ve amaca gidiyor. Görsellerin dönüşüm
performansı hakkında veri sağlanmadı; referanslar başarı kanıtı olarak kullanılmadı.

## Son kullanıcı düzeltmesi: önce CTA ilgisi

İlk deneyin ana amacı her sayfadaki belirli teklife ve belirli CTA'ya tıklamayı
ölçmektir. Bekleme listesi veya sözleşme ekleme gibi aksiyonun hangisi olacağı
sayfa bazında belirlenir. Demo, ilgi gösterenlerle sonraki aşamada yapılır;
birincil hedefin bütün sayfalarda demo rezervasyonu olması istenmiyor.

Tekil CTA tıklayan / o sayfayı gören ölçülebilmiş tekil ziyaretçi temel orandır.
Kayıt bırakma, gerçek dosya yükleme, demo, ücretli pilot ve ödeme ayrı ikincil
adımlardır. İzin vermeyen ziyaretçiler nedeniyle kapsama sınırı açıklanmalı.
Tıklama ödeme isteğini veya ürünün çalıştığını kanıtlamaz. CTA sonrası gerçek
ürün/pilot durumu açıklanmalı; çalışan ajan veya sonuç taklidi yapılmamalı.

Ürün vizyonu: sözleşme çıkarımı ajanı vadeleri ve ilgili verileri takip ajanına
iletir; takip ajanı tanımlanmış iletişim akışlarını yürütür; Gmail inceleme ajanı
yanıt/satış sinyallerini çıkarır; öngörü ajanı bunları değerlendirebilir. Üstteki
sohbet arayüzü bu görevler ve sonuçlarla tek giriş noktası sağlar. Bu bir ürün
mimarisi vizyonudur; depoda çalışan ajan orkestrasyonu henüz bulunmuyor.

Ücretlendirme önerileri ve deney sırası [`pricing-hypotheses.md`](pricing-hypotheses.md)
dosyasındadır. Yukarıdaki iki EN sayfasında görünür test fiyatı uygulanmıştır;
bunlar araştırılmış piyasa fiyatları veya satın alınabilir paketler değildir.

## Kullanıcıdan gelen yeni bilgiler

- Sözleşme veya yapılandırılmış girdiden model geliştirip çıktı üretmeyi ve
  müşteriye iletmeyi sağlayabileceğini düşünüyor. Doğruluk değeri belirlenmedi.
- Gmail bağlantılı ajanla follow-up, satış tahmini ve takip sunabileceğini düşünüyor.
  Çalışan entegrasyon veya modelin kodu henüz bu depoya eklenmedi.
- WhatsApp Business/belirli hesapları bağlama ihtimali araştırılacak; belirsiz.
- Başvurudan sonra 20 dakikalık demo gösterimi yapılacak.
- İlk 1000 demoyu ücretsiz sunma fikri var. Kota/koşullar kesinleşmedi;
  gerçek rezervasyon ve kapasiteye bağlı sayım kurulmadan sayaç veya kıtlık
  iddiası kullanılmayacak. Demo ile ücretli ürün/pilot bedeli ayrı açıklanacak.
- Çözüm alt sayfalarının bazılarında ücretlendirme isteniyor; yukarıdaki iki EN
  sayfasında planlanan fiyat gösterimi seçildi, TR fiyatları gizli tutuluyor.
- Ekip sayfası ve gerçek destekçi/referans bilgileri daha sonra sağlanabilir.
  Doğrulanmadan `backed by`, müşteri logosu veya başarı metriği eklenmeyecek.

## Ortak deney

Her kampanya sayfası aynı sırayı takip eder: tanıdık problem → o probleme özel
sonuç → tek örnek çözüm yolculuğu → sayfaya özel tek CTA → ücret/pilot
koşulları → aynı ana CTA'nın tekrarı → ilgili SSS ve gerçek iletişim/veri bilgileri.

Sayfa bazında `Bekleme listesine katıl`, `Sözleşmeni ekle` veya benzeri tek
aksiyon seçilir. Birincil hedef CTA tıklamasıdır. İlgi/kayıt sonrasında 20 dakikalık
demo önerilebilir; ücretsiz politika ve dönüş süresi ayrıca kesinleşmeli.

Reklam sayfalarında çözüm seçimi, segment menüsü ve farklı niyetli eşdeğer
CTA'lar gösterilmez. Genel/organik ana sayfa keşif ve yönlendirme sunabilir.
Belge yükleme, demo öncesinde isteğe bağlı veya demo sonrasına bırakılabilir;
birincil başarı davranışı bununla karıştırılmamalı. Gerçek kullanıcı belgesi
gerekmeyen, anonim veya örnek bir demo gösterilebilmeli.

## Yedi sayfa hipotezi

| Sayfa/öncelik | Önerilen dar grup | Tek problem ve başlık taslağı | Çözüm yolculuğu | Ana aksiyon |
| --- | --- | --- | --- | --- |
| 1 / ilk grup | Proje bazlı çalışan ajans sahipleri | `Proje ödemelerinizin hangi haftaya denk geldiğini görün.` Yaklaşan giderlerle müşteri ödeme tarihleri uyuşmuyor. | Sözleşme/girdi → vade ve ödeme koşulları → haftalık nakit senaryosu | `Sözleşmeni ekle` tıklaması (öneri) |
| 2 / ilk grup sonrası | Birden çok müşteriyle çalışan freelancer/danışman | `Avans ve teslim ödemelerinizi tek gelir planında görün.` Değişken proje geliri kişisel planı zorlaştırıyor. | Proje tutarı ve kilometre taşları → tahmini ödeme zamanları → gecikme senaryosu | `Gelir planımı oluştur` tıklaması (öneri) |
| 3 / ilk grup | Vadeli çalışan küçük B2B işletmelerin finans sorumluları | `Yaklaşan ve geciken tahsilatları yazışmalarınızın içinden takip edin.` Ödeme sözleri e-postalarda kalıyor. | İzinli Gmail/sözleşme bağlamı → taahhüt ve vade listesi → takip/istisna özeti | `Takip ajanını keşfet` tıklaması (öneri) |
| 4 / ilk grup | Satışını Gmail üzerinden yürüten küçük B2B işletme sahipleri | `Gönderdiğiniz teklifler takipsiz kalmasın.` Teklif sonrası yeniden iletişime geçme unutuluyor. | Teklif yazışması → yanıt/son temas durumu → sonraki takip önerisi veya kapsamı belirlenmiş ajan aksiyonu | `Follow-up ajanına erken erişim` tıklaması (öneri) |
| 5 / ilk grup sonrası | Satış pipeline'ını e-postayla takip eden B2B satış yöneticileri | `Beklenen satışın hangi fırsatlardan geldiğini görün.` Teklif tutarıyla gerçekleşmesi beklenen satış karışıyor. | İzinli fırsat yazışmaları ve girdiler → varsayımlar/aşamalar → senaryolu satış öngörüsü | `Satış öngörümü keşfet` tıklaması (öneri) |
| 6 / teknik keşif | WhatsApp Business üzerinden sipariş/ödeme konuşan küçük işletmeler | `Ödeme taahhütlerini sohbet akışında kaybetmeyin.` Konuşmalardaki finansal işler gözden kaçıyor. | Desteklenen hesap/veri erişimi doğrulaması → taahhüt çıkarımı → takip özeti | `WhatsApp pilot listesine katıl` tıklaması (öneri) |
| 7 / ayrı kurumsal keşif | Bankaların KOBİ risk/analitik ekipleri | `Geri ödeme analizinde iletişim ve sektör sinyallerini değerlendirin.` Mevcut değerlendirmede hangi ek sinyallerin faydalı olacağı belirsiz. | İzinli veri kapsamı → geçmiş örneklerde değerlendirme → uzman incelemesi ve doğrulama | `Kurumsal pilotla ilgileniyorum` tıklaması (öneri) |

1, 3 ve 4, kullanıcının açıklamalarından hareketle ilk hazırlık önerisidir;
erişilebilir müşteriler ve demo hazırlığına göre sıra değişebilir. Tüm sayfalara
aynı anda reklam bütçesi dağıtılması önerilmiyor. 2 ve 5'te aynı altyapı
paylaşılabilir; problem, örnek çıktı, başlık, fiyat birimi ve reklam mesajı ayrı tutulur.

## Örnek: sayfa 1'in CTA sonrası demo yolculuğu

- İlk ekran: hedef grup + haftalık nakit problemi + sayfaya özel tek CTA.
- Görsel: açıkça örnek olduğu belirtilmiş proje sözleşmesi, vade çıkarımı ve
  haftalık nakit zaman çizelgesi; ekran yerine anlaşılır çıktı.
- Fayda: ödeme takvimini görmek, gecikmenin etkisini tartışmak ve hangi
  varsayımların sonucu değiştirdiğini anlamak. Ölçülmemiş tasarruf yüzdesi yok.
- Demo içeriği önerisi: 3 dakika ihtiyaç, 10 dakika örnek sözleşme/çıktı,
  5 dakika müşterinin akışına uyarlama, 2 dakika sonraki adım. Bu süre dağılımı öneridir.
- Form: e-posta ve tek ihtiyaç sorusu; sektör/şirket bilgisi ancak uygunluk
  değerlendirmesi için gerekliyse. İlk başvuruda sözleşme zorunluluğu önerilmiyor.
- Ücret: demo bedeli ve sonraki pilotun bedeli ayrı. Tutar bilinmiyorsa fiyat
  icat edilmez; müşteri hangi kapsamın ücretlendirmeyi belirlediğini öğrenir.
- SSS: örnek/kendi verisi, varsayımlar/doğruluk, entegrasyon kapsamı, demo sonrası adım.

## Fiyatlandırma için henüz cevaplanması gerekenler

- Nakit öngörüsü tek seferlik analiz, aylık işletme aboneliği veya proje bazında mı?
- Gmail takip ajanı için hesap/işletme, kullanıcı veya iş hacmi bazlı ücret mi?
- Pilot ücretsizse ne kadar süre ve hangi kullanım sınırları var?
- Banka teklifinde ücretli keşif/kurumsal pilot yaklaşımı mı olacak?
- Müşteriye sunulabilecek gerçek fiyat veya denenecek fiyat aralığı nedir?

Bu maddeler fiyatlandırma hipotezleridir; henüz kesin paket, tutar veya satın
alma akışı tanımlanmadı. Demo ücretsizliği, ürün ücretsizliği anlamına gelmez.

## Sayfa bazında ölçüm

Kampanya ölçümüne sunucuda doğrulanan `campaignId`, `pageId` (kampanya+dil),
`offerId`, `ctaGoal`, `pageVersion`, hedef pazar ve `priceVariant` eklendi. Tekil
CTA tıklama oranı sayfa/dil/fiyat gösterimi bazında ayrı raporlanıyor. Aynı kişinin
tekrar tıklamaları oranı şişirmiyor. CTA, form başlamadan ve e-posta doğrulamasından
önce ölçülüyor. Ölçüm izni yoksa formlar çalışıyor ama ziyaretçi tıklama oranının
paydasına alınmıyor. Eski kayıtlar ve eski sayfa raporları korunuyor.

Başvuruların tekilleştirilmesine `page_id` eklendi; aynı e-posta farklı sayfalara
ilgi bırakabilir. SQLite eski şemadan işlem içinde geçirilir; sözleşme ve rezervasyon
bağlantılarının korunması test edildi. Toplam kayıt sayısı, tüm sayfalar arasında
tekilleştirilmiş kişi sayısı olarak yorumlanmamalı.

Takip zinciri: sayfa ziyareti → ana CTA (ilk deneyin ana hedefi) → form başlangıcı → kaydedilmiş talep →
doğrulanmış randevu → gerçekleşen demo → nitelikli/ücretli pilot. Dosya paylaşımı
ayrı bir ikincil davranış olarak ölçülür. Hazırlık ve ölçüm kurulabilir;
hangi sayfanın kazandığına trafik ve başvuru kalitesi geldikten sonra karar verilir.

## Sonraki içerik kararları

1. Önerilen dar gruplardan hangilerine ilk müşteri erişimi var?
2. İlk canlı gösterimde hangi akış gerçekten baştan sona gösterilebilir ve ne zaman hazır olur?
3. Gmail ajanı yalnızca takip önerisi/taslak mı üretir, yoksa kullanıcı adına
   hangi koşullarda mesaj gönderir? İstenen yetki ve kullanıcı kontrolü nedir?
4. Demo sonrası pilot/ürün fiyat birimi ve fiyat aralığı nedir?
5. Ücretsiz demo politikasının kapsamı, gerçek kapasite ve dönüş süresi nedir?
