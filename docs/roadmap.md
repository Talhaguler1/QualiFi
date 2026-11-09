# QualiFi uygulama öncelikleri

Kullanıcı, açıklanan hedef kitleler, teklifler ve CTA'lar doğrultusunda
önceliklendirme ve uygulama istedi. Tamamlanan kaynak kod işleri işaretlendi;
servis bağlantıları ve görsel tarayıcı doğrulaması aşağıda açık bırakıldı.
Ürün ayrıntıları için [brief](landing-brief.md), kaynak
incelemesi ve ölçüm yaklaşımı için [strateji](landing-strategy.md) esas alınır.

## P0 — KOBİ için ölçülebilir ilk talep akışı

Hedef: KOBİ ziyaretçilerinin hangi teklif için kuruluma başlayıp gerçek talep
bıraktığını öğrenmek. Sayfa, kayıt ve ölçüm aynı ilk teslimatın parçalarıdır.

- [x] Mevcut QualiFi kimliğini koruyarak şablonun hero, kart, form ve SSS
      düzenlerinden yararlanan `/isletmeler` sayfasını hazırla; TR/EN karşılığını koru.
- [x] `Nakit akışımı öngör` ve `Nakit takibini ajanıma devret` tekliflerini sun;
      istenen sonuç seçimini sonraki adımlarda koru.
- [x] Dashboard yerine örnek mesaj, nakit zaman çizelgesi ve dayanakları göster;
      örnek veriyi ve ürünün pilot durumunu açıkça belirt.
- [x] Ana CTA `Sözleşmeni ekle, ajanını kur` için kısa pilot kurulum akışını hazırla.
      Dosya seçme, yükleme, kanal tercihi ve gerçek entegrasyon durumlarını ayır.
- [x] Kalıcı ve tekilleştirilmiş pilot başvurusu/bekleme listesi kaydını kur;
      sunucu kaydı başarısızsa başarı mesajı gösterme ve yeniden deneme sun.
- [ ] `Talk to a human` ile gerçek takvim seçeneklerini; `Join waiting list`
      ile kısa e-posta formunu bağla. Üç CTA'yı ayrı niyet olarak ölç.
      E-posta formu, ayrı olaylar ve yapılandırılabilir HTTPS takvim linki hazır.
      Google Calendar randevu planı bağlantısı kullanıcıdan bekleniyor. Doğrulanmış
      rezervasyon kaydı için imzalı adaptör girişi hazır; Google adaptörü bağlı değil.
- [x] Kaynak/UTM, dil, teklif, CTA konumu ve sayfa sürümünü ilişkilendir;
      analitik olaylarına kişisel bilgi veya sözleşme içeriği ekleme.
- [x] Kuruluma başlama, pilot talebi, bekleme listesi ve doğrulanmış randevu
      olaylarını uçtan uca doğrula; tekrar gönderim ve hata durumlarını kontrol et.
      Doğrulama yerel HTTP/SQLite ve DOM testleriyle yapıldı; randevu sağlayıcısı
      henüz bağlı olmadığı için gerçek sağlayıcı uçtan uca testi bekliyor.
- [ ] Mobil, klavye kullanımı, form etiketleri, hata mesajları ve dil geçişini kontrol et.
      Responsive stiller, etiketler ve DOM davranış testleri hazır. Sites yönetimli
      ortamında `cua_repl.js` olmadığından görsel tarayıcı kontrolü yapılamadı.

Tamamlanma ölçütü: Ziyaretçi ilgili tekliften kayıt onayına ulaşabilir; başvuru
kalıcı kayıtta bulunur; kaynak ve teklif ilişkisi korunur; ölçümdeki başarı
sunucu işlemiyle eşleşir. Randevu tıklaması rezervasyon, pilot talebi aktif ajan
olarak raporlanmaz. GitHub'a gönderim ve siteyi yayına alma ayrı işlemlerdir.

Eksik bağımlılıklar: gerçek takvim bağlantısı ve doğrulama adaptörü, üretim HTTPS
adresi/kalıcı disk ve canlı ajan/entegrasyon kapsamı. SQLite kayıt hedefi,
sunucuya sözleşme yükleme ve birinci taraf analitik uygulandı. Üretim dosyası
toplamadan önce erişim ve saklama politikası işletim ortamıyla doğrulanmalı.
Bu bağlantılardan bağımsız sayfa tasarımı ve metin çalışması ilerleyebilir.
Çalışmayan servisler varmış gibi gösterilerek P0 tamamlanmış sayılmamalı.

## P1 — Freelancer sayfası ve karşılaştırılabilir kampanya yapısı

- [x] P0'daki ortak bileşen ve kayıt akışını kullanarak `/freelancerlar` sayfasını hazırla.
- [x] Avans, teslim ödemesi ve geciken proje tahsilatı senaryolarını uyarla.
- [ ] Reklamın vaadiyle sayfanın başlığı/çıktısını eşleştir; ziyaretçiyi doğrudan
      ilgili sayfaya getir. Bu madde reklam satın alma veya kampanya başlatma talimatı değildir.
- [ ] İki teklifi aynı kitle/kaynak içinde karşılaştır; segmentleri ayrı raporla.

Tamamlanma ölçütü: KOBİ ve freelancer akışları kendi mesajlarıyla aynı ölçüm
tanımlarını kullanır. Tekil ziyaret, kuruluma başlama, tamamlanan talep ve nitelikli
görüşme sayıları/oranları teklif ve kaynak bazında incelenebilir.

## P2 — Bulgulara göre iyileştirme ve CFO uyarlaması

- [ ] En fazla kaybın olduğu adımı belirle; form, çıktı anlatımı veya CTA üzerinde
      bir seferde tek değişkeni dene. Varyantı ziyaretçi düzeyinde sabit tut.
- [ ] Kararları yalnızca tıklamalara değil, tamamlanan ve nitelikli taleplere dayandır.
- [x] CFO/finans ekibi için `/finans-ekipleri` sayfasını ortak yapıdan türet;
      ödeme koşulları, istisnalar ve takip yüküne odaklan.

Tamamlanma ölçütü: İyileştirme gerekçesi gözlenen veriyle açıklanabilir; az sayıda
ziyaretten kesin kazanan sonucu çıkarılmaz. Yeni sayfa ölçüm tanımlarını bozmaz.

## P3 — Bankalara yönelik ayrı kurumsal pilot

- [ ] `/bankalar` sayfası için alıcı, veri kaynağı, değerlendirme çıktısı ve
      doğrulama beklentilerini netleştir; ayrı kurumsal görüşme akışı oluştur.
      Ayrı TR/EN banka pilot sayfası ve `risk` teklifine bağlı talep akışı hazır;
      veri kaynağı, değerlendirme/model kapsamı ve kurumsal doğrulama bekliyor.
- [ ] Geri ödeme/risk analizini geçmiş örneklerde değerlendirme ve uzman
      incelemesiyle tanımla; sonuç kesinliği hakkında doğrulanmamış iddia kullanma.

Tamamlanma ölçütü: Banka talebi KOBİ talebinden ayrı takip edilir; veri erişimi,
pilot kapsamı ve başarı ölçütleri tanımlıdır.

## İlk aşamanın dışında kalanlar

Tam yönetim paneli, tema düzenleyicisi, kapsamlı blog, fiyatlandırma deneyleri ve
framework geçişi ilk talep doğrulamasından sonra ihtiyaç varsa ele alınır.
Dashboard gerektirmeyen kullanım, tüm segmentlerde ortak deneyim ilkesi olarak korunur.
