# QualiFi ürün ve pazarlama bağlamı

**Document version:** v2
**Last updated:** 2026-11-12
**Durum:** Kullanıcı açıklamaları ve kaynak incelemesinden hazırlanmış ilk taslak.
Öneriler, kullanıcı kararı veya müşteri doğrulaması olarak sunulmaz.

## Ürün

QualiFi, sözleşme ve iş yazışmalarından finansal bağlam çıkarıp nakit planlama ve
takip işlerine yardımcı olacak uzman ajanlar ve sohbet arayüzü geliştirmeyi hedefliyor.
Bugünkü depoda çalışan ürün; TR/EN tanıtım, pilot ilgisi/bekleme listesi formları,
SQLite kayıtları ve izinli birinci taraf ölçümüdür. Canlı AI, Gmail/WhatsApp
entegrasyonu ve otomatik finansal analiz uygulanmış kabul edilmez.

## Hedef kitle ve araştırılacak problemler

- Proje bazlı çalışan ajans sahipleri: sözleşme vadeleri, beklenen tahsilat ve gider planı.
- Freelancer/danışmanlar: değişken gelir, avans ve teslim ödemeleri.
- Küçük B2B işletme sahipleri/satış ekipleri: Gmail teklif takibi ve satış öngörüsü.
- Finans sorumluları: yaklaşan/geciken tahsilatların takibi.
- WhatsApp ve banka risk teklifleri ayrı teknik/kurumsal keşiflerdir.

Müşteri alıntısı, doğrulanmış problem sıklığı ve ödeme isteği verisi henüz sağlanmadı.
Mevcut alternatifler olarak Excel/takvim/manuel e-posta takibi araştırılabilir;
rakiplerin eksikliği veya müşterilerin neden geçeceği doğrulanmış değil.

## Hedef ve dönüşüm tanımları

- Araştırmanın birincil sinyali: sayfaya özel ana CTA'ya tekil tıklama.
- CTA tıklaması; başvuru, belge yükleme, aktif ajan, görüşme veya ödeme değildir.
- Gerçek başvuru: sunucuda kalıcı kaydedilen yeni bekleme listesi/pilot talebi.
- Sonraki aşama: uygun kişilere 20 dakikalık demo; herkes için ana CTA'ya dönüştürülmez.
- Nitelikli ilgi: hedef kitleye uygunluk, yakın tarihli gerçek problem ve sonraki adım
  isteği görüşmeyle değerlendirilir. Şu anda otomatik nitelik puanı yoktur.

## Ücret, marka ve kanıt

- Kullanıcı kararı: TR fiyatları gizli. EN cashflow: planlanan 29 USD/analiz;
  EN Gmail follow-up: planlanan 99 USD/işletme/ay. Ödeme alınmıyor.
- Görünür kişi/iletişim: Muhammed Talha Güler, talha.guler@ozu.edu.tr.
- Renkler: koyu yeşil/açık yeşil/kırık beyaz; kısa, açık TR/EN metinler.
- Sahte müşteri, destekçi, doğruluk, tasarruf, kıtlık veya çalışan entegrasyon iddiası yok.
- Pilot aşaması açık kalır. Lab, ürün geliştirme yaklaşımıdır; bankacılık lisansı
  veya kurumsal destek kanıtı değildir.
- Gerçek müşteri referansları, kullanım sonuçları ve performans karşılaştırması MISSING.

## Pazarlama deneyi

Kullanıcı yaklaşık 10.000 TL reklam bütçesi ve toplam 9 günlük çalışma ufku belirtti.
Türkiye ve İngilizce pazar ayrı bütçelerle hedefleniyor; kullanıcı doğrudan da ulaşacak.
Meta Ads düşünülüyor. Kesin başlangıç/bitiş, harcanmış bütçe, iki kampanya, EN ülkesi,
hedef CPL ve reklam hesabı bilgileri MISSING.

Önceki asistan önerisi; ajansların nakit planı için TR/EN iki ücretli deney,
4.500 TL TR + 3.500 TL EN + 2.000 TL yedek ve EN'de Birleşik Krallık idi.
Bu dağılım ve ülke kullanıcı tarafından seçilmiş değildir. Yeni bir günlük bütçe
veya çalışan kampanya varsayma. Müşteri edinme/ROAS hedefi, erken ilgi metriğiyle karıştırılmaz.

## Site ve güncel ölçüm durumu

Kullanıcı Lovable'dan domain satın aldı ve canlı adresi https://qualifilab.com/ olarak verdi.
12 Kasım GET incelemesinde ana sayfa ve örnek kampanyalar 200;
`/tr/hakkimizda`, `/en/about`, `/tr/veri-kullanimi`, `/sitemap.xml` 404 döndü.
Canlı JS bu eski depodaki dosyalarla aynı değil. Kullanıcının sonraki Lovable
ekranı ve GitHub kontrolü bağlı kaynağı `Talhaguler1/qualifi-41598058` main olarak
doğruladı. Bu kaynağın lead/event handler'ları DB yazmadan başarı dönen placeholder'lardı.
Orada `a3d944f` ile geçici dürüst hata yanıtı ve Lovable üzerinden gerçek kayıt
kurulum talimatı eklendi; veritabanı entegrasyonu henüz kurulmadı.
Canlı kalıcılık/yayın henüz doğrulanmadı. Ayrıntı: `docs/marketing-measurement.md`.

Kullanıcı GA4/GTM/Meta Pixel/Clarity kurulu olmadığını düşünüyor; bu hesap tarafında
doğrulanmış durum değildir. Son seçilen kapsam: ziyaret, kaynak, CTA, form adımları,
tamamlanan başvurular. Oturum kaydı ve ısı haritası bu aşamada kapsam dışı.

## Yetki ve çalışma biçimi

Kullanıcı her çalışma sonunda incelenmiş değişikliklerin commit/push edilmesini ve
çalışmaların canlı siteye aktarılmasını istedi. Aktif web kaynağı artık doğrulanmış
Talhaguler1/qualifi-41598058 main'dir; önceki Talhaguler1/QualiFi ayrı Node/SQLite
kaynağı olarak korunur. Lovable editör senkronizasyonu canlı yayın değildir.
Başka projeye dağıtım veya domain taşıma yapma. Şema değişiklikleri yeni deponun
AGENTS.md kuralı gereği Lovable üzerinden yapılır.
Reklam açma, bütçe harcama, gerçek kişilere mesaj gönderme talimatı henüz yok.
Kaynak incelemesi, taslaklar ve yerel hazırlık yapılabilir; canlı gerçekleşme
kanıtı olmadan entegrasyon çalışıyor denmez.

## Learnings

Doğrulanmış kampanya sonucu yok; öneriler öğrenilmiş sonuç olarak eklenmedi.

## Changelog

- v2 (2026-11-12) — Kullanıcının Git bağlantısı ekranıyla aktif Lovable deposu
  doğrulandı; iki uygulama ve placeholder API'ler arasındaki ayrım kaydedildi.
- v1 (2026-11-12) — Kullanıcı hedefleri, canlı domain, seçilen olay ölçümü kapsamı,
  deney kısıtları ve kaynak/canlı sürüm ayrımı ilk taslağa işlendi.
