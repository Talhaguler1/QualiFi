# QualiFi çalışma kuralları

## Proje

- İngilizce sayfa: `index.html`; Türkçe sayfa: `tr.html`.
- Paylaşılan tasarım: `style.css`; etkileşimler: `app.js`.
- Yerel sunucu: `server.cjs`; çalıştırma: `npm run dev`.
- Ek paket kurulumu veya derleme gerekmiyor.
- Demo örnek yanıtlar kullanıyor; canlı yapay zekâ ve iletişim entegrasyonu henüz yok.

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
2. Değişiklikleri incele; `npm run check` çalıştır. Sayfa veya sunucu değiştiyse
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
