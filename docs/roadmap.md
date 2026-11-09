# QualiFi uygulama öncelikleri

Kullanıcı, açıklanan hedef kitleler, teklifler ve CTA'lar doğrultusunda
önceliklendirme istedi. Bu sıra uygulama planıdır; aşağıdaki işler henüz
tamamlanmış değildir. Ürün ayrıntıları için [brief](landing-brief.md), kaynak
incelemesi ve ölçüm yaklaşımı için [strateji](landing-strategy.md) esas alınır.

## P0 — KOBİ için ölçülebilir ilk talep akışı

Hedef: KOBİ ziyaretçilerinin hangi teklif için kuruluma başlayıp gerçek talep
bıraktığını öğrenmek. Sayfa, kayıt ve ölçüm aynı ilk teslimatın parçalarıdır.

- [ ] Mevcut QualiFi kimliğini koruyarak şablonun hero, kart, form ve SSS
      düzenlerinden yararlanan `/isletmeler` sayfasını hazırla; TR/EN karşılığını koru.
- [ ] `Nakit akışımı öngör` ve `Nakit takibini ajanıma devret` tekliflerini sun;
      istenen sonuç seçimini sonraki adımlarda koru.
- [ ] Dashboard yerine örnek mesaj, nakit zaman çizelgesi ve dayanakları göster;
      örnek veriyi ve ürünün pilot durumunu açıkça belirt.
- [ ] Ana CTA `Sözleşmeni ekle, ajanını kur` için kısa pilot kurulum akışını hazırla.
      Dosya seçme, yükleme, kanal tercihi ve gerçek entegrasyon durumlarını ayır.
- [ ] Kalıcı ve tekilleştirilmiş pilot başvurusu/bekleme listesi kaydını kur;
      sunucu kaydı başarısızsa başarı mesajı gösterme ve yeniden deneme sun.
- [ ] `Talk to a human` ile gerçek takvim seçeneklerini; `Join waiting list`
      ile kısa e-posta formunu bağla. Üç CTA'yı ayrı niyet olarak ölç.
- [ ] Kaynak/UTM, dil, teklif, CTA konumu ve sayfa sürümünü ilişkilendir;
      analitik olaylarına kişisel bilgi veya sözleşme içeriği ekleme.
- [ ] Kuruluma başlama, pilot talebi, bekleme listesi ve doğrulanmış randevu
      olaylarını uçtan uca doğrula; tekrar gönderim ve hata durumlarını kontrol et.
- [ ] Mobil, klavye kullanımı, form etiketleri, hata mesajları ve dil geçişini kontrol et.

Tamamlanma ölçütü: Ziyaretçi ilgili tekliften kayıt onayına ulaşabilir; başvuru
kalıcı kayıtta bulunur; kaynak ve teklif ilişkisi korunur; ölçümdeki başarı
sunucu işlemiyle eşleşir. Randevu tıklaması rezervasyon, pilot talebi aktif ajan
olarak raporlanmaz. GitHub'a gönderim ve siteyi yayına alma ayrı işlemlerdir.

Eksik bağımlılıklar: takvim bağlantısı/sağlayıcısı, kalıcı kayıt hedefi, analitik
hedefi, gerçek sözleşme yükleme altyapısı ve pilotta çalışan ajan/entegrasyon kapsamı.
Bu bağlantılardan bağımsız sayfa tasarımı ve metin çalışması ilerleyebilir.
Çalışmayan servisler varmış gibi gösterilerek P0 tamamlanmış sayılmamalı.

## P1 — Freelancer sayfası ve karşılaştırılabilir kampanya yapısı

- [ ] P0'daki ortak bileşen ve kayıt akışını kullanarak `/freelancerlar` sayfasını hazırla.
- [ ] Avans, teslim ödemesi ve geciken proje tahsilatı senaryolarını uyarla.
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
- [ ] CFO/finans ekibi için `/finans-ekipleri` sayfasını ortak yapıdan türet;
      ödeme koşulları, istisnalar ve takip yüküne odaklan.

Tamamlanma ölçütü: İyileştirme gerekçesi gözlenen veriyle açıklanabilir; az sayıda
ziyaretten kesin kazanan sonucu çıkarılmaz. Yeni sayfa ölçüm tanımlarını bozmaz.

## P3 — Bankalara yönelik ayrı kurumsal pilot

- [ ] `/bankalar` sayfası için alıcı, veri kaynağı, değerlendirme çıktısı ve
      doğrulama beklentilerini netleştir; ayrı kurumsal görüşme akışı oluştur.
- [ ] Geri ödeme/risk analizini geçmiş örneklerde değerlendirme ve uzman
      incelemesiyle tanımla; sonuç kesinliği hakkında doğrulanmamış iddia kullanma.

Tamamlanma ölçütü: Banka talebi KOBİ talebinden ayrı takip edilir; veri erişimi,
pilot kapsamı ve başarı ölçütleri tanımlıdır.

## İlk aşamanın dışında kalanlar

Tam yönetim paneli, tema düzenleyicisi, kapsamlı blog, fiyatlandırma deneyleri ve
framework geçişi ilk talep doğrulamasından sonra ihtiyaç varsa ele alınır.
Dashboard gerektirmeyen kullanım, tüm segmentlerde ortak deneyim ilkesi olarak korunur.
