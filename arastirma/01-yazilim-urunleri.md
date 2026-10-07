# Ajans Flow yazılım ürünleri envanteri

> Araştırma ajanı çıktısı (6 Ekim 2026). Siteyi yapan bütün ajanlar bunu okur.

## Özet

Ajans Flow'un "yazılımlar" klasöründe, sitede anlatılabilir **9 gerçek ürün + 2 ek ürün** buldum. Portföy iki ağırlık merkezine oturuyor: (1) **otomotiv/galeri dikeyi** — MAY MOTORS için uçtan uca bir dijital omurga (piyasa taraması → değerleme → ilan/vitrin → muhasebe → reklam ölçümü), (2) **yerel işletme dijitalleşmesi** — QR menü, kafe POS, spor ligi sitesi, ilan/sosyal medya görsel üretici. En güçlü ve en satılabilir ürün MAY-Aİ + maymotors.net ikilisi: Chrome eklentisi olarak çalışan 3 bilgisayarlı dağıtık piyasa tarama ağı, kendi öğrenen değerleme motoru (52 test dosyası), 37 API uç noktası, 41 yazılık SEO rehberi, WhatsApp OTP, Google Ads atıf/huni ölçümü ve KVKK belgeleri. Bu "ajans sosyal medya yapar" algısını kıran, kurumsal yazılım seviyesinde bir referans. DİKKAT: Üç yerde belge ile kod çelişiyor (model sayısı, test sayısı, rehber yazı sayısı — kod daha ileride), bir üründe (Kule menü) besin değerleri rastgele üretilmiş, bir üründe (nar-pos) arka uç hiç yok. Siteye yazarken bunları abartmadan, doğrulanmış rakamlarla anlatmak gerekiyor — detayları aşağıda işaretledim.

## Bulgular

### MAY-Aİ — Araç Değerleme ve Piyasa Tarama Sistemi

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/may-degerleme/OKU-BENI.md · MAY-AI-KURULUM.md · manifest.json · package.json · motor/ayarlar.json · motor/modeller.json · motor/degerleme.js · motor/piyasa.js · motor/hasar.js · ajan/ (23 dosya) · test/ (52 dosya) · rapor/2026-09-18.html

NE İŞE YARAR: Araç sahibi siteye marka/model/yıl/km/hasar girer, sistem piyasadaki benzer ilanlara bakıp piyasa değerini hesaplar ve galerinin ön alış teklifini anında gösterir. Dükkanda da aynı motor kullanılır.

KİMİN DERDİNİ ÇÖZER: Galeri sahibi, aracı kaça alacağına "kafadan" değil veriyle karar verir; müşteri 3 gün beklemek yerine saniyeler içinde rakam görür.

SOMUT ÖZELLİKLER (kodda doğrulandı):
• Chrome eklentisi (manifest v3, sürüm 6.1.6) — kendi başına çalışır, yapay zekâ tokeni harcamaz.
• DAĞITIK TARAMA AĞI: Üç bilgisayar (Elif / Eren Monster / Beyza) sunucudaki tek kuyruktan çalışır. Bir görev = model + model yılı. Görev alınırken sunucuda kilitlenir → aynı araç iki kez taranmaz. Her 5 saniyede 'buradayım' sinyali. 7/24, gece tempo düşer.
• SIFIR ŞİFRE GÜVENLİĞİ: İşçi bilgisayarlarda hiçbir şifre durmaz, yalnız panelden iptal edilebilen cihaz anahtarı var. Veritabanına yalnız sunucu yazar; tarama kimliği muhasebe/kasa/müşteri verisine Firestore kurallarıyla kapatılmış. Panelden 'Yetkiyi kes' → o bilgisayar o saniye durur.
• CANLI PANEL: maymotors.net/admin/may-motors-ai — üç bilgisayarın o saniye ne yaptığı görünür; duraklat/durdur/devam/yetki kes.
• ÖĞRENEN DEĞERLEME MOTORU (motor/piyasa.js 94 KB, motor/degerleme.js 40 KB): Modelin ilanlarından yıl ve km katsayıları ÖĞRENİLİR (az ilan varsa %7,5/yıl ve -%0,8/10k km varsayılanı); uçlar atılır; yakınlığa göre ağırlıklı medyan alınır. Güven skoru = ilan sayısı + saçılım.
• KIRICILAR (motor/ayarlar.json — tüm oranlar veride, kod değişmez): ağır hasar 0,85 · değişen 0,94 · boyalı 0,97 · lokal 0,985 · tramer en çok %15 · yaşına göre yüksek km en çok %8 (beklenen = yaş×20.000+10.000). Alış teklifi = düzeltilmiş piyasanın %85-90'ı.
• PARÇA HARİTASI MODELİ (6.0.0): Yalnız 'değişen' etiketi değil, hangi parçanın değiştiği, darbe deseni, araç yaşı ve fiyat dilimi hesaba girer (motor/hasar.js 26 KB) — 'ön tampon değişen' ile 'tüm parçalar değişen' artık aynı fiyatı vermiyor.
• DONANIM PRİMİ: sunroof/cam tavan seçilirse 1M araçta +30.000, 2M'de +60.000, 3M'de +100.000 TL (çapalar arası doğrusal).
• VERİ YOKSA RAKAM YOK: Hiçbir kaynakta yakın kayıt bulunamazsa teklif null döner, site 'ekibimiz arayacak' der. Uydurma rakam üretmiyor — satışta güçlü bir dürüstlük argümanı.
• ANALİST AJANI: Tarama bitince tarihli küme yazılır, rapor/<tarih>.html haftalık piyasa raporu üretilir (en çok alınıp satılanlar, yükselen/gerileyen, en hızlı satan, indirim yapan ilanlar). Klasörde 3 gerçek rapor var (09, 17, 18 Eylül 2026).
• ARŞİV = TREND: veri/piyasa/YYYY-AA-GG.json tarihli kümeler silinmez; zamanla piyasa trendi çıkar.
• BOT KORUMASINI KENDİ GEÇMEZ: 'Basılı tut' doğrulaması çıkarsa bildirim gönderip insanı bekler (OKU-BENI.md'de açıkça 'sistem doğrulamayı kendisi geçmez — yasak ve hesabı yakar' yazıyor). Ayrıca insan hızında gezer, dinlenme molası verir (ajan/dinlenme.js).
• TEST: test/ klasöründe 49 birim testi + 3 uçtan uca test dosyası (kilit, eşleştirme, güvenlik, bot koruma, duvar teşhis, gizli pencere dâhil). Sahte sahibinden sitesiyle e2e denemesi var.
• KATALOG: motor/modeller.json 270 KB — 1.057 model (27'si öncelik 1, yani ODMD sıfır satış ilk 10 + ikinci elde en hızlı satan 20; 25'i öncelik 2). Tarama yıl aralığı 2010-2026.
• SITEYE-AKTAR.command/.bat: çift tıkla testler koşar, sonra motor + veri siteye kopyalanır.

TEKNOLOJİ: Saf JavaScript (ES modülleri, çerçeve yok), Chrome Extension Manifest V3 service worker, Node.js test koşucusu (node --test), Firebase Firestore (yalnız sunucu tarafı yazar), Vercel. Bilerek çerçevesiz — eklenti olarak dağıtılacağı için.

SATILABİLİR SEKTÖR: İkinci el oto galerileri (en net), oto ekspertiz firmaları, araç kiralama şirketleri (filo kalıntı değeri), sigorta/hasar eksperleri, bankaların taşıt kredisi birimleri, filo yönetimi. Aynı mimari (dağıtık tarama + kendi öğrenen fiyat motoru) emlak, iş makinesi ve ticari araç pazarına birebir taşınabilir.

BELGE-KOD ÇELİŞKİSİ (siteye yazmadan önce karar verilmeli): OKU-BENI.md '46 model' ve '36 birim testi' diyor; kod 1.057 model ve 49 test dosyası içeriyor. Belgeler eski kalmış, kod daha ileride. Sitede 'yüzlerce model' / '50'ye yakın otomatik test' demek güvenli.

may-degerleme 2 KLASÖRÜ: Ayrı bir ürün değil — eklentinin ESKİ bir dağıtım kopyası (manifest 5.3.0, ana klasör 6.1.6). İçinde ajan/ ve motor/ var ama güvenlik gözü, oturum, mağaza, kaporta şeması, güncelleyici gibi 8 yeni modül yok. Bir işçi bilgisayarına kurulmuş kopya olarak bırakılmış. Sitede anılmamalı.

### maymotors.net — MAY MOTORS Otomotiv Platformu (vitrin + panel + muhasebe + rehber)

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/may-motors-next/DEVIR-NOTU.md · REHBER-SEO-RAPORU-2026-09-19.md · CLAUDE-DEVIR-NOTU-OTP-2026-09-19.md · CLAUDE-DEVIR-NOTU-PAKET-GUVENLIK-2026-09-29.md · METIN-ARALIK-VE-PAKET-2026-09-27.md · src/lib/reklam-getiri.js · src/lib/huni.js · src/icerik/rehber.js · src/icerik/rehber-kumeler.js · public/onizleme/index.html · public/onizleme/yonetim.html · public/js/ · package.json

NE İŞE YARAR: Bir oto galerinin bütün dijital işini tek yerde toplayan platform: müşteriye dönük vitrin (satılık / kiralık / satılanlar / aracımı sat / iletişim / rehber), galerinin yönetim paneli, dört ortaklı muhasebe programı ve reklam getirisi ölçümü.

KİMİN DERDİNİ ÇÖZER: Galeri sahibi 'reklama para veriyorum, geri ne dönüyor?' sorusuna rakamla cevap alıyor; müşteri aracını satmak için galeriye gitmeden ön teklif görüyor; ortaklar kasanın kimde ne kadar olduğunu tartışmadan görüyor.

SOMUT ÖZELLİKLER (kodda doğrulandı):
• 5 ADIMLI DEĞERLEME SİHİRBAZI (public/onizleme/index.html — 10.440 satır): marka/model/motor/donanım paketi seçimi, il, renk, kasa, vites, yakıt, kaporta parça haritası, tramer, plaka (zorunlu), donanım listesi.
• WhatsApp OTP DOĞRULAMA: 6 haneli kod, Meta WhatsApp API 'dogrulama_kodu' şablonu, Firestore 'dogrulamalar' koleksiyonunda 5 dakika geçerli, tek kullanımlık; aynı IP'den dakikada en çok 3 istek (hız sınırı). Sahte form gönderimini kesiyor.
• İKİ RAKAMLI TEKLİF + HUKUKİ LAFIZ: 'En az teklifimiz' ve 'HEMEN SAT teklifimiz'. Metinler avukat oturumunda onaylanmış; sözün şartı müşterinin beyanı (kaporta-boya, mekanik, hasar kaydı, km, belge). Teklif numarasıyla belirli gün geçerli.
• REKLAM GETİRİSİ ZİNCİRİ (src/lib/reklam-getiri.js): reklam etiketi → talep → PLAKA → muhasebedeki alınan araç → kâr. Plaka üzerinden kendiliğinden eşleşiyor, elle işaretleme yok. Kâr formülü muhasebeyle birebir aynı tutuluyor ve bu bir testle kilitlenmiş.
• ZİYARETÇİ HUNİSİ (src/lib/huni.js): kaç kişi girdi → kaç kişi sihirbazı açtı → kaç kişi fiyatı gördü. Süreç belleğinde sayıp seyrek yazıyor, çünkü ücretsiz Firestore yazma kotası muhasebe programıyla ortak — 'ölçüm, ölçtüğü işi bozamaz'. KVKK gereği yalnız SAYI tutuyor: ham IP yok, IP özeti bile yok.
• 37 API UÇ NOKTASI: teklif, teklif-emsal, otp-gonder, whatsapp-webhook, whatsapp-sablon, ses-arama, sms, ajan (tarama kuyruğu), ai-fiyat, ai-durum, ai-uyari, foto-yukle, kira-talebi, meta-form, olcum, reklam-rapor, guvenlik-nobet, guvenlik-rapor, imha (KVKK), misafir-panel, yorumlar, kurulum, bakim, kron-birlestir...
• 76 SUNUCU MODÜLÜ (src/lib/): kuyruk, piyasa-canli, piyasa-tarihce, paket-agac, kaba-kuvvet (brute force koruması), isci-duvar, sizinti, cihaz-kapisi, api-guvenlik, otp, kvkk/imha, randevu-guvenlik, huni, reklam-getiri, fiyat-masasi...
• PAKET (DONANIM) AĞACI SENKRONU: 3.337 motor sırası (src/lib/degerleme/paket-menu-sira.json). Motor paketi (1.3 Multijet) ile donanım paketi (Dynamic Plus) ayrı şeyler olarak modellenmiş. Okuyamayan işçiye 30 dk mola, liste bitince hatalılar için 2. geçiş.
• REHBER (BLOG) — SEO'nun kalbi: src/icerik/rehber.js 4.377 satır, 41 yazı, 6 konu kümesi (sat 8, al 14, işlem 6, finans 2, kirala 8, İstanbul 3). Her kümenin /rehber/konu/<anahtar> hub sayfası var (topical authority).
• REHBER SEO İŞÇİLİĞİ (19.09.2026 raporu): #/blog diyezli adresler → sunucuda üretilen kalıcı /rehber/<slug> adreslerine taşındı (diyezten sonrası Google için ayrı sayfa değil, 32 yazının hepsi tek adres sayılıyordu). generateStaticParams ile derleme anında üretiliyor. Her sayfada kendi title/description/canonical/OG/Twitter kartı. Eski adresler 301 yönlendirildi. İçerik: 32 yazı (2'si tekrar) → 30 yazı; ~8.500 kelime → 40.119 kelime; yazı başına ~270 → 1.337 kelime; 0 → 30 yazıda SSS; 4 → 120+ şema/tablo. Keyword cannibalization yapan 2 çift birleştirildi.
• JSON-LD: her rehber sayfasında AutoDealer (adres, koordinat, çalışma saatleri, hizmet bölgesi) + BreadcrumbList + BlogPosting; liste sayfasında CollectionPage + ItemList. 30/30 sayfada geçerli üretildiği doğrulanmış. FAQPage BİLEREK eklenmemiş (Google Ağustos 2023'ten beri SSS zengin sonucunu kısıtlıyor) — bu düzeyde bir karar, satışta güçlü.
• 30 ÖZGÜN KAPAK ÇİZİMİ + yazı içi şemalar (karşılaştırma tablosu, numaralı akış, göreli etki merdiveni, zaman çizelgesi, ekspertiz boya haritası), hepsi sayfa içinde SVG — ek dosya isteği yok, CSP güvenli, açılış hızını düşürmüyor. Her yazı için 1200×630 markalı paylaşım görseli derleme anında üretiliyor.
• İÇERİK DOĞRULUĞU İLKESİ: Mevzuat birincil kaynaktan doğrulanmış (zorunlu garanti 3 ay/5.000 km; 8 yaş/160.000 km üstü kapsam dışı; 6502 sayılı kanun ayıplı mal hakları; noter güvenli ödeme). 'Araç kiralama yönetmeliği henüz taslaktır' yazıları ayrıca uyarıyor. Kaynağı olmayan rakam, yüzde ve 'ortalama X TL' metinlerde YOK; uydurma veri grafiği kullanılmamış.
• SITEMAP: 35 adres (ana sayfa + /rehber + 30 yazı + 3 yasal). Panel, muhasebe, /onizleme ve API adresleri bilerek girmiyor.
• MUHASEBE PROGRAMI (public/js/ — 40 modül, 25.778 satır): 4 ortağın kasası, araç al-sat, kiralama, taksit, kredi, sigorta/MTV/ÖTV takibi, haftalık/aylık analiz, Excel al-ver, kullanıcı yetkilendirme, etkinlik günlüğü, PIN ekran kilidi.
• GENİŞ KASA TARAMASI (public/js/tarama.js): SALT OKUMA denetim aracı; alış fiyatı↔kasa uyumsuzluğu, dağıtılmamış satış parası, %100 etmeyen pay toplamı, mükerrer kayıt, açılış bakiyesinden önce tarihli hareket, alışta pay dengesizliği. Yanlış alarm üretmemek için ortaklık devri olan araçlar ve borçlu ortaklar muaf tutulmuş.
• PARA HATASI REGRESYON KİLİDİ: DEVIR-NOTU.md'de 'asla geri alınmaması gereken düzeltmeler' bölümü — vadeli satışta kârın iki kez sayılması (579.400 TL ve 286.000 TL hayali kâr), çift iade üreten silme (8.500 yerine 25.500 TL iade). Gerçek para hataları bulunup kilitlenmiş.
• 211 TEST DOSYASI (test/*.test.mjs).
• KVKK: 5 yasal sayfa (açık rıza, çerez politikası, hemen sat koşulları, kullanım koşulları, KVKK), /api/imha veri imha uç noktası, 8 ayrı KVKK uygulama/yama belgesi.
• GÜVENLİK İŞÇİLİĞİ: 11 ayrı güvenlik denetim raporu, sızma denemeleri raporu, CSP aşamalı plan (3 belge), Vercel WAF planı, gitleaks + semgrep yapılandırması, firestore.rules.
• OTOMATİK YAYIN: Arka plan bekçisi (launchd net.maymotors.bekci) _yayin-istegi.txt dosyasını okuyup main'e itiyor, Vercel kendiliğinden Production'a derliyor. Elle push/jeton yok. Veri yedeği her gün 13:07 ve 21:07'de otomatik (launchd).

TEKNOLOJİ: Next.js 16.3.5, React 19.3, Tailwind 4, Firebase Firestore + firebase-admin, Vercel barındırma, Meta WhatsApp Business API, Google Ads, puppeteer + jsdom (test), node --test. Mimari dikkat çekici: Next.js kabuk görevi görüyor, çalışan muhasebe programı public/ altındaki düz HTML+JS — bilerek böyle, çünkü hızlı ve bağımlılıksız.

SATILABİLİR SEKTÖR: Oto galeriler (çok şubeli olanlar dâhil), araç kiralama, oto ekspertiz zincirleri. Rehber+SEO+reklam ölçümü üçlüsü ise sektör bağımsız: emlak, özel sağlık, hukuk bürosu, eğitim kurumu — 'reklama ne verdik, ne kazandık' sorusu her yerde aynı.

DOĞRULANMADI: Sitenin BUGÜNKÜ canlı durumu. 19.09.2026 raporuna göre /rehber herkese açık ve indekslenebilir, vitrin /onizleme ŞİFRELİ ve noindex, ana sayfa 'bakımda' ekranı. 25-29.09 belgeleri Google Ads kampanyasının yayında olduğunu ve panelin canlı çalıştığını gösteriyor. Hangi bölümün şu an halka açık olduğunu Eren'e sormadan veya canlı siteye bakmadan sitede iddia etmeyin.

### May Motors Finansal Takip — çok ortaklı galeri muhasebesi (bağımsız web uygulaması)

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/may-motors-finans/index.html · js/app.js · js/firebase-config.js · js/vehicles.js · js/partner-cashes.js · js/rentals.js · js/installments.js · js/excel.js

NE İŞE YARAR: Ortaklı bir oto galerinin bütün parasını tek ekrandan takip eder: hangi araç kaça alındı, kime ne kadar masraf çıktı, hangi ortağın kasasında ne var, taksit kim ödeyecek, hangi aracın sigortası bitiyor.

KİMİN DERDİNİ ÇÖZER: Ortaklı işletmelerin en büyük kavgası 'kimin kasasında ne var, bu aracın kârı nasıl bölünecek'. Bu yazılım o tartışmayı tabloya çeviriyor.

SOMUT ÖZELLİKLER (kodda doğrulandı — js/ altında 17 modül, ~480 KB kod):
• 10 ANA EKRAN: Dashboard (genel bakış) · Veri Girişi (gelir-gider) · Araç Al-Sat Takibi (stok ve kâr/zarar) · Sigorta, MTV, ÖTV Takibi (bitiş tarihleri) · Kasa Analizleri (ortak kasa bakiyeleri ve araç kâr analizi) · Taksit Takibi (vadeli satış tahsilatları) · Haftalık Analiz · Aylık Analiz (trend ve kategori) · Raporlar (detaylı filtreleme) · Kullanıcı Yönetimi (şifre ve yetki).
• vehicles.js tek başına 91 KB — araç kartı, alış/satış, masraf düşme, ortak değiştirme, kira geliri, evrak tarihleri.
• ORTAK KASASI MANTIĞI (partner-cashes.js 28 KB): ortak bazlı kasa işlemleri, 'Ortaklardan araç gideri düş' akışı, araç başına kâr analizi.
• KİRALAMA MODÜLÜ (rentals.js 39 KB) — galerinin kiralama tarafı ayrı takip ediliyor.
• TAKSİT PLANI + taksit ödemesi ekranları (installments.js).
• EXCEL AL-VER: tek tuşla dışa aktar, dosya seçip içe aktar (excel.js).
• PDF/BELGE yönetimi (documents.js) + Firebase Storage'a dosya yükleme.
• ÇEVRİMDIŞI ÇALIŞMA: Firestore enablePersistence + CACHE_SIZE_UNLIMITED — internet kesilse de ekran çalışmaya devam eder, bağlanınca eşitlenir. Dükkan ortamı için önemli bir detay.
• FIREBASE YOKSA YEREL KİP: yapılandırma boşsa veriler yerel hafızada tutulur, uygulama yine açılır (demo göstermek için birebir uygun).

TEKNOLOJİ: Saf JavaScript (çerçeve yok), modül başına bir dosya, Firebase Firestore v8 CDN + Firebase Storage, CSS değişkenleriyle tema. Tek index.html (52 KB) + 17 JS modülü.

SATILABİLİR SEKTÖR: Ortaklı oto galeriler (en net), araç kiralama firmaları, iş makinesi al-sat, emlak ofisleri (ortaklı), küçük ticari işletmeler — 'ortaklı işletme kasası' ihtiyacı sektör bağımsız.

NOT (sitede dikkat): js/firebase-config.js içinde may-motors projesinin web apiKey'i açık duruyor. Firebase web apiKey'i tasarım gereği herkese açıktır (sır değil, güvenlik Firestore kurallarıyla sağlanır — bunu MAY MOTORS devir notu da yazıyor). Yine de SİTEDE BU DOSYANIN EKRAN GÖRÜNTÜSÜ KULLANILMAMALI; proje adı ve kimlikleri gereksizce ifşa eder ve teknik bilmeyen müşteride 'şifre açıkta' algısı yaratır.

NOT: Bu, may-motors-next içindeki muhasebe programının ÖNCESİ/bağımsız sürümü. İkisini sitede ayrı iki ürün gibi anlatmak kafa karıştırır; ya 'ilk sürüm → bugünkü platform' hikâyesi olarak ya da tek ürün olarak anlatılmalı.

### OtoKart Pro — araç tanıtım kartı ve sosyal medya görsel üretici

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/oto-kart/index.html · app_v10.js · ig_generator.js · ig_rent.js · logo_pdf.js · autosave.js · car_logos.js · banners.js

NE İŞE YARAR: Galeri çalışanı aracın bilgilerini forma girer; sistem baskıya ve sosyal medyaya hazır, vektörel, markalı araç tanıtım kartı üretir. Tek veriden hem araç kartı, hem Instagram postu, hem kiralık araç postu çıkıyor.

KİMİN DERDİNİ ÇÖZER: Galerilerde her araç için tasarımcıya iş açma veya Canva'da elle uğraşma derdi. 40+ alanı bir kez giriyorsun, görsel kendiliğinden çıkıyor — tasarımcıya bağımlılığı bitiriyor. Ajans için de iş: müşterinin kendi içerik üretimini otomatikleştiren bir araç.

SOMUT ÖZELLİKLER (index.html + app_v10.js 66 KB + ig_generator.js 120 KB içinde doğrulandı):
• ÇIKTILAR: 'PNG 72 DPI' indir · 'Instagram Postu Oluştur' · 'Kiralık Araç Postu' · PDF (jsPDF + svg2pdf ile vektörel).
• INSTAGRAM FORMATI: 1080×1350 (dikey post) canvas, html2canvas ile render, otomatik açıklama (caption) metni üretimi.
• LOGO PDF'DEN OKUNUYOR: Galerinin kurumsal PDF'i yükleniyor, pdf.js ile logo çıkarılıp karta vektörel olarak basılıyor (logo_pdf.js). Her müşteriye elle logo hazırlama derdi yok.
• MARKA LOGO KÜTÜPHANESİ: car_logos.js 4,6 MB — otomobil marka logoları gömülü, araç markası seçilince kart kendiliğinden logoyu alıyor. banners.js 5,8 MB hazır şablon/afiş havuzu.
• GÖRSEL EKSPERTİZ ŞEMASI: 14 kaporta parçası (ön kaput, tavan, bagaj kapağı, 4 çamurluk, 4 kapı, ön/arka tampon) tek tek Orijinal / Boyalı / Değişen / Lokal Boyalı olarak işaretleniyor ve kartta görsel şema olarak çıkıyor.
• 40+ ARAÇ ALANI: marka, model, yıl, donanım paketi, km, motor cc, beygir (HP), tork (Nm), muayene tarihi, şasi no, plaka, motor no, vites (manuel/otomatik/yarı otomatik), yakıt (6 seçenek), kasa tipi (10 seçenek: sedan, hatchback, SUV, camlı van, panelvan, coupe, cabrio, MPV, kamyonet, minivan), çekiş (önden/arkadan/4WD/AWD), renk, tramer tutarı + tramer sorgu tarihi.
• ROZET/ETİKET SİSTEMİ: Hatasız, Boyasız, %20 Faturalı, Değişensiz, Garantili, Muayene Yeni, Kazasız, Servis Bakımlı, Bayi Çıkışlı, TSE Onaylı + 'Kendi özelliklerinizi ekleyin'. Köşe kurdelesi ayarlanabilir, vurgu rengi seçilebilir (#e11d2a varsayılan).
• DONANIM LİSTELERİ: Güvenlik grubu (ABS/ESP, airbag, isofix, yokuş kalkış desteği, şerit takip, kör nokta, çarpışma önleyici) ve diğer gruplar; 'Tümünü Seç' / 'Temizle'.
• ARAÇ GARAJI: 'Aracı Kaydet' / 'Araçlarım' — localStorage'da araç havuzu, otomatik kayıt (autosave.js).
• 'HTML Temizle' aracı — yapıştırılan ilan metnini temizliyor.

TEKNOLOJİ: Saf JavaScript, SVG tabanlı vektörel kart, jsPDF 2.5.1, pdf.js 2.16, svg2pdf.js 2.0, html2canvas 1.4.1, localStorage. Çerçeve yok, kurulum yok — tarayıcıda açılıp çalışıyor.

SATILABİLİR SEKTÖR: Oto galeriler ve oto ekspertiz (en net). Aynı kalıp — 'veri gir, markalı görsel çıkar' — emlak (daire kartı), turizm (tur/otel kartı), restoran (günün menüsü), spor salonu (üye kampanyası), perakende (ürün kartı) için birebir satılır. Ajansın en kolay tekrar satılabilir ürünü bu.

ÖNEMLİ UYARI (sitede göstermeden önce): Klasör çok dağınık — 150+ dosyanın büyük kısmı geliştirme sırasında yazılmış tek kullanımlık betik (check_*.py, patch_*.py, dom_*.html, test_*.html, app_v6/v7/v8). Gerçek ürün yalnızca: index.html + app_v10.js + ig_generator.js + ig_rent.js + car_logos.js + banners.js + logo_pdf.js + autosave.js. Ekran görüntüsü alınacaksa yalnız index.html açılıp alınmalı; klasörün kendisi asla gösterilmemeli, demo olarak yayına verilmemeli.

### MAY MOTORS İlan Sihirbazı ve OtoBid — ilan oluşturma ve araç alım akışı maketleri

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/maymotors-web/ilan-sihirbazi-maket-v1.html · otobid-arac-sat-maket.html · panel-ilan-ekle.html · on-inceleme-v1.html · prototip-v1.html

NE İŞE YARAR: Bu klasör dört çalışan MAKET (interaktif prototip) içeriyor: galerinin ilan ekleme akışı, müşterinin 'aracını sat' akışı, panel ilan ekleme ekranı ve bir ön inceleme/teklif belgesi. Yani üretimden önce 'ekran nasıl olacak, akış nasıl işleyecek' sorusunun gerçek tıklanabilir cevabı.

KİMİN DERDİNİ ÇÖZER: Müşterinin 'anlatsan da gözümde canlanmıyor' derdini. Ajansın satış sürecinde en güçlü kozu: teklif aşamasında müşteriye çalışan bir ekran gösterebilmek.

SOMUT İÇERİK (dosyalarda doğrulandı):
• ilan-sihirbazi-maket-v1.html (81 KB — en kapsamlısı): 6 bölümlü ilan sihirbazı — Araç kimliği · Teknik · Hasar & ekspertiz · Donanım, rozet, ek bilgi · Fotoğraflar · Fiyat & yayın. Yanında canlı ilan önizlemesi: başlık, boyalı/değişen parça şeması (parça başına tooltip: 'Sağ Arka Kapı: Değişen'), özellik sayacı, 'Araç hakkında', 'Galeriden' bölümleri.
• otobid-arac-sat-maket.html — 'Aracını Sat (Pro Sistem)': 5 adım (Araç Bilgileri → Kaporta Durumu → Ek Donanım → Başlangıç Fiyatı → Randevu). Alt model, yakıt, kasa tipi, motor gücü (100 HP), motor hacmi (1368 cm3), vites, üretim yılları; plaka/renk/km; kaporta parça durumu (Orijinal/Lokal Boyalı/Boyalı/Değişen) + 'ağır hasar kaydı var' kutusu; ek donanım (sunroof, deri koltuk, geri görüş kamerası, şerit takip asistanı); TELEFON DOĞRULAMA (SMS kodu, 02:55 geri sayım, 'Numarayı doğrula'); sonuç ekranı 'Tahmini Alış Fiyatı 856.100 TL' + '📢 Bu fiyat 3 gün geçerlidir'; sonra ÜCRETSİZ EKSPERTİZ RANDEVUSU (şube seçimi — Maslak / Ataşehir, tarih seçimi, saat seçimi 10:00/11:30/14:00/16:00).
• panel-ilan-ekle.html — galeri çalışanının 3 adımlı ilan ekleme ekranı (Temel Bilgiler → Ekspertiz ve Hasar → Öne Çıkan Özellikler) + sağda '👀 Canlı Önizleme'. Kaporta haritası (ön tampon, sol/sağ ön çamurluk, kaput, tavan, kapılar, bagaj, arka tampon), tramer tutarı, donanım rozetleri (cam tavan, hayalet ekran, koltuk ısıtma, elektrikli bagaj, geri görüş kamerası, Apple CarPlay, F1 vites, Matrix far, hatasız/boyasız, garantili).
• on-inceleme-v1.html — 'MAY MOTORS web sitesi: nasıl kurulur, ne alınır, kaça mal olur' başlıklı müşteriye sunulan ön inceleme belgesi. Ajansın teklif/kapsam belgesi kalıbı olarak değerli.
• prototip-v1.html (301 KB) — tam site prototipi: 'İkinci elde güvenin adresi' hero, Öne çıkan araçlar, 'Fotoğrafını yükle, fiyatını öğren, teklifi al', 'Günlük, haftalık, aylık kiralama', 'Aldığınız araç, gördüğünüz araçtır', satılık/kiralık listeleri, araç detay, 'Bunlar da ilginizi çekebilir', kiralama şartları, rezervasyon talebi, web sitesi yönetimi ekranı.

TEKNOLOJİ: Tek dosyada saf HTML+CSS+JS (bağımlılıksız, çift tıkla açılıyor). Maketler Python betikleriyle üretilip yamalanmış (create_otobid_maket.py, update_prototip.py) — yani maket üretimi de otomatikleştirilmiş.

SATILABİLİR SEKTÖR: Doğrudan satılacak bir ürün değil; AJANSIN ÇALIŞMA YÖNTEMİNİN KANITI. Sitede 'önce maket, onay sonrası kod' sürecini anlatan bölümde kullanılmalı. İlan sihirbazı kalıbı ise emlak (daire ilanı), iş makinesi, tekne, ticari araç ilan siteleri için birebir satılabilir.

NOT: Bunlar maket, ürün değil. 9 Eylül 2026 tarihli ve maymotors-web klasöründe bırakılmış; bugünkü canlı site bunların ileri sürümü. Sitede 'ürün' olarak değil 'süreç' olarak anlatılmalı — yoksa müşteri 'niye iki tane aynı şey var' diye sorar.

### Sahibinden İlan Analiz Ajanı — yerel yapay zekâ ile fiyat teklifi (Ar-Ge prototipi)

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/sahibinden_agent/scraper_agent.py · ai_parser.py · pricing_engine.py · analyzer.py · requirements.txt

NE İŞE YARAR: 4 betikten oluşan bir boru hattı: ilan listelerini okur → ilan açıklamasını yerel yapay zekâya verip hasar/tramer/'acil satılık' bilgisini çıkarır → bu bilgilere göre otonom alım teklifi hesaplar → pazar özetini ve fiyat/performans sıralamasını raporlar.

KİMİN DERDİNİ ÇÖZER: Galeri alım uzmanının yüzlerce ilan açıklamasını elle okuyup 'bunda ne var ne yok' çıkarma derdi. Değeri şurada: ilan açıklaması serbest metindir, tabloda yoktur — orada 'sağ arka kapı değişen', 'nakit ihtiyacından acil' gibi fiyatı belirleyen bilgiler saklıdır. Betik onu yapılandırılmış veriye çeviriyor.

SOMUT ÖZELLİKLER (363 satır kodun tamamını okudum):
• scraper_agent.py — Playwright + Firefox (headless=False, çünkü bot koruması headless tarayıcıyı tanıyor), BeautifulSoup; liste sayfasından başlık/fiyat/yıl/km/link, sonra ilan detayına girip açıklama metni; CSV'ye yazıyor. İnsan temposu bilerek yavaş: liste sonrası 5 sn, detay sonrası 4 sn, ilanlar arası 8 sn bekliyor ve ilk 5 ilanla sınırlı — kodun yorumu 'çok fazla ilana girmek engellenmeye yol açar' diyor.
• ai_parser.py — YEREL yapay zekâ: Ollama (localhost:11434) üzerinde llama3. İlan açıklamasını 'Sen bir 2. el araç ekspertiz uzmanısın' istemiyle verip ZORUNLU JSON formatında {tramer, boyali_parcalar[], degisen_parcalar[], acil} çıkarıyor. Veri dışarıya hiç çıkmıyor, API ücreti yok — gizlilik ve maliyet açısından anlatılmaya değer bir tercih.
• pricing_engine.py — teklif = pazar ortalaması, sonra kırıcılar: tramer tutarının %50'si düşülür · her boyalı parça -%1,5 · her değişen parça -%3 · 'acil/nakit' etiketliyse ek -%5 · al-sat kâr marjı -%4. Her kırıcı için gerekçe metni üretiyor ('1 parça değişen için -%3 değer düşüldü'). Teklif satıcının istediğinden yüksek çıkarsa 'çok kelepir veya hatalı veri' uyarısı veriyor, değilse brüt kâr potansiyelini yazıyor.
• analyzer.py — grup bazlı ortalama fiyat/km/ilan sayısı; fiyat ve km normalize edilip toplanarak 'en mantıklı araç' skoru.

TEKNOLOJİ: Python 3, Playwright, BeautifulSoup4, pandas, Ollama + llama3 (yerel LLM). requirements.txt yalnız 3 satır.

SATILABİLİR SEKTÖR: Kendi başına satılmaz. Sitede 'serbest metinden yapılandırılmış veri çıkarma' ve 'veriniz dışarı çıkmadan, yerelde çalışan yapay zekâ' yeteneğinin örneği olarak satılır — bu ikisi KVKK hassasiyeti olan her sektörde (sağlık, hukuk, finans, İK/CV ayıklama, sigorta hasar dosyası) karşılığı olan bir söz.

DÜRÜSTLÜK NOTU (önemli): Bu bir PROTOTİP, ürün değil. Kanıtlar: TARGETS sözlüğünde tek model var (Fiat Egea), diğeri yorum satırında; 'Şimdilik test için tek kategori'; 'Daha düşük skor = daha iyi' gibi basit skorlama; 'Basit bir algoritma örneği' yorumu; pazar ortalaması olarak çekilen 5 ilanın düz ortalaması alınıyor (MAY-Aİ'deki ağırlıklı medyan/uç atma yok); test yok. 9 Eylül 2026 tarihli — yani MAY-Aİ'nin ATASI. Sitede 'ürünümüz' diye anlatılmamalı; 'MAY-Aİ'nin çıkış noktası olan ilk deneme' olarak anlatılırsa Ar-Ge hikâyesini güçlendirir.

HUKUKİ DİKKAT: Hedef sitenin kullanım koşulları ve robots.txt'i bağlayıcıdır. MAY MOTORS devir notlarında ilan sitesinin robots.txt'inin yapay zekâ tarayıcılarını tüm siteden yasakladığı ve bu yüzden veri çekilmediği açıkça yazılı. Sitede 'rakip siteleri kazıyoruz / veri çekiyoruz' şeklinde bir vaat KESİNLİKLE verilmemeli — hem hukuki risk, hem itibar riski. Anlatılacaksa 'herkese açık piyasa verisinden fiyat modelleme' çerçevesinde ve sahibinden/ilan sitesi adı verilmeden anlatılmalı.

### Mola Kafe — kafe otomasyon ve satış (POS) ekranı

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/nar-pos/index.html · js/store.js · js/router.js · js/app.js · js/views/ (9 dosya)

NE İŞE YARAR: Bir kafenin günlük işletmesini tek ekrandan yürütür: masa düzeni, sipariş alma, adisyon, kasa, gelir-gider ve rapor.

KİMİN DERDİNİ ÇÖZER: Küçük kafelerin defter/WhatsApp ile yürüttüğü masa-adisyon-kasa takibini düzene sokuyor; pahalı POS aboneliklerine alternatif.

SOMUT ÖZELLİKLER (kodda doğrulandı — 1.135 satır görünüm kodu + 16 KB durum yönetimi):
• 9 EKRAN: Dashboard · Masalar · Siparişler · Adisyonlar · Ürünler · Gelir/Gider · Kasa · Raporlar · Ayarlar.
• MASA DÜZENİ: 15 masa, her birinin kapasitesi (4) ve durumu (boş/dolu) + bağlı adisyon numarası. Masalar ekranı 208 satır, adisyonlar 274 satır — en çok iş görmüş iki ekran.
• ÜRÜN KATALOĞU: 43 hazır ürün, 11 kategoride, fiyatlarıyla gömülü (Kutu İçecekler, Sıcak İçecekler, Kahve Çeşitleri, Ana Yemekler, Makarnalar, Salatalar, Atıştırmalıklar, Tatlılar, Aperatifler, Tostlar). Demo göstermek için hazır — boş ekran yok.
• KASA: nakit / kredi kartı ayrımı + günlük ciro + hareket defteri.
• SPA MİMARİSİ: kendi router'ı (js/router.js), merkezi durum deposu (js/store.js), dinleyici (listener) tabanlı yeniden çizim — küçük ama düzgün kurulmuş bir yapı.
• localStorage'a otomatik kayıt ('mola_kafe_state'); tarayıcı kapanıp açılsa veri duruyor. Varsayılan ürün/masa listesi korunuyor.
• Mobil menü düğmesi ve duyarlı (responsive) yerleşim var; canlı saat göstergesi.

TEKNOLOJİ: Saf JavaScript (çerçeve yok), CSS değişkenleriyle tema (3 ayrı CSS: theme/style/modal), Font Awesome 6.4 ikonlar, Google Fonts Inter. Kurulum gerektirmiyor.

SATILABİLİR SEKTÖR: Kafe, restoran, nargile kafe, pastane, bar, kıraathane, halı saha kantini, güzellik salonu (randevu/kasa kalıbı aynı).

ÖNEMLİ DÜRÜSTLÜK NOTU — SİTEDE ABARTILMAMALI:
1) Klasör adı 'nar-pos' ama içindeki uygulama 'MOLA KAFE' markalı. Sitede hangi adla anılacağına karar verilmeli (klasör adı kullanılmamalı).
2) ARKA UÇ YOK. Veri yalnız o tarayıcının localStorage'ında duruyor (grep ile doğruladım: firebase/fetch/sunucu çağrısı yok). Bunun anlamı: tek cihaz, tek kullanıcı; garson telefonu ile kasa ekranı birbirini GÖRMEZ; tarayıcı verisi silinirse kayıt gider; yedek yok. Yani bu bir MVP/demo — 'çok kullanıcılı kafe otomasyonu', 'bulut' veya 'şubeler arası' gibi iddialar şu hâliyle doğru değil.
3) Raporlar ekranı 48 satır — diğerlerine göre en yüzeysel yer.
4) Yazar kasa/ödeme kaydedici (ÖKC) entegrasyonu, fiş yazdırma ve mutfak ekranı yok.
SATILACAK DOĞRU ÇERÇEVE: 'Çalışan kafe otomasyon maketi — bulut ve çok cihaz desteği talebe göre eklenir'. Bu dürüst, hem de yükseltme satışına kapı açıyor.

### Kule İstanbul Cafe — 4 dilli QR dijital menü

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/kule-istanbul-cafe/index.html · app.js · menu-data.js · build_menu.py · enrich_data_advanced.py (satır 114-126) · enrich_menu.py

NE İŞE YARAR: Masadaki QR kodu okutan misafir, telefonunda kafenin tam menüsünü görüyor: 4 dilde, fotoğraflı, aranabilir, alerjen bilgili ve diyet filtreli.

KİMİN DERDİNİ ÇÖZER: Boğaz/Sarıyer hattında turist yoğun bir mekânın dil derdini (TR/EN/DE/AR) ve alerjen sorumluluğunu çözüyor; basılı menü maliyetini ve fiyat değişince menü yenileme derdini bitiriyor.

SOMUT ÖZELLİKLER (menu-data.js'i ayrıştırıp saydım):
• 11 KATEGORİ: Kahvaltı & Omlet · Aparatif & Tost · Salata & Makarna · Burger & Wrap · Ana Yemekler · Kırmızı Etler · Tatlılar · Frozen & Milkshake · Sıcak İçecekler · Soğuk İçecekler · Nargile.
• 172 ÜRÜN, her biri 24 alanlı. 148'inde gerçek fotoğraf var (assets/images/).
• 4 DİL TAM ÇEVİRİ: Türkçe, İngilizce, Almanca, ARAPÇA. Kategori adı, ürün adı, açıklama, içindekiler ve alerjenler — hepsi dört dilde ayrı alanlarda (name_tr/en/de/ar, desc_*, ingredients_*, allergens_*). Arayüz metinleri de dört dilde (filtre adları, arama kutusu, 'sonuç bulunamadı', alerjen uyarıları, footer).
• CANLI ARAMA: Menüde yazarak anında filtreleme, sonuç başlığı dinamik.
• DİYET FİLTRELERİ: Vegan · Glutensiz · Kuruyemişsiz — rozet olarak değil, ürünün alerjen listesinden hesaplanarak çalışıyor (app.js:189-196). Yani veri tek yerden geliyor, çelişki çıkmıyor.
• ALERJEN DETAYI: Ürüne tıklayınca açılan pencerede 'Alerjen İçermez' / 'Alerjen Uyarısı', içindekiler ve alerjen listesi — mevzuat açısından değerli.
• YAPIŞKAN KATEGORİ MENÜSÜ, kategori başlığı dekoratörü, modal detay penceresi, lucide ikonlar.
• FOOTER'DA DÖNÜŞÜM: 'Haritada Gör' (Google Maps) + 'Google'da Bizi Değerlendirin' (doğrudan Google arama/yorum bağlantısı) + Instagram + tıklanabilir telefon. QR menüyü Google yorumu toplama aracına çevirmiş — satışta anlatılacak akıllı detay.
• VERİ ÜRETİM HATTI: 6 Python betiği (build_menu.py menüyü kuruyor, enrich_menu.py ve enrich_data_advanced.py çeviri/alerjen/besin alanlarını dolduruyor, download_images.py + update_images.py + fix_missing_images.py görselleri indirip eşliyor). 172 ürünü elle yazmak yerine boru hattı kurulmuş.

TEKNOLOJİ: Saf HTML/CSS/JS (çerçeve yok, kurulum yok, sunucu gerekmez — statik barındırma yeter, maliyeti neredeyse sıfır), Google Fonts (Playfair Display + Outfit), lucide ikonlar, Python veri hattı.

SATILABİLİR SEKTÖR: Kafe, restoran, otel (oda servisi + kahvaltı), nargile mekânı, plaj/beach club, pastane, turistik işletmeler. 4 dil + alerjen kombinasyonu özellikle İstanbul'un turistik hatlarında (Sarıyer, Beşiktaş, Fatih, Beyoğlu, Adalar) doğrudan satılır. Çoğaltması çok kolay: veri dosyasını değiştir, marka renklerini değiştir, yayına al.

İKİ ÖNEMLİ UYARI — SİTEDE KESİNLİKLE DİKKAT:
1) BESİN DEĞERLERİ GERÇEK DEĞİL. enrich_data_advanced.py:114-126 besin değerlerini random.randint ile ÜRETİYOR (kategoriye göre aralıklarda, ürün id'si tohum olarak). Ürün penceresinde 'Kalori (kcal) / Protein / Karbonhidrat / Yağ' tablosu olarak gösteriliyor (app.js:271-279). Bu sayılar yer tutucudur. Sitede 'kalori ve besin değeri bilgisi' ASLA özellik olarak satılmamalı; ekran görüntüsü alınacaksa besin tablosu görünen kare kullanılmamalı. Mekâna da bildirilmesi gerekir — yanlış besin değeri göstermek tüketici mevzuatı açısından risklidir. (Öneri: ya gerçek değerler alınıp girilmeli ya da o bölüm kapatılmalı. Bunu ayrı bir iş olarak ele alın.)
2) FİYAT YOK. build_menu.py'de her ürünün fiyatı var (ör. Serpme Kahvaltı 995 TL) ama yayındaki menu-data.js'de 'price' alanı hiç yok — fiyatlar bilerek çıkarılmış. Sitede 'fiyat güncelleme' bir özellik olarak anlatılmamalı; aksine 'fiyatsız menü, fiyat değişiminde yenileme derdi yok' ya da 'fiyatlar talebe göre eklenir' denmeli.
3) Çeviriler sözlük tabanlı betikle üretilmiş; bazı İngilizce açıklamalarda Türkçe kelimeler kalmış (ör. 'Sahanda Egg, menemen, ... Sınırsız Tea ve ekmek'). Sitede İngilizce/Almanca/Arapça ekran görüntüsü kullanılacaksa önce o kareler elden geçirilmeli.

### Minik Starlar Ligi (msl-web) — çocuk futbol ligi tanıtım ve kayıt sitesi

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/MSL/msl-web/src/lib/data.ts · src/app/page.tsx · src/components/ (22 dosya) · package.json

NE İŞE YARAR: U10/U11/U12 kategorilerinde 10 hafta sürecek bir çocuk futbol liginin tanıtımını yapan ve online kayıt toplayan tek sayfalık (one-page) site.

KİMİN DERDİNİ ÇÖZER: Spor organizasyonlarının 'velilere nasıl ulaşırız, kaydı nasıl toplarız' derdi. WhatsApp'a hazır mesajla düşen kayıt akışı, veliyi form doldurma yorgunluğundan kurtarıyor.

SOMUT ÖZELLİKLER (22 React bileşeni, kodda doğrulandı):
• 13 BÖLÜM: Navbar · Hero · Ticker (kayan şerit) · Hakkında · Medya · Ödüller · Yıldızlar · Galeri · Kurallar · Sözleşme · Kayıt · Instagram akışı · İletişim + yüzen aksiyon düğmeleri (FloatingActions) + kayıt penceresi (RegistrationModal).
• TEK VERİ KAYNAĞI (src/lib/data.ts): site adı, sezon (2026-2027), slogan ('Geleceğin Yıldızları Bugünden Parlıyor'), organizatör (ÖSF Sportif Faaliyetler), MEDYA PARTNERİ: Ajans Flow. İçerik tek dosyadan yönetiliyor — müşteri metni değiştirmek istediğinde kod avı yok.
• SON BAŞVURU GERİ SAYIMI: kayıt bitişi 15 Ekim, ilk maç 17-18 Ekim; Countdown bileşeni canlı sayıyor (İstanbul UTC+3 sabit).
• WHATSAPP KAYIT AKIŞI: numara, hazır mesaj metniyle birlikte ('Merhaba, Minik Starlar Ligi için bilgi almak ve kayıt yaptırmak istiyorum') encode edilmiş wa.me bağlantısı.
• SEO/YAPILANDIRILMIŞ VERİ: SportsEvent JSON-LD — etkinlik adı, açıklama, spor dalı, başlangıç tarihi, eventStatus, eventAttendanceMode, görsel, Place (adres: Güzeltepe, 34060 Eyüpsultan/İstanbul, posta kodu, ülke), SportsOrganization organizatör + telefon, sameAs Instagram. Yerel aramada ve Google etkinlik sonuçlarında görünmek için doğru kurulmuş.
• OG GÖRSELİ, icon.png, apple-icon.png hazır (src/app/opengraph-image.jpg) — WhatsApp'ta paylaşıldığında düzgün kart çıkıyor.
• ÖZEL ARAYÜZ BİLEŞENLERİ (src/components/ui/): StarField (yıldız alanı), Stadium (stadyum görseli), AnimatedCounter (sayı animasyonu), Marquee (kayan yazı), Countdown, SpotlightCard, Lightbox (galeri büyütme), Reveal (kaydırmayla belirme), SectionHeading, Button. Hazır şablon değil, elle kurulmuş bir arayüz kütüphanesi.
• Instagram akışı bileşeni + public/instagram ve public/motm (maçın adamı) klasörleri — sosyal medya ile site birlikte kurgulanmış.
• Ticker içeriği: 'U10 • U11 • U12', 'Fair Play', '10 Hafta Heyecan', 'Maçın Adamı'.
• public/ajansflow-logo.png — ajans imzası sitede duruyor.

TEKNOLOJİ: Next.js 16.3.5, React 19.2, TypeScript 5, Tailwind CSS 4, Framer Motion 13 (animasyon), lucide-react ikonlar, clsx + tailwind-merge. Ajansın modern ve tipli (TypeScript) iş yaptığının en net kanıtı.

SATILABİLİR SEKTÖR: Spor okulları ve futbol akademileri, yüzme/basketbol/tenis okulları, turnuva ve lig organizatörleri, yaz kampları, dans/müzik kursları, etkinlik ve festival organizasyonu. 'Geri sayımlı kayıt kampanyası sitesi' kalıbı dönemsel kayıt alan her kuruma satılır.

NOT: Site adresi data.ts'de minikstarlarligi.com olarak yazılı; yayında olup olmadığını DOĞRULAMADIM. Sitede canlı bağlantı verilecekse önce açılıp kontrol edilmeli. Ayrıca README dosyası Next.js'in varsayılan şablonu — projeye özgü bir belge yazılmamış.

### Ajans Flow İç Yönetim Yazılımı (ajansflow-next) — ajansın kendi işletme programı

*Güven: kesin* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/ajansflow-next/package.json · src/app/(app)/ (13 modül, 21 sayfa) · src/lib · scripts/ · db/

GÖREV LİSTESİNDE YOKTU, AMA SİTE İÇİN ÇOK DEĞERLİ, O YÜZDEN EKLİYORUM.

NE İŞE YARAR: Ajans Flow'un kendi işini yürüttüğü yazılım: müşteriler, finans, kasa, borçlar, görevler, hedefler, takvim, videolar, raporlar, notlar ve 'müşteri bulma' modülü.

KİMİN DERDİNİ ÇÖZER: Ajansın kendi iç operasyonunu. Ama SATIŞ AÇISINDAN ASIL DEĞERİ: 'Biz müşterimize kurduğumuz sistemi kendi işimizde de kullanıyoruz' demesini sağlıyor. Bu, yazılım satışında en güçlü tek cümledir.

SOMUT ÖZELLİKLER (21 sayfa, kodda doğrulandı):
• 13 ANA MODÜL: Panel (ana sayfa) · Müşteriler · Müşteri Bulma (marka bazlı: /musteri-bulma/[marka], şablonlar ve içe aktarma alt sayfalarıyla) · Finans · Kasa · Borçlar · Görevler (+ tekrarlayan görevler) · Hedefler · Takvim · Videolar · Raporlar · Notlar (+ kısayollar, + rehber) · Ayarlar.
• PAYLAŞIM BAĞLANTISI: /t/[kod] — koda göre açılan sayfa; müşteriye özel içerik/teklif paylaşımı için.
• /tanitim — ajansın kendi tanıtım sayfası ve src/components/tanitim/ bileşenleri.
• src/components/aday/ — aday (potansiyel müşteri) bileşenleri; müşteri bulma akışının arayüzü.
• KENDİ OTURUM/KİMLİK ALTYAPISI: bcryptjs (şifre özeti) + jose (JWT) — hazır kimlik servisi kullanmak yerine elle kurulmuş.
• GERÇEK VERİTABANI: PostgreSQL (pg sürücüsü), db/ klasörü, scripts/setup-db.mjs kurulum betiği, scripts/yedekle.mjs YEDEKLEME betiği, scripts/local-db.mjs ve embedded-postgres ile geliştiricinin makinesinde kurulum gerektirmeyen yerel veritabanı. Firebase'den ilişkisel veritabanına geçiş yapılmış — teknik olgunluk göstergesi.
• REHBER TOHUMLAMA: scripts/seed-rehber.mjs — bu projede de bir 'rehber' (içerik) yapısı var.
• /api/health — sağlık kontrolü uç noktası.
• server-only paketi kullanılmış — sunucu kodunun tarayıcıya sızmasını engelleyen bilinçli bir tercih.

TEKNOLOJİ: Next.js 16.3, React 19.2, TypeScript 5.7, PostgreSQL (pg 8.23), bcryptjs, jose (JWT), embedded-postgres. Ajansın en 'kurumsal yazılım' görünen projesi.

SATILABİLİR SEKTÖR: Ajanslar, danışmanlık firmaları, serbest çalışanlar, küçük hizmet işletmeleri — 'müşteri + görev + kasa + hedef' dörtlüsü hepsinde aynı. Sitede 'size özel iç yönetim yazılımı' hizmet kalemi olarak satılabilir.

NOT: İkinci çalışma klasörü olarak oturuma tanımlı (/Users/ajansflow/Desktop/yazılımlar/ajansflow-next) — yani şu an aktif geliştirilen proje. /Users/ajansflow/Desktop/yazılımlar/ajansflow ise aynı işin eski, saf HTML sürümü (index.html + css + js + serve.py).

### MAS Entertainment Platform (mas-platform) — kapsam dışıydı, ama portföyün en büyük projesi

*Güven: muhtemel* · Kaynak: /Users/ajansflow/Desktop/yazılımlar/mas-platform/README.md · apps/ · packages/ (15) · services/ (3) · docs/agent-system/ · /Users/ajansflow/Desktop/yazılımlar/mas-platform-worktrees/ · MAS-Go-Kart-Tasarim-Inceleme-Raporu.md

GÖREV LİSTESİNDE YOKTU. İNCELEMEDİM, sadece README'sini ve klasör yapısını okudum. Siteye koymadan önce AYRI BİR ARAŞTIRMA yapılmalı — ama atlanmaması gerektiği için bildiriyorum, çünkü klasördeki en iddialı yazılım bu.

README'DE YAZDIĞINA GÖRE: MAS bünyesindeki markaları (MAS Go Kart, Woist Sahil, İstinye Airsoft, Rodeo, Arcade) tek dijital omurgada birleştiren işletme platformu: çok dilli halka açık site, online rezervasyon ve ödeme, canlı yarış/timing, QR bilet ve yerel baskı, kasa/finans, personel, bakım ve analitik.

KLASÖR YAPISINDA GÖRÜNEN (doğrulandı): pnpm + Turborepo monorepo. apps/web + apps/admin. 15 paket: analytics, auth, db, domain, finance, i18n, maintenance, notifications, payments, pricing, racing, reservations, test-support, ui. 3 servis: api, print-agent (bilet yazıcı ajanı), timing-bridge (yarış zamanlama köprüsü). Ayrıca brand/, db/, docs/ (spec, adr, architecture, agent-system), tests/, vitest yapılandırması, eslint, tsconfig tabanları.

ÇOK AGENT'LI GELİŞTİRME YÖNTEMİ: README, projenin çok-agent'lı bir mühendislik programı olarak yürütüldüğünü anlatıyor — bir Head Manager Agent (A0) planlıyor, görevleri uzman agentlara dağıtıyor ve inceliyor; ortak hafıza deponun kendisi. docs/agent-system/ altında PROJECT_STATE.md, REQUIREMENTS_SUMMARY.md, TASK_LEDGER.md, OWNERSHIP.md, DEPENDENCIES.md, DECISIONS_PENDING.md var; mimari karar kayıtları docs/adr/ altında. Yanında mas-platform-worktrees/ klasöründe 25+ ayrı görev dalı (TASK-001...TASK-027) duruyor. Ajansın 'yapay zekâ ile yazılım geliştirme' yöntemini anlatacağı en güçlü malzeme bu.

TEKNOLOJİ: TypeScript monorepo (pnpm workspace + Turborepo), Next.js (apps/web, apps/admin), Vitest, ayrı servisler. Kurumsal ölçekte bir mimari.

SATILABİLİR SEKTÖR: Eğlence merkezleri, go-kart ve yarış pistleri, airsoft/paintball, halı saha, lunapark, plaj işletmeleri, spor tesisleri, aktivite parkları — 'rezervasyon + ödeme + bilet + kasa + personel' ihtiyacı aynı.

DOĞRULANMADI / UYARI: README'nin kendisi 'Durum: FAZ 0 → FAZ 1 (Discovery tamamlanıyor, Foundation başlıyor)' diyor. Yani PROJE HENÜZ TAMAMLANMAMIŞ. Sitede bitmiş bir ürün gibi anlatılmamalı. İki dürüst yol var: (a) 'devam eden büyük ölçekli proje' olarak, müşterinin izniyle ve ekran görüntüsü vermeden anlatmak; (b) hiç anılmayıp, FAZ ilerleyince eklemek. Ayrıca klasörde MAS Go Kart tasarım inceleme ve görsel denetim raporları (29.09 ve 01.10.2026) var — tasarım işi de ajansta.

ÖNERİ: Bu proje için ayrı bir araştırma turu çalıştırın; doğru anlatılırsa sitenin en ağır referansı olur.

## Sitede nasıl kullanılmalı

- MİMARİ KARAR — 'Yazılım' ana menüde eşit ağırlıkta olsun: Site üst menüsü 'Sosyal Medya · Prodüksiyon · YAZILIM · Referanslar · Rehber · İletişim' şeklinde kurulmalı. /yazilim bir hub (üst) sayfa olsun, altında her ürünün kendi kalıcı adresi bulunsun: /yazilim/arac-degerleme-yazilimi · /yazilim/galeri-yonetim-yazilimi · /yazilim/qr-dijital-menu · /yazilim/kafe-otomasyon · /yazilim/arac-ilan-gorsel-uretici · /yazilim/spor-ligi-sitesi · /yazilim/ajans-yonetim-yazilimi. Sebep: Google'da sıralanacak olan ürün sayfasıdır, hub değil. MAY MOTORS'ta öğrenilen dersi tekrarlamayın — orada 32 yazı '#/blog/<slug>' diyezli adreslerde durduğu için Google'ın gözünde TEK sayfa sayılıyordu ve hiçbiri sıralanamıyordu (REHBER-SEO-RAPORU-2026-09-19.md). Diyezli (#/) rota kullanmayın, her sayfa sunucuda üretilsin.
- ÜRÜN SAYFASI KALIBI (7 ürün için aynı iskelet, doldurulacak): 1) H1 = aranan ifade, ürün adı değil. 2) Tek cümlelik ne işe yarar. 3) 'Kimin derdini çözer' — 3 madde, müşterinin ağzından. 4) 'Nasıl çalışır' — 3-5 adım + ekran görüntüsü. 5) 'Özellikler' — yalnız kodda doğrulanmış olanlar (bu raporun 'somut özellikler' kısımlarını kullanın). 6) 'Hangi işletmeler için' — sektör listesi (yerel arama için şehir/semt geçsin). 7) SSS — 3-5 soru (sayfada görünür, açılır kapanır; MAY MOTORS rehberinde aynısı yapıldı). 8) Teknoloji kutusu (tek satır). 9) Kapanış CTA: 'Benzerini işletmeniz için kurgulayalım' → WhatsApp + form. 10) JSON-LD: SoftwareApplication veya Service + BreadcrumbList; sayfanın altında Organization/LocalBusiness (Ajans Flow, 4.Levent adresi, telefon) sabit dursun.
- MAY-Aİ SAYFASI — vitrinin baş köşesi, en ağır teknik referans: Başlık olarak 'Araç Değerleme Yazılımı' (aranan ifade) kullanın, 'MAY-Aİ' marka adını alt başlıkta verin. Anlatım sırası: (a) problem — 'galeri aracı kaça alacağını kafadan karar veriyor', (b) çözüm — 'piyasadaki ilanlardan öğrenen fiyat motoru', (c) en etkileyici üç rakam: yüzlerce model kataloğu, 50'ye yakın otomatik test, 7/24 çalışan 3 bilgisayarlı tarama ağı. GÖSTERİLECEK EKRANLAR: (1) MAY-Aİ paneli — 'üç bilgisayarın o saniye ne yaptığı' canlı ekranı, güvenlik kamerası benzetmesiyle anlatılır, çok etkileyici; (2) rapor/2026-09-18.html haftalık piyasa raporu (en çok alınıp satılanlar, yükselen/gerileyen, en hızlı satan) — ekran görüntüsü için hazır duruyor; (3) değerleme sonucu ekranı: teklif + 'dayanak ilanlar' + güven göstergesi. SATIŞ BAŞLIĞI OLARAK EN GÜÇLÜ CÜMLE: 'Veri yoksa rakam vermez.' Yazılım, yakın kayıt bulamazsa null döner ve site 'ekibimiz arayacak' der — uydurma fiyat üretmiyor. Bu, 'yapay zekâ uyduruyor' endişesine verilen en ikna edici cevap ve rakiplerin söyleyemediği bir şey. İkinci güçlü cümle: 'İşçi bilgisayarlarda hiçbir şifre durmaz' — panelden yetki kesilebilen cihaz anahtarı mimarisi. KVKK/güvenlik hassasiyeti olan müşteriye bu tek başına satar.
- GÖRÜNÜR DEMO ÖNCELİĞİ (ziyaretçi 'çalışıyor' diye görmeli): Sırayla şunlar demo edilebilir — (1) Kule İstanbul QR menü: statik, bağımsız, telefonda birebir açılıyor; sitede GERÇEK QR KODU bastırıp 'telefonunla okut' deyin, en çarpıcı etkileşim bu. (2) OtoKart Pro: tarayıcıda açılıp çalışıyor; kısa ekran kaydı (video) alın — 'form doldur → Instagram postu çıkıyor' 15 saniyede anlaşılır. (3) İlan Sihirbazı maketi (maymotors-web/ilan-sihirbazi-maket-v1.html): kaporta şemasına tıklayınca ilan önizlemesinin değişmesi, 'maket' anlatımı için ideal. (4) Mola Kafe POS: 43 ürün ve 15 masa hazır gömülü olduğu için demoda boş ekran yok. UYARI: Hiçbir demoda gerçek müşteri verisi (MAY MOTORS kasası, müşteri telefonu, plaka) GÖRÜNMEMELİ; demo kopyaları ayrı klasörde, sahte veriyle hazırlanmalı.
- EKRAN GÖRÜNTÜSÜ KARA LİSTESİ — şunların karesi ASLA siteye konmasın: (1) may-motors-finans/js/firebase-config.js — proje kimlikleri ve apiKey açıkta (teknik olarak sır değil ama algı kötü). (2) Kule menüsündeki 'Kalori / Protein / Karbonhidrat / Yağ' tablosu — o sayılar rastgele üretilmiş (enrich_data_advanced.py:114-126). (3) Kule menüsünün İngilizce/Almanca/Arapça kareleri — çeviride Türkçe kelimeler kalmış ('Sahanda Egg', 'Sınırsız Tea'). (4) oto-kart klasörünün dosya listesi — 150+ tek kullanımlık betik, dağınıklık izlenimi verir. (5) MAY MOTORS muhasebe ekranlarında gerçek ortak adları, plakalar, kasa bakiyeleri — bulanıklaştırılmalı veya sahte veriyle yeniden alınmalı. (6) Panel/admin adresleri (maymotors.net/admin/...) okunur hâlde.
- MÜŞTERİ İZNİ — yazmadan önce alınacak: MAY MOTORS, Kule İstanbul Cafe, Minik Starlar Ligi (ÖSF Sportif Faaliyetler) ve MAS için marka adı, logo ve ekran görüntüsü kullanım izni yazılı alınmalı. İzin alınamayanlar sektör adıyla anlatılır ('İstanbul'da bir oto galeri için', 'Sarıyer'de bir kafe için'). Minik Starlar Ligi'nde iş kolay: sitenin kendi verisinde 'mediaPartner: Ajans Flow' yazıyor ve public/ajansflow-logo.png zaten sitede duruyor — zaten ilan edilmiş bir ortaklık.
- ÜÇ ÜRÜNDE ANLATIM DÜZELTİLMELİ (yoksa yanlış vaat olur): (1) nar-pos → arka ucu yok, veri yalnız o tarayıcıda (localStorage). 'Bulut', 'çok cihaz', 'şubeler arası' DEMEYİN. Doğru çerçeve: 'Çalışan kafe otomasyon maketi — bulut ve çok cihaz desteği talebe göre eklenir.' Hem dürüst, hem yükseltme satışına kapı açıyor. Ayrıca klasör adı 'nar-pos' ama uygulama 'MOLA KAFE' markalı; sitede tek bir ada karar verin. (2) sahibinden_agent → 363 satırlık bir prototip, tek model (Fiat Egea) tanımlı, testi yok. 'Ürün' değil; 'MAY-Aİ'nin çıkış noktası olan ilk deneme' olarak Ar-Ge hikâyesinde anlatılırsa değer katar. (3) mas-platform → README'si 'FAZ 0 → FAZ 1' diyor, henüz bitmemiş; bitmiş ürün gibi anlatılmasın.
- VERİ KAZIMA DİLİ — hukuki ve itibari risk, cümleler önceden kararlaştırılmalı: Sitede 'rakip siteleri kazıyoruz', 'ilan sitelerinden veri çekiyoruz', 'sahibinden'den fiyat topluyoruz' gibi tek bir cümle bile geçmesin. Gerekçe kodun kendi belgelerinde yazılı: ilan sitesinin robots.txt'i yapay zekâ tarayıcılarını tüm siteden yasaklıyor ve bu yüzden o yoldan veri çekilmiyor (CLAUDE-DEVIR-NOTU-PAKET-GUVENLIK-2026-09-29.md); MAY-Aİ ise bot doğrulamasını bilerek kendisi geçmiyor, insanı bekliyor (OKU-BENI.md). KULLANILACAK DOĞRU ÇERÇEVE: 'herkese açık piyasa verisinden fiyat modelleme', 'müşterinin kendi cihazlarında, insan temposunda, kurallara saygılı çalışan toplama', 'veri işletmenin kendi mülkiyetinde kalır'. Hedef site adı hiçbir yerde verilmesin. Bu çerçeve hem doğru hem daha prestijli duruyor.
- 'NASIL ÇALIŞIYORUZ' SAYFASI — ajansın en farklılaştırıcı varlığı: Portföyde süreç kanıtı fazlasıyla var, bunu satmıyorsunuz. Anlatılacak 4 aşama ve her birinin gerçek kanıtı: (1) ÖN İNCELEME — maymotors-web/on-inceleme-v1.html 'nasıl kurulur, ne alınır, kaça mal olur' belgesi; müşteri işe girmeden kapsamı ve maliyeti görüyor. (2) MAKET — tıklanabilir prototip (ilan sihirbazı, OtoBid, prototip-v1.html); onay sonrası kod yazılıyor. (3) GELİŞTİRME VE TEST — MAY MOTORS'ta 211 test dosyası, MAY-Aİ'de 52; 'gerçek para hataları bulunup teste kilitlendi' (DEVIR-NOTU.md'deki 'asla geri alınmaması gereken düzeltmeler' bölümü, 579.400 TL'lik hayali kâr vakası). (4) YAYIN VE BAKIM — otomatik yayın bekçisi, günde iki kez otomatik veri yedeği, 11 güvenlik denetim raporu, KVKK belgeleri. SATIŞ CÜMLESİ: 'Kodu yazmak işin yarısı; yayına almak, ölçmek ve yedeklemek diğer yarısı.' Çoğu ajansın gösteremeyeceği şey bu.
- SEO OMURGASI — MAY MOTORS'ta işe yarayan kalıbı birebir tekrarlayın: Orada 32 ince yazı (~8.500 kelime) 30 derin yazıya (40.119 kelime, yazı başına ortalama 1.337 kelime, 30'unda SSS, 120+ şema) dönüştürüldü ve 6 konu kümesinin her birine /rehber/konu/<anahtar> hub sayfası verildi (topical authority). Ajans Flow sitesinde aynısı kurulsun: /rehber altında 5-6 küme — 'Yazılım' · 'Web sitesi ve SEO' · 'Sosyal medya' · 'Prodüksiyon' · 'İstanbul/4.Levent yerel'. İLK 10 YAZI ÖNERİSİ (hepsi mevcut işlerden çıkarılabilir, uydurma gerekmiyor): 'İşletmeme özel yazılım mı, hazır program mı?' · 'QR dijital menü nasıl kurulur, neye dikkat edilir' (alerjen ve çok dil mevzuatıyla) · 'Google reklamına verdiğim para geri dönüyor mu? Ölçümü nasıl kurulur' (huni + plaka eşleştirme zincirini anlatın) · 'Ortaklı işletmede kasa nasıl takip edilir' · 'Oto galeriler için dijital düzen: vitrin, ilan, değerleme, muhasebe' · 'Web sitesi fiyatları: neye ne kadar ödersiniz' (ön inceleme belgesi kalıbıyla) · 'KVKK uyumlu form nasıl kurulur' · 'Sahte form gönderimi (spam) nasıl engellenir: WhatsApp OTP' · 'Kafe ve restoran için dijital sıra: menü, POS, Google yorumu' · '4.Levent ve Levent'teki işletmeler için dijital kontrol listesi'. KURAL: MAY MOTORS rehberinde uygulanan ilkeyi koruyun — kaynağı olmayan rakam, yüzde ve 'ortalama X TL' yazmayın; uydurma veri grafiği kullanmayın.
- TEKNİK SEO KONTROL LİSTESİ (Google'da indekslenmek için, MAY MOTORS deneyiminden): (1) Tek alan adına karar verin — apex mi www mi; diğeri 301 ile buna dönsün. MAY MOTORS'ta vitrin apex, Next tarafı www kullandığı için Google iki ayrı site görmüş ve sinyaller bölünmüştü. (2) Her sayfada kendine ait title, description, canonical, Open Graph ve Twitter kartı olsun. (3) sitemap.xml yalnız halka açık sayfaları listelesin; panel, API ve demo adresleri GİRMESİN. (4) robots.txt + gerekli yerlerde noindex: demo ve müşteri panelleri indekslenmesin. (5) JSON-LD: Organization + LocalBusiness (Ajans Flow, 4.Levent adresi, telefon, çalışma saatleri, koordinat, hizmet bölgesi) her sayfada; ürün sayfalarında Service/SoftwareApplication; rehberde BlogPosting + BreadcrumbList; liste sayfasında CollectionPage + ItemList. (6) FAQPage işaretlemesi beklenti kurmadan eklenebilir ama Google Ağustos 2023'ten beri SSS zengin sonucunu kısıtlıyor — soru-cevabı sayfada GÖRÜNÜR tutmak asıl faydayı veriyor. (7) Her yazı için 1200×630 markalı paylaşım görseli üretilsin (MAY MOTORS'ta derleme anında üretiliyor). (8) Görseller mümkün olduğunca sayfa içinde SVG olsun — ek dosya isteği yok, her ekranda net, CSP güvenli, açılış hızı düşmüyor. (9) Mobilde yatay taşma olmasın; geniş tablolar sayfayı itmek yerine kendi içinde kaysın. (10) Yayından sonra: Search Console'a sitemap gönder, apex+www mülkiyetini ekle, ilk 10 sayfayı 'URL denetimi' ile elle indeksletmeye ver, 4-6 hafta sonra gösterim alıp tıklanmayan başlıkları yeniden yaz, Google İşletme Profili ile sitedeki ad-adres-telefon (NAP) bilgisini birebir aynı tut (yerel aramada en çok bunu etkiliyor).
- YEREL SEO — '4.Levent' avantajını kullanın: Ürün ve hizmet sayfalarında 'İstanbul', 'Levent', '4.Levent', 'Şişli', 'Beşiktaş', 'Maslak' gibi ifadeler zorlamadan geçsin; ayrıca birkaç yerel iniş sayfası kurulabilir ('Levent'te web yazılımı', 'İstanbul'da QR dijital menü'). LocalBusiness JSON-LD'de adres, koordinat ve çalışma saatleri eksiksiz olsun. Google İşletme Profili açılsın/güncellensin ve sitedeki NAP ile birebir aynı tutulsun. Portföydeki yerel bağlar da bu işi destekliyor: Sarıyer (Kule İstanbul Cafe), Maslak (MAY MOTORS), Eyüpsultan (Minik Starlar Ligi), İstinye (MAS) — 'İstanbul'un dört bir yanında işletmelerle çalışıyoruz' cümlesinin arkası dolu.
- ÜRÜNLERİ SEKTÖR PAKETİNE ÇEVİRİN (tek tek yazılım satmak yerine): Sitede 3 paket sayfası kurulsun, her biri mevcut ürünlerin birleşiminden oluşsun. (1) 'OTO GALERİ DİJİTAL PAKETİ' = vitrin sitesi + ilan sihirbazı + araç değerleme + ortak kasası/muhasebe + ilan görseli üretici + reklam ölçümü. Portföyde hepsi var, en güçlü paket bu. (2) 'KAFE & RESTORAN PAKETİ' = 4 dilli QR menü + POS/adisyon + Google yorumu toplama + sosyal medya içerik üretimi. (3) 'SPOR OKULU & ORGANİZASYON PAKETİ' = geri sayımlı kayıt sitesi + WhatsApp kayıt akışı + Instagram akışı + etkinlik JSON-LD + maç/etkinlik içerik üretimi. Her pakette ajansın iki tarafı (yazılım + sosyal medya/prodüksiyon) birlikte satılır — ajansın tek rakipsiz yönü bu birleşim.
- ANA SAYFA KURGUSU: (1) Hero — tek cümlede ikili kimlik: 'İşletmenizin görünür yüzünü de, arkadaki yazılımını da biz kuruyoruz.' (2) Hemen altına 3 rakam şeridi: kaç ürün, kaç sektör, kaç otomatik test (263 — MAY MOTORS 211 + MAY-Aİ 52; dürüst ve etkileyici bir sayı). (3) 'Ne yapıyoruz' üç kart: Yazılım · Sosyal Medya · Prodüksiyon. (4) ÖNE ÇIKAN İŞ: MAY MOTORS vaka çalışması — 'bir oto galerinin bütün dijital işi' başlığıyla, çünkü portföydeki en derin iş. (5) QR menü demosu (gerçek QR kod, telefonla okutulacak). (6) Sektör paketleri. (7) 'Nasıl çalışıyoruz' 4 aşama. (8) Rehberden son 3 yazı. (9) İletişim + WhatsApp. ÖNEMLİ: Ana sayfada 'yapay zekâ' ifadesini başlık olarak kullanmayın; MAY-Aİ'nin kendi tanımı bile 'yapay zekâ tokeni kullanmaz' diyor. 'Veriden öğrenen fiyat motoru', 'otomatik', 'kendi kendine çalışan' gibi somut ifadeler daha doğru ve daha inandırıcı.
- VAKA ÇALIŞMASI SAYFASI — MAY MOTORS için ayrı ve uzun bir sayfa yazılsın (/referanslar/oto-galeri-dijital-donusum): Problem → yapılanlar → sonuç kurgusu. Anlatılacak somut kalemler: 37 API uç noktası, 76 sunucu modülü, 41 rehber yazısı, 211 test, WhatsApp OTP ile spam'in kesilmesi, plaka üzerinden reklam→kâr zincirinin kurulması, ziyaretçi hunisi (kaç kişi girdi → kaç kişi fiyat gördü), günde iki kez otomatik veri yedeği, 11 güvenlik denetimi, 8 KVKK belgesi, avukat onaylı müşteri metinleri. Bu sayfa 'ajans mı yazılım evi mi?' sorusunu kalıcı olarak kapatır. Rakamlar bu rapordan alınabilir; hepsi kodda doğrulandı.
- BELGE-KOD ÇELİŞKİSİ — siteye rakam yazmadan önce kapatın: Üç yerde ürün belgesi koddan geri kalmış. (1) may-degerleme/OKU-BENI.md '46 model' diyor, motor/modeller.json 1.057 model içeriyor. (2) Aynı belge '36 birim testi' diyor, test/ klasöründe 49 birim + 3 e2e dosyası var. (3) REHBER-SEO-RAPORU '30 yazı' diyor (19.09 tarihli), src/icerik/rehber.js bugün 41 yazı içeriyor. Siteye hangi rakamın yazılacağına karar verilmeli — GÜVENLİ YOL: yuvarlak ve aşağıdan ifadeler ('yüzlerce model', '50'ye yakın otomatik test', '40'tan fazla rehber yazısı'). Ayrıca iki Next.js projesinin (may-motors-next, msl-web) README'si hâlâ varsayılan şablon; sitede 'belgelendirme yapıyoruz' denecekse önce bunlar yazılmalı.
- AYRI İŞ OLARAK AÇILMASI GEREKENLER (siteden bağımsız, ama bu araştırmada ortaya çıktı): (1) KULE MENÜSÜNDEKİ BESİN DEĞERLERİ — rastgele üretilmiş sayılar müşterinin menüsünde kalori/protein olarak görünüyor. Mekâna bildirilmeli; ya gerçek değerler girilmeli ya o bölüm kapatılmalı. Tüketici mevzuatı açısından gerçek risk. (2) Kule menüsünün EN/DE/AR çevirilerinde kalan Türkçe kelimeler elden geçirilmeli. (3) oto-kart klasörü temizlenmeli — ürün dosyaları (index.html, app_v10.js, ig_generator.js, ig_rent.js, car_logos.js, banners.js, logo_pdf.js, autosave.js) ayrı bir 'urun/' klasörüne alınıp 150+ geliştirme betiği arşive taşınmalı; demo vermek için zaten gerekli. (4) may-degerleme 2 klasörü eski bir dağıtım kopyası (manifest 5.3.0 vs 6.1.6) — karışıklık yaratmaması için arşivlenmeli. (5) mas-platform için ayrı bir araştırma turu çalıştırılmalı; doğru anlatılırsa sitenin en ağır referansı olur. (6) Klasörde GoogleReviewBot adlı bir proje de var (Google yorumlarını toplayıp otomatik yanıt üreten betikler) — görev kapsamında olmadığı için incelemedim, ama Kule menüsündeki 'Google'da bizi değerlendirin' akışıyla birleşirse satılabilir bir 'Google yorum yönetimi' hizmeti çıkar; ayrıca araştırılmalı.