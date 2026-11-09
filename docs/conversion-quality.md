# Kalıcı dönüşüm kalite kontrolü

Bu kontrol, kullanıcının her değişiklikte 5 saniye testi ve LIFT çerçevesiyle
inceleme isteğini uygular. Üç kanıt türü ayrı tutulur: otomatik yapı/işlev
kontrolü, bağımsız editoryal inceleme, gerçek insan ve tarayıcı testi.

## Her mantıksal değişiklikte

1. Başlık, hedef kitle, CTA, fiyat, görsel veya form değiştiğinde bir dönüşüm
   incelemesi yap. Bir inceleme ajanı kullanılabiliyorsa bağımsız ve salt okunur
   inceleme iste; yoksa aynı ölçütleri açıkça kendin uygula.
2. `npm run quality` çalıştır: sözdizimi, 14 sayfanın dönüşüm yapısı ve işlev/DOM
   testleri birlikte kontrol edilir. `work/quality/latest.json` raporu oluşur.
3. Görsel değişiklikte yerel/uygun CI ortamında BackstopJS karşılaştırması çalıştır.
   Bu ortamda görüntü alınamadıysa görsel kontrolü `çalıştırılmadı` olarak bildir.
4. Son yanıtta hangi kanıtın mevcut olduğunu belirt. Kod kontrolü, görsel fark
   bulunmaması veya bir ajanın değerlendirmesi, insanın sayfayı 5 saniyede
   anladığını ya da dönüşümün yükseldiğini kanıtlamaz.

## Otomatik yapı kontrolleri

`scripts/conversion-qa.cjs` şu göstergeleri kontrol eder: hedef kitle/başlık/ana
aksiyonun ilk ekran kaynak yapısında bulunması, aynı amaca giden CTA tekrarları,
gerçek taahhüdü anlatan buton etiketi, üç adımlı yolculuk, örnek/pilot açıklaması,
form etiketleri, veri kullanımı ve gerçek iletişim, dil eşleştirmesi ve fiyat
politikasına uyum. Yarışan ana aksiyon, çalışmayan sohbet kutusu, desteklenmeyen
kıtlık/başarı iddiaları gibi belirli regresyonlar engellenir.

Bu göstergeler okunabilirliğin, hedef müşteri uyumunun veya ekranın ilk katında
görünürlüğün ölçümü değildir. Araç bunlara puan verip `5 saniye testi geçti`
sonucu üretmez; insan ve görsel test durumları açıkça beklemede kalır.

## İnsanla 5 saniye testi

- Her sayfanın hedef grubuna uygun, metni daha önce görmemiş kişilerle çalış.
- Sayfanın ilk ekranını normal cihaz boyutunda 5 saniye göster, sonra kapat.
- Yönlendirme yapmadan sor: `Bu sayfa kimin için?`, `Ne elde etmeni öneriyor?`,
  `Devam etmek için ne yapmanı istiyordu?`
- Yanıtları, sayfanın amaçlanan hedef grubu, somut sonucu ve gerçek CTA
  taahhüdüyle karşılaştır. Kelimesi kelimesine hatırlama arama.
- TR ve EN sonuçlarını ve cihazı ayrı kaydet. Örnek başlangıç değerlendirmesi:
  5 kişiden en az 4'ünün üçünü de açıklayabilmesi. Bu küçük nitel test, pazar
  doğrulaması veya istatistiksel anlamlı dönüşüm artışı değildir.
- Katılımcı kimliği yerine anonim kod, sayfa sürümü, tarih, cihaz, yanıtlar ve
  gözlenen karışıklığı kaydet. Yapılmayan testi yapılmış gibi doldurma.

## LIFT inceleme soruları

| Alan | Her değişiklikte sorulacak soru | Gerekli kanıt |
| --- | --- | --- |
| Value proposition | Hangi iş sonucunu, hangi kapsamla öneriyoruz? | Somut çıktı, gerçek ürün kapsamı, fiyat varsa kapsam ilişkisi |
| Relevance | Bu grubun gerçek problemi ve kullandığı dil mi? | Müşteri görüşmeleri ve reklam–sayfa mesajı eşleşmesi |
| Clarity | Hedef kitle, sonuç ve sonraki adım kolay anlaşılıyor mu? | Kaynak yapısı + gerçek ekran + insan yanıtları |
| Urgency | Şimdi ilgi göstermenin gerçek bir gerekçesi var mı? | Gerçek problem/iş bağlamı; doğrulanmamış sayaç ve kota yok |
| Anxiety | Beklenti, veri paylaşımı, fiyat ve ürün aşaması güven veriyor mu? | Açık pilot/örnek açıklaması, gerçek iletişim ve gerçek veri uygulamaları |
| Distraction | Birincil aksiyonun önüne başka bir davranış geçiyor mu? | Tek CTA amacı, tutarlı tekrar, gerçek etkileşimler |

## BackstopJS

BackstopJS ekran görüntülerini referanslarla karşılaştırır; tıklama/oturum
analitiği veya insanların mesajı anlamasını ölçmez. Yapılandırma 14 sayfayı,
sayfa ve form açık durumlarını, 390×844 mobil ve 1440×1000 masaüstü boyutlarını
kapsar: 56 görüntü. Kaynak: https://github.com/garris/BackstopJS

```sh
npm ci
npm run visual:reference
npm run visual:test
npm run visual:report
# Farkları gerçekten inceledikten sonra yeni görünümü referans kabul etmek için:
npm run visual:approve
```

İlk referans görüntülerinin oluşturulması tasarımın doğru olduğunu kanıtlamaz;
önce ekranları incele. `approve` otomatik çağrılmaz. Aynı işletim sistemi,
tarayıcı ve font koşullarında karşılaştır. Gerekiyorsa mevcut Chrome yolunu
`CHROME_PATH` ile ver. `npm ci` geliştirme aracı için tarayıcı indirebilir;
yalnızca kod testleri yapılan ortamda `PUPPETEER_SKIP_DOWNLOAD=1` kullanılabilir.

Görsel çalıştırıcı ayrı geçici veritabanı açar, analitiği reddeder ve formu
göndermez. Gerçek başvuruları değiştirmez. Onaylanmış referanslar
`visual/baselines/`, aday görüntüler ve raporlar yok sayılan `work/visual/`
altında tutulur. Bu oturumda Sites tarayıcı arayüzü (`cua_repl.js`) yoktur;
yönetimli ortam çalıştırıcısı bunu hata kodu 2 ve `çalıştırılmadı` durumuyla
bildirir. Yerel veya desteklenen CI ortamında gerçek görüntüler oluşturulmalıdır.

BackstopJS yalnızca geliştirme bağımlılığıdır; ziyaretçi sayfasına eklenmez.
Microsoft Clarity/oturum kaydı entegrasyonu kullanıcının isteğiyle şimdilik
ertelendi. Clarity'nin kendisi hesap/proje ister:
https://learn.microsoft.com/en-us/clarity/setup-and-installation/getting-started

## Git kaydı öncesi

`npm run setup:hooks` yalnızca bu depoda `.githooks/pre-commit` kontrolünü
etkinleştirir. Kontrol commit öncesinde `npm run quality` çalıştırır. ZIP
indirmesinde Git kancası yoktur; komut elle çalıştırılabilir. Bu, bir dosyanın
her tuş vuruşunda araştırma yapıldığı veya canlı kullanıcı testi yürütüldüğü
anlamına gelmez; her mantıksal değişiklik/teslimat aynı kontrol sürecinden geçer.
