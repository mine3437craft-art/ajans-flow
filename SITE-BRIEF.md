# Ajans Flow kurumsal web sitesi — brief

Bu dosya sitenin tek kaynaklı tanımıdır. Siteyi yapan bütün ajanlar önce bunu okur.
Sahibi: Eren (Ajans Flow). Güncelleme: her yeni istek buraya işlenir.

## 1. Amaç

- Müşteri adayına gönderilen, ajansı tam olarak anlatan kurumsal site.
- Google'dan müşteri getirmek (SEO + Rehber yazıları).
- Satış görüşmesinde ekranda açılıp gösterilebilecek bir "vitrin".

## 2. Kapsam

Çok sayfalı site, kendi alan adında, mevcut yönetim paneliyle aynı Next.js projesinde ayrı
herkese açık rotalarda. İletişim formu doğrudan panelin aday listesine düşer.

## 3. Hizmetler (sitede ayrı ayrı anlatılacak)

### A. Sosyal medya ve prodüksiyon
- Sosyal medya yönetimi, içerik stratejisi ve planlama
- Profesyonel fotoğraf çekimi, video & Reels prodüksiyonu, kurgu/edit paketleri
- Drone çekimleri
- Etkileşim & takipçi büyütme, veri analizi & performans optimizasyonu

### B. Reklam yönetimi
- Meta Business (Instagram/Facebook) reklam yönetimi — kurulum, kampanya, optimizasyon
- Google Ads yönetimi
- Google İşletme Profili düzenleme ve yönetimi

### C. Web ve tasarım
- Her ihtiyaca uygun web sitesi tasarımı ve yazılımı
- Sektöre özel entegrasyonlu siteler (ör. go kart için rezervasyon/seans, galeri için ilan akışı)
- Grafik tasarım & kurumsal kimlik (logo, menü, katalog)

### D. QR dijital menü (ayrı ve detaylı bölüm)
- Mevzuata uygun QR menü tasarımı (yürürlük tarihi ve madde iddiası, doğrulanan bilgiye göre yazılacak)
- Çok dilli menü (Kule İstanbul Cafe: TR/EN/DE/AR), menüde arama, alerjen ve diyet filtreleri,
  kategori gezinme, anında fiyat güncelleme
- İsteğe bağlı modüller: **QR üzerinden sipariş**, **rezervasyon**

### E. Otomotiv sektörüne özel yazılımlar (ajansın en ayırt edici tarafı, detaylı anlatılacak)
- Muhasebe / finans takip yazılımı (galeri için gelir-gider, araç bazlı kârlılık)
- sahibinden.com ilanları için açıklama ve görsel oluşturma yazılımı
- Araç değerleme sitesi ("aracının değerini öğren, hemen sat")
- sahibinden.com ile senkronize çalışan web sitesi (ilanların siteye akması)
- Gerçek örnek: May Motors

## 4. Sektör sayfaları (müşteriye gösterilecek, SEO'nun belkemiği)

Her meslek dalı için ayrı sayfa; her sayfada **hem web sitesi hem sosyal medya** tarafı anlatılır,
o sektöre özel entegrasyonlar ve varsa referans gösterilir. Sayfa iskeleti:
sektörün derdi → web sitesinde ne yapıyoruz (entegrasyonlar) → sosyal medyada ne yapıyoruz →
örnek iş / referans → sektöre özel SSS → ücretsiz analiz çağrısı.

| Sayfa | Odak | Entegrasyon örneği | Referans |
|---|---|---|---|
| Go kart / eğlence merkezi | Seans ve rezervasyon | Online rezervasyon, seans takvimi, turnuva duyuruları | MAS Go Kart |
| Oto galeri / otomotiv | İlan ve değerleme | sahibinden senkron, değerleme formu, ilan sihirbazı, muhasebe | May Motors |
| Kafe / restoran | Menü ve sipariş | QR menü, sipariş, rezervasyon, Google İşletme | Kule İstanbul, Kök Cafe, Mançurya |
| Avukat / hukuk | Güven ve randevu | Randevu formu, uzmanlık alanları, KVKK uyumlu iletişim | — |
| Mimar / iç mimar | Proje vitrini | Proje galerisi, 3B/360 görsel, teklif formu | Mimar Elif Kara |
| Diş kliniği / sağlık | Randevu ve güven | Randevu formu, hekim tanıtımı, öncesi-sonrası (mevzuata dikkat) | Dent 50 Clinic |
| Spor salonu | Üyelik | Üyelik/deneme dersi formu, ders programı | — |
| Anaokulu / eğitim | Veli güveni | Kayıt formu, veli bilgilendirme, kurum tanıtımı | — |
| Güzellik / kuaför | Randevu | Online randevu, hizmet listesi, Instagram akışı | — |
| Otel / turizm | Rezervasyon | Rezervasyon talebi, oda vitrini, çok dilli site | — |
| Emlak / inşaat | Portföy | İlan/portföy listesi, proje sayfaları | — |
| Mağaza / e-ticaret | Satış | Ürün vitrini, WhatsApp sipariş, kampanya sayfaları | — |

Referansı olmayan sektörlerde **uydurma müşteri gösterilmez**; onun yerine "sektöre özel yaklaşımımız"
ve benzer işlerden örnek anlatılır.

## 5. Rehber (blog)

Google'da bulunmak için Türkçe rehber yazıları. Kategoriler: QR menü ve mevzuat, sosyal medya,
reklam (Meta/Google), web sitesi ve yazılım, sektör rehberleri. Her yazının sonunda ilgili hizmete
doğal yönlendirme ve SSS. İçerik AF 02 sohbetinde üretiliyor (`~/Desktop/AJANSFLOW_REHBER/`).

## 6. Dönüşüm

- İletişim formu → panelde `prospects` tablosuna aday olarak düşer (kaynak: "Web sitesi"),
  KVKK aydınlatma onayı ve gizlilik sayfası zorunlu, spam koruması (honeypot + hız sınırı).
- WhatsApp ve Instagram DM düğmeleri her sayfada ulaşılabilir.
- "Ücretsiz dijital analiz" ana çağrı.

## 7. İçerik ve medya

- Videolar: MAS Go Kart arşivi (siteye hazır H.264), May Motors tanıtım videosu, Instagram Reels
  (AF 01 sohbetinde arşivleniyor). Sitede **sessiz**, döngüde, poster görselli oynar
  (müziklerin ticari kullanım hakkı doğrulanmadı).
- Fotoğraf: müşteri arşivlerinden seçilmiş kareler. Ajansın kendi ofis/ekip fotoğrafı yok.
- Müşteri logoları: SVG/PNG olarak referans şeridinde.

## 8. Kurallar

- **Uydurma yok:** müşteri yorumu, ödül, "%X artış", fiyat, sertifika iddiası yazılmaz.
  Yalnızca doğrulanmış bilgi. Rakamlar: 12+ marka, 244+ Instagram gönderisi, İstanbul / 4.Levent.
- Yeni npm paketi yok (saf CSS + küçük vanilla JS). Next.js 16 App Router, React 19, TypeScript.
- Mobil öncelikli; WhatsApp/Instagram uygulama içi tarayıcısında kusursuz çalışmalı, 3G'de hızlı açılmalı.
- Yönetim paneline hiçbir şekilde zarar vermemeli: stiller sızmamalı, oturum akışı bozulmamalı.
- SEO: sayfa başına özgün başlık/açıklama, sitemap.xml, robots.txt, yapısal veri
  (Organization, LocalBusiness, Service, FAQPage, Article, BreadcrumbList), Search Console doğrulaması.

## 8.1 Sahibinin kararları (6 Ekim 2026)

- **Fiyat:** Sitede rakam YAZILMAZ. Bunun yerine **paket kapsamları** anlatılır
  ("şu paketin içinde ne var") ve teklif/ücretsiz analiz formuna yönlendirilir.
  Arama trafiği için "… fiyatları" aramalarını hedefleyen sayfalar yapılabilir ama
  içlerinde rakam değil, fiyatı belirleyen kalemler + paket kapsamı + teklif formu olur.
- **Yazılımlar:** MAY-Aİ değerleme, galeri muhasebesi, ilan sihirbazı gibi işler
  **"yaptığımız iş" (vaka çalışması)** diliyle anlatılır; ürün satışı/lisans dili kullanılmaz.
  QR menü, ajansın verdiği bir **hizmet** olarak anlatılır (tasarlar ve kurarız), Kule İstanbul
  ve Kök Cafe işleriyle örneklenir; sipariş ve rezervasyon modülleri "isteğe bağlı eklenebilir" diye geçer.
- **sahibinden.com:** Dikkatli dil. "İlan açıklaması ve görseli hazırlama, ilan yönetim akışı,
  fiyat araştırması" denir; "sahibinden'den otomatik veri çekiyoruz / senkronizasyon" İDDİA EDİLMEZ.
- **Google İşletme Profili:** Yok, açılacak. Site yayına girince profil açılıp siteyle bağlanacak,
  yapısal veri (LocalBusiness) profille birebir aynı bilgileri taşıyacak.
- **QR menü mevzuatı:** "Zorunlu / ceza" dili KULLANILMAZ. Doğrusu (bkz. arastirma/02-qr-menu-mevzuati.md):
  karekod menü zorunlu değil, izin verilen bir ek yöntem (11 Ekim 2025); giriş kapısındaki fiziki
  fiyat listesi hâlâ zorunlu; 1 Temmuz 2026 tarihi ulusal zincirlerin içerik/kalori bildirimiyle ilgili;
  karekod kullanılıyorsa "okuyamayan müşteriye bilgi ayrıca verilir" bilgilendirmesi zorunlu;
  servis/kuver ücreti yasak (30 Ocak 2026); fiyat listesinde tüm ürünler bulunmalı, ceza ürün başına.

## 9. Sahibi onayladı

- **Referans logoları kullanılabilir** (MAS Go Kart, May Motors, Kule İstanbul, Kök Cafe, Mimar Elif
  Kara vb.). Logolar referans şeridinde ve ilgili sektör/vaka sayfalarında görünür.
- **Müşteri videoları kullanılabilir** — sitede sessiz ve döngüde oynatılır.

## 10. Sahibinden beklenenler (açık kalan)

- Alan adı tercihi
- Sitede görünecek telefon / WhatsApp / e-posta / açık adres / çalışma saatleri
- Ajans Flow logo dosyası (yoksa Instagram profil görselinden yeniden çizilecek)
- Fiyat gösterilsin mi (şimdilik varsayım: fiyat yok, paket anlatımı + ücretsiz analiz)
