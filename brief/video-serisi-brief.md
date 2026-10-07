# AJANS FLOW — 5 VİDEOLUK TANITIM SERİSİ BRIEF

Hazırlanma tarihi: 7 Ekim 2026
Hazırlayan: Claude (brief ajanı), Ajans Flow deposundaki doğrulanmış kaynaklardan derlendi
Kime: Videoları üretecek yapay zekâya. Ajans Flow hakkında hiçbir ön bilgisi olmadığı varsayılmıştır.

---

## BU BRIEF'İ OKUYAN YAPAY ZEKÂ İÇİN KULLANIM TALİMATI

1. Bu brief'teki **hiçbir rakamı, iddiayı veya mevzuat bilgisini değiştirmeyin, yuvarlamayın veya
   "daha etkileyici" hâle getirmeyin.** Kaynağı yazılı olan bilgiler kodda/mevzuatta doğrulanmıştır.
2. Brief'te olmayan bir bilgiyi videoya **eklemeyin**. Müşteri yorumu, ödül, memnuniyet oranı,
   "%X artış", ciro, takipçi artışı, sertifika, kuruluş yılı, ekip sayısı — bunların hiçbiri
   elimizde YOK. Uydurulursa işletme hukuki risk altına girer.
3. Fiyat ve teslim süresi **hiçbir videoda geçmeyecek** (işletme sahibinin kesin kararı).
4. 7. bölümdeki eksikler kapatılmadan 2, 3 ve 4 numaralı videolar **çekilemez** — gerekli medya yok.

### İşaret sözlüğü

| İşaret | Anlamı |
|---|---|
| `[Kaynak: …]` | Bilgi bu dosyada/URL'de doğrulandı, güvenle kullanılabilir |
| `[BİLİNMİYOR]` | Bilgi elimizde yok. Videoda bu konuda cümle kurulmayacak, işletmeye sorulacak |
| `[TAHMİN]` | Doğrulanmamış çıkarım. Videoda kullanılmadan önce işletmeye teyit edilecek |
| `[ÖNERİ]` | Bu brief'i yazanın yaratıcı teklifi; olgu iddiası değil, serbestçe değiştirilebilir |

---

# 1) AJANS FLOW GENEL BİLGİ

## 1.1 Ajans kim

**Ajans Flow**, İstanbul 4.Levent'te çalışan bir **sosyal medya ajansı + yazılım evi**.
Ayırt edici yönü: hem içerik (çekim, kurgu, sosyal medya, reklam) üretiyor, hem de yazılım
(web sitesi, QR menü, değerleme formu, muhasebe programı, yönetim paneli) yazıyor. Çoğu ajans
bunlardan yalnızca birini yapar.

Konumlandırma cümlesi (sitede kullanılan hâli):
> "İçeriği de yazılımı da aynı ekip yazıyor."
> [Kaynak: SITE-TASARIM.md §1]

Ana sayfa başlık varyantları (videoda kapanış cümlesi olarak kullanılabilir):
- "İşletmenizin görünen yüzünü de, arkadaki yazılımını da biz kuruyoruz."
- "Çekimden reklama, web sitesinden QR menüye: tek ekip, tek plan."
- "Dijitalde dağınık görünmek zorunda değilsiniz."
- "Fikirler hareket kazanır." (marka sloganı)
  [Kaynak: src/lib/site-icerik.ts → ANA_SAYFA.kahraman.baslikVaryantlari; src/lib/site.ts → MARKA.slogan]

## 1.2 İletişim bilgileri (videoların kapanış kartında kullanılacak)

| Alan | Değer |
|---|---|
| Telefon / WhatsApp | **0532 479 63 37** |
| E-posta | **ajansflow@gmail.com** |
| Instagram | **@ajansflow** (doğrulanmış / mavi tikli hesap) |
| Instagram DM kısayolu | ig.me/m/ajansflow |
| Web | **flowajans.com** — yeni site YAPIM AŞAMASINDA |
| Konum | İstanbul / 4.Levent |
| Çalışma saatleri | İşletme sahibi yazılmasını istemiyor — **videolarda geçmeyecek** |

[Kaynak: src/lib/site.ts → ILETISIM; SITE-BRIEF.md §8.1]

**DİKKAT:** flowajans.com henüz yayında değil. Kapanış kartında web adresi verilecek mi,
yoksa yalnız WhatsApp + Instagram mı gösterilecek — bu **işletmeye sorulmalı** (bkz. 7. bölüm).
Yayında olmayan bir adresi videoya yazmak izleyiciyi boş sayfaya götürür.

## 1.3 Doğrulanmış rakamlar (yalnız bunlar kullanılabilir)

| Rakam | Ne | Kaynak |
|---|---|---|
| **12+** | birlikte çalışılan marka | site-icerik.ts → ANA_SAYFA.guven |
| **244+** | üretilen Instagram gönderisi | SITE-BRIEF.md §8 |
| **4.Levent / İstanbul** | merkez | src/lib/site.ts |
| **12** | sektör sayfası (sitede anlatılan sektör sayısı) | site-icerik.ts → SEKTORLER (sayıldı) |
| **6** | yazılı vaka çalışması | site-icerik.ts → VAKALAR (sayıldı) |
| **15** | sitede ayrı ayrı anlatılan hizmet | site-icerik.ts → HIZMETLER (sayıldı) |

**ÇELİŞKİ UYARISI — videoda hizmet sayısı söylenecekse önce karar verilmeli:**
Sitenin güven şeridi "13 hizmet alanı" yazıyor, ama `HIZMETLER` dizisi 15 hizmet içeriyor.
İkisi uyuşmuyor. Güvenli yol: **sayı söylemeyin**, "tek çatı altında" deyin. Sayı kullanılacaksa
"13" mü "15" mi olduğu işletmeye sorulmalı. [Kaynak: site-icerik.ts, iki yer karşılaştırıldı]

**MARKA SAYISI ÇELİŞKİSİ:** İşletme sahibi 13 müşteri adı sayıyor; site "12+" diyor; medya
arşivinde 10 markanın dosyası var. Videoda rakam verilecekse **"12+ marka"** kullanın —
sitede onaylanmış ifade bu.

## 1.4 Videolarda ASLA söylenmeyecek şeyler (yasak listesi)

Bu liste işletme sahibinin kesin kararlarından ve hukuki risk analizinden geliyor.
[Kaynak: SITE-BRIEF.md §8 ve §8.1, SITE-TASARIM.md §8, arastirma/01-yazilim-urunleri.md,
arastirma/02-qr-menu-mevzuati.md]

**Uydurma yasağı — elimizde YOK, söylenmeyecek:**
- Müşteri yorumu / referans alıntısı — **elimizde yok**
- Ödül, sertifika, "Türkiye'nin en …" iddiası — **elimizde yok**
- Memnuniyet oranı, "%X artış", "satışları %Y büyüttük" — **elimizde yok**
- Müşteri cirosu, dönüşüm oranı, reklam getirisi rakamı — **elimizde yok**
- Takipçi artışı / takipçi sayısı — **videolarda kullanılmayacak** (sitede de yasak)
- Kuruluş yılı, ekip kişi sayısı — **[BİLİNMİYOR]**

**Karar kaynaklı yasaklar:**
- **Fiyat yazılmaz / söylenmez.** Paket kapsamı anlatılır, "ücretsiz analiz" çağrısına bağlanır.
- **Teslim süresi söylenmez.** "2 haftada teslim" gibi bir ifade yok; süre kapsama göre değişiyor.
- **Kurucunun ve ekibin yüzü görüntülerde kullanılmaz.**
- **Çalışma saati yazılmaz.**
- **"sahibinden.com'dan otomatik veri çekiyoruz / senkronizasyon kuruyoruz" İDDİA EDİLMEZ.**
  Doğru dil: "ilan açıklaması ve görseli hazırlama", "ilan yönetim akışı", "fiyat araştırması".
- **"Rakip siteleri kazıyoruz / ilan sitelerinden veri çekiyoruz" DENMEZ.** Hedef sitenin adı
  hiçbir videoda geçmez. Doğru çerçeve: "herkese açık piyasa verisinden fiyat modelleme".
- **QR menüde "zorunlu oldu / ceza yersiniz" korkutma dili KULLANILMAZ.** (Ayrıntı: Video 5.)
- Ana sayfa/hero dilinde **"yapay zekâ" başlık olarak kullanılmaz** — yazılımın kendi belgesi
  bile "yapay zekâ tokeni harcamaz" diyor. Doğru ifade: "veriden öğrenen fiyat motoru",
  "otomatik", "kendi kendine çalışan".
- Sinema jargonu yasak: timecode, 24fps, showreel gibi kelimeler kullanılmaz.

---

# 2) MARKA KİMLİĞİ

## 2.1 Renkler (kesin, kodda tanımlı)

```
--koyu          #0E0E16    ana kimlik zemini (koyu bant)
--koyu-2        #15151F    koyu bant içi kart
--kagit         #F7F5F2    açık bant / kâğıt beyazı
--beyaz         #FFFFFF
--turuncu       #FF6B35    marka vurgusu (KOYU zeminde metin olarak kullanılabilir)
--turuncu-koyu  #B83C13    AÇIK zeminde turuncu METİN — kontrast için zorunlu
--turuncu-dolu  #E2541F    dolu düğme zemini (üstüne beyaz yazı)
--ink           #14141F    açık zeminde ana metin
--ink-2         #4A4A5A    ikincil metin
```
[Kaynak: SITE-TASARIM.md §3]

**Zorunlu kural:** Açık zeminde turuncu metin **asla `#FF6B35` olmaz** (kontrast 2.9:1, okunmuyor),
**`#B83C13`** olur. Geniş turuncu dolgu kullanılmaz; turuncu çizgi, çip, aktif durum ve tek
vurgu rengidir.

## 2.2 İki bant ritmi (videolarda da uygulanacak) [ÖNERİ]

Sitede renk dekor değil **bilgi taşıyor**:
- **Açık / kâğıt zemin (#F7F5F2)** = stüdyo işleri: sosyal medya, çekim, reklam, tasarım
- **Koyu zemin (#0E0E16)** = yazılım işleri: QR menü, otomotiv yazılımları, web sitesi

Video serisinde aynı mantık korunmalı: **Video 1, 2, 3, 4 koyu zeminli** (yazılım tarafı),
**Video 5 karma** (yemek görüntüleri sıcak/açık, mevzuat kartları koyu).
[Kaynak: SITE-TASARIM.md §3 "İki bant ritmi" — eşleme önerisi bu brief'in teklifi]

## 2.3 Yazı tipleri

| Kullanım | Yazı tipi | Not |
|---|---|---|
| Başlık | **Bricolage Grotesque** | Büyük boylarda `letter-spacing: -0.03em` |
| Metin / altyazı | **Inter** | |
| Veri, etiket, kod | **JetBrains Mono** | Yazılım bantlarında etiket ve veri şeritleri |

[Kaynak: SITE-TASARIM.md §3; işletme sahibinin verdiği liste]
Alternatif başlık yazı tipi olarak Plus Jakarta Sans da onaylı. [Kaynak: SITE-TASARIM.md §3]

## 2.4 Logo ve sembol

**Tek mevcut dosya:** `public/site/marka/flow-sembol.svg`
- Şeffaf, vektörel, turuncu gradyanlı stilize "F" şeridi
- Gradyan renkleri: `#861500 → #F14B00 → #FFAE00` [Kaynak: dosyanın kendisi, satır 7-11]
- viewBox `270 190 800 880`, 800×880 px
- Kaynak: marka sahibi (Eren), 7 Ekim 2026 [Kaynak: dosya içi yorum satırı]

**Logo kullanım kuralları (zorunlu):**
- Germe, çarpıtma, renk değiştirme, gölge ekleme **YOK**
- Koyu ve açık zeminde olduğu gibi durur (gradyan ikisinde de okunuyor)
- Yanında kelime-işaret olarak "AJANS FLOW" tipografiyle yazılır: **sembol solda, yazı sağda**;
  dar ekranda yalnız sembol
  [Kaynak: SITE-TASARIM.md §3 "Marka sembolü"]

**EKSİK — videolar için kritik:** Beyaz, siyah ve yatay logo versiyonu **HENÜZ YOK**; ayrı bir
çalışma sürüyor. Videoda koyu zemin üstüne logo basılacaksa mevcut gradyanlı SVG kullanılacak
(gradyan koyu zeminde de okunuyor). Tek renk gerekirse `currentColor` ile düz bir kopya
üretilmeli. [Kaynak: işletme sahibinin bildirimi + SITE-TASARIM.md §3]

## 2.5 Ses tonu

- Abartısız, net, Türkçe. "Lider", "en iyi", "devrim" gibi büyük sözler yok.
- Vaat değil, **ne yapılacağı** anlatılır: "rakam vaadi vermiyoruz; ne yapacağımızı ve neyi
  ölçeceğimizi yazıyoruz." [Kaynak: site-icerik.ts → ANA_SAYFA.guven.notlar]
- "Önce maket, sonra kod" ajansın imza cümlesi.
- Müşterinin derdinden başla, çözümü sonra söyle.

## 2.6 Birincil çağrı (CTA)

Ana çağrı: **"Ücretsiz analiz iste"**
İkincil: "Çalışmalarımızı görün" · "WhatsApp'tan yazın"
[Kaynak: site-icerik.ts → ANA_SAYFA.kahraman]

---

# 3) TÜM HİZMETLERİN LİSTESİ

Sitede ayrı sayfası olan 15 hizmet. Her satırdaki özet metin **sitede yazılı hâlidir**,
videoda birebir kullanılabilir. [Kaynak: src/lib/site-icerik.ts → HIZMETLER]

## A. Sosyal medya ve içerik

| # | Hizmet | Tek cümlelik özeti |
|---|---|---|
| 1 | **Sosyal Medya Yönetimi** | Instagram ve Facebook hesaplarınızı plan, çekim ve yayın dahil uçtan uca biz yürütüyoruz. |
| 2 | **İçerik Stratejisi ve Planlama** | Ne yayınlayacağınızı, kime ve hangi sırayla anlatacağınızı yazılı bir plana dönüştürüyoruz. |
| 3 | **TikTok İçerik Üretimi ve Hesap Yönetimi** | TikTok hesabınızı platformun kendi diline göre kuruyor, seri içerik üretip düzenli yayınlıyoruz. |
| 4 | **Etkileşim ve Takipçi Büyütme** | Hesabınızı satın alınmış takipçiyle değil, size müşteri olabilecek gerçek kitleyle büyütüyoruz. |

## B. Prodüksiyon

| # | Hizmet | Tek cümlelik özeti |
|---|---|---|
| 5 | **Profesyonel Fotoğraf Çekimi** | Ürününüzü, mekânınızı ve ekibinizi satışa hizmet eden karelerle çekiyoruz. |
| 6 | **Video ve Reels Prodüksiyonu** | Fikirden kurguya kadar, ilk üç saniyede dikkat çeken kısa videolar üretiyoruz. |
| 7 | **Kurgu ve Edit (Post Prodüksiyon)** | Elinizdeki ham çekimleri kurgu, renk, ses ve altyazıyla yayına hazır videolara dönüştürüyoruz. |
| 8 | **Drone Çekimi** | Tesisinizi, projenizi ve etkinliğinizi havadan, tek karede anlatan görüntülerle çekiyoruz. |

## C. Reklam ve görünürlük

| # | Hizmet | Tek cümlelik özeti |
|---|---|---|
| 9 | **Meta, Google ve TikTok Reklam Yönetimi** | Üç platformdaki reklamlarınızı tek elden kuruyor, kreatifini üretiyor ve sonuç başına maliyet düşene kadar iyileştiriyoruz. |
| 10 | **Google Ads Yönetimi** | Hizmetinizi arayan kişinin karşısına, doğru anahtar kelimeyle ve ölçülebilir şekilde çıkıyoruz. |
| 11 | **Google İşletme Profili Yönetimi** | Haritalarda ve aramalarda doğru bilgiyle, güncel fotoğrafla ve yanıtlanmış yorumlarla görünmenizi sağlıyoruz. |
| 12 | **Veri Analizi ve Performans Raporlama** | Harcadığınız paranın karşılığını gösteren, okunabilir ve kararı kolaylaştıran raporlar kuruyoruz. |

## D. Web, yazılım ve tasarım

| # | Hizmet | Tek cümlelik özeti |
|---|---|---|
| 13 | **Web Sitesi Tasarımı ve Yazılımı** | Hazır şablon değil; işinizin akışına göre kurgulanmış, hızlı açılan ve form dolduran bir site yazıyoruz. |
| 14 | **QR Dijital Menü** | Misafirin telefonunda açılan, çok dilli ve aranabilir bir menü kuruyoruz; sipariş ve rezervasyon modülleri isteğe bağlı ekleniyor. |
| 15 | **Grafik Tasarım ve Kurumsal Kimlik** | Logodan menüye, katalogdan sosyal medya şablonlarına kadar her yerde aynı dili konuşan bir marka kimliği kuruyoruz. |

## E. Sektöre özel yazılım işleri (hizmet değil, "yaptığımız iş" diliyle anlatılır)

İşletme sahibinin kararı: bu işler **ürün satışı / lisans dili ile değil, vaka çalışması diliyle**
anlatılır. [Kaynak: SITE-BRIEF.md §8.1]

| İş | Ne yapıyor | Kaynak |
|---|---|---|
| **Araç değerleme akışı (MAY-Aİ)** | Marka/model/yıl/km/hasar girilince piyasa verisinden değer hesaplayıp ön alış teklifi gösteriyor | arastirma/01-yazilim-urunleri.md |
| **Galeri muhasebesi** | Çok ortaklı oto galeri için araç bazlı kâr/zarar, ortak kasaları, taksit, sigorta-vergi takibi | arastirma/01-yazilim-urunleri.md |
| **İlan açıklaması ve görseli hazırlama (OtoKart Pro)** | Tek veri girişinden markalı araç kartı, PDF ve Instagram gönderisi üretiyor | arastirma/01-yazilim-urunleri.md |
| **İlan yönetim akışı** | Galerinin kendi panelinden araç ekleme, fotoğraf yükleme, satıldı işaretleme | arastirma/01-yazilim-urunleri.md |
| **QR dijital menü** | 4 dilli, aranabilir, alerjen filtreli menü (Kule İstanbul Cafe) | arastirma/01-yazilim-urunleri.md |
| **Kafe otomasyon / POS maketi** | Masa, adisyon, kasa, rapor ekranları — **arka ucu yok, maket** | arastirma/01-yazilim-urunleri.md |
| **Spor ligi kayıt sitesi** | Geri sayımlı tanıtım sitesi + WhatsApp kayıt akışı (Minik Starlar Ligi) | arastirma/01-yazilim-urunleri.md |
| **Ajansın kendi iç yönetim yazılımı** | Müşteri, finans, kasa, görev, hedef, takvim modülleri — ajans kendi işini bununla yürütüyor | arastirma/01-yazilim-urunleri.md |

## F. Müşteri listesi (13 marka — işletme sahibinin verdiği liste)

MAS Go Kart · May Motors · Kule İstanbul Cafe · Kök Cafe Lounge · Minik Starlar Ligi ·
Coin Coffee · Teras Kilyos · Baraka Kanat · Mançurya Büfe · Lityum Servis · Dent 50 Clinic ·
Mimar Elif Kara · Airsoft İstinye

**Videoda marka adı/logosu geçecekse:** İşletme sahibi referans logolarının ve müşteri
videolarının **kendi web sitesinde** kullanılmasını onayladı [Kaynak: SITE-BRIEF.md §9].
Ancak **sosyal medyada yayınlanacak tanıtım videosu için ayrı yazılı izin alınması gerekip
gerekmediği [BİLİNMİYOR]** — medya raporu yazılı teyit öneriyor
[Kaynak: public/site/medya/RAPOR.md §8.4]. Bu 7. bölümdeki kritik sorulardan biri.

## G. Sektör sayfaları (12 sektör)

Go kart ve eğlence merkezi · Oto galeri ve otomotiv · Kafe ve restoran · Avukat ve hukuk bürosu ·
Mimar ve iç mimar · Diş kliniği ve sağlık · Spor salonu ve spor okulu · Anaokulu ve eğitim ·
Güzellik salonu ve kuaför · Otel ve turizm · Emlak ve inşaat · Mağaza ve e-ticaret
[Kaynak: site-icerik.ts → SEKTORLER]

## H. Çalışma süreci (5 adım — videolarda kullanılabilir)

1. **Ücretsiz analiz** → 2. **Strateji ve plan** → 3. **Çekim ve üretim** →
4. **Yayın ve reklam** → 5. **Raporlama ve büyüme**
[Kaynak: site-icerik.ts → SUREC]

Web ve yazılım işlerinde ek kural: **kod yazmadan önce tıklanabilir maket hazırlanır.**
[Kaynak: site-icerik.ts → ANA_SAYFA.surec.giris]

---

# 4) VİDEO SERİSİ

## 4.0 Seriye ortak kurallar

| Konu | Karar |
|---|---|
| Format | **Dikey 9:16**, 1080×1920 |
| Dil | **Türkçe** |
| Altyazı | **Her videoda gömülü (burned-in) zorunlu** — izleyicilerin çoğu sesi kapalı izler |
| Yüz | **Hiçbir videoda kurucunun/ekibin yüzü yok** |
| Fiyat | **Hiçbir videoda fiyat yok** |
| Teslim süresi | **Hiçbir videoda süre taahhüdü yok** |
| Kapanış kartı | Flow sembolü + "AJANS FLOW" + WhatsApp 0532 479 63 37 + @ajansflow |
| Son çağrı | "Ücretsiz analiz iste" veya "WhatsApp'tan yazın" |
| Müzik | Lisanslı/telifsiz kütüphane müziği. **Mevcut müşteri kliplerinin sesi kullanılmayacak** (bkz. 5. bölüm) |

Aşağıdaki 5 videonun **süre, kanca, çekim listesi ve seslendirme metinleri `[ÖNERİ]`dir** —
yaratıcı tekliftir, değiştirilebilir. **Olgu ve mevzuat bilgileri ÖNERİ DEĞİL**, kaynaklıdır ve
değiştirilemez.

---

## VİDEO 1 — OTOMOTİV: BİR OTO GALERİNİN DİJİTAL ZİNCİRİ

### a) Amaç ve hedef kitle
Oto galeri sahiplerine, ajansın otomotiv sektöründe **uçtan uca dijital iş** yaptığını
göstermek. Hedef kitle: İstanbul ve çevresindeki ikinci el oto galeri sahipleri, galeri
ortakları, oto ekspertiz işletmeleri.

### b) Ana mesaj (tek cümle)
"Galerinizin vitrini, ilanı, değerlemesi, muhasebesi ve reklam ölçümü — hepsini aynı ekip kurdu."

### c) Önerilen süre ve format [ÖNERİ]
**25–30 saniye**, dikey 9:16. Hızlı kesme ritmi; her bölüm 3–5 saniye.
Seri içinde "kapı açan" video olduğu için en geniş kapsamlı, en çok ekran gösteren video bu.

### d) Kanca — ilk 2 saniye [ÖNERİ]
Seçenek 1 (önerilen): Siyah ekranda tek satır yazı belirir ve sesli okunur:
> **"Galeride iki karar hâlâ sezgiyle veriliyor."**
Hemen ardından iki kelime çakar: **"Araç kaça alınacak?" / "Reklama ne verilecek?"**

Seçenek 2: Telefon ekranında bir araç değerleme formu hızla doldurulur, 2. saniyede rakam
alanı boş kalır ve üstüne "Peki bu rakam nereden geliyor?" yazısı gelir.

Gerekçe: Bu iki soru, May Motors vakasının yazılı "zorluk" bölümünden birebir alınmıştır —
uydurma değil. [Kaynak: site-icerik.ts → VAKALAR → may-motors.zorluk]

### e) Çekim listesi (shot list)

| # | Süre | Ne görünür | Nasıl üretilir | Ekran yazısı |
|---|---|---|---|---|
| 1 | 0–2 sn | Koyu zemin (#0E0E16), tek satır başlık | Animasyon | "Galeride iki karar sezgiyle veriliyordu." |
| 2 | 2–5 sn | Telefonda adım adım değerleme formu: marka, model, yıl, km | **EKRAN KAYDI — YOK, alınmalı** (maymotors.net "Hemen Sat" akışı veya yerel maket) | "Marka · Model · Yıl · Kilometre" |
| 3 | 5–8 sn | Kaporta parça haritası; parçalara dokununca Orijinal/Boyalı/Değişen/Lokal etiketi değişiyor | **EKRAN KAYDI — YOK.** Kaynak dosya var: `ilan-sihirbazi-maket-v1.html` (tooltip'li parça şeması) | "Her parça tek tek işaretleniyor" |
| 4 | 8–11 sn | Değerleme sonucu: iki ayrı teklif satırı | **EKRAN KAYDI — YOK**, sahte veriyle alınmalı | "Veri yetersizse rakam göstermiyoruz." |
| 5 | 11–14 sn | Markalı araç kartı / Instagram gönderisi oluşuyor | **EKRAN KAYDI — YOK.** Kaynak: OtoKart Pro `index.html` | "Tek veri girişi → ilan görseli" |
| 6 | 14–17 sn | Muhasebe ekranı: araç bazlı kâr, ortak kasaları | **EKRAN KAYDI — YOK**, sahte veriyle alınmalı | "Araç bazlı kâr · Ortak kasaları" |
| 7 | 17–20 sn | Reklam → talep → araç → kâr zincirinin animasyonlu şeması | Animasyon (SVG/motion) | "Reklamdan gelen talep, hangi araca döndü?" |
| 8 | 20–24 sn | Mevcut gerçek görseller montaj: telefonda canlı form + Reels tasarımları | **VAR:** `foto/maymotors-web-mobil-form.jpg`, `foto/maymotors-reels-tasarimi.jpg`, `foto/maymotors-reels-web-tanitimi.jpg` | "May Motors" + logo |
| 9 | 24–28 sn | Kapanış kartı | Animasyon | Flow sembolü · "Ücretsiz analiz iste" · 0532 479 63 37 · @ajansflow |

### f) Seslendirme / altyazı metni [ÖNERİ]
> "Galeride iki karar hâlâ sezgiyle veriliyordu: araç kaça alınacak, reklama ne kadar verilecek.
> Biz ikisini de veriye bağladık.
> Aracını satmak isteyen kişi, marka, model, kilometre ve kaporta durumunu giriyor; sistem
> piyasadaki benzer ilanlara bakıp değer hesaplıyor.
> Yeterli veri yoksa rakam göstermiyor — ekip arıyor.
> Aynı veriden ilan açıklaması ve ilan görseli çıkıyor.
> Arkada galeri muhasebesi duruyor: araç bazlı kâr, ortak kasaları, taksit takibi.
> Ve reklamdan gelen talebin hangi araca dönüştüğü tabloda görünüyor.
> Vitrin, ilan, değerleme, muhasebe, ölçüm — aynı ekip."

### g) Ekranda görünecek metinler ve CTA
Vurgu cümlesi (en güçlü, mutlaka ekranda büyük yazılmalı):
> **"Veri yoksa rakam vermiyoruz."**
Gerekçe: Yazılım yakın kayıt bulamazsa teklif üretmiyor, "ekibimiz arayacak" diyor. Uydurma
rakam üretmemesi doğrulanmış bir davranış. [Kaynak: arastirma/01-yazilim-urunleri.md → MAY-Aİ,
"VERİ YOKSA RAKAM YOK"]

CTA: "Ücretsiz analiz iste" + WhatsApp numarası.

### h) Kullanılacak medya

| Durum | Dosya |
|---|---|
| **VAR** | `public/site/medya/foto/maymotors-web-mobil-form.jpg` (739×1600 — dikey, ideal) |
| **VAR** | `public/site/medya/foto/maymotors-reels-tasarimi.jpg` (900×1600 — dikey) |
| **VAR** | `public/site/medya/foto/maymotors-reels-web-tanitimi.jpg` (720×1280) |
| **VAR** | `public/site/medya/logo/maymotors-logo-yatay.svg`, `maymotors-logo-beyaz.svg`, `maymotors-simge.svg` |
| **YOK — çekilmeli** | Değerleme akışının ekran kaydı (sahte veriyle) |
| **YOK — çekilmeli** | Kaporta parça haritası etkileşiminin ekran kaydı |
| **YOK — çekilmeli** | Muhasebe ekranının ekran kaydı (sahte veriyle) |
| **YOK — çekilmeli** | İlan görseli üretiminin ekran kaydı |

**May Motors'un video klibi BİLEREK SİLİNDİ:** arka planda odak dışında galeri aracının plakası
("34 MAY 811") kısmen seçilebiliyordu ve müşterinin brief'i plakanın görünmesini yasaklıyor.
Yerine plakasız/yüzsüz fotoğraflar konuldu. **Yeni çekimde de plaka görünmemeli.**
[Kaynak: public/site/medya/RAPOR.md §5]

### i) Yasaklar ve dikkat edilecekler
- **"sahibinden.com" adı geçmeyecek.** "Senkronizasyon / otomatik veri çekme" iddiası yok.
- **Plaka görünmeyecek.** Hiçbir karede okunabilir plaka olmayacak.
- **Gerçek müşteri verisi görünmeyecek:** gerçek ortak adları, kasa bakiyeleri, müşteri telefonu.
  Ekran kayıtları **sahte veriyle hazırlanmış demo kopyalardan** alınacak.
- **Panel/admin adresi okunabilir olmayacak** (tarayıcı adres çubuğu kapatılacak/bulanıklaştırılacak).
- `may-motors-finans/js/firebase-config.js` dosyasının ekranı **asla kullanılmayacak**
  (proje kimlikleri açıkta; teknik olarak sır değil ama algı kötü).
- Teklif rakamı gösterilecekse "örnek" damgası konulacak; gerçek bir araç değeri gibi sunulmayacak.
  [Kaynak hepsi: arastirma/01-yazilim-urunleri.md → "EKRAN GÖRÜNTÜSÜ KARA LİSTESİ";
  SITE-TASARIM.md §8]

---

## VİDEO 2 — MUHASEBE: ORTAKLI İŞLETMENİN KASA DERDİ

### a) Amaç ve hedef kitle
Ortaklı işletme sahiplerine, ajansın **işletmeye özel muhasebe/finans takip yazılımı** yazdığını
göstermek. Hedef kitle: ortaklı oto galeriler (en net), araç kiralama firmaları, iş makinesi
al-sat, ortaklı emlak ofisleri, küçük ticari işletmeler.
[Kaynak: arastirma/01-yazilim-urunleri.md → "SATILABİLİR SEKTÖR"]

### b) Ana mesaj (tek cümle)
"Ortaklı işletmenin en büyük kavgası 'kimin kasasında ne var' sorusu — biz onu tabloya çevirdik."

### c) Önerilen süre ve format [ÖNERİ]
**20–25 saniye**, dikey 9:16. Tamamı **ekran kaydı + yazı animasyonu**. Hiç insan görüntüsü yok.

### d) Kanca — ilk 2 saniye [ÖNERİ]
Seçenek 1 (önerilen): Boş bir ekranda tek soru yazılır ve sesli sorulur:
> **"Bu ayın kârı kimin kasasında?"**
Altına küçük yazı: "Ortaklı işletmelerde en çok tartışılan soru."

Seçenek 2: Ekranda dağınık bir not defteri / WhatsApp mesaj yığını belirir, 2. saniyede
üstü turuncu bir çizgiyle çizilir ve yerine temiz bir tablo oturur.

### e) Çekim listesi (shot list)

| # | Süre | Ne görünür | Nasıl üretilir | Ekran yazısı |
|---|---|---|---|---|
| 1 | 0–2 sn | Koyu zemin, tek soru | Animasyon | "Bu ayın kârı kimin kasasında?" |
| 2 | 2–5 sn | Panel (dashboard) ekranı: genel bakış kartları | **EKRAN KAYDI — YOK.** Kaynak: `may-motors-finans/index.html` | "Tek ekranda genel bakış" |
| 3 | 5–8 sn | Araç al-sat takibi: bir araç kartı açılıyor, alış-satış-masraf satırları | Ekran kaydı | "Araç bazlı kâr ve zarar" |
| 4 | 8–11 sn | Ortak kasaları ekranı: ortak bazlı bakiyeler, pay dağılımı | Ekran kaydı | "Hangi ortağın kasasında ne var" |
| 5 | 11–13 sn | Taksit takibi: vadeli satış tahsilat planı | Ekran kaydı | "Taksiti kim, ne zaman ödeyecek" |
| 6 | 13–15 sn | Sigorta / MTV / ÖTV bitiş tarihleri listesi | Ekran kaydı | "Sigorta ve vergi tarihleri" |
| 7 | 15–18 sn | Denetim (tarama) aracı çalışıyor, uyarı satırları beliriyor | Ekran kaydı | "Kasa tutarsızlığını kendisi yakalıyor" |
| 8 | 18–20 sn | Excel'e aktarma düğmesine basılıyor, dosya iniyor | Ekran kaydı | "Excel'e tek tuşla" |
| 9 | 20–24 sn | Kapanış kartı | Animasyon | "İşletmenize özel yazıyoruz" + iletişim |

### f) Seslendirme / altyazı metni [ÖNERİ]
> "Ortaklı bir işletmede en çok tartışılan soru şu: kimin kasasında ne var, bu işin kârı nasıl
> bölünecek?
> Biz bu tartışmayı tabloya çevirdik.
> Her araç kendi alışı, masrafı ve satışıyla ayrı duruyor; kâr araç bazında görünüyor.
> Ortak kasaları ayrı ayrı takip ediliyor.
> Taksitli satışın tahsilatı, sigorta ve vergi tarihleri aynı yerde.
> Ekranda bir tutarsızlık varsa program kendisi uyarıyor.
> Tek tuşla Excel'e çıkıyor.
> İşletmeniz ortaklıysa, bu düzeni sizin işinize göre kuruyoruz."

### g) Ekranda görünecek metinler ve CTA
Doğrulanmış, kullanılabilir somut özellikler (yalnız bunlar yazılabilir):
- **10 ana ekran:** Panel · Veri girişi · Araç al-sat takibi · Sigorta/MTV/ÖTV takibi ·
  Kasa analizleri · Taksit takibi · Haftalık analiz · Aylık analiz · Raporlar · Kullanıcı yönetimi
- Ortak bazlı kasa işlemleri ve araç başına kâr analizi
- Kiralama modülü ayrı takip ediliyor
- Excel dışa/içe aktarma
- PDF ve belge yönetimi, dosya yükleme
- **Çevrimdışı çalışma:** internet kesilse de ekran çalışmaya devam ediyor, bağlanınca eşitleniyor
- Kasa tutarsızlıklarını yakalayan **salt okunur** denetim aracı: alış fiyatı–kasa uyumsuzluğu,
  dağıtılmamış satış parası, %100 etmeyen pay toplamı, mükerrer kayıt tespiti
- PIN ekran kilidi, kullanıcı yetkilendirme, etkinlik günlüğü
[Kaynak: arastirma/01-yazilim-urunleri.md → "May Motors Finansal Takip" ve "maymotors.net →
MUHASEBE PROGRAMI"]

**Kullanılabilecek güçlü ve doğru anlatı [ÖNERİ]:** Geliştirme sırasında gerçek para hataları
bulunup düzeltildi ve bu düzeltmeler teste kilitlendi (vadeli satışta kârın iki kez sayılması,
silme işleminin çift iade üretmesi). Videoda **rakam vermeden** "bulduğumuz her para hatasını
teste kilitliyoruz, bir daha geri gelmiyor" denebilir.
[Kaynak: arastirma/01-yazilim-urunleri.md → "PARA HATASI REGRESYON KİLİDİ"]
**Hayali kâr tutarlarını (579.400 TL vb.) videoda SÖYLEMEYİN** — müşterinin gerçek mali
verisine ait iç bir hata kaydıdır.

### h) Kullanılacak medya

| Durum | Dosya |
|---|---|
| **YOK — hiç medya yok** | Bu video için elimizde tek bir fotoğraf veya klip bile yok |
| **YOK — çekilmeli** | Muhasebe yazılımının 8–10 ekranının ekran kaydı, **sahte veriyle** |

**İYİ HABER — demo kolay:** Yazılım, Firebase yapılandırması boş bırakıldığında **yerel kipte**
çalışıyor; veriler tarayıcı hafızasında tutuluyor ve uygulama yine açılıyor. Yani sahte veriyle
temiz bir demo kurmak için sunucu veya gerçek hesap gerekmiyor.
[Kaynak: arastirma/01-yazilim-urunleri.md → "FIREBASE YOKSA YEREL KİP"]

Kaynak dosyalar (ekran kaydı için açılacak):
`/Users/ajansflow/Desktop/yazılımlar/may-motors-finans/index.html`

### i) Yasaklar ve dikkat edilecekler
- **Gerçek ortak adları, plakalar ve kasa bakiyeleri görünmeyecek.** Bulanıklaştırma yetmez;
  **sahte veriyle yeniden alınmalı.**
- `js/firebase-config.js` ekranı **kullanılmayacak.**
- Gösterilen her rakamın yanında **"örnek"** ibaresi olacak.
- **Fiyat ve teslim süresi yok.**
- **"Çok şubeli", "her cihazdan erişim", "bulut" iddiaları kullanılmayacak.** Doğrulanabilen
  şey şu: yazılım Firestore kullanıyor ve çevrimdışı çalışıp bağlanınca eşitliyor. Çok şubeli
  veya çok cihazlı kullanım senaryosu ise **doğrulanmadı → [BİLİNMİYOR]**, söylenmeyecek.
  (Ayrı bir yazılım olan Mola Kafe POS maketi için bu kesin bir yasak: onun arka ucu hiç yok,
  veri yalnız o tarayıcıda duruyor.)

---

## VİDEO 3 — İLAN AÇIKLAMASI VE GÖRSELİ: TEK VERİ GİRİŞİ, HAZIR İLAN

### a) Amaç ve hedef kitle
Galeri sahiplerine, **ilan açıklaması ve ilan görseli hazırlama işinin otomatikleştirilebileceğini**
göstermek. Hedef kitle: oto galeriler, oto ekspertiz; ikincil olarak emlak ofisleri, iş makinesi
ve ticari araç satıcıları (aynı kalıp onlara da uyarlanıyor).

### b) Ana mesaj (tek cümle)
"Aracın bilgilerini bir kez giriyorsunuz; ilan açıklaması, araç kartı ve sosyal medya gönderisi
kendiliğinden çıkıyor."

### c) Önerilen süre ve format [ÖNERİ]
**15–20 saniye**, dikey 9:16. Serinin en kısa ve en "tatmin edici" videosu: tek bir eylemin
sonucu gözle görülüyor. Araştırma notu da bu videonun 15 saniyede anlaşılacağını söylüyor.
[Kaynak: arastirma/01-yazilim-urunleri.md → "GÖRÜNÜR DEMO ÖNCELİĞİ" (2)]

### d) Kanca — ilk 2 saniye [ÖNERİ]
Seçenek 1 (önerilen): Hızlandırılmış ekran kaydı — bir form alanı dolmaya başlar, üstte
sayaç: "40+ alan". 2. saniyede yazı: **"Her araç için tasarımcı beklemek yok."**

Seçenek 2: Ekran ikiye bölünür. Solda boş bir form, sağda boş bir gönderi şablonu.
2. saniyede sağ taraf aniden dolu bir Instagram gönderisine dönüşür.

### e) Çekim listesi (shot list)

| # | Süre | Ne görünür | Nasıl üretilir | Ekran yazısı |
|---|---|---|---|---|
| 1 | 0–2 sn | Form hızlı doluyor, üstte "40+ alan" sayacı | **EKRAN KAYDI — YOK.** Kaynak: OtoKart Pro `index.html` | "Her araç için tasarımcı beklemek yok." |
| 2 | 2–5 sn | Araç bilgileri girişi: marka, model, yıl, km, motor, vites, yakıt, kasa tipi | Ekran kaydı | "Bir kez giriyorsunuz" |
| 3 | 5–8 sn | 14 kaporta parçası tek tek işaretleniyor: Orijinal / Boyalı / Değişen / Lokal | Ekran kaydı | "14 parça · Orijinal, boyalı, değişen, lokal" |
| 4 | 8–10 sn | Rozetler seçiliyor: Hatasız, Boyasız, Değişensiz, Muayene Yeni, Servis Bakımlı | Ekran kaydı | "Rozetler" |
| 5 | 10–13 sn | "Instagram Postu Oluştur" düğmesine basılıyor, 1080×1350 gönderi beliriyor | Ekran kaydı | "Tek tuş" |
| 6 | 13–15 sn | Çıktı çeşitleri yan yana dizilir: araç kartı · PDF · Instagram gönderisi · kiralık araç gönderisi | Animasyon + ekran kaydı | "Dört çıktı, tek veri" |
| 7 | 15–18 sn | İlan önizlemesi: kaporta şeması üzerinde gezinme, "Sağ Arka Kapı: Değişen" bilgisi | **EKRAN KAYDI — YOK.** Kaynak: `ilan-sihirbazi-maket-v1.html` | "İlan açıklaması ve görseli hazır" |
| 8 | 18–20 sn | Kapanış kartı | Animasyon | "Benzerini işletmeniz için kurgulayalım" + iletişim |

### f) Seslendirme / altyazı metni [ÖNERİ]
> "Galeride her araç için ayrı tasarım yaptırmak ya da elle uğraşmak zaman alıyor.
> Biz bunu tek veri girişine indirdik.
> Aracın bilgilerini giriyorsunuz: marka, model, kilometre, motor, vites.
> On dört kaporta parçasının durumunu tek tek işaretliyorsunuz.
> Rozetleri seçiyorsunuz.
> Sonra tek tuş: baskıya hazır araç kartı, PDF ve sosyal medya gönderisi çıkıyor.
> İlan açıklaması ve ilan görseli aynı veriden hazırlanıyor.
> Siz aracı anlatın, görseli program hazırlasın."

### g) Ekranda görünecek metinler ve CTA
Doğrulanmış özellikler (yalnız bunlar yazılabilir):
- **40+ araç alanı:** marka, model, yıl, donanım paketi, km, motor hacmi, beygir, tork, muayene
  tarihi, vites (manuel/otomatik/yarı otomatik), yakıt (6 seçenek), kasa tipi (10 seçenek),
  çekiş, renk, tramer tutarı ve sorgu tarihi
- **14 kaporta parçası** görsel ekspertiz şeması: ön kaput, tavan, bagaj kapağı, 4 çamurluk,
  4 kapı, ön/arka tampon — her biri Orijinal / Boyalı / Değişen / Lokal Boyalı
- **Çıktılar:** PNG indir · Instagram gönderisi (1080×1350) · kiralık araç gönderisi · vektörel PDF
- **Otomatik açıklama (caption) metni üretimi**
- **Logo PDF'den okunuyor:** galerinin kurumsal PDF'i yüklenince logo çıkarılıp karta vektörel
  olarak basılıyor
- **Marka logo kütüphanesi:** araç markası seçilince kart logoyu kendiliğinden alıyor
- **Rozet sistemi:** Hatasız, Boyasız, %20 Faturalı, Değişensiz, Garantili, Muayene Yeni,
  Kazasız, Servis Bakımlı, Bayi Çıkışlı, TSE Onaylı + kendi özelliğini ekleme
- **Araç garajı:** kaydedilen araçlar havuzu, otomatik kayıt
- Kurulum gerektirmiyor, tarayıcıda açılıp çalışıyor
[Kaynak: arastirma/01-yazilim-urunleri.md → "OtoKart Pro"]

İlan sihirbazı maketinden kullanılabilecek detaylar:
- 6 bölümlü ilan akışı: Araç kimliği · Teknik · Hasar & ekspertiz · Donanım/rozet/ek bilgi ·
  Fotoğraflar · Fiyat & yayın
- Yanında **canlı ilan önizlemesi**; parça şemasında her parçanın durumu açıklama olarak çıkıyor
- Galeri çalışanı için 3 adımlı panel ilan ekleme ekranı + canlı önizleme
[Kaynak: arastirma/01-yazilim-urunleri.md → "MAY MOTORS İlan Sihirbazı ve OtoBid"]

CTA: "Benzerini işletmeniz için kurgulayalım" → WhatsApp.

### h) Kullanılacak medya

| Durum | Dosya |
|---|---|
| **YOK — hiç medya yok** | Bu video için elimizde tek bir fotoğraf veya klip bile yok |
| **YOK — çekilmeli** | OtoKart Pro ekran kaydı (form → gönderi) |
| **YOK — çekilmeli** | İlan sihirbazı maketinin ekran kaydı (kaporta şeması etkileşimi) |

Kaynak dosyalar (ekran kaydı için açılacak):
- `/Users/ajansflow/Desktop/yazılımlar/oto-kart/index.html` — **yalnız bu dosya açılacak**
- `/Users/ajansflow/Desktop/yazılımlar/maymotors-web/ilan-sihirbazi-maket-v1.html`
- `/Users/ajansflow/Desktop/yazılımlar/maymotors-web/panel-ilan-ekle.html`

### i) Yasaklar ve dikkat edilecekler — BU VİDEODA EN KRİTİK
- **"sahibinden.com" ya da başka bir ilan sitesinin adı HİÇBİR karede, hiçbir cümlede
  geçmeyecek.** Ekran kaydında adres çubuğu, sekme başlığı veya yapıştırılmış ilan metni
  üzerinden site adı görünürse kare kullanılmayacak.
- **"Otomatik veri çekiyoruz / senkronize ediyoruz / ilanlarınız siteye akıyor" DENMEYECEK.**
  Doğru ifadeler: "ilan açıklaması ve görseli hazırlama", "ilan yönetim akışı",
  "fiyat araştırması".
- **"Rakip siteleri tarıyoruz / veri kazıyoruz" DENMEYECEK.** Gerekçe yazılı: ilgili ilan
  sitesinin robots.txt'i yapay zekâ tarayıcılarını yasaklıyor ve bu yüzden o yoldan veri
  çekilmiyor. [Kaynak: arastirma/01-yazilim-urunleri.md → "VERİ KAZIMA DİLİ"]
- **`oto-kart` klasörünün dosya listesi ASLA gösterilmeyecek** — 150+ tek kullanımlık geliştirme
  betiği var, dağınıklık izlenimi verir. Yalnız `index.html` açılıp kaydedilecek.
- Gösterilen araç **sahte** olacak: sahte plaka yerine plaka alanı boş bırakılacak veya
  bulanıklaştırılacak; gerçek bir müşteri aracının bilgileri kullanılmayacak.
- İlan görselinde **fiyat alanı boş bırakılacak veya "örnek" yazılacak.**

---

## VİDEO 4 — WEB SİTESİ: ÖNCE MAKET, SONRA KOD

### a) Amaç ve hedef kitle
Her sektörden işletme sahibine, ajansın **hazır şablon satmadığını**; işin akışına göre site
yazdığını ve **kod yazmadan önce tıklanabilir maket** hazırladığını göstermek.
Hedef kitle: sitesi olmayan ya da yıllardır güncellenmeyen işletmeler; siteye giriliyor ama hiç
form doldurulmayan işletmeler; reklam vermeye başlayacak markalar.
[Kaynak: site-icerik.ts → HIZMETLER → web-sitesi.kimeGore]

### b) Ana mesaj (tek cümle)
"Kod yazmadan önce ekranları tıklayarak geziyorsunuz; onaylamadan geliştirmeye geçmiyoruz."

### c) Önerilen süre ve format [ÖNERİ]
**25–30 saniye**, dikey 9:16. Yapı: dert → süreç (maket) → sonuç (çalışan site) → ölçüm.

### d) Kanca — ilk 2 saniye [ÖNERİ]
Seçenek 1 (önerilen): Ekranda üst üste dizilmiş, birbirinin kopyası 4 tane jenerik site
başlığı belirir: "Anasayfa · Hakkımızda · Hizmetler · İletişim". 2. saniyede hepsi silinir ve
yazı gelir: **"Çoğu kurumsal site birbirinin kopyası."**

Seçenek 2: Telefon ekranında bir site açılıyor, yavaş yükleniyor; 2. saniyede yükleme çemberi
üstüne yazı: **"Siteniz var ama telefon çalmıyor mu?"**

Gerekçe: İki kanca da sitede yazılı metinden alınmıştır, uydurma değil.
[Kaynak: site-icerik.ts → HIZMETLER → web-sitesi.aciklama[0] ve kimeGore]

### e) Çekim listesi (shot list)

| # | Süre | Ne görünür | Nasıl üretilir | Ekran yazısı |
|---|---|---|---|---|
| 1 | 0–2 sn | Jenerik, birbirinin kopyası menü başlıkları siliniyor | Animasyon | "Çoğu kurumsal site birbirinin kopyası." |
| 2 | 2–5 sn | Sektör sektör farklı ihtiyaçlar çakıyor: seans takvimi / değerleme formu / QR menü / randevu formu | Animasyon (ikon + yazı) | "Go kart: seans. Galeri: değerleme. Kafe: menü." |
| 3 | 5–9 sn | **Tıklanabilir maket** geziliyor: bölümler arası geçiş, bir alan üzerine yorum balonu | **EKRAN KAYDI — YOK.** Kaynak: `prototip-v1.html`, `ilan-sihirbazi-maket-v1.html` | "Önce maket. Kod yazılmadan değişiklik ücretsiz." |
| 4 | 9–12 sn | Maket → gerçek site geçiş efekti (aynı ekran, bu kez çalışan hâli) | Animasyon + ekran kaydı | "Sonra kod." |
| 5 | 12–16 sn | Telefonda gerçek site akışı: form dolduruluyor, KVKK onay kutusu işaretleniyor | **EKRAN KAYDI — YOK**, sahte veriyle | "KVKK aydınlatma onayı · spam koruması" |
| 6 | 16–19 sn | Gelen talep yönetim panelinde aday kaydı olarak beliriyor | **EKRAN KAYDI — YOK**, sahte veriyle | "Talep panele düşüyor, kaybolmuyor" |
| 7 | 19–22 sn | Mobil hız / mobil uyum montajı: WhatsApp içi tarayıcıda site açılıyor | Ekran kaydı | "WhatsApp ve Instagram içi tarayıcıda kusursuz" |
| 8 | 22–26 sn | Mevcut gerçek görseller: telefonda canlı form + QR menü ekranı | **VAR:** `foto/maymotors-web-mobil-form.jpg`, `foto/kule-istanbul-qr-menu-mobil.jpg` | Müşteri logoları şeridi |
| 9 | 26–30 sn | Kapanış kartı | Animasyon | "Ücretsiz analiz iste" + iletişim |

### f) Seslendirme / altyazı metni [ÖNERİ]
> "Çoğu kurumsal site birbirinin kopyası: anasayfa, hakkımızda, hizmetler, iletişim.
> Oysa bir go kart pistine seans takvimi, bir galeriye değerleme formu, bir kafeye menü gerekiyor.
> Biz siteyi bu akışın üstüne kuruyoruz.
> Ve kod yazmadan önce tıklanabilir bir maket hazırlıyoruz. Ekranları geziyor, 'burası böyle
> olmasın' diyorsunuz. Maket aşamasında değişiklik ücretsiz.
> Onaydan sonra kodu yazıyoruz.
> Form yalnızca e-posta göndermiyor: talebi yönetim panelinize aday olarak düşürüyor,
> KVKK aydınlatma onayını kayda alıyor, sahte gönderime karşı koruma kuruyor.
> Mobil öncelikli yazıyoruz; WhatsApp ve Instagram içi tarayıcıda da kusursuz açılıyor.
> Sitenizi konuşalım."

### g) Ekranda görünecek metinler ve CTA
Doğrulanmış kapsam maddeleri (paket kapsamı anlatılır, **fiyat yok**):
- İçerik ve sayfa haritası planlaması
- Tıklanabilir maket (prototip) ve onay turu
- Mobil öncelikli arayüz tasarımı
- Sektöre özel modüller: randevu, rezervasyon, portföy, ilan, galeri, değerleme formu
- KVKK aydınlatma onaylı iletişim formu ve spam koruması
- Formdan gelen taleplerin yönetim paneline düşmesi
- Çoklu dil desteği (gereken projelerde)
- Teknik SEO: sayfa başına başlık ve açıklama, canonical, sitemap, robots, yapısal veri
- Hız optimizasyonu ve mobil uyum testleri
- Yayına alma, alan adı ve e-posta yönlendirmeleri
- Yayın sonrası düzeltme ve bakım dönemi
[Kaynak: site-icerik.ts → HIZMETLER → web-sitesi.neleriKapsar]

Paket adları (fiyatsız, yalnız kapsam): **Vitrin · Kurumsal · Entegrasyonlu**
[Kaynak: site-icerik.ts → HIZMETLER → web-sitesi.paket]

**Fiyat sorusu videoda geçerse verilecek tek cevap:** "Kapsamı konuşup teklif çıkarıyoruz."
Rakam **yok** — işletme sahibi paylaşmıyor.

### h) Kullanılacak medya

| Durum | Dosya |
|---|---|
| **VAR** | `public/site/medya/foto/maymotors-web-mobil-form.jpg` (739×1600, canlı site telefon ekranı) |
| **VAR** | `public/site/medya/foto/kule-istanbul-qr-menu-mobil.jpg` (390×844, telefon ekranı) |
| **VAR** | `public/site/medya/foto/kule-istanbul-qr-menu-masaustu.jpg` (1400×620, masaüstü) |
| **VAR** | Müşteri logoları: `public/site/medya/logo/` (13 dosya, bkz. 6. bölüm) |
| **YOK — çekilmeli** | Tıklanabilir maketin ekran kaydı |
| **YOK — çekilmeli** | Form doldurma + panele düşme akışının ekran kaydı (sahte veriyle) |
| **YOK — çekilmeli** | Minik Starlar Ligi sitesinin ekran kaydı (geri sayım, WhatsApp kayıt akışı) |

### i) Yasaklar ve dikkat edilecekler
- **CANLI SİTE DURUMU DOĞRULANMADI — videoda canlı adres gösterilmeden önce açılıp
  kontrol edilmeli:**
  - `maymotors.net`: 19 Eylül 2026 tarihli iç rapora göre rehber bölümü herkese açık, vitrin
    **şifreli ve noindex**, ana sayfa **"bakımda" ekranı** gösteriyor. Bugünkü durumu
    **[BİLİNMİYOR]**. [Kaynak: arastirma/01-yazilim-urunleri.md → "DOĞRULANMADI"]
  - `minikstarlarligi.com`: adres proje verisinde yazılı, **yayında olup olmadığı
    [BİLİNMİYOR]**. [Kaynak: arastirma/01-yazilim-urunleri.md → msl-web NOT]
  - `flowajans.com`: **yapım aşamasında**, henüz yayında değil.
  → Ekran kaydı alınırken **tarayıcı adres çubuğu kadrajdan çıkarılacak**, böylece yayında
    olmayan bir adres izleyiciye gösterilmemiş olur.
- **Fiyat yok, teslim süresi yok.** "Site ne kadar sürede teslim ediliyor?" sorusunun yazılı
  cevabı: "Süreyi kapsam ve içeriğin hazır olması belirliyor" — videoda süre taahhüdü verilmez.
- Panel ekran kaydında **gerçek aday/müşteri bilgisi görünmeyecek** (ad, telefon, e-posta).
- "Hazır şablon kullanmıyoruz" derken rakip isim verilmeyecek.
- Maketler **ürün değil süreç** olarak anlatılacak: "bunlar bizim maketimiz" denecek,
  "bu bizim ürünümüz" denmeyecek. [Kaynak: arastirma/01-yazilim-urunleri.md → İlan Sihirbazı NOT]

---

## VİDEO 5 — GIDA VE QR MENÜ: NE ZORUNLU, NE DEĞİL

### ⚠️ BU VİDEODA EN KRİTİK DÜZELTME — ÖNCE BUNU OKUYUN

İşletme sahibinin daha önce kullandığı **"1 Temmuz'da yürürlüğe giren QR düzenlemesi"**
ifadesi **kısmen yanlıştır** ve videoda bu şekilde kullanılamaz. İki ayrı bakanlığın iki ayrı
düzenlemesi birbirine karışmış durumda.

**Yanlış kullanılırsa sonuç:** İşletme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun
kapsamında **yanıltıcı ticari uygulama** riskine girer ve Reklam Kurulu'nun doğrudan ilgi
alanına düşer. Yani ajansın kendi tanıtım videosu, ajansı riske sokar.
[Kaynak: arastirma/02-qr-menu-mevzuati.md → "Sitede nasıl kullanılmalı", kara liste]

#### ASLA KURULMAYACAK CÜMLELER (kara liste)
- ❌ "1 Temmuz'da yürürlüğe giren yönetmelikle QR menü zorunlu oldu."
- ❌ "QR Menü Yasası çıktı."
- ❌ "Artık her masada QR menü zorunlu."
- ❌ "Yeni yönetmelik QR menü kullanmanızı şart koşuyor."
- ❌ "Alerjen zorunluluğu 1 Temmuz'da geldi."
- ❌ "1 Temmuz'da Resmî Gazete'de yayımlanan menü yönetmeliği."
- ❌ "Karekoda geçince basılı fiyat listesine gerek kalmıyor."
- ❌ "Ceza yersiniz / cezadan kurtulun / son 3 gün" tarzı korkutma dili

#### DOĞRU ÇERÇEVE (madde ve Resmî Gazete bilgisiyle)

**1. Karekodlu menü ZORUNLU DEĞİL — masalarda izin verilen bir EK yöntem.**
Fiyat Etiketi Yönetmeliği **m.8/2 (Değişik)** — yiyecek içecek hizmeti sunulan işyerlerindeki
masalarda fiyat listeleri tüketicilere karekod ile **de** gösterilebilir.
`[RG 11/10/2025 – 33044]` · ana yönetmelik `[RG 28/6/2014 – 29044]`
Yayımı tarihinde yürürlüğe girdi, geçiş süresi yok.

**2. Karekodun yönetmelikteki tanımı:** "fiyat listesine erişimi sağlayan görsel".
Fiyat Etiketi Yönetmeliği **m.4/1-(ö)** `[RG 28/6/2014 – 29044, konsolide metin]`

**3. Giriş kapısındaki fiziki fiyat listesi HÂLÂ ZORUNLU.**
Fiyat listesinin işyerinin giriş kapısının önüne — kapı birden fazlaysa her kapı için ayrı
ayrı — asılması ve hizmet sunulan masaların üstüne konulması yükümlülüğü devam ediyor.
Karekoda geçmek bunu ortadan kaldırmıyor.
Fiyat Etiketi Yönetmeliği **m.8/1** `[RG 28/6/2014 – 29044, konsolide metin]`

**4. Müşteri isterse basılı fiyat listesi ayrıca verilir.**
Karekod kullanılsa bile tüketici talep ettiğinde fiyat listesinin ayrıca verilmesi zorunlu.
Fiyat Etiketi Yönetmeliği **m.8/2** `[RG 11/10/2025 – 33044]`

**5. "1 Temmuz 2026" tarihi nereden geliyor:** Ticaret Bakanlığı'ndan değil,
**Tarım ve Orman Bakanlığı**'ndan. TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme
Yönetmeliği'ne bağlı **Kılavuz**'un 13/03/2026 güncellemesiyle gelen bir **uyum son tarihidir**
ve **ULUSAL ZİNCİR** işletmelerin menüde içerik (bileşen) ve enerji (kalori) bilgisi vermesiyle
ilgilidir. Karekodla ilgisi yoktur. O tarihte Resmî Gazete'de yayımlanmış bir menü düzenlemesi
**yoktur**. Doğru ifade: "1 Temmuz 2026'da **uyum süresi dolan**" — "yayımlanan" değil.

**Uyum takvimi (Kılavuz'un geçiş süreleri bölümü):**

| Kim | Tarih | Konu |
|---|---|---|
| Ulusal zincir işletmeler | 1 Temmuz 2026 | Menüde içerik ve enerji (kalori) bilgisi — süre doldu |
| Aynı ilde 3 ve üzeri şubesi olanlar | 31 Aralık 2026 | Menüde içerik ve enerji bilgisi |
| Diğer toplu tüketim yerleri | 31 Aralık 2026 | Menüde içerik (bileşen) bilgisi |
| Diğer toplu tüketim yerleri | 31 Aralık 2027 | Menüde enerji (kalori) bilgisi |

**Önemli nüans:** İstanbul'daki bağımsız bir kafe için 1 Temmuz 2026 tarihi **geçerli değil**;
onun tarihi 31/12/2026 (içerik) ve 31/12/2027 (kalori).
**Madde numarası verirken dikkat:** Bu yükümlülük Yönetmelik maddesinde değil, Yönetmeliğe
bağlı **Kılavuz**'ta düzenlenmiş (madde 41.3–41.5, geçiş süreleri madde 47). Doğru ifade:
**"Yönetmelik ve ona bağlı Kılavuz uyarınca"**. Kılavuza uyum, 6 Nisan 2024 tarihli Yönetmelik
değişikliğiyle hukuken bağlayıcı hâle getirildi.

**6. Karekod kullanılıyorsa bilgilendirme ZORUNLU.**
Toplu tüketim yerlerinde karekod kullanılan durumlarda, **"karekod kullanamayan tüketicilere
bilginin ayrıca sağlanacağına dair bilgilendirme yapılması zorunlu"**.
`[TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği'ne bağlı Kılavuz,
13/03/2026 güncellemesi]`

**7. Servis / masa / kuver ücreti YASAKLANDI.**
Yiyecek içecek hizmeti sunulan işyerlerinde tüketiciden servis ücreti, masa ücreti, kuver ücreti
ve benzeri herhangi bir isim altında ilave ödeme talep edilemez (4857 sayılı İş Kanunu m.51
hükmü saklı). Tüketicinin gönüllü bahşişi devam ediyor.
Fiyat Etiketi Yönetmeliği **m.8/6 (Değişik)** `[RG 30/1/2026 – 33153]`

**8. Hizmete sunulan TÜM ürünler fiyat listesinde olmak zorunda; aykırılık ÜRÜN BAŞINA sayılır.**
Aykırılık sayısı belirlenirken fiyat listelerinde eksik veya hatalı belirtilen ürün sayısı
dikkate alınıyor.
Fiyat Etiketi Yönetmeliği **m.8/3 ve m.8/4** `[RG 28/6/2014 – 29044, konsolide metin]`

**9. Menü fiyatı ile kasa fiyatı farklıysa tüketici lehine olan uygulanır.**
Fiyat Etiketi Yönetmeliği **m.10/1** `[RG 28/6/2014 – 29044, konsolide metin]`

**10. Fiyatlar TL cinsinden, etiket ve listeler Türkçe olmak zorunda.**
Satış fiyatlarının "Türk Lirası", "TL" veya ₺ simgesiyle yazılması gerekiyor; rakam ve harflerin
okunabilir, eksiksiz, gerçeğe uygun ve yeterli büyüklükte olması, yanıltıcı bilgi içermemesi
isteniyor. Çok dillilik yasak değil — **Türkçe'nin bulunması şart**.
Fiyat Etiketi Yönetmeliği **m.9/1, m.9/4, m.5/2 ve m.5/7** `[RG 28/6/2014 – 29044]`
Gıda tarafında aynı kural: TGK Gıda Etiketleme Yönetmeliği **m.18** `[RG 26/01/2017]`

**11. Alerjen bildirimi 2020'den beri zaten zorunlu — yeni bir şey değil.**
TGK Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği **m.15/5** `[RG 26/01/2017]`;
Tarım ve Orman Bakanlığı: "1/1/2020 tarihinden itibaren alerjen bilgisinin son tüketiciye
sunulması zorunlu hale getirilmiştir." Yönetmelikteki **14 alerjen**: gluten içeren tahıllar,
kabuklular, yumurta, balık, yerfıstığı, soya fasulyesi, süt, sert kabuklu meyveler, kereviz,
hardal, susam tohumu, kükürt dioksit/sülfitler, acı bakla, yumuşakçalar.

**12. Ceza rakamı kuralı:**
- Ticaret Bakanlığı tarafı: 6502 sayılı Kanun **m.77**; etiket/tarife/fiyat listesi aykırılığı
  için **2026 yılı için aykırılık başına 3.973 TL**. Rakam verilirse **mutlaka yıl belirtilecek**
  ve "her yıl yeniden değerleme oranında artırılır" notu eklenecek.
  `[2026 tutarları: RG 27/11/2025 – 33090, VUK Genel Tebliği Sıra No: 585]`
- Tarım ve Orman Bakanlığı tarafı (5996 sayılı Kanun): **RAKAM VERİLMEYECEK.** Güncel tutar
  birincil kaynaktan doğrulanamadı. Yalnızca "5996 sayılı Kanun kapsamında idari para cezası
  uygulanır" denecek. [Kaynak: arastirma/02-qr-menu-mevzuati.md, "Güven: doğrulanmadı"]

**13. Mevzuatta QR menü için TEKNİK ŞART YOK.** "Uygulama indirmeden açılması", "hızlı
yüklenmesi", "dil seçeneği sunması", "WCAG uyumu" gibi şartlar mevzuatta **bulunmuyor**.
Bunlar ajansın **kalite tercihi**dir; videoda "yönetmelik gereği" diye sunulursa bu kendisi
yanıltıcı ticari uygulama olur.
[Kaynak: arastirma/02-qr-menu-mevzuati.md, negatif bulgu]

**14. Braille / engelli erişimi için menüye özel yasal zorunluluk tespit edilemedi.**
Erişilebilirlik **etik/kalite argümanı** olarak anlatılabilir, **yasal zorunluluk olarak
anlatılamaz**. [Kaynak: arastirma/02-qr-menu-mevzuati.md, "Güven: doğrulanmadı"]

---

### a) Amaç ve hedef kitle
Kafe ve restoran sahiplerine, piyasada dolaşan yanlış bilgiyi düzeltmek ve ajansı
**doğru bilgi veren taraf** olarak konumlandırmak. Hedef kitle: kafe, restoran, pastane,
nargile mekânı, plaj işletmesi, otel; özellikle İstanbul'un turistik hatları.

**Fırsat (doğrulanmış):** Arama sonuçlarının büyük bölümü QR menü satan firmaların blogları ve
birçoğu "QR Menü Yasası 2025", "Artık Her Masada QR Kodlu Menü Zorunlu!" gibi **mevzuata aykırı**
başlıklar kullanıyor. Doğru bilgi vermek net bir farklılaşma.
[Kaynak: arastirma/02-qr-menu-mevzuati.md]

### b) Ana mesaj (tek cümle)
"Karekodlu menü zorunlu değil — zorunlu olan, fiyat listesinin eksiksiz ve doğru olması."

### c) Önerilen süre ve format [ÖNERİ]
**30–40 saniye**, dikey 9:16. Serinin en uzun videosu, çünkü bilgi yoğun. Alternatif olarak
**ikiye bölünebilir**: (5a) "QR menü zorunlu mu?" 20 sn · (5b) "Servis ve kuver ücreti yasağı"
20 sn. İkinci konu araştırmaya göre en az rekabetli ve en yüksek değerli başlık.

### d) Kanca — ilk 2 saniye [ÖNERİ]
Seçenek 1 (önerilen, en güçlü): Ekranda büyük harflerle yanlış iddia belirir, üstü turuncu
bir çizgiyle çizilir:
> ~~"QR MENÜ ZORUNLU OLDU"~~
> **YANLIŞ.**

Seçenek 2: Doğrudan soru-cevap: **"QR menü zorunlu mu?" → "Hayır."** (2. saniyede cevap
ekranda). Araştırma, bu "doğrudan cevap" kalıbının öne çıkan sonuç (featured snippet)
potansiyeli yüksek olduğunu söylüyor; videoda da aynı netlik işe yarar.

### e) Çekim listesi (shot list)

| # | Süre | Ne görünür | Nasıl üretilir | Ekran yazısı |
|---|---|---|---|---|
| 1 | 0–2 sn | Yanlış başlığın üstü çiziliyor | Animasyon, koyu zemin | ~~"QR menü zorunlu oldu"~~ → "YANLIŞ." |
| 2 | 2–6 sn | Doğru cevap kartı | Animasyon | "Karekodlu menü zorunlu değil. 11 Ekim 2025'ten beri masalarda izin verilen bir **ek** yöntem." + küçük künye: Fiyat Etiketi Yön. m.8/2 · RG 11/10/2025-33044 |
| 3 | 6–9 sn | Kapı önünde asılı fiziki fiyat listesi görseli / çizimi | **YOK — çekilmeli** veya animasyon | "Giriş kapısındaki fiyat listesi hâlâ zorunlu." + m.8/1 |
| 4 | 9–12 sn | Misafir basılı menü istiyor, garson veriyor (yüz yok, yalnız el) | **YOK — çekilmeli** veya animasyon | "Müşteri isterse liste ayrıca verilir." + m.8/2 |
| 5 | 12–16 sn | "1 Temmuz" tarihi ekrana gelir, iki bakanlık ayrı sütuna bölünür | Animasyon | "1 Temmuz 2026 = ulusal zincirlerin içerik ve kalori uyum süresi. Karekodla ilgisi yok." |
| 6 | 16–19 sn | Uyum takvimi tablosu kayarak geçer | Animasyon | 4 satırlı takvim tablosu (yukarıdaki) |
| 7 | 19–23 sn | Adisyon görseli; "servis ücreti" satırı turuncu çizgiyle siliniyor | Animasyon | "Servis, masa ve kuver ücreti alınamıyor." + m.8/6 · RG 30/1/2026-33153 |
| 8 | 23–27 sn | Menü listesinde fiyatı boş bir ürün kırmızı uyarı veriyor | **EKRAN KAYDI — YOK** | "Tüm ürünler listede olmalı; aykırılık ürün başına sayılıyor." + m.8/3, m.8/4 |
| 9 | 27–31 sn | Telefonda gerçek QR menü: kategori gezinme, arama, alerjen filtresi | **VAR (fotoğraf):** `foto/kule-istanbul-qr-menu-mobil.jpg` · **ekran kaydı YOK** | "Kule İstanbul Cafe · 4 dilli menü" |
| 10 | 31–35 sn | Yemek/içecek klipleri montajı (ritimli, kısa) | **VAR:** kule espresso, kök cafe mutfak alev, baraka kanat, teras kilyos mangal, coin coffee | — |
| 11 | 35–40 sn | Kapanış kartı + sorumluluk notu | Animasyon | "Menünüzü ve fiyat listesi düzeninizi birlikte gözden geçirelim." + iletişim |

### f) Seslendirme / altyazı metni [ÖNERİ]
> "QR menü zorunlu oldu diye duyduysanız: yanlış.
> Karekodlu menü zorunlu değil. Fiyat Etiketi Yönetmeliği, masalardaki fiyat listesinin karekod
> ile **de** gösterilmesine 11 Ekim 2025'ten beri izin veriyor. Yani ek bir yöntem.
> İşyerinizin giriş kapısı önündeki fiyat listesi zorunluluğu devam ediyor.
> Müşteri talep ettiğinde fiyat listesini ayrıca vermeniz gerekiyor.
> Sıkça duyulan 1 Temmuz tarihi ise başka bir konu: ulusal zincir işletmelerin menüde içerik ve
> kalori bilgisi verme uyum süresinin dolduğu tarih. Karekodla ilgisi yok.
> Bağımsız bir işletmeyseniz sizin tarihiniz 31 Aralık 2026 ve 31 Aralık 2027.
> Ocak 2026'dan beri servis, masa ve kuver ücreti de alınamıyor.
> Ve şu önemli: hizmete sunulan tüm ürünlerin fiyat listesinde bulunması gerekiyor. Aykırılık,
> eksik veya hatalı ürün sayısına göre hesaplanıyor.
> Karekodun gerçek değeri burada: fiyatı tek yerden değiştirince masaya, kapıya ve kasaya
> aynı anda yansıyor.
> Menünüzü birlikte gözden geçirelim."

### g) Ekranda görünecek metinler ve CTA

**Her mevzuat kartının altında küçük punto künye zorunlu:** yönetmelik adı + madde no +
RG tarih/sayı. (Yukarıdaki listede her madde için yazılı.)

**Videonun sonunda veya açıklamasında zorunlu üç öğe:**
1. "Son mevzuat kontrolü: 6 Ekim 2026" damgası
2. Birincil kaynak linkleri (açıklama metnine):
   - resmigazete.gov.tr/eskiler/2025/10/20251011-6.htm (karekod)
   - resmigazete.gov.tr/eskiler/2026/01/20260130-2.htm (servis/kuver yasağı)
   - mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.19819.pdf (konsolide Fiyat Etiketi Yönetmeliği)
   - kms.kaysis.gov.tr/Home/Goster/204259 (TGK Kılavuzu)
3. Sorumluluk notu: *"Bu içerik bilgilendirme amaçlıdır, hukuki görüş niteliği taşımaz.
   İşletmenizin durumuna özgü değerlendirme için bağlı olduğunuz meslek odasına veya hukuk
   danışmanınıza başvurun."*
[Kaynak: arastirma/02-qr-menu-mevzuati.md → "HER MEVZUAT İÇERİĞİNE ŞU 3 ÖĞEYİ ZORUNLU KIL";
site-icerik.ts → QR_MENU_BILGI.sorumlulukNotu ve kaynaklar]

**QR menü hizmetinin kapsamı (fiyatsız, kapsam anlatımı):**
Tek dilli menü · Çok dilli menü · Menü ve modüller — üç kapsam seviyesi.
İçerik: menü verisinin düzenlenmesi, çok dilli yapı (Türkçe esas), ürün fotoğrafı çekimi,
menü içi anlık arama, alerjen ve diyet filtreleri, markaya göre tasarım, masa kartı ve baskıya
hazır QR görselleri, basılabilir fiyat listesi çıktısı, haritada konum / telefon / Instagram /
Google değerlendirme bağlantıları; isteğe bağlı: QR üzerinden sipariş, rezervasyon talebi.
[Kaynak: site-icerik.ts → HIZMETLER → qr-menu]

**Kule İstanbul Cafe işinin doğrulanmış özellikleri (söylenebilir):**
11 kategori · 172 ürün · 4 dil tam çeviri (Türkçe, İngilizce, Almanca, Arapça) · canlı arama ·
vegan/glutensiz/kuruyemişsiz filtreleri (alerjen listesinden hesaplanıyor, rozet değil) ·
alerjen detay penceresi · uygulama indirmeden açılıyor · haritada konum ve Google değerlendirme
bağlantısı. [Kaynak: arastirma/01-yazilim-urunleri.md → "Kule İstanbul Cafe"]

### h) Kullanılacak medya

| Durum | Dosya |
|---|---|
| **VAR** | `foto/kule-istanbul-qr-menu-mobil.jpg` (390×844) — **bu videonun ana görseli** |
| **VAR** | `foto/kule-istanbul-qr-menu-masaustu.jpg` (1400×620) |
| **VAR** | `video/kule-istanbul-espresso-cekimi.mp4` (7,0 sn, dikey) |
| **VAR** | `video/kule-istanbul-kokteyl-hazirlama.mp4` (7,0 sn, dikey) |
| **VAR** | `video/kok-cafe-mutfak-alev.mp4` (7,0 sn, dikey) |
| **VAR** | `video/kok-cafe-burger-hazirlama.mp4` (7,0 sn, dikey) |
| **VAR** | `video/baraka-kanat-izgara.mp4` (7,0 sn, dikey) |
| **VAR** | `video/teras-kilyos-mangal-atesi.mp4` (6,5 sn, dikey) |
| **VAR** | `video/coin-coffee-flat-white.mp4` (7,0 sn, dikey) |
| **VAR** | Kule ve Kök Cafe yemek fotoğrafları (bkz. 6. bölüm) |
| **VAR** | Logolar: `logo/kule-istanbul-cafe-logo.png`, `kule-istanbul-cafe-amblem.png`, `kok-cafe-lounge-logo.png`, `teras-kilyos-logo.png`, `mancurya-bufe-logo.png` |
| **YOK — çekilmeli** | QR menünün ekran kaydı (kategori gezinme, arama, alerjen filtresi) |
| **YOK — çekilmeli** | Kapı önü fiyat listesi ve masa kartı çekimi |
| **YOK — çekilmeli** | Fiyatı boş ürün uyarısının panel ekran kaydı |
| **YOK — eksik** | Coin Coffee ve Baraka Kanat **logo dosyası diskte yok** |

### i) Yasaklar ve dikkat edilecekler

**Mevzuat dili:**
- Yukarıdaki **kara liste cümlelerinin hiçbiri kullanılmayacak.**
- "Zorunlu oldu / ceza yersiniz / son X gün" korkutma dili yok. Çerçeve: **doğru bilgi +
  operasyonel kolaylık.** En güçlü ve doğru cümle: *"Karekodlu menünün asıl değeri, fiyat
  değişikliğini aynı anda masaya, kapıya ve kasaya yansıtması."*
- **Listede olmayan hiçbir madde numarası veya tarih yazılmayacak.** Kullanılabilir referanslar
  yalnızca: Fiyat Etiketi Yön. m.4/1-ö, m.5/2, m.5/7, m.8/1, m.8/2, m.8/3, m.8/4, m.8/5, m.8/6,
  m.9/1, m.9/4, m.10/1, m.13; RG 28/6/2014-29044, 11/10/2025-33044, 30/1/2026-33153;
  TGK Yön. m.15/5, m.18, RG 26/01/2017; Kılavuz md. 41.3–41.5 ve 47.
- Gıda tarafında "Yönetmelik maddesi" denmeyecek, **"Yönetmelik ve ona bağlı Kılavuz"** denecek.
- 5996 sayılı Kanun tarafı için **ceza rakamı verilmeyecek.**
- Teknik özellikler "mevzuat gereği" diye sunulmayacak; "denetime hazırlık / bizim kalite
  tercihimiz" başlığı altında anlatılacak.
- **Ticaret Bakanlığı'nın fiyat listesi veri aktarım sistemi** (m.8/5) hakkında "sistem henüz
  açılmadı" gibi kesin cümle kurulmayacak — usul ve esasların ilan edildiğine dair kayıt
  bulunamadı, bu bir **yoklukta kanıt** durumu. **[BİLİNMİYOR]** · Videoda bu maddeye
  girilmemesi önerilir.

**Medya kullanım yasakları (Kule menüsü için kritik):**
- **"Kalori / Protein / Karbonhidrat / Yağ" tablosunun görüldüğü kare ASLA kullanılmayacak.**
  O sayılar yazılımda rastgele üretilmiş yer tutuculardır. **"Kalori ve besin değeri bilgisi"
  bir özellik olarak satılmayacak.** [Kaynak: arastirma/01-yazilim-urunleri.md →
  `enrich_data_advanced.py:114-126`]
  → **İroni uyarısı:** Video tam olarak kalori bildirimi mevzuatını anlatıyor. Bu yüzden
  "biz kalori alanlarını kuruyoruz, **bilgiyi işletme verir**" demek doğru; "kalori bilgisini
  biz sağlıyoruz" demek yanlış olur.
- **Kule menüsünün İngilizce / Almanca / Arapça ekranları kullanılmayacak** — çeviride Türkçe
  kelimeler kalmış ("Sahanda Egg", "Sınırsız Tea"). 4 dilli olduğu **söylenebilir**, ama o
  kareler **gösterilmeyecek** (ya da önce elden geçirilecek).
- Kule menüsünde **fiyat alanı yok**; "fiyat güncelleme" bu iş üzerinden örneklenmeyecek.
  Hizmet kapsamında "fiyatların tek yerden güncellenmesi" yazılı, ama **Kule ekranı buna kanıt
  değil.**
- `video/kule-istanbul-frozen-bogaz.mp4` ve `foto/kule-istanbul-frozen-icecekler.jpg`
  kadrajında **"Frozen Kivi" kampanya kartı** var — **geçmiş kampanya**, güncel teklif gibi
  sunulmayacak. Aynı uyarı `foto/mancurya-bufe-kampanya-gorseli.jpg` için de geçerli
  ("3 DK · 6 ISLAK BEDAVA! 5.000 TL'ye kadar ödül" — geçmiş kampanya).
- Kliplerdeki filigranlar (KÖK CAFE LOUNGE, KULE İSTANBUL CAFE) **müşterinin kendi markasıdır**,
  sorun değil.
[Kaynak hepsi: arastirma/01-yazilim-urunleri.md ve public/site/medya/RAPOR.md §8.5]

---

# 5) PRODÜKSİYON BİLGİLERİ

## 5.1 Platformlar ve teslim formatı

| Platform | Format | Süre sınırı | Not |
|---|---|---|---|
| **Instagram Reels** | 9:16, 1080×1920 | Seride hedeflenen 15–40 sn uygun | Birincil platform — ajansın asıl kanalı |
| **TikTok** | 9:16, 1080×1920 | Aynı dosya kullanılabilir | Platformun dili daha hızlı; kanca daha sert olabilir |
| **YouTube Shorts** | 9:16, 1080×1920 | 60 sn'ye kadar | Aynı dosya; başlıkta anahtar kelime önemli |
| **Facebook** | 9:16 Reels veya 1:1 feed | — | Meta üzerinden Instagram ile birlikte dağıtılır |

**Teslim seti [ÖNERİ]:** Her video için
1. `1080×1920` ana dosya (H.264, MP4, altyazı gömülü)
2. Altyazısız bir kopya (platform otomatik altyazısı veya farklı dil için)
3. `.srt` altyazı dosyası
4. `1080×1920` kapak karesi (ilk kare değil, seçilmiş en okunaklı kare)
5. Her videonun açıklama metni (Instagram/TikTok/Shorts için ayrı ayrı) + hashtag seti
6. Video 5 için ayrıca kaynak linkleri bloğu (yukarıda listelendi)

## 5.2 Dil, seslendirme ve altyazı

**Dil: Türkçe.** Tamamı.

**Seslendirme için üç seçenek:**

| Seçenek | Artı | Eksi | Karar |
|---|---|---|---|
| **A. İnsan seslendirmesi** (kurucunun sesi, yüzü görünmeden) | Güven, samimiyet, markaya özgü | Kurucunun sesinin kullanılmasına izin verip vermediği **[BİLİNMİYOR]** | İşletmeye sorulmalı |
| **B. Yapay seslendirme** (Türkçe sentetik ses) | Hızlı, tutarlı, 5 videoda aynı ton | Mevzuat anlatan videoda (Video 5) biraz mesafeli duruyor | Karar işletmenin |
| **C. Seslendirme yok** — müzik + ekran yazısı + altyazı | En hızlı üretim; sessiz izleyen çoğunluğa doğrudan hitap | Bilgi yoğun Video 5'te metin yükü artar | — |

**ÖNERİ:** **Video 1–4 için C (seslendirme yok, yazı ağırlıklı), Video 5 için A veya B.**
Gerekçe: 1–4 numaralı videolar ekran kaydı ağırlıklıdır ve ekranda olup biten şey kendini
anlatır; yazı yeterli. Video 5 ise mevzuat anlatıyor ve bir insan sesi "size doğrusunu
söylüyorum" tonunu taşıyor. Kurucunun **sesi** kullanılabilirse en güçlü seçenek A olur —
yüz kuralı sese ilişkin bir yasak içermiyor, ama bu **varsayılmayacak, sorulacak**.

**Altyazı: her videoda, her seçenekte ZORUNLU ve GÖMÜLÜ.** Seslendirme olmasa bile ekran
yazıları altyazı mantığıyla kurulacak. Yazı tipi Inter, veri/etiketlerde JetBrains Mono.

## 5.3 Kurgu yaklaşımı — "yüz yok" kuralının getirdiği zorunluluk

Kurucunun ve ekibin yüzü kullanılmadığı için serinin görsel omurgası şu üç malzemeden kurulacak:

1. **EKRAN KAYDI (ağırlık merkezi).** Video 1, 2, 3, 4'ün büyük bölümü. Yazılımların çalıştığı
   gerçek ekranlar, **sahte veriyle**. Araştırma notu bunu ajansın en güçlü satış kozu olarak
   işaretliyor: "teklif aşamasında müşteriye çalışan bir ekran gösterebilmek."
   [Kaynak: arastirma/01-yazilim-urunleri.md]
   **Teknik kural:** Ekran kaydı dikey kadraja oturtulurken telefon/dizüstü çerçevesi içine
   konulacak. Sitede bu çerçeveler saf CSS ile üretiliyor (1px kenar, iç içe radius, tek iç
   gölge) — videoda aynı dil korunacak. [Kaynak: SITE-TASARIM.md §3]
2. **ANİMASYON (bağ dokusu).** Başlık kartları, veri şemaları, akış çizimleri, mevzuat künyeleri.
   Marka imzası: **sayfanın tepesinden altına inen tek 2px turuncu çizgi** (akış hattı). Videoda
   bölüm geçişlerinde bu çizgi kullanılabilir. [Kaynak: SITE-TASARIM.md §3 "Akış hattı"]
   **Köşe yarıçapı anlamı korunacak:** 2px = veri/tablo · 14px = kart · 999px = çip.
   Rastgele radius kullanılmayacak.
3. **ÜRÜN / MEKÂN ÇEKİMİ (mevcut arşiv).** Yemek, içecek, mekân, drone klipleri. 15 klibin
   tamamı 6–7,5 saniye; yüz ve plaka içermiyor.

**Ritim [ÖNERİ]:** Her sahne 2–4 saniye. Ekran kaydında imleç hareketi yavaş ve okunur olacak;
form doldurma sahneleri hızlandırılacak (2–3×) ki izleyici beklemesin.

## 5.4 Müzik ve ses — ZORUNLU TEKNİK UYARI

**Mevcut 15 klibin tamamı AAC ses taşıyor ve bu seslerin ticari kullanım hakkı
DOĞRULANMADI.** Klipler sosyal medya için kurgulanmış videolardan kesildi ve altlarında müzik
var. Üretim araç kutusunda ses kanalını atma imkânı olmadığı için ses dosyanın içinde kaldı.
[Kaynak: public/site/medya/RAPOR.md §7.1 ve §8.1 — MAS arşivindeki not:
"Kaynak müziğin ticari web haklarını yayın öncesi ayrı teyit et."]

**Kural:**
1. Her kaynak klip kurguya **sessiz (muted)** alınacak; orijinal sesi kullanılmayacak.
2. Altına **lisanslı veya telifsiz kütüphane müziği** konacak.
3. Ses efektleri (tuş sesi, bildirim, geçiş) kütüphaneden alınacak.

## 5.5 Mevcut kliplerin teknik durumu — ÖNEMLİ KISIT

Eldeki klipler **web sitesi için hazırlanmış küçük boy kopyalardır**, prodüksiyon ustası değil:

| Kaynak grubu | Çözünürlük | Oran | 1080×1920'de ne olur |
|---|---|---|---|
| Dikey klipler (Kule, Kök, Coin, Teras, Baraka) | **404×720** | 9:16 | 1080×1920'ye **2,67× büyütme** gerekir → görüntü yumuşar |
| MAS Go Kart klipleri | **640×360** | **16:9 yatay** | Dikey kadrajda tam ekran olamaz; çerçeve içine / letterbox olarak konur |

[Kaynak: public/site/medya/kunye.json — her dosyanın `genislik`/`yukseklik` alanı;
public/site/medya/RAPOR.md §7.2]

**ÖNERİ — iki yol:**
- **(a) Tercih edilen:** Orijinal yüksek çözünürlüklü kaynak dosyalar iCloud Drive'da duruyor
  (örnek boyutlar: `kule video.mp4` 174 MB, `COİN COFFE TANITIM.mp4` 163 MB,
  `teras kilyos klip.mp4` 172 MB). Bunlar istenip yeniden kesilmeli. Tam liste:
  `public/site/medya/RAPOR.md` §9.1. **Uyarı: bu dosyaların hiçbiri izin/marka açısından
  denetlenmedi** — kullanım öncesi yüz, plaka ve üçüncü marka kontrolü yapılmalı.
- **(b) Mevcut kliplerle çalışılacaksa:** Tam ekran kullanmak yerine kadrajın bir bölümünde
  (telefon çerçevesi içinde, kart içinde, bölünmüş ekranda) kullanılmalı; böylece büyütme oranı
  düşer ve yumuşaklık görünmez.

## 5.6 Çekilecek ekran kayıtları — hazırlık listesi

| Video | Kaydedilecek ekran | Açılacak dosya |
|---|---|---|
| 1 | Değerleme akışı (5 adım) | `maymotors-web/ilan-sihirbazi-maket-v1.html` veya `otobid-arac-sat-maket.html` |
| 1, 3 | Kaporta parça haritası etkileşimi | `maymotors-web/ilan-sihirbazi-maket-v1.html` |
| 1, 2 | Muhasebe ekranları (8–10 ekran) | `may-motors-finans/index.html` (Firebase boşken yerel kipte açılır) |
| 1, 3 | İlan görseli / Instagram gönderisi üretimi | `oto-kart/index.html` — **yalnız bu dosya** |
| 3 | Panel ilan ekleme + canlı önizleme | `maymotors-web/panel-ilan-ekle.html` |
| 4 | Tıklanabilir maket gezintisi | `maymotors-web/prototip-v1.html` |
| 4 | Form → panel akışı | Ajansın kendi paneli, **sahte aday verisiyle** |
| 5 | QR menü: kategori, arama, alerjen filtresi | `kule-istanbul-cafe/index.html` — **Türkçe ekranlar, besin tablosu kadraj dışı** |

Tüm bu dosyalar `/Users/ajansflow/Desktop/yazılımlar/` altında. **Ekran kaydı kuralları:**
tarayıcı adres çubuğu kadraj dışı veya bulanık · gerçek müşteri verisi yok · klasör/dosya
listesi görünmüyor · panel ve admin adresleri okunmuyor.

## 5.7 Yayın sırası ve ritmi [ÖNERİ]

| Sıra | Video | Gerekçe |
|---|---|---|
| 1. | **Video 5 (QR / gıda)** | Elimizdeki medya en çok bu video için hazır; ayrıca mevzuat konusunda piyasada boşluk var, en çok kaydedilme/paylaşılma potansiyeli bunda. |
| 2. | **Video 4 (web sitesi)** | En geniş hedef kitle — her sektöre hitap ediyor. |
| 3. | **Video 1 (otomotiv zinciri)** | Dikey uzmanlığı gösteriyor, galeri kitlesini açıyor. |
| 4. | **Video 3 (ilan görseli)** | En kısa ve en "tatmin edici"; Video 1'i izleyeni derinleştirir. |
| 5. | **Video 2 (muhasebe)** | En niş kitle; seriye bağlılığı olanlara. |

Aralık: haftada 1 video [ÖNERİ]. Her videonun açıklamasında bir sonraki videonun konusu
duyurulur.

---

# 6) DOSYA LİSTESİ

Kök klasör: `/Users/ajansflow/Desktop/yazılımlar/ajansflow-next/`
Medya kökü: `public/site/medya/` · Künye: `public/site/medya/kunye.json` (80 dosya, ≈42 MB)
[Kaynak: public/site/medya/kunye.json ve RAPOR.md §1]

## 6.1 Marka dosyaları

| Durum | Dosya | Not |
|---|---|---|
| ✅ VAR | `public/site/marka/flow-sembol.svg` | Şeffaf, vektörel, turuncu gradyanlı "F". **Her yerde bu kullanılır.** |
| ❌ YOK | Beyaz logo versiyonu | **HAZIRLANIYOR** — ayrı çalışma sürüyor |
| ❌ YOK | Siyah logo versiyonu | **HAZIRLANIYOR** |
| ❌ YOK | Yatay logo (sembol + kelime-işaret tek dosya) | **HAZIRLANIYOR** — şimdilik sembol + tipografi elle dizilecek |
| ❌ YOK | Ajans Flow'un kendi tanıtım videosundan kullanılabilir klip | Bkz. 6.5 — **çıkarılamadı** |
| ❌ YOK | Ajansın ofis / ekip / çekim kulisi fotoğrafı | **çekilmeli** [Kaynak: SITE-BRIEF.md §7] |
| ❌ YOK | Kurgu ekranı / çalışma masası görüntüsü | **çekilmeli** |

## 6.2 Videolar — 15 klip, hepsi VAR

Tamamı `public/site/medya/video/` altında. Hiçbirinde yüz, plaka veya üçüncü marka logosu yok.
Poster karşılığı `public/site/medya/poster/` altında, **aynı dosya adıyla**, `.jpg` uzantılı.

| Dosya | Marka | Süre | Çözünürlük | Hangi videoda kullanılır |
|---|---|---|---|---|
| `hero-mas-gokart-gece-grid.mp4` | MAS Go Kart | 6,0 sn | 640×360 (yatay) | Serinin jeneriği / Video 4 müşteri şeridi |
| `mas-gokart-gece-pist-surusu.mp4` | MAS Go Kart | 6,0 sn | 640×360 (yatay) | Video 4 müşteri şeridi |
| `mas-gokart-pist-marka-kapanis.mp4` | MAS Go Kart | 7,0 sn | 640×360 (yatay) | Bölüm sonu şeridi (marka logosuyla bitiyor) |
| `mas-karting-academy-damali-bayrak.mp4` | MAS Go Kart | 6,2 sn | 640×360 (yatay) | Kurgu becerisi örneği |
| `mas-karting-academy-gece-onboard.mp4` | MAS Go Kart | 6,0 sn | 640×360 (yatay) | Aksiyon / hareketli arka plan |
| `kule-istanbul-espresso-cekimi.mp4` | Kule İstanbul | 7,0 sn | 404×720 | **Video 5** |
| `kule-istanbul-kokteyl-hazirlama.mp4` | Kule İstanbul | 7,0 sn | 404×720 | **Video 5** |
| `kule-istanbul-frozen-bogaz.mp4` | Kule İstanbul | 6,5 sn | 404×720 | Video 5 — ⚠️ "Frozen Kivi" kampanya kartı var |
| `kok-cafe-mutfak-alev.mp4` | Kök Cafe | 7,0 sn | 404×720 | **Video 5** |
| `kok-cafe-burger-hazirlama.mp4` | Kök Cafe | 7,0 sn | 404×720 | **Video 5** |
| `kok-cafe-burger-sunumu.mp4` | Kök Cafe | 7,5 sn | 404×720 | Video 5 kapanış |
| `kok-cafe-drone-istinye.mp4` | Kök Cafe | 7,0 sn | 404×720 | Video 4 / Video 5 mekân |
| `coin-coffee-flat-white.mp4` | Coin Coffee | 7,0 sn | 404×720 | **Video 5** (marka kartıyla kapanıyor) |
| `teras-kilyos-mangal-atesi.mp4` | Teras Kilyos | 6,5 sn | 404×720 | **Video 5** (marka kartıyla kapanıyor) |
| `baraka-kanat-izgara.mp4` | Baraka Kanat | 7,0 sn | 404×720 | **Video 5** |

**Önemli:** Bu 15 klibin **hiçbiri Video 1, 2 veya 3'e uygun değil.** Otomotiv, muhasebe ve
ilan konularını anlatan tek bir klip bile yok.

## 6.3 Fotoğraflar — 37 kare, hepsi VAR

Tamamı `public/site/medya/foto/` altında. Videoda doğrudan kullanılabilecek, konuya göre
gruplanmış hâli:

**Video 1 ve 4 için (otomotiv / web):**
| Dosya | Boyut | Ne |
|---|---|---|
| `maymotors-web-mobil-form.jpg` | 739×1600 | Canlı site telefon ekranı: "Hemen Sat" akışının 1/5. adımı |
| `maymotors-reels-tasarimi.jpg` | 900×1600 | "HEMEN SAT" dikey Reels/story tasarımı |
| `maymotors-reels-web-tanitimi.jpg` | 720×1280 | Tanıtım videosu karesi: telefonda form, yüz yok |

**Video 5 için (QR menü / yemek):**
| Dosya | Boyut | Ne |
|---|---|---|
| `kule-istanbul-qr-menu-mobil.jpg` | 390×844 | **QR menü telefon ekranı — Video 5'in ana görseli** |
| `kule-istanbul-qr-menu-masaustu.jpg` | 1400×620 | QR menü masaüstü görünümü |
| `kule-istanbul-espresso-karesi.jpg` | 720×1280 | Espresso yakın planı |
| `kule-istanbul-frozen-icecekler.jpg` | 720×1280 | ⚠️ "Frozen Kivi" kampanya kartı var |
| `kule-istanbul-kofte-tahta-tabak.jpg` | 640×640 | Köfte |
| `kule-istanbul-fajita.jpg` | 640×640 | Fajita |
| `kule-istanbul-cajun-salata.jpg` | 640×640 | Salata |
| `kule-istanbul-tiramisu.jpg` | 640×640 | Tiramisu |
| `kok-cafe-cheese-burger.jpg` | 979×1300 | Burger |
| `kok-cafe-izgara-pirzola.jpg` | 1003×1003 | Pirzola |
| `kok-cafe-kahvalti-tabagi.jpg` | 1254×1254 | Kahvaltı |
| `kok-cafe-karisik-pide.jpg` | 1600×800 | Pide (bant görseli olarak iyi) |
| `kok-cafe-pizza-milano.jpg` | 1003×1003 | Pizza |
| `kok-cafe-sezar-salata.jpg` | 1009×1261 | Salata |
| `kok-cafe-reels-burger-sunumu.jpg` | 720×1280 | Reels karesi |
| `kok-cafe-reels-mutfak-alevi.jpg` | 720×1280 | Reels karesi |
| `kok-cafe-drone-istinye-manzara.jpg` | 640×1137 | Drone karesi: İstinye koyu |
| `baraka-kanat-izgara-kanat.jpg` | 720×1280 | Izgarada kanat |
| `teras-kilyos-mangal-alevi.jpg` | 720×1280 | Mangal alevi |
| `teras-kilyos-marka-karti.jpg` | 720×1280 | Marka kartı (açık zeminli bölümler için) |
| `coin-coffee-flat-white-sunumu.jpg` | 720×1280 | Flat white sunumu |
| `coin-coffee-duvar-ilustrasyonu.jpg` | 720×1280 | Mekân duvar illüstrasyonu (figürler çizim, gerçek kişi değil) |
| `coin-coffee-sosyal-medya-tasarimi.jpg` | 720×900 | Sosyal medya tasarımı |
| `mancurya-bufe-kampanya-gorseli.jpg` | 1200×630 | ⚠️ **Geçmiş kampanya** — bant kırpılmalı veya "geçmiş kampanya" notuyla |

**Diğer (seri jeneriği / müşteri şeridi için):**
| Dosya | Boyut | Ne |
|---|---|---|
| `mas-gokart-pist-drone-01.jpg` | 1024×576 | Pistin havadan görünümü (dar açı) |
| `mas-gokart-pist-drone-02.jpg` | 800×533 | Pistin havadan görünümü (geniş açı) |
| `mas-gokart-start-cizgisi.jpg` | 840×1120 | Start çizgisi ve formula aracı |
| `mas-gokart-pilot-yaris-tulumu.jpg` | 960×1280 | Yarış tulumu ve kask (Sparco/Arai ekipman markaları var) |
| `mas-gokart-sosyal-medya-tasarimi.jpg` | 900×1600 | Sosyal medya story tasarımı |
| `airsoft-istinye-ekipman.jpg` | 972×1215 | Airsoft ekipman çekimi |
| `minik-starlar-tanitim-afisi.jpg` | 843×1192 | Tanıtım afişi |
| `minik-starlar-turnuva-odulleri.jpg` | 843×1192 | Ödüller afişi |
| `minik-starlar-turnuva-detaylari.jpg` | 818×1228 | Turnuva detayları afişi |
| `minik-starlar-iletisim-afisi.jpg` | 1024×1536 | İletişim afişi |

## 6.4 Logolar — 13 dosya

Tamamı `public/site/medya/logo/` altında.

| Durum | Dosya | Marka | Not |
|---|---|---|---|
| ✅ VAR | `masgokart-logo.png` (120×120) · `masgokart-logo-beyaz.png` (288×120) | MAS Go Kart | Beyaz sürümün kaynağında beyaz zemin plakası var — tasarım böyle |
| ✅ VAR | `maymotors-logo-yatay.svg` (289×34) · `maymotors-logo-beyaz.svg` · `maymotors-simge.svg` (179×128) · `maymotors-simge-raster.png` | May Motors | **Vektörel — videoda en esnek kullanım** |
| ✅ VAR | `kule-istanbul-cafe-logo.png` (195×120) · `kule-istanbul-cafe-amblem.png` (119×120) | Kule İstanbul | |
| ✅ VAR | `kok-cafe-lounge-logo.png` (166×120) | Kök Cafe | |
| ✅ VAR | `teras-kilyos-logo.png` (120×120) | Teras Kilyos | ⚠️ **SAYDAM DEĞİL** (videodan kırpıldı, beyaz zeminli) — yalnız açık zeminde |
| ✅ VAR | `mancurya-bufe-logo.png` (117×120) | Mançurya Büfe | |
| ✅ VAR | `minik-starlar-ligi-amblem.png` (102×120) | Minik Starlar Ligi | |
| ✅ VAR | `airsoft-istinye-logo.png` (120×120) | Airsoft İstinye | |
| ❌ YOK | — | **Coin Coffee** | Diskte hiçbir logo dosyası yok. Wordmark yalnız video karelerinin içinde. **Müşteriden vektör logo istenmeli.** |
| ❌ YOK | — | **Baraka Kanat** | Diskte hiçbir logo dosyası yok. **Müşteriden istenmeli.** |
| ❌ YOK | — | **Lityum Servis** | **Hiçbir medya dosyası bulunamadı** (kapsamlı disk ve iCloud taraması yapıldı). **İşletmeden istenmeli.** |
| ❌ YOK | — | **Dent 50 Clinic** | Medya arşivinde hiç dosya yok. **[BİLİNMİYOR]** |
| ❌ YOK | — | **Mimar Elif Kara** | Vaka çalışması yazılı ama **medya alanı tamamen boş** |

[Kaynak: public/site/medya/kunye.json, RAPOR.md §4 ve "Logo dosyası bulunamayan markalar"]

## 6.5 Ajans Flow'un kendi tanıtım videosu — ÇIKARILAMADI, KARAR GEREKİYOR

Elde **tek bir Ajans Flow videosu** var (`AJANS FLOW VİDEO.mp4` ve `AJANS FLOW VİDEO 2.mp4`
**aynı dosyadır** — ikisi de 168.841.689 bayt, 35,8 sn, 1080×1920).

İçerik kurumsal tanıtım filmi **değil**: ajans sahibinin kameraya konuşarak video kurgusu
anlattığı bir Instagram eğitim Reels'i.

| Saniye | Ne var | Neden kullanılamıyor |
|---|---|---|
| 0–5 | Sahibin kameraya konuşması | Yüz net ve kadrajın tamamında |
| 6–18 | "BEFORE / AFTER editing" karşılaştırması | **Beşiktaş JK arması, "EFES Beşiktaş" sponsor panosu, "Beşiktaş JK Spor Okulları" logosu** + kadrajda net bir yüz |
| 18 | Turuncu marka geçiş kartı | ~0,5 sn, klip olmaz |
| 19–35,8 | Sahibin kameraya konuşması | Yüz net |

**"Yüz yok VE üçüncü marka yok" şartını sağlayan tek bir saniye bile yok.**

**İki seçenek — karar işletmenin:**
1. **Sahibin kendi yüzü serbest bırakılırsa:** 19–26 ve 27–34. saniyelerden iki temiz klip
   (yalnız konuşan sahne, BJK bölümüne girmeden) çıkarılabilir. Kadrajdaki altyazılar ajansın
   kendi metni ("ilk 3 saniyede müşteriyi kapmanız gerekiyor" vb.).
2. **Kural aynen kalırsa:** Ajans Flow bölümü için **yeni çekim gerekir.** "Çekim kulisi" ve
   "kurgu ekranı" kareleri bu dosyada hiç yok.

**BJK / Efes bölümü hangi durumda olursa olsun kullanılmayacak** — tescilli markalar, kullanım
hakkı ayrıca belgelenmeli.
[Kaynak: public/site/medya/RAPOR.md §3]

## 6.6 Yazılım demo dosyaları (ekran kaydı kaynakları)

Hiçbiri `ajansflow-next` deposunda değil; `/Users/ajansflow/Desktop/yazılımlar/` altında.

| Durum | Dosya | Hangi video |
|---|---|---|
| ✅ VAR | `may-motors-finans/index.html` + `js/` (17 modül) | Video 2 (ana kaynak) |
| ✅ VAR | `oto-kart/index.html` + `app_v10.js`, `ig_generator.js` | Video 3 (ana kaynak) |
| ✅ VAR | `maymotors-web/ilan-sihirbazi-maket-v1.html` (81 KB) | Video 1, 3 |
| ✅ VAR | `maymotors-web/otobid-arac-sat-maket.html` | Video 1 |
| ✅ VAR | `maymotors-web/panel-ilan-ekle.html` | Video 3 |
| ✅ VAR | `maymotors-web/prototip-v1.html` (301 KB) | Video 4 (maket anlatımı) |
| ✅ VAR | `maymotors-web/on-inceleme-v1.html` | Video 4 (süreç belgesi örneği) |
| ✅ VAR | `kule-istanbul-cafe/index.html` + `menu-data.js` | Video 5 |
| ✅ VAR | `nar-pos/index.html` (Mola Kafe POS maketi) | Video 5 ek sahne (opsiyonel) |
| ✅ VAR | `may-degerleme/rapor/2026-09-18.html` (haftalık piyasa raporu) | Video 1 (ekran görüntüsü için hazır) |
| ⚠️ DİKKAT | `may-motors-finans/js/firebase-config.js` | **ASLA EKRANA ALINMAYACAK** |
| ⚠️ DİKKAT | `oto-kart/` klasörünün dosya listesi | **ASLA GÖSTERİLMEYECEK** (150+ dağınık betik) |

## 6.7 Yayında olmayan / durumu belirsiz adresler

| Adres | Durum |
|---|---|
| `flowajans.com` | **YAPIM AŞAMASINDA** — yayında değil |
| `maymotors.net` | **[BİLİNMİYOR]** — 19.09.2026 itibarıyla ana sayfa "bakımda", vitrin şifreli |
| `minikstarlarligi.com` | **[BİLİNMİYOR]** — proje verisinde yazılı, yayında olup olmadığı doğrulanmadı |
| Google İşletme Profili | **YOK — açılacak** (site yayına girince açılıp siteyle bağlanacak) |

[Kaynak: src/lib/site.ts, arastirma/01-yazilim-urunleri.md, SITE-BRIEF.md §8.1]

## 6.8 Kullanılmayan ama değerli kaynaklar (iCloud Drive)

`public/site/medya/RAPOR.md` §9.1 ve §9.2'de tam liste var. Video üretimi için en değerlileri:

| Kaynak | Değeri | Uyarı |
|---|---|---|
| iCloud `Downloads/` — orijinal müşteri videoları (Kule 174 MB, Coin 163 MB, Teras 172 MB vb.) | Yüksek çözünürlüklü yeniden kesim | **Hiçbiri izin/marka açısından denetlenmedi** |
| `MAS GoKart 3B/*.blend` (389 dosya) | **Telifsiz, yüzsüz 3B kart render'ı — ideal jenerik malzemesi** | Blender kurulu değil |
| `may-motors-next/_gorseller/` | Onlarca hazır reklam ve afiş görseli | Denetlenmedi |
| `MAS_Medya_Arsivi/02_Instagram_One_Cikanlar/` (~270 mp4) | Temiz aksiyon kareleri olabilir | Tek tek izin/marka denetimi gerekir |
| `maymotors-hemensat-kit/03-foto/` (27 görsel) | Kullanılabilir | **Yapay zekâ üretimi — açıkça etiketlenerek** kullanılmalı |
| `maymotors-hemensat-kit/.../sayac-animasyonu` | Mükemmel arayüz klibi olur | BMW/Mercedes marka adları + fiyat var; temizlenmiş yeni render gerekir |
| iCloud `Kule İstanbul Menü.pdf`, `CoinCo.pdf` (85 MB) | Menü/katalog işi örneği | PDF — ekran görüntüsü alınabilir |
| `MSL/msl-web/.../gallery`, `motm/` (25 foto) | Minik Starlar vakasını güçlendirir | **Çocuk yüzleri — veli muvafakati gerekir** |

---

# 7) EKSİKLER — İŞLETME SAHİBİNE SORULACAKLAR

## 7.1 Video çekilemeyecek düzeyde kritik eksikler

| # | Eksik | Etkisi |
|---|---|---|
| 1 | **Video 1, 2, 3 için hiç hazır medya yok.** Elimizdeki 15 klip ve 37 fotoğrafın tamamı yemek, mekân, go kart ve afiş içeriği. Otomotiv yazılımı, muhasebe ve ilan üretimi için tek bir kare bile yok. | Bu üç video **ekran kaydı alınmadan çekilemez** |
| 2 | **Yazılım demolarının sahte veriyle hazırlanmış kopyaları yok.** Gerçek müşteri verisiyle ekran kaydı almak yasak. | Demo kopyaları hazırlanmalı |
| 3 | **Ajans Flow'un kendi görüntüsü yok.** Kullanılabilir tek saniye bile çıkarılamadı (bkz. 6.5). | Kurucunun yüzü serbest bırakılacak mı, yoksa yeni çekim mi yapılacak — **karar gerekiyor** |
| 4 | **Logo versiyonları eksik.** Beyaz/siyah/yatay logo yok. | Kapanış kartı mevcut gradyanlı SVG ile kurulacak |

## 7.2 İzin ve hukuki netlik gereken konular

| # | Konu | Durum |
|---|---|---|
| 5 | **Müşteri markalarının sosyal medya tanıtım videosunda kullanım izni** | Web sitesi için onay var; **sosyal medya için ayrı izin gerekip gerekmediği [BİLİNMİYOR]**. MAS, Kule, Minik Starlar (ÖSF Sportif Faaliyetler), May Motors için yazılı teyit öneriliyor |
| 6 | **Kaynak müziklerin ticari kullanım hakkı** | **DOĞRULANMADI.** MAS arşivindeki not: "Kaynak müziğin ticari web haklarını yayın öncesi ayrı teyit et." → Çözüm: tüm klipler sessiz alınacak, lisanslı müzik kullanılacak |
| 7 | **MAS Instagram içeriklerinin hakları** | Açıklamaların 7'sinde dış fotoğrafçı kredisi var ("📸 Fotoğraf çekimleri: @race_focus__kare"). Kullanılan kareler kredili gönderilerden değil ama **MAS hesabının içerik hakları yazılı teyit edilmeli** |
| 8 | **Kaskta kişi adı** | `mas-gokart-pist-marka-kapanis.mp4` içinde kaskta **"SELİM ARAS"** yazısı var (yarışçının kendi kaskı). Kişi adı olduğu için sürücüden onay almak iyi olur |
| 9 | **Minik Starlar afişlerindeki çocuklar** | Çocuklar sırtı dönük, yüz görünmüyor; ligin "Fotoğraf ve Video Kullanım İzni" maddeleri var ama bu izin **ligin kendi yayınları için** alınmış görünüyor. Ajansın tanıtım videosunda kullanımı için lig ve veliler bir kez görmeli |
| 10 | **Mançurya ve Kule Frozen kampanya kartları** | Geçmiş kampanyalar; güncel teklif gibi sunulmamalı. Bant kırpılacak veya "geçmiş kampanya çalışması" notuyla verilecek |

## 7.3 Karar bekleyen içerik soruları

| # | Soru |
|---|---|
| 11 | **Kurucunun SESİ seslendirmede kullanılabilir mi?** Kural yüz için yazılmış; ses hakkında hüküm yok. **[BİLİNMİYOR]** |
| 12 | **Kapanış kartında web adresi verilecek mi?** `flowajans.com` henüz yayında değil; yayında olmayan adresi göstermek izleyiciyi boş sayfaya götürür |
| 13 | **Hizmet sayısı kaç söylenecek?** Site "13 hizmet alanı" diyor, veri dosyası 15 hizmet içeriyor. **Çelişki kapatılmalı** |
| 14 | **`maymotors.net` ve `minikstarlarligi.com` şu an yayında mı?** Ekran kaydı alınacaksa önce açılıp kontrol edilmeli |
| 15 | **Mola Kafe POS maketi videoda gösterilecek mi?** Gösterilirse "maket" diye anlatılması zorunlu: arka ucu yok, veri yalnız o tarayıcıda. "Bulut / çok cihaz / şubeler arası" denemez. Ayrıca klasör adı `nar-pos`, uygulama "MOLA KAFE" markalı — **hangi adla anılacağına karar verilmeli** |
| 16 | **Kule menüsünün besin değeri bölümü** | Kalori/protein/karbonhidrat/yağ sayıları yazılımda **rastgele üretilmiş yer tutuculardır.** Mekâna bildirilmesi gerekiyor (yanlış besin değeri göstermek tüketici mevzuatı açısından riskli). Ayrı bir iş olarak ele alınmalı |
| 17 | **Kule menüsünün yabancı dil çevirileri** | Bazı İngilizce açıklamalarda Türkçe kelimeler kalmış ("Sahanda Egg", "Sınırsız Tea"). O kareler elden geçirilmeden gösterilemez |
| 18 | **MAS Entertainment Platform videoda anılacak mı?** Portföydeki en büyük proje ama README'si "FAZ 0 → FAZ 1" diyor — **henüz tamamlanmamış.** Bitmiş ürün gibi anlatılamaz |
| 19 | **Dent 50 Clinic ve Lityum Servis** için hiç medya yok. Bu markalar videoda anılacaksa dosya istenmeli |
| 20 | **Instagram takipçi sayısı videoda geçecek mi?** Sitede takipçi sayısı yazmak yasak. **Önerimiz: videoda da geçmemesi** |

## 7.4 Fiyat ve teslim süresi

**Soru gelirse verilecek tek cevap:** İşletme sahibi **fiyat paylaşmıyor**; paket kapsamı
anlatılır ve ücretsiz analize yönlendirilir. Teslim süresi için de taahhüt yok — süreyi kapsam
ve içeriğin hazır olması belirliyor. Bu iki konuda videoda **hiçbir rakam geçmeyecek.**
**Her ikisi de: BİLİNMİYOR / işletme sahibi paylaşmıyor.**

---

## EK: BU BRIEF'İN KAYNAK DOSYALARI

| Dosya | Ne için okundu |
|---|---|
| `SITE-BRIEF.md` | Hizmetler, sahibinin kararları, uydurma yasağı |
| `SITE-TASARIM.md` | Marka kimliği, renk, yazı tipi, logo kuralları, video şartnamesi |
| `src/lib/site-icerik.ts` | 15 hizmet, 12 sektör, 6 vaka, SSS, QR mevzuat metinleri |
| `src/lib/site.ts` | İletişim bilgileri, marka sabitleri |
| `arastirma/01-yazilim-urunleri.md` | Video 1, 2, 3, 4'ün yazılım bilgileri; kara listeler |
| `arastirma/02-qr-menu-mevzuati.md` | Video 5'in mevzuat çerçevesi, madde ve RG bilgileri |
| `arastirma/03-seo-ve-rehber-plani.md` | Anahtar kelime ve içerik kümesi bağlamı |
| `arastirma/04-rakip-analizi.md` | Pazar standartları, fiyat gösterme pratiği |
| `public/site/medya/kunye.json` | 80 dosyanın tam künyesi, boyut ve kullanım önerileri |
| `public/site/medya/RAPOR.md` | Telif, izin, kalite uyarıları; elenenler ve gerekçeleri |
| `public/site/marka/flow-sembol.svg` | Logo dosyasının kendisi |

**Son güncelleme:** 7 Ekim 2026
**Mevzuat son kontrol tarihi:** 6 Ekim 2026 (Video 5 için — yayından önce yeniden kontrol edilmeli)
