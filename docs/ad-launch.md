# İki reklam öncesi yayına hazırlık

## Doğrulanmış mevcut durum

- Kullanıcının sitesi şu anda yalnızca localhost'ta. Domain henüz alınmadı;
  `qualifilab` benzeri bir ad düşünülüyor. Kaynak kodun görünen markası QualiFi;
  önceki sürümde kaldırılması gereken ayrı bir `Lab` etiketi bulunmadı. Yeni
  hakkımızda sayfası `Lab yaklaşımı`nı deneyerek ürünleştirme olarak açıklıyor.
- İki reklam sayfası henüz seçilmedi. İlk adaylar: ajanslar için sözleşmeden nakit
  akışı ve küçük B2B işletmeler için Gmail follow-up. Bu bir öneridir, seçim yapılmadı.
- E-posta kayıtları `/api/leads` → SQLite `leads` tablosuna yazılıyor.
  Bağımsız yerel gönderim/kapama/yeniden açma kontrolünde HTTP 201 ve kayıt kalıcılığı
  doğrulandı. Kullanıcının Windows veritabanı veya üretim sunucusu incelenmedi.
- Varsayılan dosya, sunucu kodunun bulunduğu klasördeki `data/qualifi.sqlite`.
  `DATA_DIR` ayarlanırsa o dizin kullanılır. Başka bir ZIP klasöründe yeni sunucu
  açmak, varsayılan olarak başka bir veritabanı kullanır.
- Kayıtlar Gmail'e, GitHub'a veya CRM'e otomatik gitmez. `view-leads.cmd` / `npm run leads`
  mevcut veritabanından özel yerel HTML/CSV ve gönderilmemiş e-posta taslakları oluşturur.
- Aynı e-posta/sayfa/kayıt türü tekrarında yeni satır oluşturulmaz. Arayüz artık
  bu durumda zaten kayıtlı olunduğunu ve yeni dosyanın tekrar kaydedilmediğini belirtir.

## Reklam bütçesinden önce gereken somut kontroller

1. Domain ve HTTPS ile erişilebilir hosting. Bu uygulama Node.js 24+ ve kalıcı,
   özel, yazılabilir `DATA_DIR` gerektirir; yalnız statik HTML hosting'i API'yi çalıştırmaz.
2. Gerçek alan adını `PUBLIC_ORIGIN=https://ALAN-ADINIZ` olarak yapılandır.
   Sondaki `/` normalleştirilir. Domain almak tek başına sunucuyu yayına almaz.
3. Kalıcı disk ve yedekleme: host yeniden dağıtıldığında veritabanı silinmemeli.
   Bu sağlayıcı davranışı yalnız kod incelemesiyle doğrulanamaz.
4. Gerçek HTTPS adresinden bir test kaydı bırak, sunucudaki özel rapordan bul,
   sunucuyu yeniden başlat ve kaydın durduğunu kontrol et. Kayıt/CSV dosyalarını
   herkese açık bir web dizinine koyma.
5. Reklamın hedeflediği problemle eşleşen tek sayfa/tek CTA seç. İki reklamda farklı
   teklifler veya kitleler varsa sonuçları ayrı yorumla. UTM'leri kişisel bilgi
   içermeyen kampanya/creative kimlikleriyle kullan.
6. Mobil/masaüstü ve gerçek 5 saniye kontrolü. Otomatik DOM/HTTP testleri, gerçek
   ekranda okunabilirliğin veya anlaşılmanın yerine geçmez. BackstopJS senaryoları
   hazırlanmıştır; bu yönetimli ortamda gerçek tarayıcı arayüzü yoktur.
7. Butona tıklama, form başlangıcı, kayıt ve gerçek dosya yüklemeyi ayrı say.
   Ölçüm reddedilse de kayıt çalışır; bu ziyaretçiler tıklama oranının ölçülmüş
   paydasına alınmaz. Küçük sayıdaki tıklamalar talep/ödeme isteğini kanıtlamaz.
8. Ziyaretçiye başarı durumu doğru gösterilmeli. Hazır olmayan ajan, Gmail/WhatsApp
   bağlantısı, kesin doğruluk, satın alma veya rezerve edilmiş demo iddiası yok.

## Güven ve marka

TR/EN hakkımızda sayfası misyon, vizyon, geliştirme yaklaşımı, bugünkü pilot aşaması
ve gerçek iletişim bilgisini içerir. Bankacılık/finans yazılımlarının geleceğine
katkı hedefi vizyon olarak sunulur; çalışan bankacılık hizmeti, kurum desteği veya
lisans iddiası eklenmedi. `Lab` alan adında araştırma/deneme yaklaşımını çağrıştırabilir;
sitedeki vaat ve gerçek ürün aşaması açık kaldığında isim tek başına güven kanıtı değildir.

İlk güven kaynakları: kimlik ve iletişim, erişilebilir veri kullanımı açıklaması,
net pilot sınırı, doğru çalışan form, okunabilir çıktı örneği ve gerçek sonraki adım.
Destekçi, ekip özgeçmişi veya müşteri logosu ancak gerçek bilgiler sağlanınca eklenir.

## SEO

`PUBLIC_ORIGIN` ayarlandığında canonical ve TR/EN alternatifleri mutlak URL olur;
OG paylaşım görseli, sayfa URL'si, temel WebSite verisi ve sitemap üretilir.
`/robots.txt`, `/sitemap.xml`, `/tr/hakkimizda`, `/en/about`, `/tr/veri-kullanimi`
ve `/en/data-use` rotaları hazırdır. Sayfa dizinleri inceleme içindir ve noindex kalır.

Domain ayarı olmadan yerel sayfalar noindex, robots engelli ve sitemap 503'tür;
sahte domain yayımlanmaz. Canlıya çıkışta bu ayarın değiştirilmesi ve HTTP çıktısının
kontrolü gerekir. Sitemap'i Search Console'a gönderme ve domain doğrulama işlemleri
henüz yapılmadı. Bu altyapı indekslenme veya sıralama garantisi değildir.

Resmî kaynaklar:
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/adspolicy/answer/6368661

## Başvuru sonrası e-posta

Her yeni kayıtla aynı işlemde `email_outbox` içinde TR/EN açıklayıcı taslak
hazırlanır. Durumu `draft`tır; e-posta gönderilmez. Yinelenen kayıt ikinci taslak
oluşturmaz. Taslakta ürün aşaması, olası 20 dakikalık demo, iletişim ve silme/ayrılma
adımı yer alır; aktivasyon veya doğrulanmış randevu sözü yoktur.

Otomatik gönderim için seçilecek servis, doğrulanmış gönderici adresi/domaini ve
sunucu ortamında saklanacak servis anahtarı henüz yok. Şifre/anahtarlar sohbete veya
Git'e yazılmamalı. Okul e-postası iletişim/reply-to olarak kalabilir; yeni domain
adına otomatik gönderim için o domainin servis üzerinde doğrulanması gerekir.

Yerel raporun EML taslakları mail uygulamasında incelenip elle gönderilebilir.
Rapor/CSV/EML dışa aktarımları veritabanından ayrı kişisel veri kopyalarıdır;
veri silme ve saklama sürecinde bunlar da ayrıca ele alınmalıdır.
