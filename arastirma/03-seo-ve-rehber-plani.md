# Türkçe SEO ve rehber içerik planı

> Araştırma ajanı çıktısı (6 Ekim 2026). Siteyi yapan bütün ajanlar bunu okur.

## Özet

Ajans Flow için Türkçe SEO ve içerik planı araştırması tamamlandı: 20+ sayfalık anahtar kelime haritası, 20 rehber yazısı fikri, Next.js 16.4 için doğrulanmış teknik SEO listesi ve risk analizi. Üç kritik bulgu planı şekillendiriyor: (1) "Ajans Flow" markası Google'da henüz hiç görünmüyor, yani ilk 6-12 ayın tamamı markasız uzun kuyruk + Google İşletme Profili üzerinden kurulmalı. (2) Google, FAQPage zengin sonucunu 7 Mayıs 2026'da kaldırdı; plan FAQPage'e değil Organization/LocalBusiness/Service/BreadcrumbList/Article şemalarına yatırım yapmalı. (3) İstenen 5 ilçe × 13 hizmet kombinasyonunda konum sayfası üretmek Google'ın doorway + scaled content abuse politikalarına doğrudan giriyor; maksimum 2-3 gerçek içerikli konum sayfası öneriyorum. En büyük içerik fırsatı QR dijital menü: Türkçe SERP'i makine çevirisi uluslararası SaaS içerik çiftlikleri tutuyor, yerel gerçekliği konuşan içerik yok. En savunulabilir niş otomotiv yazılımları: rakipler 2000'ler kalıntısı Windows programları, modern web tabanlı içerik üretmiş kimse yok. Teknik tarafta en çok gözden kaçan tuzak Next.js'in streaming metadata davranışı (meta etiketleri body'ye eklenebiliyor, sosyal paylaşım önizlemelerini bozabilir). Araştırma sırasında Türkçe SEO bloglarındaki fiyat ve bütçe rakamlarının birbiriyle açıkça çeliştiğini gördüm; bunları doğrulayamadım ve siteye rakam olarak yazılmamasını, hesap yöntemi olarak anlatılmasını öneriyorum. Hiçbir dosya değiştirilmedi, kod yazılmadı.

## Bulgular

### "Ajans Flow" markası Google'da pratikte yok — strateji markasız (non-brand) kurulmalı

*Güven: kesin* · Kaynak: WebSearch sorgusu: "Ajans Flow" 4.Levent İstanbul — alakalı sonuç dönmedi

"Ajans Flow" + 4.Levent / İstanbul aramalarında markaya ait hiçbir sonuç dönmüyor; dönen sonuçlar Levent semtiyle ilgili alakasız içerikler. Sonuç: marka adı araması (brand search) henüz sıfır, dolayısıyla "ajans flow" kelimesine yatırım yapmak ilk 6-12 ay anlamsız. Trafik tamamen (a) hizmet + konum uzun kuyruk, (b) sorun odaklı rehber içeriği, (c) Google İşletme Profili / Haritalar yerel paketinden gelecek. Pratik etki: ana sayfa title'ı "Ajans Flow" ile başlamamalı; "Sosyal Medya ve Yazılım Ajansı | İstanbul Levent — Ajans Flow" gibi hizmet-önce bir kalıp kurulmalı. Markalı arama oluşana kadar (GBP + Instagram + ağızdan ağıza) ölçüm KPI'ı "marka araması sayısı" değil "GBP arama/yol tarifi/telefon" + "non-brand tıklama" olmalı.

### Anahtar kelime haritası — Ana sayfa ve kurumsal sayfalar

*Güven: muhtemel* · Kaynak: Arama hacmi doğrulanamadı (Keyword Planner/Ahrefs erişimi yok, WebSearch ABD indeksli); öncelik SERP kompozisyonuna göre verildi

ANA SAYFA (/): Birincil: "dijital ajans İstanbul" / "sosyal medya ajansı İstanbul". İkincil: "reklam ajansı Levent", "dijital pazarlama ajansı İstanbul", "sosyal medya ve yazılım ajansı". Niyet: ticari araştırma (karşılaştırma yapıyor, henüz teklif istemiyor). Sayfa bu yüzden: ne yaptığınız + kime + kanıt (işler, yorum, rakam) + tek net CTA. Hizmet listesi değil, hizmet + sektör kesişimi gösterilmeli.

/hakkimizda: Birincil: "Ajans Flow hakkında" (marka, hacim yok ama E-E-A-T için zorunlu). İkincil: "İstanbul 4.Levent dijital ajans ekibi". Niyet: bilgi + güven doğrulama. Gerçek isimler, gerçek fotoğraflar, gerçek adres, ekip kimin ne yaptığı.

/iletisim: Birincil: "Ajans Flow iletişim". İkincil: "4.Levent ajans adres", "Levent dijital ajans telefon". Niyet: işlemsel/navigasyonel. Tam NAP + harita gömme + çalışma saatleri + WhatsApp.

/isler (veya /referanslar): Birincil: "ajans portfolyo", "sosyal medya çalışma örnekleri". Niyet: ticari araştırma. Her vaka ayrı URL (/isler/[slug]) olursa hem uzun kuyruk hem Article/CreativeWork şansı doğar.

/teklif-al: noindex DEĞİL, index ama düşük öncelik; "dijital ajans teklif al".

### Anahtar kelime haritası — Hizmet sayfaları (13 sayfa, Türkçe ASCII slug)

*Güven: muhtemel* · Kaynak: Hacim doğrulanmadı; niyet sınıflandırması ve slug yapısı SERP incelemesine dayanıyor

Her satır: URL | birincil | ikincil | niyet

1) /sosyal-medya-yonetimi | "sosyal medya yönetimi" | "sosyal medya ajansı", "Instagram hesap yönetimi", "sosyal medya yönetimi fiyatları" | ticari
2) /icerik-stratejisi | "içerik stratejisi" | "sosyal medya içerik takvimi", "marka içerik planı" | ticari araştırma
3) /fotograf-cekimi | "ürün fotoğrafı çekimi İstanbul" | "kurumsal fotoğraf çekimi", "mekan çekimi", "profesyonel fotoğraf çekimi fiyatları" | ticari/işlemsel
4) /video-produksiyon | "video prodüksiyon ajansı İstanbul" | "reels çekimi", "tanıtım filmi", "sosyal medya video çekimi" | ticari/işlemsel
5) /drone-cekimi | "drone çekimi İstanbul" | "drone çekim fiyatları", "havadan çekim", "drone tanıtım videosu" | işlemsel (yüksek niyet, düşük hacim)
6) /meta-reklam-yonetimi | "Instagram reklam ajansı" | "Meta reklam yönetimi", "Facebook reklam ajansı", "Instagram reklam verme" | ticari
7) /google-ads-yonetimi | "Google Ads ajansı" | "Google reklam yönetimi", "Google Ads uzmanı İstanbul" | ticari
8) /web-sitesi-tasarimi | "web sitesi tasarımı" | "kurumsal web sitesi", "web tasarım ajansı İstanbul", "web sitesi yaptırma" | ticari
9) /yazilim-gelistirme | "özel yazılım geliştirme" | "web yazılımı", "işletmeye özel yazılım", "panel yazılımı" | ticari araştırma
10) /qr-dijital-menu | "QR menü" | "dijital menü", "QR kod menü sistemi", "restoran sipariş sistemi", "online rezervasyon sistemi" | ticari/işlemsel — SİTENİN EN DEĞERLİ SAYFASI (aşağıdaki rekabet bulgusuna bakın)
11) /kurumsal-kimlik-tasarim | "kurumsal kimlik tasarımı" | "logo tasarımı İstanbul", "marka kimliği", "grafik tasarım ajansı" | ticari
12) /google-isletme-profili-yonetimi | "Google İşletme Profili yönetimi" | "Google Haritalar'da üst sıraya çıkma", "yerel SEO", "Google Benim İşletmem" | ticari
13) /otomotiv-yazilimlari (HUB) + 4 alt sayfa:
   /otomotiv-yazilimlari/arac-degerleme | "araç değerleme yazılımı" | "ikinci el araç fiyat belirleme", "araç değer hesaplama modülü"
   /otomotiv-yazilimlari/ilan-olusturma | "oto galeri ilan yönetimi" | "araç ilanı hazırlama programı"
   /otomotiv-yazilimlari/galeri-muhasebe | "oto galeri muhasebe programı" | "galeri kar zarar takibi", "araç bazlı maliyet takibi"
   /otomotiv-yazilimlari/sahibinden-senkronizasyonu | "sahibinden ilan aktarma" | "XML ilan aktarımı", "galeri ilan senkronizasyonu", "arabam.com entegrasyonu"

KURAL: Her hizmet sayfası tek birincil kelimeye sahip olmalı; "fiyat" kelimesi gerçekten fiyat/aralık/hesap mantığı anlatılıyorsa hedeflenmeli, yoksa kullanıcı hayal kırıklığıyla geri döner (pogo-sticking).

### Anahtar kelime haritası — Sektör sayfaları (en yüksek dönüşüm potansiyeli burada)

*Güven: muhtemel* · Kaynak: Hizmet listesi görev tanımından; sektör eşleşmesi analitik çıkarım, hacim doğrulanmadı

Ajans sayfası yerine "benim işim" sayfası dönüştürür. Önerilen 6 sayfa:

/sektorler/restoran-kafe | "restoran sosyal medya yönetimi" | "kafe Instagram yönetimi", "restoran dijital pazarlama", "kafe QR menü" | ticari — QR menü + fotoğraf + Reels + GBP paketini tek sayfada birleştirir
/sektorler/oto-galeri | "oto galeri dijital pazarlama" | "galeri sosyal medya yönetimi", "oto galeri yazılımı", "araç ilanı pazarlama" | ticari — otomotiv yazılımları + reklam yönetimini birleştirir, ajansın en savunulabilir farkı
/sektorler/guzellik-salonu-klinik | "güzellik salonu sosyal medya" | "klinik Instagram reklamı", "estetik klinik dijital pazarlama" | ticari — DİKKAT: sağlık reklamı mevzuatı kısıtlı, iddia dili çok dikkatli olmalı
/sektorler/emlak | "emlak ofisi sosyal medya yönetimi" | "emlak drone çekimi", "gayrimenkul tanıtım videosu" | ticari — drone hizmetinin en doğal alıcısı
/sektorler/insaat-proje | "inşaat firması tanıtım filmi" | "proje drone çekimi", "şantiye havadan çekim"
/sektorler/e-ticaret | "e-ticaret ürün fotoğrafı" | "e-ticaret reklam yönetimi", "ürün çekimi ve reklam"

Her sektör sayfası şu iskeletle yazılmalı: o sektörün 3 gerçek sancısı → hangi hizmet hangi sancıyı çözer → o sektörden gerçek bir iş örneği → o sektöre özel SSS → sektöre özel CTA. Hizmet sayfalarının kopyası OLMAMALI (aşağıdaki doorway riskine bakın).

### Anahtar kelime haritası — Konum sayfaları ve doorway/scaled-content riski (DİKKAT)

*Güven: kesin* · Kaynak: https://developers.google.com/search/docs/essentials/spam-policies (doorway pages); ikincil: https://storerocket.io/learn/doorway-pages

İstenen konumlar: 4.Levent, Kağıthane, Şişli, Beşiktaş, Levent. Ancak Google'ın spam politikası, "farklı şehir/bölgeye yönelik neredeyse aynı sayfa kümeleri"ni açıkça doorway page olarak tanımlıyor; şablon üretimi konum sayfaları aynı anda hem doorway hem scaled content abuse ihlaline girebiliyor. Şablonun sadece yer adı değişerek çoğaltılması ihlal; her sayfanın gerçek yerel veri/gerçek fark taşıması meşru.

ÖNERİ: 20 ilçe sayfası AÇMAYIN. Maksimum 2-3 sayfa, gerçek içerikle:
- /istanbul-dijital-ajans — ana konum sayfası, ofis, hizmet bölgesi, ulaşım, İstanbul'daki gerçek müşteri örnekleri
- /levent-dijital-ajans — ofisin bulunduğu semt; burada gerçek içerik var: adres, metro (4.Levent M2), plaza çevresi, yürüme mesafesindeki müşteriler, yüz yüze toplantı teklifi
- (opsiyonel) /kagithane-dijital-ajans — YALNIZCA Kağıthane'den gerçek müşteri/iş örneği, o bölgeye özel gözlem (sanayi/oto galeri yoğunluğu gibi) yazılabiliyorsa
Şişli/Beşiktaş için ayrı sayfa açmak yerine /istanbul sayfasında "hizmet verdiğimiz bölgeler" bölümü + LocalBusiness JSON-LD'de areaServed listesi kullanın. Yerel sinyalin ana taşıyıcısı sayfa değil, Google İşletme Profili.

### Rehber (blog) içerik planı — 1-10. yazı

*Güven: muhtemel* · Kaynak: SERP incelemesi: qrcode-tiger.com (TR sayfaları), braverytechnology.com/tr/web-sitesi-fiyatlari, ideasoft.com.tr/instagram-reklam-rehberi

Format: BAŞLIK | hedef kelime | kime | neden tıklanır | H2 iskeleti

1) "QR Menü Nasıl Yapılır? Restoran ve Kafeler İçin Adım Adım Rehber" | "qr menü nasıl yapılır" (+"dijital menü oluşturma") | menüsü hâlâ basılı olan kafe/restoran sahibi | SERP'i uluslararası QR-kod SaaS içerik çiftlikleri tutuyor; hiçbiri Türkiye'ye özgü konuşmuyor (adisyon/POS entegrasyonu, Türkçe-İngilizce menü, fiyat güncelleme alışkanlığı) | H2: QR menü nedir, neyi çözer / PDF menü ile gerçek dijital menü farkı / Adım adım: menüyü hazırlama → QR üretme → masaya yerleştirme / Sipariş ve rezervasyon modülü eklemek / Ücretsiz QR üreticilerin 3 gizli maliyeti (link ölümü, reklam, istatistik yok) / Menü hızı = sipariş hızı: mobil performans / SSS

2) "PDF Menü mü, Gerçek Dijital Menü mi? Hangisi Daha Çok Satış Getirir" | "pdf menü qr kod" | 1. yazıyı okuyup "zaten PDF koydum" diyen işletme | somut karşılaştırma tablosu | H2: PDF menünün 5 sorunu / Dijital menünün ölçebildiği 4 şey / Fiyat güncellemesi: baskı maliyeti hesabı / Yükseltme kararı nasıl verilir

3) "Instagram Reklamı Ne Kadar Bütçe İster? Küçük İşletme İçin Gerçekçi Hesap" | "instagram reklam bütçesi" (+"instagram reklamı ne kadar") | ilk kez reklam verecek KOBİ sahibi | en çok sorulan, en kötü cevaplanan soru; rakam yerine HESAP yöntemi vermek fark yaratır | H2: Günlük minimum bütçe nasıl belirlenir / Bütçeyi belirleyen 4 değişken (hedef kitle genişliği, format, sezon, teklif stratejisi) / CPM, CPC ve sonuç başına maliyet farkı / 3 senaryo: kafe, oto galeri, klinik / Bütçeyi artırmanın doğru anı / Yeni başlayanın 5 bütçe hatası — ÖNEMLİ: TL rakamı yazarsanız tarih damgası + "kendi hesabınızda değişir" notu zorunlu (minimum bütçe sık değişiyor)

4) "Instagram Reklamı mı Google Ads mi? Hangi İşletme Hangisinden Kazanır" | "instagram reklamı mı google ads mi" | kısıtlı bütçeyi nereye koyacağını bilmeyen sahip | karar verdiriyor, iki hizmet sayfasına da link veriyor | H2: Talep yakalama vs talep yaratma / Hangi sektör hangisinde kazanır (tablo) / Aynı bütçeyle iki test nasıl kurulur / İkisini birlikte kullanma sırası / Ölçüm: hangi metrik hangisinde yanıltır

5) "Google Ads'te Boşa Para Harcatan 7 Ayar" | "google ads hataları" (+"google ads ajansı") | kendi kampanyasını kurup para kaybeden sahip | teşhis listesi, doğrudan hizmet satın alma niyeti doğurur | H2: Arama ağı + Display karması / Geniş eşleme ve negatif kelime eksiği / Konum hedeflemesinin "ilgi" ayarı / Dönüşüm izlemesi olmayan kampanya / Otomatik teklif için yetersiz veri / Tek reklam grubuna 50 kelime / Mobil-masaüstü ayrımsızlık / Kendi hesabınızı 20 dakikada denetleme listesi

6) "Google İşletme Profili Nasıl Açılır ve Haritalarda Üst Sıraya Nasıl Çıkılır" | "google işletme profili nasıl açılır" (+"google haritalarda üst sıra") | fiziksel mekânı olan her KOBİ | hem çok aranan hem doğrudan hizmete bağlanan konu | H2: Profil açma adımları / Doğrulama yöntemleri ve süreleri (kartpostal 20 güne kadar) / NAP tutarlılığı neden her şeyin önünde / Kategori seçimi: birincil kategori hatası / Fotoğraf, gönderi, ürün/hizmet bölümleri / Yorum yönetimi ve cevaplama / Fiziksel adresi olmayan "hizmet bölgesi işletmesi" ise ne değişir

7) "Google Yorumu Nasıl Toplanır? Yasak Olmayan Yöntemler" | "google yorum toplama" | yorum sayısı rakibinden az olan işletme | "yasak olmayan" vaadi tıklatır; sahte yorum satanların karşısına etik alternatif koyar | H2: Yorumun yerel sıralamadaki yeri / Yorum isteme zamanlaması ve kanalı / QR/kısa link ile yorum akışı / Olumsuz yoruma cevap şablonu / Yorum teşviki nerede ihlale girer

8) "Kurumsal Web Sitesi Fiyatları Neye Göre Değişir? Teklif Okuma Rehberi" | "web sitesi fiyatları" (+"kurumsal web sitesi fiyat") | 3 ajanstan 3 farklı teklif almış, kafası karışmış sahip | SERP rakam listeleyen içerikle dolu ama "neden bu kadar farklı teklif aldım" sorusunu kimse cevaplamıyor | H2: Fiyatı oluşturan 7 kalem / Hazır tema vs özel geliştirme / Teklifte mutlaka olması gereken 12 madde / Gizli maliyetler: hosting, bakım, içerik, çoklu dil, SSL / Kaynak kodu ve alan adı kimin üzerine / Teklifte uyarı veren 5 ifade

9) "Hazır Site Kurucu mu Özel Yazılım mı? KOBİ İçin Karar Tablosu" | "hazır site mi özel site mi" | bütçesi sınırlı, kararsız sahip | karar tablosu paylaşılabilir içerik | H2: Hazır kurucunun gerçekten yeterli olduğu 4 durum / Özel geliştirmenin zorunlu olduğu 4 durum / Taşınma maliyeti (veri, SEO, alan adı) / 3 yıllık toplam maliyet karşılaştırması

10) "Web Siteniz Google'da Neden Görünmüyor? 10 Maddelik Teşhis Listesi" | "sitem google'da çıkmıyor" (+"google'da bulunmuyorum") | sitesini yeni yaptırmış, panikleyen sahip | çok yüksek niyet, acil sorun; doğrudan danışmanlık satar | H2: İndeksleniyor mu: site: sorgusu ve Search Console kontrolü / robots.txt ve noindex kazaları / Yeni site için normal bekleme süresi / Aranan kelimeyi sayfa gerçekten içeriyor mu / Rakip ne kadar güçlü: beklentiyi ayarlamak / Teknik: hız, mobil, canonical / Yerel aramalar için GBP eksikliği / Hangi durumda ajans gerekir

### Rehber (blog) içerik planı — 11-20. yazı

*Güven: muhtemel* · Kaynak: Drone mevzuat detayları: iha.shgm.gov.tr ve SHT-İHA kaynaklı ikincil özetler (ffkpartnerhukuk.com.tr, hukukcularevi.com); diğer başlıklar SERP boşluk analizi

11) "Reels İçin 30 Günlük İçerik Takvimi (Restoran, Galeri, Klinik Örnekleriyle)" | "reels içerik fikirleri" (+"sosyal medya içerik takvimi") | her gün ne paylaşacağını bilmeyen işletme | indirilebilir takvim = e-posta/WhatsApp lead | H2: İçerik takviminin 4 sütunu / 30 günlük şablon / Sektöre göre uyarlama: 3 örnek / Tek çekim gününde 30 içerik üretmek / Ölçüm: hangi içerik tipi neyi büyütür

12) "Telefonla Çekilen Reels Neden İşe Yaramıyor: Işık, Ses ve Kurgu" | "reels nasıl çekilir" | kendi içeriğini çeken sahip | eleştiri değil çözüm sunar; prodüksiyon hizmetine köprü | H2: Işık: pencere kuralı / Ses telefonun en zayıf noktası / İlk 2 saniye / Dikey çerçeve hataları / Altyazı ve metin okunabilirliği / Ne zaman profesyonel çekim gerekir

13) "Ürün Fotoğrafı Çekimi: Stüdyoya Gitmeden Önce Bilmeniz Gerekenler" | "ürün fotoğrafı çekimi" (+"ürün çekimi fiyatları") | e-ticaret/üretici | hazırlık listesi niteliğinde, çekim talebine dönüşür | H2: Çekim öncesi ürün hazırlığı / Kaç kare, hangi açı, hangi oran (pazaryeri gereklilikleri) / Beyaz fon mu yaşam tarzı mı / Kullanım hakları ve dosya teslimi / Fiyatı belirleyen değişkenler

14) "Drone Çekimi İçin İzin Gerekir mi? Türkiye'de Ticari Drone Çekiminin Kuralları" | "drone çekim izni" (+"ticari drone kullanımı") | inşaat/emlak/otel sahibi ve bu işi düşünen işletme | gerçek mevzuat sorusu; sitenin en güçlü E-E-A-T sinyali | H2: SHGM İHA kayıt zorunluluğu ve ağırlık sınıfları (İHA-0: 500 g–4 kg, İHA-1: 4–25 kg …) / 500 gram eşiği ve iha.shgm.gov.tr kaydı / Ayrı izin gerektiren durumlar: kalabalık alan, askeri bölge yakını, ticari amaç / İstanbul'da yasak ve kısıtlı sahalar / Sigorta ve pilot yetkinliği / Çekim öncesi kontrol listesi / İzinsiz uçuşun yaptırımları — ZORUNLU: güncelleme tarihi + SHGM resmi kaynağına link + "mevzuat değişebilir" notu

15) "Oto Galericiler İçin Araç Değerleme: Fiyatı Doğru Koymanın Yolu" | "araç değerleme" (+"ikinci el araç fiyat belirleme") | galeri sahibi / plaza | sektörel, rekabeti düşük, doğrudan otomotiv yazılımına bağlanır | H2: Fiyatı belirleyen 6 değişken (km, hasar kaydı, donanım, renk, sezon, talep) / Pazar verisini okuma / Stok yaşlanma maliyeti / Değerlemeyi yazılımla standartlaştırmak / Müşteriye fiyatı savunma

16) "Sahibinden ve arabam.com'a İlanları Tek Panelden Göndermek: Senkronizasyon Nasıl Çalışır" | "sahibinden ilan aktarma" (+"xml ilan aktarımı", "galeri ilan senkronizasyonu") | 20+ araçlı galeri, her ilanı elle giren | hacim düşük ama niyet çok yüksek; rakip içerik neredeyse yok | H2: Elle ilan girmenin gerçek maliyeti (süre × ilan) / XML/feed mantığı nasıl çalışır / Satılan aracın otomatik düşmesi / Fotoğraf ve açıklama standardı / Entegrasyon kurarken dikkat edilecekler / Platform kurallarına uyum

17) "Galeri Muhasebesi: Araç Bazlı Kâr-Zarar Takibi Nasıl Kurulur" | "oto galeri muhasebe programı" (+"galeri kar zarar takibi") | galeri sahibi, Excel'le boğuşan | somut tablo yapısı verir | H2: Araç bazlı maliyet kalemleri / Çek-senet ve cari takibi / Konsinye araç / Aylık kapanış rutini / Yazılıma geçiş: hangi veriyi taşımalı

18) "Kurumsal Kimlik Nedir, Logodan Farkı Ne? KOBİ İçin Minimum Set" | "kurumsal kimlik nedir" (+"logo tasarımı") | yeni kurulan işletme | tanım + alışveriş listesi | H2: Logo, kurumsal kimlik, marka: üç ayrı şey / Minimum set: logo varyasyonları, renk, tipografi, kullanım kuralları / Sosyal medya ve basılı uyarlamalar / Dosya formatları ve teslimat / Yeniden tasarım ne zaman gerekir

19) "Ajans Teklifi Nasıl Okunur: Sosyal Medya Yönetimi Paketlerinde Nelere Bakılır" | "sosyal medya yönetimi fiyatları" (+"sosyal medya ajansı seçimi") | ajans arayan sahip | şeffaflık = güven; kendinizi karşılaştırmaya davet etmek güçlü bir konumlanma | H2: Pakette sayılması gereken kalemler (içerik sayısı, çekim günü, revizyon, reklam yönetim ücreti) / "Reklam bütçesi dahil" tuzağı / Raporlama sıklığı / Hesap sahipliği: Meta/Google varlıkları kimin / Sözleşme süresi ve çıkış / 10 soruluk ajans mülakatı

20) "KOBİ İçin Aylık Dijital Rapor: Gerçekten Önemli 8 Metrik" | "sosyal medya raporu" (+"dijital pazarlama metrikleri") | ajanstan rapor alıp anlamayan sahip | vanity metrik eleştirisi ilgi çeker | H2: Takipçi sayısı neden en zayıf metrik / Erişim, etkileşim, kaydetme, paylaşma / Siteye gelen trafik ve kaynak / Dönüşüm: form, telefon, WhatsApp, yol tarifi / Reklam: sonuç başına maliyet / GBP metrikleri / Ayda bir bakılacak tek tablo

YAYIN RİTMİ ÖNERİSİ: haftada 1 yazı, ilk 8 hafta 1-3-6-8-10-14-16-19 sırasıyla (en yüksek niyetliler önce). Her yazı tek bir hizmet sayfasına ve bir sektör sayfasına bağlanmalı.

### Teknik SEO — Next.js 16 Metadata API (doğrulanmış API yüzeyi)

*Güven: kesin* · Kaynak: https://nextjs.org/docs/app/api-reference/functions/generate-metadata (v16.4.0)

Next.js dokümantasyonu şu an 16.4.0 (son güncelleme 2026-08-19/18) ve şunları doğrulanmış olarak sunuyor:

ROOT (app/layout.tsx):
- metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!) — ZORUNLU. Göreli yol kullanıp metadataBase tanımlamazsanız BUILD HATASI alırsınız. Mutlak URL verilen alanlarda metadataBase yoksayılır.
- title: { default: "...", template: "%s | Ajans Flow" }
- description, openGraph: { locale: "tr_TR", type: "website", siteName, url, images }
- twitter: { card: "summary_large_image" }
- robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } }
- verification: { google: "...", yandex: "..." } → çıktı: <meta name="google-site-verification"> ve <meta name="yandex-verification">
- <html lang="tr">

HER SAYFA: alternates: { canonical: "/sosyal-medya-yonetimi" } — göreli yol metadataBase ile birleşir, <link rel="canonical"> üretir. İstisnasız her sayfada olmalı; parametreli URL'ler (utm_*) de parametresiz canonical'a işaret etmeli.

DİNAMİK SAYFALAR (rehber/[slug]): generateMetadata + generateStaticParams. Sayfa prerender edilebiliyorsa ve generateMetadata dinamik davranış getirmiyorsa metadata ilk HTML'e dahil edilir.

viewport: metadata içindeki viewport Next 14'ten beri deprecated — generateViewport/viewport export kullanılmalı.

### Teknik SEO — Streaming metadata uyarısı (gözden kaçan tuzak)

*Güven: kesin* · Kaynak: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata

Next.js 15.2'den beri generateMetadata'nın sonucu STREAM edilebiliyor: metadata çözüldüğünde etiketler <head> yerine <body>'ye EKLENİYOR. Next.js dokümantasyonu bunun Googlebot gibi JavaScript çalıştırıp tüm DOM'u inceleyen botlar tarafından doğru yorumlandığını doğruluyor. ANCAK JavaScript çalıştırmayan "HTML-limited" botlar (ör. facebookexternalhit) için metadata sayfa render'ını bloklar ve <head>'e yazılır; Next.js bu botları User-Agent ile otomatik tanıyor.

PRATİK SONUÇ (bu site için önemli, çünkü ajans işinin yarısı sosyal paylaşım): WhatsApp/Instagram/LinkedIn önizlemeleri kritik. İki güvenli yol:
(a) Ana sayfa ve hizmet sayfalarının metadata'sını STATİK `export const metadata` yapın (generateMetadata kullanmayın) — streaming devreye girmez.
(b) Rehber yazılarında generateMetadata kullanıyorsanız veriyi 'use cache' ile önbellekleyin; o zaman metadata ilk HTML'e girer.
Son çare olarak next.config.ts'de htmlLimitedBots: /.*/ ile streaming tamamen kapatılabilir ama bu TTFB'yi ve dolaylı olarak LCP'yi kötüleştirir — doküman bunu "ileri seviye, varsayılan yeterli" diye işaretliyor.

Ayrıca: Cache Components açıksa, generateMetadata runtime verisine (cookies/headers/searchParams) dokunuyor ve sayfanın kalanı tamamen prerender edilebiliyorsa Next.js açık bir seçim yapmanızı isteyip HATA fırlatır.

### Teknik SEO — sitemap.ts ve robots.ts (doğrulanmış API)

*Güven: kesin* · Kaynak: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (v16.4.0)

app/sitemap.ts — döndürülen her nesne: { url, lastModified?, changeFrequency?, priority?, alternates?: { languages }, images?: string[], videos?: Videos[] }. TypeScript tipi: MetadataRoute.Sitemap.
NOT: sitemap.js özel bir Route Handler'dır ve varsayılan olarak CACHE'LENİR (request-time API veya dynamic config kullanmadığı sürece).

ÖNERİLEN YAPI (tek sitemap yeterli; generateSitemaps sadece 50.000 URL üstü için gerekir, bu sitede gerekmez):
- Statik sayfalar elle listelenmeli (ana, hizmetler, sektörler, konum, hakkında, iletişim, rehber index)
- Rehber yazıları veritabanından/CMS'ten çekilmeli
- lastModified GERÇEK güncelleme tarihi olmalı. `new Date()` yazarsanız her build'de tüm tarihler değişir ve lastmod sinyali değersizleşir (hatta güvenilmez hale gelir). İçeriğin updatedAt alanını kullanın.
- images alanı ile portfolyo/çekim görsellerini image sitemap olarak verin — fotoğraf/video ajansı için Görseller sekmesinden trafik getirir.
- videos alanı ile tanıtım videolarını verin (title, thumbnail_loc, description zorunlu alanlar).
- priority/changeFrequency: Google bunlara büyük ağırlık vermiyor; abartmayın, 1.0'ı sadece ana sayfaya verin.

app/robots.ts:
- Allow: "/"
- Disallow: "/api/", "/panel", "/giris", "/teklif-al/tesekkur" (teşekkür sayfası), "/*?utm_*" gerekmez (canonical çözer)
- sitemap: `${SITE}/sitemap.xml`, host: SITE
- Yapay zeka tarayıcıları için ayrı kural istenirse bilinçli karar verilmeli (ajans için AI Overviews/ChatGPT görünürlüğü muhtemelen istenir → engellemeyin).

Ayrıca app/opengraph-image.tsx ile dinamik OG görseli üretilebilir (rehber yazıları için başlık basılı OG kartı → sosyalde tıklama oranı artar).

### Teknik SEO — hreflang GEREKMİYOR (şimdilik)

*Güven: muhtemel* · Kaynak: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (localized sitemap bölümü); hreflang gerekliliği standart Google rehberliği

Site tek dilli (Türkçe) ve tek ülkeye (Türkiye) hitap ediyorsa hreflang/alternates.languages GEREKMEZ ve eklenmesi fayda sağlamaz. Yapılması gereken tek şey <html lang="tr"> ve openGraph.locale = "tr_TR".

İleride İngilizce versiyon eklenirse (ajansın yurt dışı müşteri hedefi varsa) yapılacaklar: /en/ alt dizini (alt alan adı değil), her sayfada alternates.languages = { "tr-TR": "/...", "en-US": "/en/...", "x-default": "/..." }, sitemap.ts'de alternates.languages (Next 14.2'den beri destekli, xhtml:link rel=alternate çıktısı üretir), ve İNGİLİZCE İÇERİĞİN GERÇEKTEN ÇEVRİLMİŞ olması. Makine çevirisi ile çoğaltılmış ikinci dil, scaled content riski doğurur.

UYARI: Türkçe URL'lerde Türkçe karakter KULLANMAYIN. ASCII slug kullanın: /icerik-stratejisi (içerik-stratejisi değil), /kurumsal-kimlik-tasarim, /fotograf-cekimi. Türkçe karakterli URL percent-encoding ile çirkinleşir, paylaşımda bozulur, bazı araçlarda eşleşme sorunu yapar.

### Teknik SEO — Yapısal veri: FAQPage zengin sonucu KALDIRILDI (plan buna göre kurulmalı)

*Güven: kesin* · Kaynak: https://developers.google.com/search/docs/appearance/structured-data/faqpage ("This feature will no longer appear in Google Search starting May 7, 2026."); https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/

ÖNEMLİ DEĞİŞİKLİK: Google'ın kendi dokümantasyonu FAQPage zengin sonucunun 7 Mayıs 2026'dan itibaren Google Arama'da GÖSTERİLMEDİĞİNİ belirtiyor; Haziran 2026'da özellik dokümantasyonu tamamen kaldırıldı, Search Console API desteği Ağustos 2026'da sonlandırılıyor. Mevcut FAQ işaretlemesini kaldırmanız gerekmez ama görsel bir kazanç üretmez.

SONUÇ: SSS bölümleri yine YAZILMALI — ama SEO zengin sonucu için değil; (a) kullanıcı deneyimi, (b) AI Overviews / yapay zeka asistanlarında alıntılanma, (c) uzun kuyruk soru eşleşmesi için. FAQPage JSON-LD'yi ekleyin ama ondan zengin sonuç beklemeyin ve bütçe/zamanı buraya yığmayın.

KURULACAK ŞEMALAR (önem sırasına göre):
1. Organization — root layout'ta, @id ile (ör. https://site/#kurulus): name, legalName, url, logo, image, telephone, email, address (PostalAddress: 4.Levent/Kağıthane, İstanbul, TR), sameAs (Instagram, LinkedIn, Google İşletme Profili linki), foundingDate
2. LocalBusiness — daha spesifik alt tür kullanın: ProfessionalService (veya MarketingAgency; Schema.org'da resmi olmayan türlerden kaçının). İletişim sayfasında: tam NAP, geo (latitude/longitude), openingHoursSpecification, areaServed (İstanbul + ilçe listesi), priceRange, hasMap. 2026'da hâlâ zengin sonuç üretebilen türler arasında.
3. Service — her hizmet sayfasında: name, serviceType, description, provider → { "@id": organization @id }, areaServed, hasOfferCatalog (alt hizmetler). Service'in kendisi zengin sonuç üretmez ama varlık ilişkisini (entity graph) kurar — AI arama görünürlüğü için değerli.
4. BreadcrumbList — her alt sayfada; hâlâ aktif zengin sonuç türü, SERP'te URL yerine kırıntı yolu gösterir.
5. Article / BlogPosting — her rehber yazısında: headline, description, image, datePublished, dateModified, author (GERÇEK bir Person, @id ile; "Ajans Flow Ekibi" zayıf sinyal), publisher → Organization, mainEntityOfPage. 2026'da aktif türler arasında.
6. WebSite + potentialAction (SearchAction) — site içi arama varsa.
7. FAQPage — ekleyin, ama beklenti düşük (yukarı bakın).

UYGULAMA: JSON-LD'yi server component içinde <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} /> olarak render edin. Kullanıcı girdisi içeriyorsa (yorum vb.) `<` karakterini kaçışlayın. @id kullanarak şemaları birbirine bağlayın — dağınık ada şemalar yerine tek bağlı graf.

### Teknik SEO — Search Console doğrulaması ve Google İşletme Profili bağlantısı

*Güven: muhtemel* · Kaynak: https://support.google.com/business/?hl=tr; https://developers.google.com/my-business/content/locations-setup?hl=tr; https://www.hostragons.com/blog/google-haritalar-local-seo-kaydi-yerel-aramalarda-ust-sira/ — kartpostal süresi ve e-posta doğrulama detayları ikincil kaynaklardan, Google'ın kendi dokümanıyla teyit edilmeli

SEARCH CONSOLE:
1. ÖNCE Domain property (DNS TXT) kurun — alan adının tüm alt alan adlarını ve http/https varyantlarını tek seferde kapsar; Vercel'de DNS sağlayıcınızda TXT kaydı. Bu en sağlam yöntem.
2. Ek olarak URL prefix property kurun (https://www.site.com/) — bazı raporlar (URL denetimi, kaldırma) prefix property'de daha kullanışlı. Doğrulama için metadata.verification.google kullanın → <meta name="google-site-verification">. Bu etiketi SİLMEYİN, doğrulama geri alınır.
3. Doğrulama sonrası: sitemap.xml gönder → "Sayfa indeksleme" raporunu haftalık izle → "Performans" raporunda sorgu verisi 16 ay saklanır → "Core Web Vitals" raporunu kontrol et.
4. Bing Webmaster Tools'u da kurun (Search Console'dan içe aktarma var). Türkiye'de Yandex payı ihmal edilebilir değil → metadata.verification.yandex ile Yandex Webmaster.

GOOGLE İŞLETME PROFİLİ (yerel trafiğin ANA kaynağı, siteden daha önemli):
- Fiziksel ofis varsa (4.Levent) adres doğrulaması posta/kartpostal ile yapılır; kartpostalın ulaşması 20 güne kadar sürebilir — bu yüzden profili SİTE BİTMEDEN AÇIN, paralel yürüsün.
- İşletme adı, adres, telefon (NAP) sitede, GBP'de, Instagram'da, firma rehberlerinde ve faturada HARFİ HARFİNE aynı yazılmalı. Profili açıp sonradan ad/adres/telefon değiştirmek yerel SEO'da en pahalı hata.
- Birincil kategori seçimi kritik: "Reklam ajansı" / "Dijital pazarlama ajansı" / "Yazılım şirketi" arasından İŞİN ÇOĞUNLUĞUNU yapan tek kategori birincil, diğerleri ikincil.
- GBP → site bağlantısı: web sitesi alanına ana sayfa; "Hizmetler" bölümündeki her hizmeti ilgili hizmet sayfasına bağlayın. UTM parametresi ekleyebilirsiniz (?utm_source=google&utm_medium=gbp) ama o URL'in canonical'ı PARAMETRESİZ kalmalı.
- Sitede LocalBusiness JSON-LD içinde sameAs olarak GBP/Google Haritalar linkini verin — varlık eşleşmesini güçlendirir.
- Fiziksel ofisi müşteri ziyaretine kapalı tutmak istenirse "hizmet bölgesi işletmesi" olarak kurulabilir; o durumda adres gizli kalır ve doğrulama e-posta ile yapılabilir. Ancak ajans için GÖRÜNÜR ofis adresi bir güven sinyalidir — 4.Levent adresini göstermeyi öneririm.

### Teknik SEO — Sayfa hızı: eşikler ve bu site için somut yapılacaklar

*Güven: kesin* · Kaynak: CWV eşikleri: web.dev/Chrome resmi tanımları (ikincil teyit: https://ppc.land/core-web-vitals/, https://www.shno.co/marketing-statistics/core-web-vitals-statistics)

EŞİKLER (75. persentil, GERÇEK kullanıcı verisi / CrUX — lab verisi değil):
- LCP: iyi ≤ 2,5 s | geliştirilmeli 2,5–4,0 s | kötü > 4,0 s
- INP: iyi ≤ 200 ms | geliştirilmeli 200–500 ms | kötü > 500 ms (INP, 12 Mart 2024'te FID'in yerini aldı)
- CLS: iyi ≤ 0,1 | geliştirilmeli 0,1–0,25 | kötü > 0,25
Değerlendirme hem sayfa hem köken (origin) düzeyinde yapılır. CWV bir eşitlik bozucu sinyal — içerik kalitesi benzer olduğunda fark eder, tek başına sıralama kazandırmaz.

BU SİTE İÇİN RİSK: Ajans sitesi = ağır görsel + video + animasyon. En olası iki sorun LCP (hero görseli/videosu) ve CLS (font + görsel boyutu).

YAPILACAKLAR:
- next/image her yerde; width/height veya fill + aspect-ratio ZORUNLU (CLS). Hero görseline priority. AVIF/WebP. sizes doğru yazılmalı yoksa gereksiz büyük dosya iner.
- next/font ile yerel barındırılan font (display: swap + fallback metrikleri) — Google Fonts'u <link> ile çekmek FOUT + CLS üretir.
- Hero'da otomatik oynayan video KULLANMAYIN veya poster + preload="none" + kullanıcı etkileşimiyle yükleyin. Portfolyo videolarını (YouTube/Vimeo) lazy facade ile sarın (tıklamadan önce iframe yüklenmesin) — aksi halde 1 MB+ üçüncü taraf JS iner.
- Meta Pixel / GA4 / Google Ads etiketlerini next/script strategy="afterInteractive" ile; sohbet/widget script'lerini "lazyOnload" ile. INP'nin en büyük düşmanı üçüncü taraf script.
- Ana sayfa ve hizmet sayfaları TAMAMEN statik prerender (SSG) olmalı. Rehber yazıları ISR / 'use cache'. İndekslenmesi gereken hiçbir içerik yalnızca client-side render edilmemeli.
- Ağır animasyon kütüphaneleri (GSAP, Framer Motion, Three.js) dynamic(() => ..., { ssr: false }) ile ve yalnızca kullanıldığı rotada.
- Mobil öncelik: ölçümü mobilde yapın. Mobil CWV geçme oranı masaüstünden belirgin düşük.
- Vercel Analytics / Speed Insights veya CrUX + PageSpeed Insights ile ALAN verisini izleyin; Lighthouse skoruna değil alan verisine bakın.

### Rekabet analizi — QR dijital menü: sitenin en büyük SEO fırsatı

*Güven: muhtemel* · Kaynak: WebSearch SERP incelemesi: qrcode-tiger.com/tr/*, menulux.com, spendbase.co (ChoiceQR), canva.com/tr_tr

"QR menü nasıl yapılır" ve "dijital menü" Türkçe SERP'ini neredeyse tamamen ULUSLARARASI SaaS içerik çiftlikleri tutuyor (qrcode-tiger.com'un TR çevirileri ilk sayfanın çoğunu kaplıyor — 6+ sonuç tek alan adından), yanında Canva gibi genel araçlar var. Türkiye pazarına özgü gerçek oyuncular (Menulux, Adisyo, ChoiceQR) ürün sayfalarıyla var ama "nasıl yapılır" tipi bilgi niyetli sorgularda zayıf.

FIRSAT: Makine çevirisi kokan, Türkiye gerçeğinden kopuk içeriğe karşı GERÇEK Türkçe, gerçek işletme detaylı içerik (adisyon/POS entegrasyonu, Türk mutfağı menü yapısı, fiyat güncelleme sıklığı, garson çağırma, Türkçe-İngilizce-Arapça menü, turist yoğun bölgelerde QR davranışı) yazılırsa bu SERP'te yer almak realist.

Ayrıca Menulux gibi oyuncuların zayıf noktası: hazır SaaS. Ajans Flow'un farkı "sipariş ve rezervasyon modülleriyle, işletmeye özel QR menü" — yani kıyaslama içeriği (/qr-dijital-menu sayfasında "hazır QR menü uygulaması vs özel QR menü" bölümü) hem dönüştürür hem uzun kuyruk yakalar.

RESTORAN/KAFE, bu sitenin paket satabileceği en iyi dikey: QR menü + fotoğraf çekimi + Reels + Meta reklamı + Google İşletme Profili yönetimi tek müşteride birleşiyor. /sektorler/restoran-kafe sayfası ana dönüşüm sayfası olarak kurgulanmalı.

### Rekabet analizi — Otomotiv yazılımları: düşük hacim, çok düşük rekabet, çok yüksek niyet

*Güven: muhtemel* · Kaynak: WebSearch SERP: tamindir.com (LUQU/ProGaleri/Microm), tr.motor1.com/news/481685 (Cardata değerleme modülü), zunapro.com

"galeri yazılımı / araç değerleme / sahibinden ilan aktarma" aramalarında SERP'i 2000'ler kalıntısı Windows masaüstü programları (LUQU Oto Galeri, ProGaleri, Microm Oto Galeri — tamindir.com indirme sayfaları üzerinden) tutuyor. Modern, web tabanlı, içerik üretmiş bir oyuncu yok. Cardata gibi değerleme modülü sağlayıcıları var ama bayi/distribütör odaklı.

SONUÇ: Bu küme arama hacmi düşük (doğrulanmadı — ölçemedim) ama (a) rekabet neredeyse yok, (b) arayan kişi doğrudan satın alma niyetinde bir işletme sahibi, (c) ajansın en savunulabilir farkı bu. Hizmet sayfası + 3 rehber yazısı (15, 16, 17) ile bu nişte kısa sürede otorite olunabilir. Ortalama müşteri değeri sosyal medya paketinden yüksek olacağı için dönüşüm başına değer çok yüksek.

ÖNERİ: /otomotiv-yazilimlari altında 4 alt sayfa + /sektorler/oto-galeri hub sayfası; XML/feed entegrasyonunun gerçekten çalıştığına dair ekran görüntüleri ve (izin alınarak) gerçek galeri referansı. Teknik doğruluk burada satış argümanı — "XML ile Sahibinden/arabam.com'a otomatik aktarım" ve "satılan araç otomatik satıldı işareti" gibi somut işleyiş anlatılmalı.

### RİSK 1 — Asılsız iddia ve doğrulanamayan rakamlar (en büyük hukuki+SEO riski)

*Güven: doğrulanmadı* · Kaynak: Çelişen ikincil kaynaklar: ideasoft.com.tr/instagram-reklam-rehberi, dynamoi.com, braverytechnology.com/tr/web-sitesi-fiyatlari, godaddy.com/resources/tr — hiçbiri birincil kaynakla teyit edilemedi

KAÇINILACAK İFADELER: "%300 büyüme garantisi", "1 ayda Google'da ilk sayfa", "garantili ilk sıra", "Google onaylı/sertifikalı ajans", "Meta iş ortağı" (Google Partner ve Meta Business Partner gerçek programlar — şartları karşılanmadan bu ibareler kullanılamaz), "Türkiye'nin en iyi ajansı", "500+ mutlu müşteri" (sayı doğruysa bile kanıtlanabilir olmalı).

ARAŞTIRMADA GÖRDÜĞÜM SOMUT TUZAK: Türkçe SEO bloglarında dolaşan rakamlar birbiriyle ÇELİŞİYOR. Örnek: Instagram reklamı günlük minimum bütçesi için aynı arama sonucunda "20-30 TL" ve "65 TL'ye yükseltildi" iddialarına birlikte rastladım; web sitesi fiyatı için "3.000–8.000 TL", "8.000–45.000 TL", "15.000–200.000 TL", "30.000–80.000 TL" aralıkları aynı anda dolaşıyor. Bu rakamların HİÇBİRİNİ birincil kaynaktan doğrulayamadım. Rehber yazılarında bu tür rakamları kesin gerçek gibi yazarsanız (a) kısa sürede yanlış olur, (b) "ajans bile bilmiyor" izlenimi verir, (c) tüketiciyi yanıltıcı ticari beyan riski doğar (Türkiye'de ticari reklamlarda iddiaların ispat yükümlülüğü var — kesin yönetmelik maddesi doğrulanmadı, hukuk danışmanına teyit ettirin).

DOĞRU YÖNTEM: Rakam yerine HESAP YÖNTEMİ yazın ("bütçeniz şu 4 değişkenle belirlenir", "şu formülle hesaplayın"). Rakam verecekseniz: platformun RESMİ sayfasına link + görünür güncelleme tarihi + "değişebilir" notu. Vaka çalışmasında sayı kullanacaksanız müşteri YAZILI İZNİ + ölçümün kaynağı (hangi panel, hangi tarih aralığı) belirtilmeli. Müşteri logosu izinsiz kullanılmamalı.

### RİSK 2 — Kopya içerik, şablon çoğaltma ve scaled content abuse

*Güven: kesin* · Kaynak: https://developers.google.com/search/docs/essentials/spam-policies; ikincil: https://storerocket.io/learn/doorway-pages, https://digitalshiftmedia.com/search-intelligence/google-june-2026-spam-update-home-services/ (Haziran 2026 güncellemesi iddiası doğrulanmadı)

Google'ın spam politikalarında her sürümde masada kalan iki ihlal: doorway pages ve scaled content abuse. Şablon üretimi konum sayfaları ikisine de aynı anda girebiliyor — sadece yer tutucu değiştiğinde doorway olur; her sayfa gerçek yerel veri/gerçek fark taşıdığında meşru kalır. Haziran 2026 spam güncellemesinin özellikle bu ihlalleri hedeflediği bildiriliyor (ikincil kaynak, doğrulanmadı).

BU SİTEDEKİ SOMUT RİSKLER:
- 13 hizmet × 5 ilçe = 65 sayfa üretme isteği → KESİNLİKLE YAPMAYIN. Doorway.
- Rakip ajans sitelerinden hizmet açıklaması kopyalama (sektörde çok yaygın) → değer katmayan yinelenen içerik.
- 20 rehber yazısının tamamını yapay zekâya tek seferde yazdırıp yayınlama → scaled content abuse. Yapay zekâ kullanmak yasak değil; İNSAN KATKISI OLMADAN ÖLÇEKTE üretmek ihlal. Her yazıda ajansın kendi işinden gerçek örnek, gerçek ekran görüntüsü, gerçek sayı olmalı.
- Aynı SSS bloğunu 13 hizmet sayfasına kopyalama.
- Sektör sayfalarını hizmet sayfalarının kelime değiştirilmiş kopyası yapma.

KONTROL: Yayından önce her sayfanın en az %70'i o sayfaya özgü olmalı. Tekrarlayan bileşenleri (CTA, ekip, iletişim) şablon bileşeni olarak tutun — bunlar sorun değil; SORUN gövde metninin tekrarı.

### RİSK 3 — Aşırı anahtar kelime kullanımı ve diğer eski taktikler

*Güven: kesin* · Kaynak: https://developers.google.com/search/docs/essentials/spam-policies (keyword stuffing, link spam, hidden text)

KAÇINILACAKLAR:
- Footer'da ilçe/kelime listesi: "İstanbul sosyal medya ajansı, Levent sosyal medya ajansı, Kağıthane sosyal medya ajansı, Şişli sosyal medya ajansı…" → klasik keyword stuffing, hem işe yaramıyor hem risk.
- Title'da kelime tekrarı: "Sosyal Medya Yönetimi | Sosyal Medya Ajansı | Sosyal Medya İstanbul" → tıklama oranını düşürür, Google title'ı yeniden yazar.
- alt metnine kelime doldurma. alt, görseli GÖRMEYEN birine görseli anlatmak içindir — erişilebilirlik gereği. "4.levent sosyal medya ajansı dijital pazarlama" yazmak ihlal.
- Beyaz üstüne beyaz metin, display:none ile gizli kelime bloğu, 0px font.
- meta keywords etiketi (Google 2009'dan beri kullanmıyor; Next.js metadata'da keywords alanı var ama Google için değersiz — zararsız, ama buna zaman harcamayın).
- Yapay anchor text: her sayfadan "İstanbul dijital ajans" metniyle ana sayfaya link. Doğal, bağlama uygun bağlantı metni kullanın.
- Satın alınmış backlink / link ağları / "500 backlink 500 TL" paketleri → link spam ihlali, en pahalı hata.
- Sahte Google yorumu / yorum karşılığı indirim (yorum teşviki Google politikası ihlali, ayrıca tüketici mevzuatı sorunu).

DOĞRU ÖLÇÜ: birincil kelime title'da bir kez, H1'de bir kez, ilk paragrafta bir kez, gövdede doğal akışta 2-4 kez. Eşanlamlı ve ilişkili ifadeleri (sosyal medya ajansı / sosyal medya yönetimi / içerik üretimi) doğal kullanın — kelime sayısı değil konu kapsamı önemli.

### RİSK 4 — Zamana bağlı içerik ve sektörel mevzuat (fotoğraf/video/drone/sağlık)

*Güven: muhtemel* · Kaynak: iha.shgm.gov.tr / SHT-İHA kaynaklı ikincil özetler: ffkpartnerhukuk.com.tr, hukukcularevi.com, eleman.net — resmi SHGM metniyle teyit edilmeli; sağlık reklamı ve KVKK kısmı doğrulanmadı, hukuk danışmanı gerekli

- DRONE: SHGM mevzuatı (SHT-İHA, 2920 sayılı Türk Sivil Havacılık Kanunu) değişiyor; 500 g üzeri İHA'lar için iha.shgm.gov.tr kaydı, ticari kullanımda ek izin, yasak sahalar, para cezasından cihaza el konulmasına uzanan yaptırımlar söz konusu. Hem drone HİZMET sayfasında hem 14. rehber yazısında: görünür güncelleme tarihi + SHGM resmi kaynağına link + "mevzuat değişebilir, güncel durumu SHGM'den teyit edin" notu zorunlu. Kendi uçuşlarınızın kayıtlı/izinli olduğunu belirtmek güçlü bir güven sinyali (ama doğru değilse yazmayın).
- SAĞLIK/ESTETİK sektör sayfası: Türkiye'de sağlık hizmeti reklamı ciddi şekilde kısıtlı. "Öncesi-sonrası" görsel kullanımı ve tedavi vaadi içeren dil müşterinizi de sizi de riske atar. Bu sayfada "hasta kazandırma" değil "mevzuata uygun tanıtım" dili kullanın; mevzuat teyidi alınmadan yayınlamayın (doğrulanmadı — hukuk danışmanı gerekli).
- GÖRSEL KULLANIMI: Fotoğraf/video ajansı için stok fotoğrafını "bizim işimiz" gibi sunmak itibar intiharı. Portfolyoda yalnızca kendi ürettiğiniz işler; stok görsel kullanılıyorsa dekoratif alanlarda kullanın ve iş örneği olarak sunmayın. Müşteri işlerinin yayın hakkı sözleşmede olmalı.
- KİŞİSEL VERİ: İletişim/teklif formları KVKK aydınlatma metni + açık rıza kutusu gerektirir; çerez bildirimi (GA4/Meta Pixel varsa) zorunlu. Gizlilik politikası ve çerez politikası sayfaları açılmalı (bunlar noindex OLMASIN, güven sinyali).
- İÇERİK BAKIMI: Fiyat, platform limiti, mevzuat içeren yazılara 6 ayda bir gözden geçirme takvimi kurun; dateModified'ı GERÇEKTEN güncellediğinizde değiştirin (yalancı tarih güncellemesi sinyal kirliliği).

### Mevcut kod tabanı bağlamı — yeni site ayrı proje olmalı

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/ajansflow-next/README.md, /Users/ajansflow/Desktop/yazılımlar/ajansflow-next/src/app/, /Users/ajansflow/Desktop/yazılımlar/ajansflow/

/Users/ajansflow/Desktop/yazılımlar/ajansflow-next bir KURUMSAL SİTE DEĞİL: ajansın İÇ yönetim paneli (müşteri, görev, içerik takvimi, gelir-gider, borç-alacak). Next.js App Router + Postgres, Vercel'e deploy için hazırlanmış. Rotalar: src/app/(app)/{takvim,raporlar,notlar,gorevler,musteriler,hedefler,musteri-bulma,videolar,borclar,ayarlar,finans,kasa}, src/app/login, src/app/t/[kod], src/app/tanitim, src/app/api/health.

/Users/ajansflow/Desktop/yazılımlar/ajansflow eski statik bir site (index.html + css/js, serve.py ile servis ediliyor).

SEO AÇISINDAN SONUÇLAR:
1. Yeni kurumsal site AYRI bir Next.js projesi ve AYRI bir deploy olmalı. Paneli aynı alan adının altında tutmak (site.com/panel) crawl ve güvenlik karmaşası yaratır; panel panel.site.com veya ayrı alan adında olsun, robots'ta Disallow + login duvarı arkasında.
2. ajansflow-next içindeki src/app/tanitim rotası kamuya açık bir tanıtım sayfasıysa ve indekslenmişse, yeni siteye 301 yönlendirilmeli (indekslenip indekslenmediğini site: sorgusuyla kontrol edin).
3. src/app/t/[kod] kısa link rotası görünüyor — bunlar robots.ts'de Disallow edilmeli, canonical hedefe 301 vermeli ve sitemap'e GİRMEMELİ.
4. Eski statik sitenin yayında olduğu bir alan adı/URL varsa, yeni siteye sayfa-sayfa 301 planı yapılmalı; toptan ana sayfaya yönlendirme indeks kaybı yaratır.
5. README'de kullanıcı adları ve başlangıç şifreleri (eren1234 vb.) düz metin duruyor ve paneldeki şifre sıfırlama akışı anlatılıyor. Bu dosya kamuya açık bir repoya veya yayına çıkarsa ciddi güvenlik sorunu olur. Yeni kurumsal site projesine bu tür dosya taşınmamalı. (Bu bir SEO bulgusu değil ama gözüme çarptı, bildirmem gerekiyordu.)

## Sitede nasıl kullanılmalı

- Site mimarisini üç katmanlı kur: HİZMET sayfaları (13 adet, /sosyal-medya-yonetimi ... /otomotiv-yazilimlari/*) + SEKTÖR sayfaları (6 adet, /sektorler/*) + KONUM sayfaları (en fazla 2-3 adet). Dönüşümün çoğu sektör sayfalarından gelecek çünkü işletme sahibi "video prodüksiyon" değil "restoranımın müşterisi artsın" diye arıyor.
- Konum sayfası sayısını 2-3'te tut: /istanbul-dijital-ajans ve /levent-dijital-ajans (ofis gerçekten orada, metro-plaza-yüz yüze toplantı gibi gerçek içerik var). Şişli/Beşiktaş/Kağıthane için ayrı sayfa AÇMA; /istanbul sayfasında "hizmet verdiğimiz bölgeler" bölümü + LocalBusiness JSON-LD'de areaServed listesi kullan. 13 hizmet × 5 ilçe şablonu Google'ın doorway politikasına doğrudan giriyor.
- URL slug'larını ASCII yaz: /icerik-stratejisi, /fotograf-cekimi, /kurumsal-kimlik-tasarim. Türkçe karakterli URL paylaşımda bozulur ve percent-encoding karmaşası yaratır.
- Ana sayfa title'ını marka ile başlatma; "Sosyal Medya ve Yazılım Ajansı | İstanbul Levent — Ajans Flow" kalıbını kullan. Marka araması henüz sıfır, hizmet-önce kalıp gerekiyor.
- Root layout'ta metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!) tanımla — yoksa göreli canonical yolları BUILD HATASI verir. Her sayfaya istisnasız alternates.canonical ekle; UTM parametreli URL'ler de parametresiz canonical'a işaret etsin.
- Ana sayfa ve hizmet sayfalarında generateMetadata YERİNE statik `export const metadata` kullan. Next.js'in streaming metadata özelliği meta etiketlerini <body>'ye ekliyor; Googlebot bunu okuyor ama facebookexternalhit gibi JS çalıştırmayan botlar için WhatsApp/Instagram/LinkedIn paylaşım önizlemesi riske giriyor. Rehber yazılarında generateMetadata kullanacaksan veriyi 'use cache' ile önbellekle.
- Yapısal veriyi @id ile bağlı tek bir graf olarak kur: Organization (root) → LocalBusiness/ProfessionalService (iletişim sayfası: tam NAP, geo, openingHoursSpecification, areaServed, sameAs'ta GBP linki) → Service (her hizmet sayfası, provider Organization @id'ye bağlı) → BreadcrumbList (her alt sayfa) → Article (her rehber yazısı, author GERÇEK bir Person olsun). FAQPage'i ekle ama zengin sonuç bekleme — Google 7 Mayıs 2026'da kaldırdı; SSS'yi kullanıcı deneyimi ve AI Overviews için yaz.
- Tek dilli site olduğu için hreflang EKLEMEYE GEREK YOK; <html lang="tr"> ve openGraph.locale="tr_TR" yeterli. İngilizce versiyon ileride eklenirse /en alt dizini + alternates.languages + x-default, ama makine çevirisiyle değil gerçek çeviriyle.
- app/sitemap.ts'de lastModified için `new Date()` YAZMA — içeriğin gerçek updatedAt değerini kullan, yoksa her build'de tüm tarihler değişir ve lastmod sinyali değersizleşir. images alanıyla portfolyo/çekim görsellerini, videos alanıyla tanıtım videolarını sitemap'e ekle (fotoğraf-video ajansı için Görseller sekmesi trafik kaynağı). generateSitemaps'e ihtiyaç yok, 50.000 URL altındasın.
- app/robots.ts'de /api/, panel rotaları, /giris ve /t/[kod] kısa linklerini Disallow et; kısa linkler sitemap'e girmesin. Yapay zekâ tarayıcılarını engelleme — ajans için AI aramada görünürlük istenir.
- Google İşletme Profili'ni SİTE BİTMEDEN AÇ: fiziksel adres doğrulaması kartpostalla yapılıyor ve 20 güne kadar sürebiliyor, paralel yürümeli. İşletme adı/adres/telefon (NAP) sitede, GBP'de, Instagram'da, firma rehberlerinde harfi harfine aynı olsun — profili açıp sonradan değiştirmek yerel SEO'da en pahalı hata. Birincil kategoriyi işin çoğunluğunu yapan tek alana göre seç.
- Search Console'da ÖNCE DNS TXT ile Domain property kur (tüm alt alan adlarını kapsar), ek olarak metadata.verification.google ile URL prefix property ekle ve o etiketi asla silme. Bing Webmaster Tools ve Yandex Webmaster'ı da kur (metadata.verification.yandex).
- Performans için: next/image her yerde width/height veya fill ile (CLS), hero görseline priority; next/font ile yerel font; hero'da otomatik oynayan video kullanma; YouTube/Vimeo gömmelerini lazy facade ile sar; Meta Pixel ve GA4'ü next/script afterInteractive, widget'ları lazyOnload ile yükle; ağır animasyon kütüphanelerini dynamic import et. Hedef: LCP ≤2,5s, INP ≤200ms, CLS ≤0,1 — mobilde ve gerçek kullanıcı verisinde ölç, Lighthouse skoruna bakma.
- Rehber'i haftada 1 yazı ile başlat ve en yüksek niyetli 8 yazıyı öne al: QR menü nasıl yapılır → Instagram reklam bütçesi → Google İşletme Profili nasıl açılır → Web sitesi fiyatları teklif okuma → Sitem Google'da çıkmıyor → Drone çekim izni → Sahibinden ilan aktarma → Ajans teklifi nasıl okunur. Her yazı tek bir hizmet sayfasına ve bir sektör sayfasına bağlansın; her hizmet sayfası 2-3 ilgili yazıya link versin.
- QR dijital menüyü sitenin amiral sayfası yap: /qr-dijital-menu + /sektorler/restoran-kafe ikilisi. Türkçe SERP'i makine çevirisi uluslararası SaaS içeriği tutuyor; adisyon/POS entegrasyonu, çok dilli menü, garson çağırma, fiyat güncelleme gibi Türkiye gerçeğini konuşan içerikle o SERP'te yer almak realist. Sayfada "hazır QR menü uygulaması vs işletmeye özel QR menü" karşılaştırması olsun.
- Otomotiv yazılımlarını ihmal etme: hacim düşük ama rakipler 2000'ler kalıntısı Windows masaüstü programları, modern içerik üretmiş kimse yok ve arayan kişi doğrudan satın alma niyetinde. /otomotiv-yazilimlari hub + 4 alt sayfa + 3 rehber yazısı ile kısa sürede otorite olunabilir; müşteri başına değer sosyal medya paketinden yüksek.
- Metinde rakam vaadi kullanma: "%300 büyüme", "1 ayda ilk sayfa", "garantili ilk sıra", "Google onaylı ajans" gibi ifadeler hem ispat yükümlülüğü hem itibar riski. Rehber yazılarında TL rakamı yerine hesap yöntemi anlat; rakam verecekse platformun resmi sayfasına link + görünür güncelleme tarihi + "değişebilir" notu koy. Araştırmada Instagram minimum bütçesi ve web sitesi fiyatı için birbiriyle çelişen 4 ayrı aralık dolaştığını gördüm, hiçbirini doğrulayamadım.
- Yapay zekâ ile 20 yazıyı tek seferde üretip yayınlama — bu scaled content abuse. Her yazıda ajansın kendi işinden gerçek örnek, gerçek ekran görüntüsü, gerçek sayı olsun. Rakip ajans metinlerini kopyalama, aynı SSS bloğunu 13 hizmet sayfasına yapıştırma, sektör sayfalarını hizmet sayfalarının kelime değiştirilmiş kopyası yapma. Kural: her sayfanın gövde metninin en az %70'i o sayfaya özgü olsun.
- Footer'a ilçe-kelime listesi KOYMA ("İstanbul sosyal medya ajansı, Levent sosyal medya ajansı, Kağıthane..."). alt metinlerini anahtar kelimeyle doldurma — alt, görseli görmeyen birine görseli anlatmak içindir. Satın alınmış backlink paketlerine ve sahte Google yorumuna hiç yaklaşma.
- Drone hizmet sayfası ve drone yazısında SHGM kaydı (500 g üzeri İHA, iha.shgm.gov.tr), ticari kullanımda ek izin ve yasak sahalardan bahsederken görünür güncelleme tarihi + SHGM resmi kaynağına link + "mevzuat değişebilir" notu koy. Estetik/klinik sektör sayfasını sağlık reklamı mevzuatı teyit edilmeden yayınlama.
- Yeni kurumsal siteyi ajansflow-next panelinden AYRI proje ve ayrı deploy olarak kur; paneli panel.site.com veya ayrı alan adında tut. ajansflow-next/src/app/tanitim indekslenmişse yeni siteye 301 ver, src/app/t/[kod] kısa linklerini robots'ta engelle. Eski statik sitenin yayında bir URL'i varsa sayfa-sayfa 301 planı yap, toptan ana sayfaya yönlendirme indeks kaybı yaratır.
- Ayrıca (SEO dışı ama önemli): ajansflow-next/README.md içinde kullanıcı adları ve başlangıç şifreleri (eren1234 vb.) düz metin duruyor. Bu dosya kamuya açık repoya veya yayına çıkarsa güvenlik sorunu olur; yeni kurumsal site projesine taşınmasın ve mevcut projede de gözden geçirilsin.