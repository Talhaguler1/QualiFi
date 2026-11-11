# QualiFi çalışma kuralları

## Proje

- Ortak TR/EN sayfa üretimi ve hedef kitle rotaları: `site.cjs`.
- Yedi kampanya ve 14 TR/EN adres: `campaigns.cjs`; tek amaçlı sayfa üretimi:
  `campaign-site.cjs`; etkileşim ve tasarım: `campaign.js`, `campaign.css`.
- Kampanya dizinleri: `/kampanyalar`, `/en/campaigns`. Windows yerel açılışı:
  `start-windows.cmd` (Node.js 24+ gerekir); `npm run preview` aynı dizini açar.
- İngilizce/Türkçe HTML kopyaları: `index.html`, `tr.html`;
  `site.cjs` değiştiğinde `npm run build:pages` ile güncelle.
- Paylaşılan tasarım: `style.css`; etkileşimler: `app.js`.
- Yerel sunucu: `server.cjs`; çalıştırma: `npm run dev`.
- Çalıştırma için Node.js 24+ gerekir; üretim bağımlılığı veya derleme yok.
- Testler için `npm ci`, doğrulama için `npm run check` ve `npm test` kullan.
- Örnek çıktılar gösteriliyor; canlı yapay zekâ ve iletişim entegrasyonu henüz yok.
- Kalıcı kayıtlar `store.cjs` ile SQLite'a yazılır. `data/`, `.env`, sözleşmeler
  ve başvuru verileri Git'e eklenmez. Yeni API'lerde kişisel veri sızıntısını önle.
- Takvim `CALENDAR_URL` ile yapılandırılır; yoksa görüşme talep formu çalışır.
- Kayıtlar sunucunun özel `DATA_DIR/qualifi.sqlite` dosyasındadır; gelen kutusu
  veya GitHub'a aktarılmaz. Yerel görüntüleme: `view-leads.cmd` / `npm run leads`.
  Rapor özel HTML/CSV/EML üretir; bunları web rotası veya Git dosyası olarak sunma.
- Yeni kayıtla `email_outbox` içinde TR/EN yanıt taslağı aynı işlemde hazırlanır;
  durum `draft`tır. Otomatik gönderici/provider henüz yok; e-posta gönderildi deme.
- SEO: `seo.cjs`, hakkımızda/veri sayfaları: `info-site.cjs`. `PUBLIC_ORIGIN`
  ayarlanana kadar yerel sayfalar noindex; sitemap 503'tür. Kullanıcı Lovable'dan
  domain aldı; canlı adres https://qualifilab.com/. 12 Kasım GET kontrolünde
  kampanyalar açılıyor, yeni bilgi sayfaları ve sitemap 404; yayın bağlantısı ve
  canlı kalıcı kayıt henüz doğrulanmadı. Eski hazırlık notu `docs/ad-launch.md`,
  güncel kaynak/canlı ayrımı ve ölçüm planı `docs/marketing-measurement.md`.
- İki reklam sayfası henüz kullanıcı tarafından seçilmedi. Kullanıcı yaklaşık
  10.000 TL, toplam 9 gün, TR/EN ve doğrudan ulaşım belirtti. Önerilen ülke/bütçe
  dağılımını kullanıcı kararı sayma. Ortak skill bağlamı: `.agents/product-marketing.md`.
- Landing page çalışmasında kullanıcı brief'i `docs/landing-brief.md`, uygulama
  öncelikleri ve tamamlanma ölçütleri `docs/roadmap.md` dosyasındadır.
- En güncel kampanya yönü `docs/campaign-pages.md`: her reklam sayfası tek
  hedef grup/problem/teklif/ana CTA etrafında kurulacak. Demo 20 dakika;
  Gmail/model yetenekleri kullanıcı tarafından geliştirilmesi düşünülen kapsamdır.
  Yedi sayfanın TR/EN kampanya uygulaması hazırdır; canlı entegrasyon varsayma.
- Kullanıcının fiyat kararı: tüm TR kampanyalarında fiyat gizli; yalnızca EN
  sözleşme/nakit sayfasında planlanan 29 USD/analiz ve EN Gmail follow-up
  sayfasında planlanan 99 USD/ay gösterilir. Bunlar ödeme alınan fiyatlar değildir.
- Kullanıcının görünür iletişim bilgisi: Muhammed Talha Güler,
  `talha.guler@ozu.edu.tr`; bu adres kullanıcı tarafından siteye eklenmek üzere verildi.
- Ana kampanya metriği `primary_cta_clicked` / `landing_viewed` tekil ziyaretçi
  oranıdır; rapor sayfa, dil, teklif, CTA amacı ve fiyat gösterimiyle ayrılır.
- Son kullanıcı düzeltmesi: ilk deneyin ana hedefi sayfaya özel tek CTA'ya
  tıklamadır (bekleme listesi, sözleşme ekleme vb.). Demo sonraki adımdır;
  tüm sayfaların birincil hedefini demo rezervasyonuna çevirme. CTA tıklamasını
  kayıt, dosya yükleme, aktif ürün veya ödeme isteğiyle aynı başarı sayma.
- Kullanıcının 12 Kasım son seçimi: ziyaret, kaynak, CTA, form adımları ve tamamlanan
  başvuruları ölç; oturum kaydı/ısı haritası ekleme. GA4/GTM/Meta kurulu olmadığını
  düşünüyor; hesap tarafı durumu doğrulanmadı. Mevcut izinli CTA raporu korunur.
- Kullanıcı çalışmaların qualifilab.com'a aktarılmasını istiyor. Lovable bağlı
  deposu/dalı ve yayın yolu henüz bilinmiyor; push'u canlı yayın diye raporlama.
  GitHub bağlantısını doğrulamadan başka projeyi yayımlama veya domaini taşıma.

## Her değişiklikte dönüşüm kalite kontrolü

Kullanıcı her değişiklik/teslimatta 5 saniye testi ve LIFT incelemesi yapan
bir ajan veya kontrol parçası istedi. Protokol: `docs/conversion-quality.md`.

- Her mantıksal metin, tasarım, CTA, form, fiyat veya yönlendirme değişikliğinde
  bağımsız, salt okunur bir dönüşüm inceleme ajanı kullan. Bu kullanıcı tarafından
  istenmiş sınırlı bir inceleme delegasyonudur.
- İnceleme hedef kitle, tek sonuç, tek CTA, Value Proposition, Relevance, Clarity,
  Urgency, Anxiety ve Distraction alanlarını kapsasın. Gerçek ürün durumunu ve
  ilk hedefin CTA tıklaması olduğunu koru. Otomatik sonuçlar sayfa yapısına ilişkindir.
- `npm run quality` sözdizimi, 14 sayfa yapısı ve işlev/DOM testlerini çalıştırır.
  `.githooks/pre-commit` etkinse bunu commit öncesinde otomatik yapar.
- Görsel değişiklikte uygun yerel/tarayıcı ortamında BackstopJS çalıştır;
  referans görüntülerini incelemeden otomatik `approve` yapma. Yönetimli Sites
  ortamında desteklenen tarayıcı arayüzü yoksa görsel testi yapılmadı diye bildir.
- Gerçek 5 saniye testi, hedef kullanıcılara ekranın 5 saniye gösterilip
  hedef grup, sonuç ve CTA'nın hatırlanmasının sorulmasını gerektirir. Yapılmadıysa
  bekliyor olarak kaydet. Bir ajanın yorumu veya DOM testi insan testi yerine geçmez.
- Yapılan kontrolü ve açık belirsizlikleri son yanıtta belirt; kullanıcı testi
  veya dönüşüm artışı için kanıt yokken başarı puanı üretme. İnceleme, rutin
  düzeltmeler veya commit için ek kullanıcı onayı gerektirmez.

## GitHub bağlantısı

- Doğrulanmış depo: `https://github.com/Talhaguler1/QualiFi`.
- Git uzak adresi (`origin`): `https://github.com/Talhaguler1/QualiFi.git`.
- Çalışma ve gönderim dalı: `main`.
- Deponun görünürlüğü özel (`private`); kullanıcı istemedikçe değiştirme.
- Kullanıcının görev panosu: `https://github.com/users/Talhaguler1/projects/3`.
  Pano erişimi mevcut bağlantıyla doğrulanamadı; kaynak kod aktarımı bu panoya
  değil, yukarıdaki depoya yapılır.

## Her çalışma turunun sonunda

Kullanıcı, bu projedeki güncellemelerin her çalışma turunun sonunda GitHub'a
commit ve push edilmesini istedi. Bu yetki için her seferinde yeniden onay isteme.

1. Mevcut Git durumunu ve uzak deponun doğru QualiFi deposu olduğunu kontrol et.
   Depo veya bağlantı henüz belirlenmediyse kullanıcıdan eksik bilgiyi al;
   herhangi bir depoyu tahmin ederek gönderim yapma.
2. Değişiklikleri incele; `npm run quality` çalıştır (etkin commit kancası
   zaten bu tam kontrolü çalıştırır; değişiklik yoksa gereksiz tekrarlama).
   Sayfa veya sunucu değiştiyse
   ilgili rotaları, etkileşimleri ve iki dildeki karşılıkları uygun şekilde kontrol et.
3. Yalnızca bu çalışmaya ait, incelenmiş dosyaları açıklayıcı bir mesajla commit et.
   `.env`, erişim anahtarları, kişisel veriler, bağımlılıklar ve geçici dosyaları ekleme.
4. Doğrulanmış proje dalına normal push yap. Uzak geçmişi ve başkasının
   değişikliklerini koru; force push, geçmişi silme veya çatışmada veri kaybına yol açma.
5. Son yanıtta değişiklikleri, doğrulamayı ve GitHub gönderiminin sonucunu bildir.
   Gönderim engelliyse tamamlanmış gibi gösterme; yerel çalışmayı koru ve engeli açıkla.

Sohbetin kapanması bir otomatik tetikleyici değildir; gönderimi çalışma tamamlanıp
kullanıcıya son yanıt verilmeden önce yap. Yeni bir oturumda bu dosyayı yeniden oku.

GitHub'a kaynak kod gönderme talebi, siteyi yayına alma veya erişim ayarlarını
değiştirme talebi değildir. Yayınlama işlemini ayrıca kullanıcının isteğine göre ele al.
