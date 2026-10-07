# Giriş ekranı ve görsel etki katmanı — uygulama şartnamesi

Kazanan konsept: **HARF KADRAJI** (6 konsept, 3 jüri; müşteri jürisi 8,8 · sanat yönetmeni 8,7 ·
performans mühendisi 8,25 ile ikinci sıraya koydu ve IŞIK TEZGÂHI'nı seçti). Aşağıda kazananın
tamamı, sonunda jürinin ZORUNLU eklemeleri ve yasakları var.

---
## KAZANAN KONSEPT

### İlk ekran
GİRİŞ TEK BİR CÜMLEDİR VE O CÜMLE EKRANI DOLDURUR. Saf siyah (#000) bir "plaka" üzerinde dört satır devasa Bricolage Grotesque:

  GÖRÜNEN
  YÜZÜNÜZ        ← harflerin İÇİ hareketli görüntü
  ve ARKADAKİ
  YAZILIM        ← harflerin İÇİ hareketli görüntü

Cümlenin yüklemi ("— ikisini de aynı ekip kuruyor.") katlama çizgisinin ALTINDA, üst %45'i görünecek şekilde kırpılmış durur. Yani ilk ekran gramer olarak YARIM. Bu, kaydırma zorlamasının kendisidir; JS gerektirmez.

0–1 sn (JS YOK, video YOK):
Siyah plaka ilk boyamada basılır (ilk ekran CSS'i satır içi). Dört satır zaten HTML'de ve zaten dolu: "YÜZÜNÜZ" ve "YAZILIM" harflerinin içinde gece go-kart pistinin DURAĞAN karesi (18 KB AVIF) duruyor — turuncu ışıklar, ıslak asfalt, siyah gece. Tek hareket: sol oluktan inmeye başlayan 2px turuncu akış hattı (saf CSS, 0 JS). Göz: iki beyaz kelimeden geçip turuncu-sıcak dolu kelimeye çakılır, oradan alttaki kırpık satıra düşer. Hiçbir şey zıplamaz, hiçbir şey dönmez. Etki "ses"ten değil, ÖLÇEKten ve dolu harften gelir.

1–3 sn (JS geldi):
1,05 sn — `document.fonts.ready` dönüyor; SplitText her satırı kendi satır kutusundan (mask: 'lines') yukarı açar: 0,85 sn, harf kademesi 0,012 sn. Perde açılması gibi okunur, harf harf çizgi film gibi değil.
1,25 sn — dolu kelimelerin arkasındaki DURAĞAN kare, canlı videoya 600 ms'de çapraz geçer. Hareket yalnızca harflerin içinde başlar. Durağan siyah ekranda kıpırdayan tek şey yazının içidir — göz kaçamaz.
1,9 sn — kritik nokta: "YÜZÜNÜZ" ve "YAZILIM" AYNI video düzleminin iki deliğidir. Işık bir kelimeden çıkıp diğerinde devam eder. İki video kutusu değil, tek ekrana açılmış iki pencere gibi okunur.
2,4 sn — yazının altındaki mono şerit, ScrambleText ile hizmet adlarını harf harf devreder (1,8 sn'de bir): SOSYAL MEDYA YÖNETİMİ → DRONE ÇEKİMİ → KAMERA ve FOTOĞRAF → KURGU ve EDİT → REKLAM YÖNETİMİ · META · GOOGLE · TIKTOK. Mono olduğu için genişlik sabit, hiç kayma yok. Aktif adın altına DrawSVG ile 2px turuncu çizgi çizilir.
2,6 sn — en alt kenarda mono "AŞAĞI KAYDIRIN" ve akış hattının ucu nefes alır (0,9 opak ↔ 0,45, 2,4 sn).

İlk kaydırma (parmak değdiği an):
İlk 40–70vh boyunca yazı duvarı 1 → 0,46 ölçeğine KÜÇÜLÜR (transform-origin sol üst) ve aynı anda yüklem satırı aşağıdan içeri yazılır. Yani kaydırmanın ödülü somut: CÜMLE TAMAMLANIR. Küçülen bu duvar, sayfanın geri kalanının normal başlığıdır — hiçbir şey yerine başka bir şey takas edilmez.

### Teknik
## Çekirdek teknik: BLEND KNOCKOUT (background-clip: text DEĞİL)

`background-clip: text` videoyu alamaz, SVG `mask` + `foreignObject` iOS Safari'de güvenilmez, harfi path'e çevirmek SSR metnini ve ekran okuyucuyu öldürür. Üçünü de eliyorum. Kullanılacak teknik `mix-blend-mode` knockout — her yerde (iOS 15.4+ dâhil) çalışır, GPU'da birleşir ve METİN GERÇEK DOM METNİ KALIR (seçilebilir, SSR, SEO, ekran okuyucu).

### Koyu kutuplaşma (ilk ekran) — 3 katman + 1 sarmalayıcı
```
.af-hk            { isolation: isolate; background:#000; contain: paint; }
  .af-hk-taban    solid  linear-gradient(100deg,#E2541F,#FF8900 50%,#FFCF3B)
  .af-hk-plan     <img> + <video>   mix-blend-mode: screen
  .af-hk-maske    background:#000; color:#fff; mix-blend-mode: multiply
```
Matematik: `multiply` → siyah plaka × düzlem = siyah (gizler), beyaz harf × düzlem = düzlem (gösterir). Alttaki `screen` katmanı videoyu turuncu tabana ekler, dolayısıyla harfin içi ASLA turuncudan koyu olamaz. Hesaplanmış kontrast tabanı: #E2541F / #000 = **5,52:1** (devasa metin için gereken 3:1'in iki katı). "Karanlık kare geldi, kelime kayboldu" hatası matematiksel olarak imkânsız.

### Açık kutuplaşma (ikinci ekran) — aynı yapı, ters kutup
```
.af-hk--acik      { isolation: isolate; background:#fff; }
  .af-hk-taban    linear-gradient(100deg,#861500,#B83C13 50%,#C5410F)
  .af-hk-plan     mix-blend-mode: multiply
  .af-hk-maske    background:#fff; color:#000; mix-blend-mode: screen
```
Tavan kontrastı: #C5410F / #FFF = **5,08:1**. `screen` beyaz plakayı beyaz bıraktığı için bu duvar `--af-beyaz` (#FFFFFF) yüzeyinde yaşar, `--af-kagit` (#F7F5F2) üzerinde değil.

### Tasarım sistemine eklenen TEK token
`--af-plaka: #000000`. Gerekçe teknik: `multiply` knockout saf siyah ister; #0E0E16 ile aralarındaki fark %0,4 görece parlaklık (gözle ayırt edilemez). Marka bantları (#0E0E16 / #F7F5F2) DOKUNULMAZ. Plaka üçüncü, NADİR bir yüzeydir: sayfada en çok 2 kez (giriş + ikinci ekran) kullanılır. "Bant = okunan içerik, plaka = başlık anı" kuralı.

### DOM bütçesi
İlk ekran SplitText'ten ÖNCE 26 eleman: sarmalayıcı 1 + taban 1 + plan 3 (`img`+`video`) + maske 1 + `h1` 1 + satır span 4 + mono yuva 1 + hizmet `ul`/`li`/`a` 11 + yüklem 1 + kaydırma ipucu 1 + alt çizgi SVG 1. SplitText sonrası ≤ 60 (3 satır maskesi + ~26 harf span'ı). Ek paket: SIFIR.

### Kullanılan GSAP eklentileri (hepsi kurulu)
`ScrollTrigger` (scrub), `SplitText` (satır maskesi + harf kademesi, `aria:'auto'` varsayılanı `h1`'e `aria-label` basıp parçaları `aria-hidden` yapıyor — `node_modules/gsap/SplitText.js` içinde doğruladım), `ScrambleTextPlugin` (hizmet şeridi), `DrawSVGPlugin` (akış hattı + aktif hizmet altı çizgisi), `gsap.quickTo` (masaüstü harf itişi). `Flip` ve `MorphSVG` BU bölümde kullanılmaz (gereksiz ağırlık ve kayma riski). `ScrollSmoother` yasak (Lenis ile çakışır) — mevcut kurala uyuyor.

### Yazı tipi
Bricolage Grotesque zaten değişken (wght + opsz). Duvar için `font-weight: 800`, `letter-spacing: -0.045em`, `line-height: 0.84`. `wdth` eksenini EKLEMEYİN: latin+latin-ext alt kümesine +18–26 KB bindirir ve LCP yolundadır; sıkışık görünümü tracking ile alıyoruz. `font-size: clamp(2.75rem, 11.8vw, 9.25rem)` (44px → 148px).

### Satır yüksekliği KİLİTLİ (CLS 0'ın anahtarı)
```
.af-hk-satir { height: clamp(46px,13.5vw,132px); overflow: clip; display:block; }
```
Yükseklik MUTLAK ve yazı tipinden bağımsız. Bricolage swap ile geç gelse bile glif sabit kutunun içinde değişir → düzen kaymaz. `100svh` + `100vh` yedeği (iOS adres çubuğu zıplamasını keser).

### Mobil / masaüstü farkı
| | Mobil (≤700px) | Masaüstü (≥1024px) |
|---|---|---|
| Dolu kelime sayısı | **1** (yalnız YAZILIM) | 2 (YÜZÜNÜZ + YAZILIM) |
| Video düzlemi | 1 adet, `object-position: 50% 62%` | 1 adet, `50% 58%` |
| Ölçek scrub'ı | 1 → 0,62 / 0–40vh | 1 → 0,46 / 0–70vh |
| Yapışkan plaka | `max-height:680px` altında KAPALI | `position: sticky; top:0` |
| İşaretçi itişi | yok | en yakın 3 harf, ±6px, `quickTo` |
| Hizmet şeridi | tek yuva + Scramble | 5 bağlantı yan yana + DrawSVG altı çizgi |
| Blend alanı | ~55vh × 100vw | duvar sınır kutusuna `contain: paint` ile kırpılı |

Mobilde dolu kelimeyi tek tutmanın nedeni iki katlı: dar kolonda iki dolu satır kalabalık görünüyor ve blend edilen glif kenarı sayısı yarıya iniyor (düşük uçlu Android'de kompozisyon maliyeti).

### Kaydırma davranışı
## İnsanı aşağı çeken mekanizma: YARIM CÜMLE + ANINDA ÖDÜL

Scroll-jacking YOK, pin YOK. Sayfa her an parmakla 1:1 hareket eder. Çekim üç kattan gelir:

**1. Yarım cümle (JS'siz çalışır).** H1 tam cümledir ama ekranda yalnız özne öbeği durur; yüklem katlamanın altında, harflerin üst %45'i görünecek biçimde kırpılır. Yarım kesilmiş devasa bir satır, insanın görebileceği en güçlü "devamı var" sinyalidir ve 0 bayta mal olur. Kaza gibi değil kasıt gibi okunması için: turuncu akış hattı tam o satırın arkasından geçer ve mono "AŞAĞI KAYDIRIN" etiketi o satırın tabanına oturur.

**2. İlk 120px'te somut ödül.** Parmak değer değmez duvar küçülmeye başlar ve yüklem içeri yazılır — kaydırmanın karşılığı CÜMLENİN TAMAMLANMASI. Bu bir süsleme değil, bilgi. Scrub'a bağlı, hıza bağlı değil; geri kaydırırsan geri alır.

**3. Plaka devri (saf CSS derinlik).** Teknik: `position: sticky; top: 0; height: 100svh`. Siyah plaka yerinde durur, beyaz plaka ÜSTÜNE kayar. Kart üstüne kart hissi; pin değil, sayfa hiç donmuyor. JS'siz çalışır, 0 KB.

## İlk üç bölümün geçiş mantığı
**S1 · SİYAH PLAKA (100svh, sticky)** — Harf kadrajı, koyu kutup. Yazı duvarı + mono hizmet şeridi + yarım yüklem. `data-akis="duz"`, `data-alt-cta-gizle`.
↓ 0–70vh: duvar 1→0,46 ölçek (tek `transform`, reflow yok), video düzlemi parlaklık 1→0,72, akış hattı "Z" harfinin karnına girip çıkar (DrawSVG scrub).

**S2 · BEYAZ PLAKA (100svh, S1'in üstüne kayar)** — Aynı imza, TERS kutup: beyaz üzerine siyah harfler, içinde ıslak gece pisti onboard klibi. Üç satır, üç fiil:
  ÇEKERİZ. / KURGULARIZ. / YAYINLARIZ.
Kutbun dönmesi bilgi taşır: koyu plaka "ne yaptığımız", beyaz plaka "nasıl yaptığımız". Sağ kolonda, aynı düzlemden beslenen iki küçük kare yan yana: aynı karenin ham ve kurgulanmış hâli — KURGU ve EDİT'i cümleyle iddia etmek yerine GÖSTERİR.
↓ Geçiş: beyaz plakanın üst kenarı `clip-path: polygon()` ile tek köşeli kesik; kesik hattın üstünden turuncu akış hattı geçer. Kesik köşenin tek köşe noktası tek CSS değişkeniyle scrub edilir.

**S3 · KÂĞIT BANT (normal akış, plaka biter)** — Mevcut sektör kapısı ve "Neyin eksik" buraya iner. Plaka rejimi burada KAPANIR: IntersectionObserver `mix-blend-mode: normal` yazar, video duraklar ve `src` serbest bırakılır. Sayfanın kalanı mevcut iki bant ritmine döner. Yani "cafcaf" ilk iki ekranda yoğunlaşır, okuma bölgesini kirletmez — ucuz durmamasının tek garantisi bu.

Mobilde S1→S2 arası `max-height: 680px` altında sticky kapalı: iki plaka normal arka arkaya dizilir. Küçük ekranda yapışkan katman kaydırma hissini bozuyor.

### Video kullanımı
## Mutlak kural: harf kadrajı YALNIZCA 5 yatay MAS klibini kullanır

`kunye.json`'daki 15 klip iki gruba ayrılıyor: 5 adet 640×360 yatay (MAS go-kart) ve 10 adet 404×720 dikey (yemek/içecek/drone). Harf kadrajı bir satır boyunca ~5:1 geniş bir açıklık yaratır; dikey bir klibi oraya `cover` ile koymak 2,5× yukarı ölçekleme ve karenin %14'ü demek. Bu yüzden:
- **Harf içine YALNIZCA yatay klip girer.** Dikey 10 klip kendi 9:16 kutularında, vaka ve hizmet bölümlerinde kalır — oraya hiç dokunmuyoruz.
- Açıklık/kaynak en-boy farkı 1,6×'ı geçemez. 640×360 (1,78) → yalnız 1,1'den geniş açıklıklar.

## Klip atamaları
| Yer | Dosya | Boyut | Neden |
|---|---|---|---|
| S1 siyah plaka | `hero-mas-gokart-gece-grid.mp4` | **972 KB** | Arşivin en küçüğü; gece, siyah zemin, turuncu ışık — plakayla birebir. Hareket az olduğu için 6 sn döngü dikişi görünmez. |
| S2 beyaz plaka | `mas-karting-academy-gece-onboard.mp4` | 1,7 MB | Islak gece pistinde onboard akış; `multiply` altında iyice koyulaşıp beyaz plakada güçlü kontrast veriyor. İlk kaydırmadan SONRA yüklenir. |
| Kullanılmaz (kadrajda) | `...-pist-marka-kapanis.mp4`, `...-damali-bayrak.mp4` | — | İkisi de müşteri logo/başlık kartıyla bitiyor; ajansın kendi başlığının içinde müşteri logosu dönmesi yanlış okunur. |

## Koruma kuralları (kodda zorunlu)
1. **Tek düzlem, çok açıklık.** Bir plakada tek `<video>` vardır; iki kelime aynı düzlemin iki deliğidir. Işık bir kelimeden çıkıp diğerinde devam ettiği için "iki video kutusu" değil "tek ekrana açılmış pencereler" okunur. Maliyet: tek dosya, tek çözücü.
2. **`src` üç koşul birlikte sağlanmadan atanmaz:** görünürlük ≥%50 **ve** `requestIdleCallback` (ya da LCP+1,2 sn) **ve** ağ uygun. Ağ eşiği hero için YÜKSELTİLİR: mevcut kod 2g/slow-2g'yi engelliyor; 972 KB'lık plaka için `3g` de engellenir ve `connection.downlink >= 1.5` istenir.
3. **Altında her zaman durağan kare durur.** `.af-hk-plan` içinde `<img>` (18 KB AVIF / 26 KB WebP, 1024×576) kalıcıdır; video onun ÜSTÜNE 600 ms'de çapraz geçer. Video hiç gelmezse, `play()` reddedilirse, `saveData` açıksa veya ağ kötüyse duvar hiç bozulmaz — hep dolu görünür.
4. **`object-position` kişi korumasıdır.** `RAPOR.md §8.2`: `hero-mas-gokart-gece-grid.mp4` arka planında bariyer önünde iki kişi var (yüz seçilmiyor). Açıklık karenin ÜST %25'ini asla göstermez: `object-position: 50% 62%` (mobilde `50% 62%`, masaüstünde `50% 58%`). Böylece açıklıkta yalnız kartlar ve aydınlanmış asfalt kalır.
5. **Hız 0,72×.** `playbackRate = 0.72`: 6 sn'lik döngü 8,3 sn gibi okunur, 640px kaynağın yukarı ölçeklemesinden gelen hareket titremesi gizlenir, "stok video" acelesi kaybolur. Negatif `playbackRate` (ping-pong) KULLANILMAZ — Safari'de güvenilmez.
6. **Ses yok, kontrol yok.** `muted playsInline loop preload="none" disablePictureInPicture tabIndex={-1} aria-hidden="true"`. Künye şeridi (`kunyeGoster`) kadrajda KAPALI: başlığın içine altyazı girmez. `RAPOR.md §8.1`'deki müzik notu için klipler `muted` gömülüdür; ffmpeg gelince ses kanalı tamamen çıkarılsın.
7. **`Video.tsx`'e tek yeni prop: `kadraj`.** 3 katmanlı yığını basar, oynat düğmesini duvarın İÇİNDEN çıkarıp altına 44px'lik turuncu bir çipe taşır (otomatik oynatma reddedilirse görünür). Mevcut `data-video` / `data-video-sira` sözleşmesi aynı kalır, böylece `Efektler.tsx`'teki "aynı anda tek video" denetleyicisi hiç değişmeden plakaları da yönetir.
8. **Ekran dışında tam serbest bırakma.** Plaka görünürden çıkınca: `pause()`, `mix-blend-mode: normal`, `will-change` kaldırılır. Sayfanın kalanında blend/kompozisyon maliyeti sıfırdır.

### Hizmetlerin görünürlüğü
## İlk ekranda: hizmetler BAŞLIĞIN İÇİNDE, ikon ızgarası yok

Yazı duvarının hemen altında tek satırlık mono bir yuva. Beş hizmet orada harf harf devreder (1,8 sn'de bir, ScrambleText):

`SOSYAL MEDYA YÖNETİMİ` → `DRONE ÇEKİMİ` → `KAMERA ve FOTOĞRAF ÇEKİMİ` → `KURGU ve EDİT` → `REKLAM YÖNETİMİ · META · GOOGLE · TIKTOK`

Kritik ayrıntılar:
- **Beşi de gerçek `<a>` bağlantısıdır.** SSR'da `<ul>` olarak basılır, kendi hizmet sayfasına gider. SEO ve klavye kazanır, "dekor metin" değildir.
- **JS'siz hâl bozulmaz:** listeyi gizleyen CSS `.af.js-var` altındadır (repodaki mevcut 4 saniye kapısı). JS gelmezse beş hizmet normal, okunur bir satır listesi olarak görünür. JS gelirse tek yuvaya toplanır.
- **Kayma sıfır:** yuva mono ve `width: 34ch` ile kilitli; en uzun ad bile kutuyu büyütmez.
- Aktif adın altına DrawSVG ile 2px turuncu çizgi çizilir (0,35 sn), sönerken geri silinir.
- Odak gelince (`:focus-within`) devir DURUR ve beş bağlantının tamamı açılır.
- Masaüstünde (≥1024px) devir yerine beşi yan yana durur, biri altı çizili dolaşır — geniş ekranda tek tek göstermek bilgi saklamak olur.

## İlk kaydırmada (S2 beyaz plaka): üretim zincirinin kendisi

Üç fiil, üç satır, ters kutup harf kadrajı:
**ÇEKERİZ. / KURGULARIZ. / YAYINLARIZ.** — hizmet listesi değil, iş akışı. Her fiil bir hizmet kümesini çağırır:
- **ÇEKERİZ** → drone çekimi + kamera/fotoğraf çekimi. Satırın sağında mono künye: `DRONE · 404×720 · İSTİNYE KOYU` ve `KAMERA · YEMEK · MEKÂN`, ikisi de gerçek hizmet sayfasına bağlanır.
- **KURGULARIZ** → KURGU ve EDİT'in KANITI. Satırın sağında aynı karenin iki hâli yan yana: ham ve kurgulanmış. Elimizdeki `kule-istanbul-kokteyl-hazirlama.mp4` içinde zaten kurgulanmış emoji seçim animasyonu var (künye: "üstte malzeme emojileriyle kurgulanmış seçim animasyonu") — kurgu becerisi cümleyle iddia edilmez, iki kare yan yana konup GÖSTERİLİR. Bu, Türkiye'deki ajans sitelerinde göremeyeceğiniz tek şeydir: "kurgu yapıyoruz" yazmak yerine kurgunun öncesi/sonrası.
- **YAYINLARIZ** → reklam süreç yönetimi. Sağda üç mono satır, üç gerçek bağlantı: `META · INSTAGRAM · FACEBOOK`, `GOOGLE`, `TIKTOK`. Yanlarında rakam değil, SÜREÇ etiketi: `kurulum → hedefleme → ölçüm → rapor`. Uydurma rakam yok, oran yok, "%X artış" yok — yalnız yapılan işin adımları.
- **SOSYAL MEDYA YÖNETİMİ** üç fiilin hepsini kapsadığı için plakanın alt kenarında tek bir mono şerit olarak durur: `AYLIK İÇERİK AKIŞI · ÇEKİM · KURGU · YAYIN · RAPOR` — yani yönetim, üç fiilin sürekli hâli olarak konumlanır. Doğru ve iddiasız.

Böylece ziyaretçi ilk iki ekranda, tek kelime pazarlama dili okumadan beş hizmetin tamamını görmüş ve altısına bağlantı bulmuş olur.

### Performans
## Hedef: 3G'de LCP ≤ 2,5 sn, CLS ≤ 0,01, ilk ekran transferi ≤ 165 KB

### LCP
- **LCP adayı metin, video değil.** Dolgu görseli (`poster/hk-dolgu-gece-grid.avif`, 1024×576, ~18 KB AVIF / 26 KB WebP yedek) `<link rel="preload" as="image" fetchpriority="high">` ile ön yüklenir. Mevcut 1280×721 / 140 KB posteri kadrajda KULLANMAYIN — açıklıktan karenin %18'i görünüyor, 140 KB israf.
- **GSAP, LCP yolundan tamamen çıkarılır.** Şu an `Efektler.tsx` doğrudan içe aktarılıyor: gsap-core + ScrollTrigger + SplitText + ScrambleText + DrawSVG + Lenis ≈ 115 KB gz. `next/dynamic(..., { ssr:false })` + `requestIdleCallback` ile ilk boyamadan SONRA yüklenmeli. İlk ekran 0 KB GSAP taşır.
- **İlk ekran CSS'i satır içi.** `site.css` 65 KB ve engelleyici. Plaka + duvar + mono yuva kuralları (~1,6 KB) layout'taki mevcut satır içi kapı betiğinin yanına `<style>` olarak basılır; gerisi normal yoldan gelir.
- Yazı tipi: `next/font/google` zaten ön yüklüyor; `display:'swap'` ve `adjustFontFallback: true` (varsayılan) KORUNUR. `wdth` ekseni EKLENMEZ (+18–26 KB, LCP yolunda).

### CLS
- **Satır yükseklikleri mutlak ve kilitli:** `.af-hk-satir { height: clamp(46px,13.5vw,132px); overflow: clip; }`. Bricolage geç swap olsa bile glif sabit kutuda değişir → kayma 0.
- `100svh` (+ `100vh` yedeği): iOS adres çubuğu daralmasının yarattığı yükseklik zıplaması biter. `100vh` TEK BAŞINA kullanılmaz.
- Mono yuva `width: 34ch` ile kilitli; ScrambleText genişliği değiştiremez.
- `<video>` ve `<img>` aynı `aspect-ratio`'lu kutuda; video gelince kutu büyümez.
- Ölçek scrub'ı `font-size` değil `transform: scale()` sürer → hiç reflow yok.

### Ana iş parçacığı
- SplitText tek seferde, `document.fonts.ready` sonrası, `requestAnimationFrame` içinde kurulur (3 satır ≈ 4–7 ms). Ardından bir `ScrollTrigger.refresh()`.
- Scrub tek bir `transform` + tek bir CSS değişkeni yazar. Mevcut tek-rAF kuralı (gsap.ticker Lenis'i sürüyor) korunur; yeni `requestAnimationFrame` döngüsü YOK.
- `will-change: transform` yalnız scrub süresince; bittiğinde `onComplete` ile kaldırılır.
- Blend alanı duvarın sınır kutusuna kırpılı (`contain: paint`) — tam ekran blend edilmez. Aynı anda tek blend katmanı yaşar.

### Ağ ve hareket korumaları
| Durum | Davranış |
|---|---|
| `prefers-reduced-motion: reduce` | Scrub yok, SplitText yok, Scramble yok, video yok. Duvar durağan kareyle DOLU kalır, akış hattı tam boy çizili, yüklem satırı kırpılmadan tamamen görünür. Kendinden emin bir afiş gibi durur. |
| `saveData` veya 2g/slow-2g | Video hiç yok, görsel de yok: `.af-hk-taban` gradyanı doğrudan harflerin içinde görünür. Harfler **marka sembolünün kendi gradyanıyla** dolar (`flow-sembol.svg`'den alınmış duraklar) — 0 bayt, marka doğru, 5,52:1 kontrast. |
| 3g veya `downlink < 1,5` | Durağan görsel (18 KB) var, video yok. |
| 4g+ / bilinmeyen + yeterli downlink | Video düzlemi, idle'da, görünürlükte, çapraz geçişle. |
| Ekran dışı | `pause()`, `mix-blend-mode: normal`, `will-change` kaldırılır, `src` serbest. |
| Sekme arka planda | Mevcut denetleyici duraklatıyor; plakalar da aynı yoldan. |

### Mobil düşüşleri
Dolu kelime 2→1 · blend edilen glif kenarı yarıya · scrub mesafesi 70vh→40vh · `max-height:680px` altında yapışkan plaka kapalı · işaretçi itişi tamamen yok · `object-position` daha aşağıda.

### Medya bütçesi
`RAPOR.md`: 42 MB / 60 MB kullanılmış, 18 MB boş. Yeni eklenen: 2 dolgu görseli (AVIF+WebP) ≈ 48 KB. Yeni video YOK.

### Erişilebilirlik
## Klavye
- İlk ekrandaki beş hizmet adı gerçek `<a>`, DOM sırasında ve görsel sırada. `:focus-visible` halkası mevcut `--af-halka` tokenından, siyah plakada 2px turuncu + 2px offset (plakada 7,4:1 görünür).
- Odak gelince (`:focus-within`) Scramble devri DURUR ve beş bağlantının tamamı açılır — hiçbir bağlantı "sırası gelmediği için" erişilemez durumda kalmaz.
- Mevcut `.af-atla` ("İçeriğe geç") bağlantısı plakanın üstünde kalır; plakanın `isolation: isolate`'i onu etkilemez (kardeş değil, dışında).
- Video düzleminde `tabIndex={-1}`, oynat çipi ise 44×44px gerçek `<button>` ve duvarın İÇİNDE değil altında — başlığın ortasında tıklanabilir bir şey durmaz.
- Yapışkan plaka klavye kaydırmasını engellemez: `position: sticky` odak kaydırmasını bozmaz (pin bozar, bu yüzden pin kullanmıyoruz).

## Ekran okuyucu
- `<h1>` tek, gerçek, tam bir cümledir: "Görünen yüzünüz ve arkadaki yazılım — ikisini de aynı ekip kuruyor." Görsel olarak dört satıra bölünür ama anlamı bölünmez.
- SplitText'in `aria:'auto'` varsayılanı (yerel `node_modules/gsap/SplitText.js` içinde doğruladım: `aria-label` + parçalara `aria-hidden`) başlığı tek parça olarak okutur; harf span'ları harf harf okunmaz.
- Video düzlemi tamamen dekoratif: `aria-hidden="true"`, `alt` iddiası yok, künye şeridi kapalı.
- Scramble yuvası `aria-hidden="true"`; gerçek bilgi `.af.js-var` altında `clip-path: inset(50%)` ile görsel olarak saklanan ama DOM'da ve odak sırasında duran `<ul>`'dadır. `aria-live` KULLANILMAZ — 1,8 sn'de bir konuşan bir şerit işkencedir.
- Başlık sırası bozulmaz: plakalar `<section>`, S1 `h1`, S2 `h2`.

## Kontrast (hesaplanmış, tahmin değil)
| Yüzey | Taban/tavan rengi | Oran | Gereken |
|---|---|---|---|
| Koyu plaka, dolu harf | #E2541F / #000 | **5,52:1** | 3:1 (büyük metin) |
| Açık plaka, dolu harf | #C5410F / #FFF | **5,08:1** | 3:1 |
| Koyu plaka, mono turuncu | #FF6B35 / #000 | **7,37:1** | 4,5:1 |
Blend yığınının alt katmanı bir TABAN/TAVAN olduğu için harfin içi asla bu değerlerin ötesine geçemez. "Karanlık kare geldi, kelime kayboldu" hatası mimari olarak imkânsız — bu, video-harf tekniğinin bilinen tek ciddi erişilebilirlik riski ve burada kökten çözülmüş durumda.

## Hareket hassasiyeti
- `prefers-reduced-motion: reduce` → hiçbir scrub, hiçbir split, hiçbir scramble, hiç video. Duvar dolu ve durağan, yüklem satırı kırpılmadan tam görünür (az hareket isteyen kullanıcıya "yarım cümle" oyunu oynanmaz).
- Blend edilen metin alt-piksel kenar yumuşatmasını kaybeder → **kural: blend edilen metin ≥700 ağırlık ve ≥40px olmalı.** Gövde metni ASLA blend edilmez.
- Kırpışma (flash) riski yok: yanıp sönen, sıçrayan, 3 Hz üstü titreşen hiçbir öğe yok. Scramble harf değişimi 0,7 hızda, tek satırda.

### İmza efekt katmanı
- HARF KADRAJI (imza) — bölüm başlıklarının anahtar sözcüğünün içinden tek bir video düzlemi görünür; kutup banda göre döner. Teknik: 3 katmanlı blend knockout (taban gradyan + plan video `screen`/`multiply` + maske plaka `multiply`/`screen`), `isolation: isolate` + `contain: paint`, ekran dışında IntersectionObserver `mix-blend-mode: normal` yazar. Yalnız 640×360 yatay MAS klipleriyle; en çok 3 bölümde.
- SATIR MASKESİ — her H2 kendi satır kutusunun içinden yukarı açılır, harfler 0,012 sn kademeyle gelir. Teknik: `SplitText(el,{type:'lines,chars',mask:'lines',aria:'auto'})` + `gsap.from(yPercent:108, 0.5s, power3.out)`, `once:true`, `document.fonts.ready` sonrası tek seferde kurulur; mevcut `[data-baslik-ac]` kancası harf kademesiyle yükseltilir.
- MONO DEVİR ŞERİDİ — hizmet adları, veri etiketleri ve sektör adları aynı yuvada harf harf yeniden dizilir, genişlik sabit kaldığı için hiç kayma olmaz. Teknik: `ScrambleTextPlugin` (`chars:'upperCase', revealDelay:0.25, speed:0.7`) tek bir `aria-hidden` span üzerinde; yuvaya `width: 34ch` mono kilit, gerçek liste `.af.js-var` altında `clip-path: inset(50%)` ile klavye ve ekran okuyucuya açık kalır.
- AKIŞ HATTI HARFE GİRER — sayfanın mevcut 2px turuncu imza çizgisi üç noktada bir harfin karnından (Ö, A, D sayaç boşluğu) girip diğer yanından çıkar. Teknik: `AkisHatti.tsx`'e iki yeni şekil (`harf-ic`, `kesik`) eklenir, `DrawSVGPlugin` ile scrub; mevcut tek-SVG / tek-dinleyici kuralı bozulmaz, yeni eleman yok.
- KESİK KENAR — bant ve plaka geçişleri yuvarlak değil, tek köşeli sert bir kesikle olur ve kesiğin üstünden turuncu hat geçer. Teknik: `clip-path: polygon()` içinde tek `--af-kesik` CSS değişkeni, ScrollTrigger scrub ile 0→1; gradyan yok, gölge yok, SVG yok.
- HARF İTİŞİ (yalnız masaüstü, ince imleç) — işaretçi yazı duvarına yaklaşınca en yakın üç harf 2–6px kaçar, duvar canlı bir yüzey gibi durur. Teknik: mevcut `[data-miknatis]` altyapısının üstüne `gsap.quickTo(x/y, 0.35s)` yalnız en yakın 3 harfe (tüm harflere değil); `(hover:hover) and (pointer:fine)` ve `prefers-reduced-motion: no-preference` koşullu, mobilde tamamen yok.

### Riskler
- NEREDE UCUZ GÖRÜNÜR — 1: Harf harf zıplayan/dönen açılış. Bunu yapmayın: açılış SATIR maskesinden gelir, harf kademesi 0,012 sn'yi geçmez. Harfler tek tek dans ederse 2019 şablonu olur. 2: Videonun herhangi bir yerde DİKDÖRTGEN olarak görünmesi — açıklığın bir pikseli bile harfin dışına taşarsa büyü biter; `contain: paint` + `isolation: isolate` ihmal edilemez. 3: Boş siyah plaka. Plakanın üzerinde en çok ÜÇ işaret olur: akış hattı, duvar, mono yuva. Dördüncüyü koyan an 'şablon dark mode' olur. 4: Dikey 404×720 klibin geniş bir harf açıklığına sokulması — 2,5× yukarı ölçekleme, bulanık ve amatör. Kural kesin: kadrajda yalnız 640×360 yatay klipler.
- NEREDE YAVAŞLAR — 1: `mix-blend-mode` tam ekran alanda düşük uçlu Android'de kompozisyon maliyeti yaratır; blend yalnız duvarın sınır kutusunda, aynı anda tek katman, ekran dışında `normal`. 2: GSAP yığını (≈115 KB gz) şu an `Efektler.tsx` ile doğrudan içe aktarılıyor ve LCP yolunda duruyor — `next/dynamic` + idle'a alınmazsa 3G'de 2,5 sn tutmak imkânsız. 3: `site.css` 65 KB engelleyici; ilk ekran kuralları satır içine alınmazsa ilk boya gecikir. 4: SplitText yazı tipi yüklenmeden koşarsa yanlış satır kırılması çıkar ve ikinci kez bölmek gerekir (çift maliyet + görünür zıplama): `document.fonts.ready` beklenmeli, ardından `ScrollTrigger.refresh()`. 5: 640×360 kaynak 1440px ekranda ~2,25× yukarı ölçekleniyor; açıklık dar olduğu için göze batmıyor ama tam genişlikte tek bir harf açıklığı kullanılırsa yumuşaklık belli olur — açıklık satır genişliğini geçmemeli.
- YAPMAZSAK ÇÖKER — 1: `.af-hk-taban` gradyan tabanı/tavanı. Olmazsa karanlık bir kare harfin içine geldiğinde kelime kaybolur; hem erişilebilirlik hem 'site bozuk' algısı. Hesaplanmış 5,52:1 / 5,08:1 tabanı bu tek katmandan geliyor. 2: Satırların mutlak kilitli yüksekliği. Olmazsa Bricolage swap anında devasa duvar kayar, CLS tek başına 0,15'i geçer. 3: `100svh`. `100vh` ile iOS'ta adres çubuğu daralınca plaka zıplar ve yarım yüklem satırı rastgele yere düşer — mekanizmanın tamamı bozulur. 4: Durağan dolgu görselinin video ALTINDA kalıcı durması. Olmazsa `play()` reddinde, `saveData`'da veya 3G'de harfler boş kalır ve giriş ekranı çöker. 5: Hero videosunun 3g'de de engellenmesi (`downlink >= 1.5`). Mevcut kod yalnız 2g'yi engelliyor; 972 KB klip 3G'de LCP'yi yiyor. 6: Hizmet listesinin `.af.js-var` altında gizlenmesi — gizleme JS kapısına bağlanmazsa JS gelmediğinde ilk ekranda hiç hizmet görünmez.
- İÇERİK VE HUKUK — `RAPOR.md §8.2`: `hero-mas-gokart-gece-grid.mp4` arka planında bariyer önünde iki kişi var (yüz seçilmiyor). Harf açıklığı bir kez karenin üst %25'ini gösterirse sahibinin 'yüz olmasın' kuralı ihlal edilir; `object-position: 50% 58-62%` pazarlık konusu değil ve yayın öncesi üç ekran boyunda (375 / 768 / 1440) gözle kontrol edilmeli. Ayrıca `§8.1`: kliplerin ses kanalı dosyanın içinde duruyor — `muted` yeterli ama ffmpeg gelince ses tamamen çıkarılsın. Logo/başlık kartıyla biten iki MAS klibi kadrajda kullanılmamalı (ajansın başlığının içinde müşteri logosu dönmesi yanlış okunur).
- ÖLÇÜM OLMAZSA KONSEPT ÇÖKER — Yayın öncesi zorunlu: gerçek telefonda (orta sınıf Android) WhatsApp ve Instagram uygulama içi tarayıcısında açılış, 3G kısıtlı Lighthouse koşusu (LCP / CLS / TBT), `prefers-reduced-motion` açıkken ekran görüntüsü, JS tamamen kapalıyken ekran görüntüsü, ve 375×667 (küçük ekran) ile 1440×900'de yarım yüklem satırının kırpılma yüzdesi. Bu beş kontrolden biri atlanırsa konseptin 'saygın kalma' sözü boşa düşer.

### Yeni paket
YENİ PAKET GEREKMİYOR — ve bilinçli olarak önerilmiyor.

İstenen etkinin tamamı kurulu araçlarla çıkıyor: `mix-blend-mode` knockout (saf CSS), `clip-path` (saf CSS), `position: sticky` (saf CSS), GSAP ScrollTrigger / SplitText / ScrambleText / DrawSVG (zaten kurulu, 3.15'te hepsi ücretsiz), Lenis (zaten kurulu), tek `<video>`.

**three.js / ogl REDDEDİLDİ.** WebGL ile video-harf maskesi yapmak 120–600 KB JS ekler, LCP yoluna girer, `prefers-reduced-motion` ve JS'siz yollarda ikinci bir yedek kurmayı zorunlu kılar, metni gerçek DOM metni olmaktan çıkarır (SSR, SEO, ekran okuyucu, metin seçimi gider) ve düşük uçlu Android'de GPU'yu ısıtır. Karşılığında CSS blend yığınının zaten verdiği şeyi verir. Ziyaretçilerin çoğu telefondan ve uygulama içi tarayıcıdan girerken bu takas kaybediyor.

**matter.js REDDEDİLDİ.** Fizik, bu konseptin ihtiyacı olan şey değil; harf itişi için `gsap.quickTo` 0 ek bayt.

**`background-clip: text` ve SVG `mask` ELENDİ (teknik gerekçe).** `background-clip: text` canlı video alamaz. SVG `mask` + `foreignObject` iOS Safari'de güvenilmez; harfi path'e çevirmek SSR metnini ve erişilebilirliği öldürür, ayrıca Türkçe karakterli dört satır için ciddi bayt demek. Blend knockout üçünün de yapmak istediğini yapıyor ve metni metin bırakıyor.

Tek önerilen "ekleme" paket değil, iki küçük görsel dosyası: `public/site/medya/poster/hk-dolgu-gece-grid.{avif,webp}` ve `hk-dolgu-onboard.{avif,webp}` (1024×576, toplam ≈48 KB). Medya bütçesinde 18 MB boş yer var.

Ayrıca Bricolage Grotesque'e `wdth` ekseni eklemeyi DEĞERLENDİRİP REDDEDİYORUM: latin+latin-ext alt kümesine +18–26 KB bindiriyor ve tam LCP yolunda duruyor; sıkışık devasa görünümü `letter-spacing: -0.045em` ve `line-height: 0.84` ile bedelsiz alıyoruz.


---
## JÜRİNİN ZORUNLU EKLEMELERİ


### HARF KADRAJI — yazı, görüntünün kadrajıdır diyen jüri

**Alınacaklar:**
- IŞIK TEZGÂHI'ndan DOKTRİN (en önemli alınacak): "Zenginlik duran karede." Etkiyi harekete değil ışığa, grain'e, cama ve gradyana yükle. Pratik sonucu: prefers-reduced-motion açık kullanıcı, saveData'daki 2g kullanıcısı ve 4g kullanıcısı AYNI kompozisyonu görsün. HARF KADRAJI bunu zaten kısmen yapıyor (durağan kare harfin içinde kalıyor) ama saveData yolunda harfi yalnız gradyanla doldurup bırakıyor; oraya grain (390 baytlık feTurbulence data-URI, koyu plakada 0,045 / mobilde 0,030) ve tek ışık havuzu eklenirse sade hâl de PAHALI görünür, yedek görünmez.
- IŞIK TEZGÂHI'ndan ÇÖZÜNÜRLÜK SÖZLEŞMESİ: `--af-yarik-en: min(56vw, 760px)` ve "hiçbir açıklığın kısa kenarı kaynağın kısa kenarının 1,4 katını geçmez" kuralını token'a yaz. HARF KADRAJI'nın "yalnız 640×360 yatay klip, en-boy farkı 1,6×'ı geçemez" kuralıyla birleştirilip TEK kural haline getirilmeli — iki konsept aynı matematiğe iki ayrı isim vermiş.
- DÖRT DÜĞÜM'den KURGU KAPISI (altı konseptin en iyi hizmet gösterimi): 16:9 bir pencere 520 ms'de 9:16'ya dönüyor, üstünde tek kelime KURGU, altında "yatay çekim → dikey yayın". Tek klip, tek clip-path. Bunu S2 beyaz plakadaki KURGULARIZ satırının yanına koy — HARF KADRAJI'nın "ham ve kurgulanmış kare yan yana" fikrinden daha okunur, çünkü dönüşümü ziyaretçi GÖRÜYOR, iki kareyi karşılaştırmak zorunda kalmıyor.
- DÖRT DÜĞÜM'den İKİ GERÇEK REPO DÜZELTMESİ (ikisini de doğruladım, konseptten bağımsız olarak yapılmalı): (a) /Users/ajansflow/Desktop/yazılımlar/ajansflow-next/src/app/site/page.tsx satır 277 — hero H1'indeki `data-baslik-ac` kaldırılmalı; SplitText + mask LCP ögesini gizliyor. (b) /Users/ajansflow/Desktop/yazılımlar/ajansflow-next/src/components/site/Efektler.tsx satır 173 — akış hattı `trigger: document.body, end: 'bottom bottom', scrub: 0.6` ile tüm sayfa boyu stroke-dashoffset scrub ediyor; dashoffset compositor'da hızlanmaz. Mobilde bölüm bölüm segmentlere ayrılmalı ya da scrub yerine bölüm bazlı opaklık açılışına düşülmeli. Repodaki en büyük tek jank riski bu.
- DÖRT DÜĞÜM'den `<meta name="theme-color" content="#0E0E16">`: koyu/siyah plaka ile WhatsApp-Instagram içi tarayıcının üst çubuğu arasında beyaz şerit kalmasın. HARF KADRAJI siyah plaka kullanıyor ve bu maddeyi atlamış; atlanırsa ilk izlenim "bozuk sayfa" olur.
- AÇIK TEZGÂH'tan BOŞ SES RAYI ve GERÇEK SÜRELER: Klipler sessiz olduğu için dalga formu çizmeyi REDDEDİP yerine "1px kesikli boş ray + ses yok · müzik sonradan" yazmak. RAPOR.md §8.1 gerçekten "ses kanalı dosyanın içinde duruyor" diyor. Bu, altı konseptin en inandırıcı tek ayrıntısı. Klip bloklarının kunye.json'daki gerçek sürelerle (7,0 · 6,0 · 6,5 · 7,0 sn) oransal olmasıyla birlikte S2'deki KURGULARIZ satırının yanına girmeli.
- AÇIK TEZGÂH'tan GERÇEK OKUTULABİLİR QR: src/components/site/anasayfa/qr.ts sunucuda üretiyor, istemciye 0 KB JS gidiyor. Masaüstünde ziyaretçi kendi telefonuyla okutunca /demo/qr-menu dört dilli çalışan menü elinde açılıyor. Bu bir süs değil ürün demosu ve bütçeden hiç yemiyor. HERO'DA DEĞİL, yazılım bandında kullanılmalı — yanında QR okutamayanlar için görünür metin bağlantısı.
- KADRAJ TEZGÂHI'ndan REKLAM VERİ PENCERESİ: Reklam süreç yönetiminin görüntüsü yok ve uydurma panel ekran görüntüsü yasak. Çözüm: 2px köşeli mono panel, yalnız kanal adları (META · INSTAGRAM/FACEBOOK, GOOGLE · ARAMA/PMAX, TIKTOK), genişlik taşıyan çubuklar, HİÇ RAKAM YOK, alt köşede "ÖRNEK" damgası. Altı konseptin en dürüst reklam çözümü; HARF KADRAJI'nın S2'deki YAYINLARIZ satırına girer.
- KADRAJ TEZGÂHI'ndan ASİMETRİ KURALI ve KÜÇÜK-KESKİN PENCERE KURALI: Pencereler eşit boyda ve düzgün ızgarada dizilmez; farklı oranlar (9/16, 5/4, 1/1) ve en az bir kenardan kesilmişlik YÜK TAŞIYAN karardır. Ve "küçük-keskin pencere, büyük-yumuşak videodan daha pahalı görünür" — mobilde ≤196px, masaüstünde ≤320px.
- KADRAJ TEZGÂHI'ndan ŞARTNAME ÇELİŞKİSİ NOTU (süreç olarak zorunlu): SITE-TASARIM.md §5 bugün net biçimde "Ana sayfa hero'sunda video YOK" diyor ve §3 bant renginin bilgi olduğunu söylüyor; hero şu an `af-bant--kagit` (page.tsx satır 271 — doğruladım). HARF KADRAJI ikisini de değiştiriyor ama bunu FARK ETMEYEN tek konsept. Uygulamadan önce §3 ve §5 güncellenmeli, yoksa başka bir ajan videoyu haklı olarak siler ya da bandı kâğıda çevirir.
- TEZGÂH'tan NESNE AİLESİ SÜREKLİLİĞİ: hizmet adı → akış sütunu satırı → eksik çipi → Akış Kartı satırı → ön-dolu form alanı. Altı konseptin en iyi dönüşüm düşüncesi ve altyapısı repoda hazır (sessionStorage['af-akis'] + AkisKarti + talepGonder). HARF KADRAJI'ndaki beş mono hizmet çipi, S3'teki EksikSecici çiplerine aynı nesne olarak devredilmeli — yoksa ilk iki ekran etkileyici bir afiş olarak kalır ve "müşteri tutamayız" sorunu aynen durur.
- TEZGÂH'tan SplitText'i KRİTİK YOLDAN ÇIKARMA: Başlık kelimelerini/satırlarını sunucuda span olarak basıp CSS keyframe ile kaldırmak. Ölçülmüş sonuç: kritik JS yolu bugünden 3,7 KB HAFİF. HARF KADRAJI satır maskesi için SplitText'e dayanıyor; en azından İLK boyama satır maskesinin SSR karşılığıyla çıkmalı, SplitText yalnız yükseltme olmalı.
- TEZGÂH'tan SAÇILMA/KONUM DİSİPLİNİ: `Math.random()` KESİNLİKLE YOK — her konum elle yazılmış sabit üçlü, rotasyon tavanı 4,5°, gölgeler tek yönden tek ışık kaynağıyla tutarlı. Rastgele = CodePen görünümü. Bu kural altı konseptin hepsi için geçerli ve kodun yanına yorum olarak yazılmalı.

**Kaçınılacaklar:**
- ffmpeg'e BAĞLI HİÇBİR ŞEY KRİTİK YOLA KONMAZ. `which ffmpeg` boş döndü ve public/site/medya/RAPOR.md satır 245 teyit ediyor: "ffmpeg, yt-dlp, HandBrake, ImageMagick yok." KADRAJ TEZGÂHI'nın hero-iki-kadraj.mp4'ü ve TEZGÂH'ın 256×144 mikro klibi bugün üretilemez. Bu yüzden hero, DİSKTE ZATEN VAR OLAN 971 KB'lık hero-mas-gokart-gece-grid.mp4 ile çalışmak zorunda. Dikey kliplerin hepsi 2,7-3,1 MB (ölçtüm) — hiçbiri hero'ya konamaz.
- TELEFONDA SÜRÜKLEME-FİZİK. Sürükleme bir kez dikey kaydırmayı yerse çıkış oranı ikiye katlanır ve bu zaten scroll-jacking yasağının ihlali sayılır. Draggable + InertiaPlugin + Physics2D ilk ekranda hiç olmasın; kurulu oldukları için (node_modules/gsap'ta hepsi var, doğruladım) bedava sanılıyor ama bedel bayt değil, kaydırma hissi.
- HERO'DA SÜREÇ ŞEMASI veya PARÇACIK ALANI. Akan noktalı düğüm diyagramı Türkiye'deki her ajans/yazılım sitesinin 4. bölümünde zaten var; hero'ya taşımak onu özgün yapmıyor, B2B SaaS yapıyor. Parçacık sayısına sert sınır koymak zorunda kalman (en çok 6 / mobilde 3, glow yok, iz yok) efektin klişeye ne kadar yakın olduğunun kendi itirafıdır.
- clip-path TWEEN ETMEK. clip-path interpolasyonu compositor dışıdır; 760×345'lik bir alanı 0,9 sn boyunca kare başına yeniden boyar. Açılış DAİMA statik clip-path + kapsayıcıda scaleY + içerikte ters scaleY ile yapılır. Aynı kural: `filter: blur()` DEĞERİ asla tween edilmez (yalnız opacity/transform), `backdrop-filter` tam ekran panelde yasak (site.css'teki mevcut üst bar yorumu da bunu yazıyor), `font-size` yerine `transform: scale()`.
- ALTI DETAYLI MİNİ ARAYÜZ TASARLAMAK. AÇIK TEZGÂH'ın vitrini altı ayrı küçük ürün yüzeyi istiyor ve tek satış argümanı o yüzeylerin gerçekliği. Biri yaklaşık görünürse bütün güvenilirlik TERSİNE döner. Tek bir teknik ya %100 ya %0 çalışır; altı şeyin altısının da ikna etmesi gerekmez.
- EŞİT ARALIKLI KESME ve STATİK POSTERLER ARASINDA GEZEN CANLI PENCERE. Eşit aralık slayt gösterisi olur; dört statik kare arasında rastgele canlanan bir pencere ise "kurgu" değil "bir şey bozuldu" okunur. İzleyici zaman çizelgesini görmüyor. Hareket TEK yerde ve yorum gerektirmeyecek biçimde olsun.
- DİKEY 404×720 KLİBİ GENİŞ BİR AÇIKLIĞA SOKMAK. 10 klip dikey, 5'i yatay (kunye.json'dan ölçtüm). Dikey bir klibi 5:1 bir harf açıklığına `cover` ile koymak 2,5× yukarı ölçekleme ve karenin %14'ü demek — bulanık ve amatör. Aynı şekilde 404×720 kaynağı 21:9 "sinema" oranına kırpmak görüntüyü öldürür.
- YENİ ÇALIŞMA ZAMANI PAKETİ. three.js (~150 KB gz), ogl (~11-25 KB + shader + bağlam kaybı yedeği), matter.js (~25-90 KB + KENDİ rAF döngüsü). SITE-BRIEF.md satır 98 "Yeni npm paketi yok" diyor ve SITE-TASARIM.md çelişkide BRIEF'i üstün tutuyor. Teknik gerekçe de aynı yönde: WebGL metni gerçek DOM metni olmaktan çıkarır (SSR, SEO, ekran okuyucu, seçilebilirlik gider), prefers-reduced-motion ve saveData yollarında ikinci bir yedek kurmayı zorunlu kılar, düşük uçlu Android'de GPU'yu ısıtır. IŞIK TEZGÂHI'nın "Faz 2 ogl" kapısı iyi çitlenmiş ama açılmaması gereken bir kapı.
- `100vh`. Tek satırlık bu hata, ziyaretçilerin ÇOĞUNUN bulunduğu ortamda (WhatsApp/Instagram içi tarayıcı) ilk kaydırmada 60-90 px zıplama yaratır ve hem LCP hem CLS'yi birden bozar. Daima `100svh` (+ gerekiyorsa `100vh` yedeği), hero yüksekliği `min()` ile tavanlı.
- İLK EKRANDA MÜŞTERİ MARKA KARTIYLA BİTEN KLİP. kunye.json'a göre bunlar: coin-coffee-flat-white, kule-istanbul-frozen-bogaz, mas-gokart-pist-marka-kapanis, mas-karting-academy-damali-bayrak, teras-kilyos-mangal-atesi. Kendi başlığımızın içinde başka bir markanın logo kartının dönmesi marka sahipliğini karıştırır ve "üçüncü marka panosu olan kare yok" kısıtını deler. Bunlar vaka sayfalarına gider. Ayrıca mas-gokart-pist-marka-kapanis içinde kaskta "SELİM ARAS" yazıyor (RAPOR.md §8.2) — kişi adı, onay gerekir.
- ScrambleText ENFLASYONU. Sayfa başına 8-12 ögeyi geçerse "teknoloji hissi" değil "numara" olur ve metin düğümünü mutasyona soktuğu için ekran okuyucuyu bozar. Yalnız `aria-hidden` mono span'lerde, dış ögede sabit `aria-label`, başlık ve gövde metninde ASLA. `aria-live` kullanılmaz — 1,8 sn'de bir konuşan bir şerit işkencedir.
- SERBEST GRADYAN RENGİ. Mor, mavi, teal, pembe ASLA girmez; iki-üç duraktan fazlası olmaz. Renkler yalnız public/site/marka/flow-sembol.svg'nin KENDİ stoplarından alınır — dosyada gerçekten #861500, #F14B00, #FFAE00, #FF5100, #FF8900, #FFCF3B var (okudum). Serbest bir "aurora" rengi girdiği an konsept şablona döner. Aynı disiplin grain için: 0,045'i geçerse ekran kirli görünür ve AMOLED'de bantlaşır; grain ASLA animasyonlu olmaz.

**Uygulama notları:**
- YAPIM SIRASI — YEDEK YOLLAR ÖNCE, EFEKT SONRA. Tek satır GSAP yazılmadan önce ilk ekran şu üç hâlde eksiksiz ve SAYGIN görünmeli: (a) JS hiç gelmemiş, (b) prefers-reduced-motion: reduce, (c) saveData/2g. Sıra tersine çevrilirse konsept tam da ana trafiğin olduğu üç durumda boş ekrana düşer. Repoda bunun kapısı hazır: src/app/site/layout.tsx satır 97-100'deki KAPI_BETIGI `js-var` ekliyor ve 4 saniyede `af-hazir` gelmezse kaldırıyor — plakanın/yarığın KAPALI durumu YALNIZ `.js-var` altında tanımlanmalı, CSS'in kendisinde asla.
- ÖNCE ÜÇ MEVCUT HATAYI DÜZELT, SONRA KONSEPTİ KUR (konseptten bağımsız, hepsi doğrulandı): (1) src/app/site/page.tsx:277 — hero H1'inden `data-baslik-ac` kaldırılacak (SplitText mask LCP ögesini gizliyor). (2) src/app/site/layout.tsx:9 — `import Efektler` STATİK, yani gsap-core + ScrollTrigger + SplitText + ScrambleText + DrawSVG + Lenis (≈115 KB gz) LCP yolunda duruyor; `next/dynamic(..., { ssr:false })` + `requestIdleCallback` zorunlu. (3) src/components/site/Efektler.tsx:173 — akış hattı tüm sayfa boyu stroke-dashoffset scrub ediyor; mobilde segmentlere bölünecek. Bu üçü yapılmazsa HANGİ konsept uygulanırsa uygulansın 3G'de 2,5 sn tutulamaz.
- AĞ KAPISI YÜKSELTİLECEK. src/components/site/Efektler.tsx:48 şu an yalnız `saveData` ve 2g/slow-2g'yi engelliyor (okudum). 971 KB'lık hero plakası için `3g` de engellenmeli ve `connection.downlink >= 1.5` istenmeli. Ayrıca hero videosunun `src`'si mevcut %50-görünürlük kapısıyla ATANAMAZ — hero ilk karede görünür olduğu için bu 971 KB'yi doğrudan LCP penceresine sokar. Yeni bir `data-video-bekle="yukleme"` niteliği eklenip `window.load` + `requestIdleCallback` + ağ kontrolü arkasına alınmalı. Mevcut `data-video` / `data-video-sira` sözleşmesi aynen korunmalı, böylece "aynı anda tek video" denetleyicisi değişmeden çalışır.
- BLEND YIĞINININ GRADYAN TABANI PAZARLIK KONUSU DEĞİL. Kazananın tek kritik katmanı bu: `.af-hk-taban` olmazsa karanlık bir kare harfin içine geldiğinde kelime kaybolur — hem erişilebilirlik hem "site bozuk" algısı. Hesaplanmış 5,52:1 (koyu kutup, #E2541F/#000) ve 5,08:1 (açık kutup, #C5410F/#FFF) tabanı yalnız bu katmandan geliyor. Beraberinde iki kural: blend edilen metin ≥700 ağırlık ve ≥40px olmalı (alt-piksel kenar yumuşatması kaybolur), gövde metni ASLA blend edilmez. Ve blend alanı duvarın sınır kutusuna kırpılı kalmalı (`isolation: isolate` + `contain: paint`), ekran dışında IntersectionObserver `mix-blend-mode: normal` yazmalı.
- SATIR YÜKSEKLİKLERİ MUTLAK KİLİTLİ. `.af-hk-satir { height: clamp(46px,13.5vw,132px); overflow: clip; display:block; }` — yükseklik yazı tipinden BAĞIMSIZ. Bricolage Grotesque `display:'swap'` ile geç gelse bile glif sabit kutunun içinde değişir, düzen kaymaz. Olmazsa swap anında devasa duvar kayar ve CLS tek başına 0,15'i geçer. Aynı gerekçeyle mono hizmet yuvası `width: 34ch` ile kilitli ve H1'de `text-wrap: balance` KULLANILMAZ (yazı tipi yüklenince satır sayısını değiştirip CLS üretir).
- ÜÇÜNCÜ YÜZEY NADİR KALMALI. `--af-plaka: #000000` tasarım sistemine eklenen tek yeni token ve teknik gerekçesi var (multiply knockout saf siyah ister; #0E0E16 ile görece parlaklık farkı %0,4). Ama kural yazılmalı: "bant = okunan içerik, plaka = başlık anı" ve plaka sayfada EN ÇOK 2 kez (S1 giriş + S2 ikinci ekran). Marka bantları #0E0E16 / #F7F5F2 dokunulmaz. Plakanın üzerinde en çok ÜÇ işaret olur: akış hattı, duvar, mono yuva — dördüncüyü koyan an "şablon dark mode" olur.
- CAFCAF İLK İKİ EKRANDA YOĞUNLAŞIR, OKUMA BÖLGESİNİ KİRLETMEZ. S3'te (kâğıt bant, mevcut "Neyin eksik" + Akış Kartı) plaka rejimi KAPANIR: IntersectionObserver `mix-blend-mode: normal` yazar, video duraklar, `src` serbest bırakılır, `will-change` kaldırılır. Sayfanın kalanı mevcut iki bant ritmine döner. Ucuz durmamanın tek garantisi bu — efekt her yerde olursa hiçbir yerde değerli olmaz.
- MOBİL DÜŞÜŞLERİ TEK TEK YAZILI OLMALI (≤700px): dolu kelime 2→1 (blend edilen glif kenarı yarıya iner), scrub mesafesi 70vh→40vh, `max-height:680px` altında yapışkan plaka KAPALI (iki plaka normal arka arkaya dizilir), işaretçi itişi tamamen yok, `object-position` daha aşağıda (50% 62%), grain 0,045→0,030. Mobilde dolu kelimeyi tek tutmanın nedeni iki katlı: dar kolonda iki dolu satır kalabalık ve düşük uçlu Android'de kompozisyon maliyeti yarıya iniyor.
- HİZMETLER İLK EKRANDA GERÇEK `<a>` OLMALI, DEKOR METİN DEĞİL. Beş hizmet SSR'da `<ul>` olarak basılır, her biri kendi sayfasına gider. Listeyi gizleyen CSS `.af.js-var` ALTINDA olmalı — gizleme JS kapısına bağlanmazsa JS gelmediğinde ilk ekranda HİÇ hizmet görünmez. Odak gelince (`:focus-within`) Scramble devri DURUR ve beşi de açılır. Masaüstünde (≥1024px) devir yerine beşi yan yana durur. İÇERİK BOŞLUĞU: src/lib/site-icerik.ts'de KURGU/EDİT'in kendi hizmet anahtarı YOK — sahibi bunu ayrıca vurguladığı için içerik ajanından `kurgu-edit` anahtarıyla yeni hizmet istenmeli, `/hizmetler/video#kurgu` çapası geçici çözüm.
- KİŞİ KORUMASI PAZARLIK KONUSU DEĞİL. RAPOR.md §8.2: hero-mas-gokart-gece-grid.mp4 arka planında bariyer önünde iki kişi var (yüz seçilmiyor). Harf açıklığı karenin ÜST %25'ini asla göstermemeli: `object-position: 50% 62%` (mobil) / `50% 58%` (masaüstü). Yayın öncesi üç ekran boyunda (375 / 768 / 1440) GÖZLE kontrol edilmeli. Ayrıca §8.1: kliplerin ses kanalı dosyanın içinde duruyor — `muted` yeterli ama ffmpeg kurulunca ses tamamen çıkarılsın.
- DURAĞAN DOLGU GÖRSELİ VİDEONUN ALTINDA KALICI DURMALI. `.af-hk-plan` içinde `<img>` (1024×576, ~18 KB AVIF / ~26 KB WebP) kalıcı; video onun ÜSTÜNE 600 ms'de çapraz geçer. Mevcut poster/hero-mas-gokart-gece-grid.jpg 140 KB (ölçtüm) ve açıklıktan karenin ancak %18'i görünüyor — kadrajda KULLANILMAYACAK, israf. sharp kurulu (node_modules/sharp — doğruladım), 15 satırlık script yeter. Bu görsel olmazsa `play()` reddinde, saveData'da veya 3G'de harfler boş kalır ve giriş ekranı çöker.
- YAYIN ÖNCESİ BEŞ ZORUNLU KONTROL — biri atlanırsa "saygın kalma" sözü boşa düşer: (1) gerçek orta sınıf Android'de WhatsApp VE Instagram uygulama içi tarayıcısında açılış, (2) 3G kısıtlı Lighthouse koşusu (LCP ≤2,5 sn / CLS ≤0,01 / TBT ≤150 ms), (3) prefers-reduced-motion açıkken ekran görüntüsü, (4) JS tamamen kapalıyken ekran görüntüsü, (5) 375×667 ve 1440×900'de yarım yüklem satırının kırpılma yüzdesi. Ayrıca `npx tsc --noEmit` ve `npx next build` temiz olmalı (SITE-TASARIM.md §9).
- ŞARTNAME GÜNCELLEMESİ ZORUNLU, KODDAN ÖNCE. SITE-TASARIM.md §5 bugün "Ana sayfa hero'sunda video YOK" diyor; §3 bant renginin bilgi olduğunu söylüyor; hero şu an page.tsx:271'de `af-bant--kagit`. Kazanan konsept üçünü de değiştiriyor. §3'e ve §5'e şu iki cümle eklenmeli: (a) "Hero bir BANT değil ÖNOYUN; bant anlamı (koyu=yazılım, kâğıt=stüdyo) S3'ten itibaren geçerli. Plaka üçüncü ve nadir bir yüzeydir, sayfada en çok 2 kez." (b) "Hero'da kontrollü, maskelenmiş, ≤1 MB, LCP'den sonra yüklenen, 3G'de hiç gelmeyen TEK klip serbesttir; tam ekran otomatik oynayan hero videosu yasağı sürüyor." Bu yazılmazsa sonraki ajan videoyu haklı olarak siler ya da bandı kâğıda geri çevirir.
- DÖNÜŞÜME BAĞLANMAZSA KONSEPT SADECE SÜSLÜ BİR BROŞÜR OLUR. İlk ekrandaki beş mono hizmet çipi, S3'teki mevcut EksikSecici çiplerine AYNI NESNE olarak devredilmeli; oradan Akış Kartı'na, oradan ön-dolu forma. Zincir repoda hazır: sessionStorage['af-akis'] + AkisKarti + src/app/site/iletisim/actions.ts → talepGonder. Bu taşıma yapılmazsa sahibinin "müşteri tutamayız" sorunu çözülmez — sadece daha etkileyici bir afişle aynı yerde durur.


### HARF KADRAJI — yazı, görüntünün kadrajıdır (toplam 8,7) diyen jüri

**Alınacaklar:**
- DÖRT DÜĞÜM'DEN — KURGU KAPISI, pazarlık konusu değil: 16:9 bir karenin gözünüzün önünde 9:16'ya dönüşmesi ve üstünde tek kelime 'KURGU'. Setin en ekonomik tek jesti; kurguyu ikonla değil DURUM DEĞİŞİMİYLE anlatıyor. Kazanan konseptin S2 beyaz plakasındaki 'KURGULARIZ.' satırının yanına, iki ham/kurgulanmış karenin YERİNE değil YANINA konur: sabit 220×220 kutu, içeride clip-path inset 16:9 → 9:16, 520 ms, aspect-ratio DEĞİŞMEZ (CLS 0), aynı tek <video> ögesinin object-position kaymasıyla — ikinci dosya, ikinci çözücü yok.
- DÖRT DÜĞÜM'DEN — repoda bulduğu iki gerçek hata, kazanan konseptin ÖN KOŞULU olarak yazılır. (1) src/app/site/page.tsx:281'deki hero H1'inden `data-baslik-ac` KALDIRILIR: Efektler.tsx:113 SplitText'i `mask:'words'` + `yPercent:110` ile kuruyor, yani LCP ögesini gizliyor — doğrudan LCP cezası. Harf kadrajında başlık ilk boyada DOLU durur, satır maskesi yalnız `.js-var` altında tanımlanır. (2) Efektler.tsx:168'deki akış hattı scrub'ı `trigger: document.body, end: 'bottom bottom'` ile tüm sayfa boyu `stroke-dashoffset` sürüyor; bu compositor dışıdır ve orta segment Android'de tam kaydırma anında kare düşürür — mobilde bölüm bölüm segmentlere ayrılır ya da opaklık açılışına düşürülür.
- DÖRT DÜĞÜM'DEN — ilk ekranın CSS-ÖNCE ilkesi: harf kadrajının satır maskesi ve kutup geçişi mümkün olduğunca saf CSS keyframe'e alınır, GSAP yalnız scrub ve Scramble için gelir. Ayrıca `<meta name="theme-color" content="#000000">` — koyu plaka ile Instagram/WhatsApp tarayıcı çubuğu arasında beyaz şerit kalmaz; bu tek satır atlanırsa ilk izlenim 'bozuk sayfa' olur.
- AÇIK TEZGÂH'TAN — BOŞ SES RAYI. Klipler sessiz olduğu için dalga formu çizmeyi reddetmek ve yerine 'ses yok · müzik sonradan' yazmak, setin en inandırıcı detayı. S2'deki 'KURGULARIZ.' bloğunun altına 1px kesikli boş ray + mono etiket olarak girer. Hiçbir rakamın yapamayacağı şeyi yapıyor: dürüstlükle inandırıyor.
- AÇIK TEZGÂH'TAN — GERÇEK QR. anasayfa/qr.ts + QrKod.tsx repoda hazır ve sunucuda üretiliyor, istemciye 0 KB JS gidiyor. Ziyaretçinin kendi telefonuyla ekranı okutup çalışan dört dilli menüyü açması, 'yazılım da yapıyoruz' iddiasının tek kanıtlanabilir biçimi. Yanında mutlaka görünür metin bağlantısı durur. Harf kadrajının yazılım tarafı bu olur — mockup PNG değil.
- AÇIK TEZGÂH'TAN + KADRAJ TEZGÂHI'NDAN — REKLAM YÖNETİMİ: SONUÇ DEĞİL SÜREÇ. İkisi aynı doğru cevaba varıyor; birleştirilir. 2px köşeli mono veri penceresi: kanal adları (META · INSTAGRAM / FACEBOOK, GOOGLE, TIKTOK), yanında 'kurulum → hedefleme → ölçüm → rapor' durakları, alt köşede 'ÖRNEK' damgası. Rakam YOK, yüzde YOK, CTR/ROAS grafiği YOK, platform LOGOSU YOK (yalnız mono kelime-işaret — hem marka hukuku temiz hem 'üçüncü marka panosu' kısıtı korunur).
- KADRAJ TEZGÂHI'NDAN — EŞİT OLMAYAN RİTİM. Harf kadrajının hizmet şeridi 1,8 sn'de bir sabit devrederse slayt gösterisi gibi okunur. Süreler sabit bir diziden okunur ve nefes alır (1,25 / 0,90 / 1,60 / 0,75 mantığı); 'basitleştirme' adına tek sayıya indirilmez. Aynı kural döngü dikişine: kesme HER ZAMAN dikişten en çok 0,6 sn önce düşer, böylece 'video başa döndü' hiç görülmez.
- KADRAJ TEZGÂHI'NDAN — ZANAATIN ADI, JS GELMEDEN EKRANDA. Mobilde ScrambleText devri ziyaretçinin 2 saniyede tek hizmet görmesine yol açıyor — kazanan konseptin en net satış açığı bu. Çözüm: mono yuvanın ALTINDA, kesilmemiş, ikinci bir satırda beş zanaatın tamamı küçük puntoyla ve SSR metin olarak durur (ya da masaüstündeki 'beşi yan yana' davranışı mobile de taşınır, iki satıra sararak). Devir bir yükseltmedir, bilginin tek yolu değil.
- TEZGÂH'TAN — NESNE ZİNCİRİ. Harf kadrajının mono hizmet şeridindeki beş ad, S3'teki gerçek EksikSecici çiplerinin konumuna taşınır (elle FLIP, 5 öge). Repodaki zincir hazır ve doğruladım: sessionStorage['af-akis'] → akis.ts → EksikSecici → AkisKarti → talepGonder. Böylece ilk ekranda okunan beş kelime, iki kaydırma sonra teklif kapsamının satırı oluyor. Bu olmadan harf kadrajı güzel bir afiş; bununla birlikte dönüşüm mekanizması.
- TEZGÂH'TAN — KURGU KARARINI VERİ OLARAK GÖSTERMEK. kunye.json her klibin kaynak içindeki gerçek kesim aralığını tutuyor ('montajın 43,5-49,5. saniyesi', 'kaynağın 5,5-12,5. saniyesi' — doğruladım). S2'de 'KURGULARIZ.' satırının yanında 2px mono in/out göstergesi: kaynağın tam süresi soluk, bizim seçtiğimiz aralık turuncu ayraç içinde. Tek rakam uydurulmuyor, hepsi künyede yazılı. Sinema jargonu kullanılmadan (timecode/fps/showreel YASAK) sade Türkçe ifade edilir.
- IŞIK TEZGÂHI'NDAN — DURAN KARENİN ZENGİNLİĞİ ve ÖLÇÜM KAPISI. Zenginlik harekete değil malzemeye yüklenir: 390 baytlık statik feTurbulence grain (koyu .045 / mobil .030, prefers-contrast'ta 0, ASLA animasyonlu değil) ve tek 1px cam kenarı, harf kadrajının saf siyah plakasını dijital siyahtan film siyahına çevirir — tek değişkenden kısılır. Yanında üç adımlı geri çekilme reçetesi: LCP 2,4 sn'yi geçerse (1) dolgu görseli küçült, (2) görseli tamamen çıkar ve harfler marka gradyanıyla dolsun, (3) grain tile'ını küçült. Konsept üç adımın hiçbirinde çökmez.
- IŞIK TEZGÂHI'NDAN + TÜM KONSEPTLERDEN — `svh` ZORUNLULUĞU. site.css bugün satır 143 ve 1765'te `100vh` kullanıyor; doğruladım. Altı konseptin altısı da bunu işaret ediyor ve haklı: ziyaretçilerin çoğu WhatsApp/Instagram uygulama içi tarayıcısında ve orada ilk kaydırmada araç çubuğu kaybolunca 60-90px zıplar — aynı anda hem LCP hem CLS bozulur ve 'yarım yüklem' mekanizmasının tamamı rastgele yere düşer. `100svh` + `100vh` yedeği, pazarlık konusu değil.

**Kaçınılacaklar:**
- HARF HARF DANS EDEN AÇILIŞ. Kazanan konseptin kendi birinci riski ve haklı: açılış SATIR maskesinden gelir, harf kademesi 0,012 sn'yi geçmez. Harfler tek tek zıplar, döner ya da elastik yaylanırsa 2019 şablonu olur ve devasa tipografinin verdiği ciddiyet tek karede gider.
- VİDEONUN BİR YERDE DİKDÖRTGEN GÖRÜNMESİ. Açıklığın tek pikseli harfin dışına taşarsa büyü biter — `isolation: isolate` + `contain: paint` ihmal edilemez, ekran dışında `mix-blend-mode: normal` yazılır. Aynı sebeple DİKEY 404×720 klip ASLA geniş bir harf açıklığına sokulmaz: 2,5× yukarı ölçekleme, bulanık ve amatör. Kadrajda yalnız 5 yatay 640×360 klip (doğruladım: arşivde tam 5 tane var).
- DÖRDÜNCÜ İŞARET. Siyah plakanın üstünde en çok ÜÇ şey olur: akış hattı, yazı duvarı, mono yuva. Dördüncüyü koyan an 'şablon dark mode' olur. Boş siyah ekran korkusuyla eklenen her öge konsepti ucuzlaştırır.
- AURORA / GRADYAN MESH ARKA PLAN. IŞIK TEZGÂHI'nın kendi itirafı doğru: serbest renkli akışkan gradyan 'yapay zekâ arka planı' klişesinin kendisidir. Harf kadrajında gradyan YALNIZ harfin içindeki kontrast tabanıdır ve durakları flow-sembol.svg'nin kendi renklerinden gelir (#861500 / #F14B00 / #FFAE00 ailesi). Mor, mavi, teal, pembe ASLA. Turuncu geniş dolgu olarak da kullanılmaz — yalnız çizgi, çip, aktif durum.
- SCRAMBLETEXT ENFLASYONU. Üç konsept bağımsız olarak aynı tavanı koyuyor: sayfa başına en çok 8-12 öge, yalnız mono veri etiketlerinde, yalnız bir kez. Başlıkta ve gövde metninde ASLA. Fazlası 'matrix efekti' yapan bedava tema görünümü verir ve metin düğümünü mutasyona soktuğu için ekran okuyucuyu bozar (karşılığı `.af.js-var` altında gerçek <ul> olarak durmalı).
- DİKEY KAYDIRMAYLA KAVGA EDEN SÜRÜKLEME. TEZGÂH'ın fiziği masaüstünde keyifli ama imza etkileşimi dokunmatikte kaydırma jestiyle aynı; bir kez dikey kaydırmayı yerse çıkış oranı ikiye katlanır ve scroll-jacking yasağının ihlali sayılır. Mobilde hiçbir sürükleme ilk ekranın mekanizması olamaz. Aynı aileden: pin, snap, scrollIntoView, wheel/touchmove yakalama — hepsi yasak.
- DİYAGRAM-HERO. DÖRT DÜĞÜM mühendislik olarak en temiz ama sahibinin şikâyeti 'temiz ve kurumsal ama etkileyici değil' ve düğüm diyagramı DAHA temiz, DAHA kurumsaldır. Bir prodüksiyon firmasının ilk ekranında görüntü yerine teknik çizim göstermek satış hatasıdır; o düşünceyi mini-harita olarak sayfanın İÇİNDE kullanın, giriş ekranı olarak değil.
- FFMPEG BAĞIMLI HERO. KADRAJ TEZGÂHI ve TEZGÂH'ın mikro klibi var olmayan bir dosyaya bağlı ve ffmpeg bu makinede kurulu DEĞİL (RAPOR.md §245 teyit ediyor). Kazanan konsept hiç yeni video üretmiyor; bu sözleşme bozulmaz. Üretilemeyen bir dosyaya bağlanan her konsept, uygulama anında birilerinin 3 MB'lık mevcut klibe uzanmasıyla çöker.
- three.js / ogl / matter.js / lottie. Altı konseptten altısı reddediyor ve hepsi haklı: WebGL bağlamı 120-600 KB, uygulama içi WebView'da kaybedilebilir, düşük uçlu Android'de GPU ve pil yakar, `prefers-reduced-motion` ve `saveData`'da tamamen çöpe gider, ve en önemlisi metni gerçek DOM metni olmaktan çıkarır (SSR, SEO, ekran okuyucu, seçim). IŞIK TEZGÂHI'nın opsiyonel faz-2 `ogl` önerisi de dâhil — kendi faz 1'i o etkinin %85'ini 0 KB ile veriyor.
- SİMETRİK PENCERE IZGARASI ve RASTGELE SAÇILMA. İki uç, aynı hata: eşit boyda hizalı medya kutuları anında şablon galeriye döner; `Math.random()` ile dağıtılmış kartlar anında CodePen görünür. Harf kadrajında ikisi de yok — konum yoksa risk de yok; bu bir avantaj, 'eksiklik' sanılıp kolajla doldurulmamalı.
- ÜÇÜNCÜ MARKA KARTIYLA BİTEN KLİPLER ilk ekranda. teras-kilyos-mangal-atesi, mas-gokart-pist-marka-kapanis, coin-coffee-flat-white, kule-istanbul-frozen-bogaz, mas-karting-academy-damali-bayrak — hepsi müşteri logo/başlık kartıyla kapanıyor. Ajansın kendi başlığının içinde dönen bir müşteri logosu marka sahipliğini karıştırır ve 'sponsor panosu olan kare yok' kısıtını deler. Yerleri vaka sayfaları; orada marka kartıyla bitmeleri avantaj.
- INSTAGRAM PİKSEL KOPYASI, SAHTE PANEL, SAHTE DALGA FORMU, SAHTE GRAFİK. Instagram glifi/gradyanı kopyalanırsa hem 'klonlamış' görünür hem marka hukuku sorunu doğar. Aynı aileden: uydurma reklam paneli ekran görüntüsü, '%X artış' kutusu, sessiz klibe çizilen ses dalgası. Hepsi tek satırda ölçülebilir bir yalan ve sitenin tüm dürüstlük sermayesini harcar.

**Uygulama notları:**
- SIRA TERSİNE ÇEVRİLMEZ: önce JS'SİZ ve reduced-motion yolu kurulur, sonra animasyon. AÇIK TEZGÂH bunu doğru söylüyor. Harf duvarı ilk olarak şöyle doğar: dört satır tam görünür, 'YÜZÜNÜZ' ve 'YAZILIM' içinde 18 KB AVIF durağan kare, yüklem satırı kırpılmadan tam, akış hattı tam boy çizili. Ancak bu çalıştıktan SONRA satır maskesi, kutup geçişi ve video eklenir — ve hepsi YALNIZ `.js-var` altında tanımlanır (layout.tsx'teki 4 saniye kapısı tam bunun için var). Ters sırada yapılırsa konsept 3G'de, saveData'da ve hareket hassasiyetinde boş ekrana düşer — ve tam o üç durum bu sitenin ana trafiği.
- GSAP LCP YOLUNDAN ÇIKARILIR — bu, bütün performans iddiasının tek ön koşulu. Doğruladım: src/app/site/layout.tsx:9 Efektler'i STATİK import ediyor, yani gsap-core (28,4 KB gz) + ScrollTrigger (18,0) + SplitText (3,7) + Lenis bugün ilk boyama yolunda duruyor. `next/dynamic(..., { ssr:false })` + `requestIdleCallback` ile ilk boyamadan SONRA yüklenmeli. İlk ekran 0 KB GSAP taşır. Bu yapılmazsa 3G'de 2,5 sn tutmak matematiksel olarak imkânsız ve diğer bütün kararlar anlamsızlaşır.
- İLK EKRAN CSS'İ SATIR İÇİ. site.css 65 KB / 14,9 KB gz ve render-blocking (ölçtüm). Plaka + duvar + satır yüksekliği + mono yuva kuralları (~1,6-2 KB) layout.tsx'teki mevcut satır içi kapı betiğinin yanına <style> olarak basılır; gerisi normal yoldan gelir. Yarım uygulanmış stil bile doğru boyar.
- SATIR YÜKSEKLİĞİ MUTLAK KİLİTLENİR — CLS 0'ın tek anahtarı: `.af-hk-satir { height: clamp(46px,13.5vw,132px); overflow: clip; display:block; }`. Yükseklik yazı tipinden BAĞIMSIZ olmalı; Bricolage swap ile geç gelse bile glif sabit kutunun içinde değişir. Bu yapılmazsa devasa duvar swap anında kayar ve CLS tek başına 0,15'i geçer. Mono yuva da `width: 34ch` ile kilitlenir, Scramble genişliği değiştiremez. Ölçek scrub'ı `font-size` değil `transform: scale()` sürer — hiç reflow yok. `wdth` ekseni EKLENMEZ (+18-26 KB, tam LCP yolunda); sıkışık görünüm `letter-spacing: -0.045em` ve `line-height: 0.84` ile bedelsiz alınır.
- KONTRAST TABANI TEK KATMANDAN GELİYOR ve çıkarılamaz. `.af-hk-taban` gradyanı olmadan karanlık bir kare harfin içine geldiğinde kelime kaybolur — hem erişilebilirlik ihlali hem 'site bozuk' algısı. Hesapladım ve doğru: koyu kutupta #E2541F/#000 = 5,52:1, açık kutupta #C5410F/#FFF = 5,08:1, ikisi de devasa metin için gereken 3:1'in iki katı. Bu taban mimari, dekor değil. Ek kural: blend edilen metin ≥700 ağırlık ve ≥40px olmalı (blend alt-piksel kenar yumuşatmasını kaybeder); gövde metni ASLA blend edilmez.
- HERO VİDEOSUNUN AĞ KAPISI YÜKSELTİLİR. Mevcut Efektler.tsx:48 yalnız saveData ve 2g/slow-2g'yi engelliyor, ve src'yi %50 görünürlükte atıyor (satır 277-345, okudum) — hero ilk karede görünür olduğu için bu, 972 KB'yi doğrudan LCP penceresine sokar. Üç koşul BİRLİKTE istenir: görünürlük ≥%50 VE `requestIdleCallback` (ya da LCP+1,2 sn) VE `effectiveType` 3g değil VE `connection.downlink >= 1.5`. Ayrıca iki ek madde: `document.visibilityState === 'hidden'` → hepsini duraklat; ilk kaydırmada plaka kapanırken `pause()` + `src` serbest (çözücü bedava bırakılır).
- DURAĞAN DOLGU GÖRSELİ HER ZAMAN VİDEONUN ALTINDA KALIR. `.af-hk-plan` içindeki <img> (18 KB AVIF / 26 KB WebP, 1024×576) kalıcıdır; video onun ÜSTÜNE 600 ms'de çapraz geçer. Mevcut 1280×721 / 137 KB posteri kadrajda KULLANMAYIN (ölçtüm — açıklıktan karenin yaklaşık %18'i görünüyor, 137 KB israf), `<link rel="preload" as="image" fetchpriority="high">` ile yalnız yeni dolgu ön yüklenir. Bu olmazsa `play()` reddinde, saveData'da veya 3G'de harfler boş kalır ve giriş ekranı çöker.
- KİŞİ KORUMASI PAZARLIK KONUSU DEĞİL. RAPOR.md §8.2'yi doğruladım (satır 282): `hero-mas-gokart-gece-grid.mp4` arka planında bariyer önünde iki kişi var, yüz seçilmiyor. Harf açıklığı karenin ÜST %25'ini ASLA göstermez: `object-position: 50% 62%` (mobil) / `50% 58%` (masaüstü). Yayın öncesi 375 / 768 / 1440 genişliklerinde gözle kontrol edilir. Ayrıca §8.1 (satır 276): kliplerin ses kanalı dosyanın içinde duruyor — `muted` yeterli ama ffmpeg kurulunca ses tamamen çıkarılsın.
- MOBİL DÜŞÜŞLERİ TEK TEK YAZILIR, 'sonra bakarız' denmez: dolu kelime 2→1 (yalnız YAZILIM — dar kolonda iki dolu satır kalabalık ve blend edilen glif kenarı yarıya iner), scrub mesafesi 70vh→40vh, `max-height:680px` altında yapışkan plaka KAPALI (küçük ekranda yapışkan katman kaydırma hissini bozar), işaretçi itişi tamamen yok, grain .045→.030, object-position daha aşağıda. Blend alanı duvarın sınır kutusuna `contain: paint` ile kırpılı, aynı anda tek blend katmanı yaşar.
- CAFCAF İKİ EKRANDA YOĞUNLAŞIR, OKUMA BÖLGESİNE SIZMAZ. S3 kâğıt bandında plaka rejimi KAPANIR: IntersectionObserver `mix-blend-mode: normal` yazar, video duraklar, `src` serbest bırakılır, sayfa mevcut iki bant ritmine döner. Ucuz durmamanın tek garantisi bu — ve SITE-TASARIM.md §3'e şu cümle EKLENMELİ: 'Plaka bir bant değil ÖNOYUNDUR; bant anlamı (koyu=yazılım, kâğıt=stüdyo) 3. bölümden itibaren geçerlidir.' Yazılmazsa sonraki ajanlar plakayı 'yazılım bandı' sanıp içine mono veri şeridi koyar ya da §5'in 'hero'da video YOK' maddesine dayanıp videoyu haklı olarak siler. §5 de şu sınırlarla güncellenir: kontrollü, maskelenmiş, ≤1 MB, LCP'den sonra, 3G'de hiç gelmeyen tek klip.
- ERİŞİLEBİLİRLİK SÖZLEŞMESİ KODA YAZILIR: <h1> tek, gerçek, tam bir cümledir ve görsel olarak dört satıra bölünse de anlamı bölünmez. SplitText'in `aria:'auto'` varsayılanını kaynaktan doğruladım (node_modules/gsap/SplitText.js:213 element'e `aria-label` basıyor, :49 parçalara `aria-hidden` koyuyor) — H1'e ELLE `aria-label` EKLENMEZ, çift okuma olur; temizlikte `revert()` çağrılır (mevcut kod yapıyor). Beş hizmet gerçek <a>, DOM sırasında ve görsel sırada; `:focus-within` gelince Scramble devri DURUR ve beşi birden açılır. Scramble yuvası `aria-hidden`, `aria-live` KULLANILMAZ (1,8 sn'de bir konuşan şerit işkencedir). Video `aria-hidden` + `tabIndex={-1}`, oynat çipi 44×44px gerçek <button> ve duvarın İÇİNDE değil altında.
- YAYIN ÖNCESİ BEŞ ZORUNLU KONTROL — biri atlanırsa 'saygın kalma' sözü boşa düşer: (1) gerçek orta sınıf Android'de WhatsApp VE Instagram uygulama içi tarayıcısında açılış, (2) 3G kısıtlı Lighthouse koşusu (LCP / CLS / TBT), (3) `prefers-reduced-motion` açıkken ekran görüntüsü — duvar dolu ve durağan, yüklem satırı kırpılmadan TAM görünür (az hareket isteyen kullanıcıya 'yarım cümle' oyunu oynanmaz), (4) JS tamamen kapalıyken ekran görüntüsü, (5) 375×667 ve 1440×900'de yarım yüklem satırının kırpılma yüzdesi ve kişi korumasının object-position kontrolü.
- DÖRT KONSEPTİN DOĞRULADIĞIM FAKTÜEL HATALARI, uygulama sırasında tekrarlanmasın diye kayda geçsin: (a) klip envanteri 5 yatay 640×360 / 10 dikey 404×720 — DÖRT DÜĞÜM 'dört yatay, on bir dikey' ve TEZGÂH aynısını diyor, yanlış; harf kadrajının '5 yatay' sözleşmesi doğru. (b) `kurgu-edit` hizmet anahtarı site-icerik.ts:642'de ZATEN VAR — IŞIK TEZGÂHI'nın 'içerik boşluğu, iş durur' uyarısı geçersiz, çipler doğrudan /hizmetler/kurgu-edit'e bağlanır. (c) `public/site/medya/logo/teras-kilyos-logo.png` diskte VAR — 'bulunamadı' uyarısı geçersiz. (d) `@property` kaydı GSAP'in özel özellik animasyonu için şart değil (GSAP kare kare setProperty yazar); yalnız saf CSS geçişi/animasyonu için gerekir.


### IŞIK TEZGÂHI — karanlık odada açılan tek yarık (8,50/10) diyen jüri

**Alınacaklar:**
- DÖRT DÜĞÜM'den en önemli kural: GİRİŞ ANİMASYONU CSS OLMALI, GSAP ilk kaydırmaya kadar HİÇ yüklenmemeli. IŞIK TEZGÂHI zaten 'ilk ekran için 0 JS' diyor ama hero timeline'ını `requestIdleCallback`'e bağlıyor; DÖRT DÜĞÜM bundan bir adım ileri gidip açılışın tamamını CSS keyframe'e alıyor. Kazananın yarık açılışı (scaleY + ters scaleY) ve ışık süpürmesi CSS'e taşınabilir — GSAP yalnız scrub için gerekir. 3G/Instagram WebView şartını tek başına çözen karar bu.
- DÖRT DÜĞÜM'ün bulduğu gerçek jank kaynağı: `src/components/site/Efektler.tsx:173` akış hattını `trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6` ile TÜM SAYFA BOYU scrub ediyor ve `stroke-dashoffset` compositor'da hızlanmaz. Doğruladım, kodda aynen böyle. Mobilde hat bölüm bölüm segmentlenmeli (her bölüm kendi kısa ScrollTrigger'ı) ya da scrub yerine bölüm bölüm opaklık açılışına düşülmeli. Hangi konsept seçilirse seçilsin bu düzeltilmeli.
- DÖRT DÜĞÜM'ün KURGU KAPISI: sabit 220×220 kutu içinde `clip-path: inset()` ile 16:9'dan 9:16'ya geçiş, `aspect-ratio` hiç değişmediği için reflow ve CLS yok. Setin en keskin hizmet anlatımı — 'kurgu yapıyoruz' yazmak yerine yatay çekimin dikey Reels'e dönüşünü gözün önünde yapıyor. IŞIK TEZGÂHI'nın yarığına doğrudan takılır: yarık 56vw şeritken içindeki pencere aynı tekniği uygular.
- KADRAJ TEZGÂHI'nın poster düzeltmesi — setin en büyük tek performans kazancı ve hemen yapılabilir. Ölçtüm: `public/site/medya/poster/` içindeki ilk beş dosya 149 + 149 + 144 + 142 + 140 KB. Üst kıvrımda beş poster kullanan bir hero bugün ~700 KB taşıyor. `sharp` KURULU (`node_modules/sharp` doğrulandı), 15 satırlık bir script render boyutunun 2 katında AVIF + JPEG çıkarır → poster başına 18–30 KB, toplam ≤120 KB. Tasarımda hiçbir şey değişmez, 3G'de LCP ~1,4 sn kısalır.
- AÇIK TEZGÂH'ın `data-video-bekle="yukleme"` kapı adı ve deseni. `Efektler.tsx`'teki mevcut denetleyici `src`'yi yalnız IntersectionObserver %50 eşiğiyle atıyor ve `hafif` bayrağı sadece saveData/2g/slow-2g'yi kapsıyor — hero ilk karede ratio 1.0 olduğu için 971 KB doğrudan LCP penceresine giriyor. Kapı: `window.load` → `requestIdleCallback` → `effectiveType !== '3g'` + `connection.downlink >= 1.5` → `src`. Bu olmadan hangi konsept seçilirse seçilsin 2,5 sn hedefi kaçar.
- AÇIK TEZGÂH'ın BOŞ SES RAYI dürüstlüğü. Klipler sessiz olduğu için dalga formu çizmeyi reddetmek ve yerine 1px kesikli boş ray + 'ses yok · müzik sonradan' etiketi koymak, altı konseptin ürettiği en inandırıcı tek ayrıntı. Kurgu/edit hizmetini anlatan her yere taşınabilir ve 0 bayt.
- TEZGÂH'ın bütçe disiplini: SplitText'i kritik yoldan çıkarıp başlığı sunucuda `<span>` + CSS keyframe ile açmak. Ölçülü kazanç 3,66 KB gz ve kritik yol BUGÜNDEN hafif olur. Ayrıca ağır/opsiyonel kodu (fizik, parçacık, ikinci timeline) `requestIdleCallback` VEYA ilk `pointerdown` — hangisi önce olursa — arkasına almak deseni.
- HARF KADRAJI'nın iki parçası: (a) YARIM CÜMLE kancası — H1 gramer olarak yarım, yüklem katlamanın altında harflerin üst %45'i görünecek şekilde kırpılı. 0 bayt, JS'siz, setteki en verimli kaydırma mekanizması; kazananın 'alt kenardan sızan ışık' kancasının yanına eklenir, ikisi çakışmaz. (b) Dolu/maskeli metnin arkasına GRADYAN TABAN/TAVAN koyarak kontrast tabanını mimari hale getirmek. Hesaplarını elle doğruladım: #E2541F/#000 = 5,52:1, #C5410F/#FFF = 5,08:1 — iddia edilen değerler doğru. Video veya görsel üstünde duran her büyük metin bu kuralı almalı.
- Üç konseptin ortak çözünürlük sözleşmesi, token'a yazılmalı: elimizde 5 adet 640×360 yatay ve 10 adet 404×720 dikey klip var (kunye.json'dan doğruladım). Kural: bir medya açıklığının kısa kenarı kaynağın kısa kenarının 1,4 katını geçmez; dikey klip dikey kutuda, yatay klip yatay kutuda kalır. 404×720'yi geniş bir açıklığa sokmak 2,5× yukarı ölçekleme ve amatör görünüm demek.
- Reklam süreç yönetiminin platform LOGOSUZ çözümü — üç konsept bağımsız olarak aynı yere vardı ve doğru olan bu: META · INSTAGRAM · FACEBOOK / GOOGLE / TIKTOK mono kelime-işaret olarak yazılır, logo kullanılmaz. Hem 'üçüncü marka panosu olan kare yok' kısıtını hem marka kullanım izinlerini aşıyor. Yanında SONUÇ değil SÜREÇ: kurulum → hedefleme/kampanya → ölçüm → rapor. Hiç rakam, hiç '%X artış' yok.

**Kaçınılacaklar:**
- ffmpeg'e BAĞLI hiçbir hero mekanizmasına girilmemeli. `which ffmpeg` boş dönüyor ve `public/site/medya/RAPOR.md` §245 'ffmpeg, yt-dlp, HandBrake, ImageMagick yok; avconvert ne ses atabiliyor ne bit hızı ayarlayabiliyor' diyor. KADRAJ TEZGÂHI'nın `hero-iki-kadraj.mp4`'ü ve TEZGÂH'ın 150 KB'lık mikro klibi bugün ÜRETİLEMEZ. ffmpeg kurulana kadar hero yalnız mevcut `hero-mas-gokart-gece-grid.mp4` (971 KB, 640×360, arşivin tek 1 MB altı dosyası — diğerlerinin en küçüğü 1,28 MB) üzerine kurulmalı.
- Aynı anda İKİ VİDEO ÇÖZÜCÜ açmak (KADRAJ TEZGÂHI'nın 'hızlı ağda ikinci `<video>`' fikri). Orta sınıf Android'de iki eşzamanlı H.264 çözme, tam kullanıcı kaydırmaya başladığı anda kare düşürür. Kapı sıkı olsa bile `navigator.deviceMemory` Chrome-only ve yedeği yok. `Efektler.tsx`'teki mevcut 'aynı anda tek video' denetleyicisi doğru kuralı zaten uyguluyor — bozulmamalı. Bir medya kümesinde birden fazla kutuya `src` verilecekse yalnız birine `data-video-sira` ile sıra verilmeli; sıra verilmezse DOM sırasına düşüyor ve rastgele bir kutu oynuyor.
- SÜRÜKLEMEYİ hero'nun ana mekanizması yapmak (TEZGÂH). Dokunmatikte dikey kaydırmayı korumak için sürükleme 180 ms basılı tutma kapısının arkasına alınmak zorunda; bu da trafiğin çoğunluğu için (telefon + WhatsApp/Instagram WebView) 'dokundum, bir şey olmadı' demek. Sürükleme bir YÜKSELTME olabilir, ilk ekranın tezi olamaz.
- `clip-path` ve `filter: blur()` DEĞERLERİNİ tween etmek. `clip-path` interpolasyonu compositor dışıdır ve her karede alanı yeniden boyar; `blur` bir kez rasterlenirse bedava, her karede değişirse mobilde 15 fps. Doğru yol: statik `clip-path` + kapsayıcıda `scaleY`/`transform`, ve blur'da yalnız `opacity`/`transform` tween'i. Kazanan konseptin bu iki yasağı açıkça yazması en güçlü yanı; 'daha kolay' diye biri clip-path'i tween ederse orta segment Android'de kare atlar ve nedeni bulunmaz.
- Hero'da `<video poster>` ATTRIBUTE'u. Poster attribute'u yüksek öncelikli bir istek açar ve LCP ile yarışır. Yerine açık bir `<img fetchpriority="low" decoding="async">` basılmalı. Aynı mantıkla hero'daki HİÇBİR görsele `fetchpriority="high"` verilmemeli — yazı tipinden bant genişliği çalar ve LCP ögesi metin olmalı.
- Kayıtlı bir `@property` değişkenini animasyonlayıp onu ÇOK ögeye okutmak (AÇIK TEZGÂH'ın 15 ögeyi tek `--af-tarama`'dan süren TARAMA'sı). 15 JS tween'inden ucuz ama compositor işi değil: kare başına 15 ögede stil yeniden hesaplama + paint, hem de ilk izlenim penceresinde. Bu desen kullanılacaksa okuyan öge sayısı 5-6'yı geçmemeli.
- Tam ekran panelde `backdrop-filter`, `background-attachment: fixed`, ve ANİMASYONLU grain. `site.css:1396`'daki mevcut uyarı `backdrop-filter`'ın üst barda yarattığı kapsayıcı blok sorununu zaten yazıyor; büyük yüzeylerde ayrıca her karede viewport readback demek. `background-attachment: fixed` mobil kaydırma katili. Animasyonlu `feTurbulence` kare başına yeniden rasterleme — grain her zaman statik, koyu bantta ≤0,045, mobilde ≤0,030 (AMOLED bantlaşması).
- `100vh`. Ölçtüm: `src/app/site/site.css` içinde `100vh` 2 kez geçiyor (satır 143 ve 1765), `svh` HİÇ geçmiyor. Ziyaretçilerin çoğu WhatsApp/Instagram içi tarayıcıda ve orada ilk kaydırmada araç çubuğu kaybolunca 60–90 px zıplıyor — aynı anda hem LCP hem CLS bozuluyor. Altı konseptin tamamı `svh` istiyor ve hiçbiri bugün karşılanmıyor; bu tek satırlık düzeltme ölçülebilir en büyük tek kazanç.
- `mix-blend-mode`'u BÜYÜK bir alanda canlı `<video>`'nun üstünde, GERÇEK CİHAZDA ÖLÇMEDEN kullanmak (HARF KADRAJI). Blend katmanı videoyu donanım overlay yolundan çıkarıp genel kompozisyona sokuyor. Bu teknik kullanılacaksa alan duvarın sınır kutusuna `contain: paint` ile kırpılı, aynı anda tek katman, ekran dışında `mix-blend-mode: normal` — ve yayından önce orta sınıf Android'de Instagram WebView'ında ölçülmüş olmalı.
- ScrambleText enflasyonu. Sayfa başına 8 ögeyi geçerse teknoloji hissi değil numara hissi veriyor ve 'matrix efekti yapan şablon'a benziyor. Yalnız mono veri etiketlerinde, `aria-hidden` bir span içinde, dış ögede sabit `aria-label` ile, bir kez. Başlık ve gövde metninde ASLA — metin düğümünü mutasyona soktuğu için ekran okuyucuyu bozar.
- Yeni çalışma zamanı paketi. `SITE-BRIEF.md:98` 'Yeni npm paketi yok (saf CSS + küçük vanilla JS)' diyor. three.js, ogl ve matter.js şartname ihlali — kazanan konseptin 'Faz 2 opsiyonel ogl' önerisi dâhil. Teknik gerekçe de aynı yöne bakıyor: WebGL bağlamı uygulama içi tarayıcıda kaybedilebilir, düşük uçlu Android'de GPU'yu ısıtır, `prefers-reduced-motion` ve `saveData` yollarında zaten tamamen kapatılacağı için trafiğin önemli kısmı o bayttan fayda görmez.

**Uygulama notları:**
- SIRALAMA (ağırlık: mobilPerformans %30, uygulanabilirlik %25, etki %20, satisEtkisi %15, ozgunluk %10): IŞIK TEZGÂHI 8,50 · HARF KADRAJI 8,25 · DÖRT DÜĞÜM 8,15 · AÇIK TEZGÂH 6,95 · TEZGÂH 6,65 · KADRAJ TEZGÂHI 6,15. İlk üç arasındaki fark küçük ve birbirlerini tamamlıyorlar; son üçün ikisi araç zinciri yüzünden bugün uygulanamaz.
- Gerçek uygulama planı tek konsept değil: IŞIK TEZGÂHI'nın ışık/malzeme mimarisi + DÖRT DÜĞÜM'ün 'açılış CSS, GSAP ilk kaydırmadan sonra' kuralı + HARF KADRAJI'nın yarım cümle kancası ve hesaplanmış kontrast tabanı. Üçü de aynı temele oturuyor (LCP metin, ilk boya 0 JS, koyu zemin, tek maskelenmiş küçük video) ve çakışmıyorlar. KURGU kapısını (16:9 → 9:16 clip-path flip) kazananın yarığının içine koyun — tek hamlede hem imza hem hizmet kanıtı.
- İLK İŞ, konsept seçiminden ÖNCE — üç satırlık düzeltme, tek başına en büyük kazanç: (1) `src/app/site/site.css:143` ve `:1765`'teki `100vh` → `svh` (+`vh` yedeği). (2) `src/components/site/Efektler.tsx`'teki video denetleyicisine hero kapısı: `src` ataması IntersectionObserver %50'ye ek olarak `window.load` + `requestIdleCallback` + `effectiveType !== '3g'` + `connection.downlink >= 1.5` istesin; mevcut `hafif` bayrağı yalnız saveData/2g/slow-2g'yi kapsıyor, 971 KB'lık hero klibi 3G'de LCP'yi yiyor. (3) `sharp` ile üst kıvrım posterlerini render boyutunun 2 katında AVIF+JPEG'e çıkarın; şu an ilk beş poster 149/149/144/142/140 KB.
- `src/components/site/Efektler.tsx` `src/app/site/layout.tsx:9`'da STATİK import. Yani gsap + ScrollTrigger + SplitText + Lenis her /site sayfasının ilk paketinde. Ölçtüm (gzip): gsap.min 27,7 KB + ScrollTrigger 17,6 KB + SplitText 3,6 KB + Lenis 5,3 KB = 54,2 KB gz. Konseptlerin verdiği 115 KB ve 95 KB rakamları şişirilmiş; TEZGÂH'ın 55,5 KB'ı doğru. Bu paket `next/dynamic(..., { ssr: false })` + idle arkasına alınmalı ve SplitText kritik yoldan çıkarılmalı (başlık SSR span + CSS keyframe) — net sonuç bugünden ~3,7 KB hafif.
- `data-baslik-ac` gerçekten hero H1'inde (`src/app/site/page.tsx:277`) ve `Efektler.tsx:112-122`'de `SplitText(type:'words', mask:'words')` + `gsap.from(yPercent:110)` ile çalışıyor. Ama DÖRT DÜĞÜM'ün 'doğrudan LCP cezası' gerekçesi yanlış: H1 GSAP gelmeden boyanıyor, LCP o anda kaydediliyor. Gerçek zarar iki tane: boyamadan SONRA görünür bir yeniden animasyon (algılanan kalite düşüşü) ve `mask:'words'` sarmalayıcılarının H1'i reflow edip satır kırılmasını değiştirme riski (CLS). Yine de kaldırılmalı — ama doğru gerekçeyle.
- GSAP eklenti bütçesi, bu repodan ölçülmüş gzip: ScrollTrigger 17,6 · Draggable 13,2 · MotionPath 9,5 · Flip 9,5 · MorphSVG 9,3 · Observer 4,2 · ScrambleText 3,9 · SplitText 3,6 · Inertia 3,2 · DrawSVG 2,2 · Physics2D 1,2. Hepsi 3.15'te ücretsiz ve yerel. Flip (9,5 KB) yalnız gerçekten bir ögeyi iki konum arasında taşıyorsanız; çip morph'u için elle FLIP (`getBoundingClientRect` + transform) ~0,6 KB. MotionPath (9,5 KB) `offset-path` varken gereksiz. MorphSVG'yi akış hattına SOKMAYIN — her scrub karesinde yolu yeniden hesaplar.
- Künye doğrulaması: 5 yatay 640×360 klip (hero-mas-gokart-gece-grid 971 KB · mas-gokart-gece-pist-surusu 1,75 MB · mas-gokart-pist-marka-kapanis 1,49 MB · mas-karting-academy-damali-bayrak 1,83 MB · mas-karting-academy-gece-onboard 1,69 MB) ve 10 dikey 404×720 klip (1,29–2,96 MB). Hero'da kullanılabilir tek dosya 971 KB'lık olan; 'ikincisini de yükleriz' diyen her plan 1,3 MB'dan başlıyor. Marka kartıyla kapanan klipler (teras-kilyos-mangal-atesi, mas-gokart-pist-marka-kapanis, coin-coffee-flat-white, kule-istanbul-frozen-bogaz, mas-karting-academy-damali-bayrak) ilk ekranda kullanılmamalı.
- Kişi koruması pazarlık dışı: `RAPOR.md` §8.2 `hero-mas-gokart-gece-grid.mp4` arka planında bariyer önünde iki kişi olduğunu (yüz seçilmiyor) ve `mas-gokart-pist-marka-kapanis.mp4` içinde kaskta 'SELİM ARAS' yazdığını söylüyor. Hero açıklığı karenin üst %25'ini asla göstermemeli (`object-position: 50% 58-62%`) ve bu 375 / 768 / 1440 genişliklerinde gözle kontrol edilmeli. §8.1: tüm klipler AAC ses taşıyor, `muted` ZORUNLU; ffmpeg gelince ses kanalı tamamen çıkarılsın.
- ŞARTNAME ÇELİŞKİSİ kayda geçmeli — altı konseptten yalnız üçü (KADRAJ TEZGÂHI, IŞIK TEZGÂHI, DÖRT DÜĞÜM) bunu gördü. `SITE-TASARIM.md:143` bugün net biçimde 'Ana sayfa hero'sunda video YOK' diyor, satır 19-20 'tam ekran otomatik oynayan hero videosu' yasağı koyuyor ve `page.tsx:272` hero bandı `af-bant--kagit`. Kontrollü, maskelenmiş, LCP'den sonra yüklenen küçük bir klip bu maddenin istisnası olarak YAZILMAZSA bir sonraki ajan videoyu haklı olarak siler veya bandı kâğıda geri çevirir. Bant anlamı için de bir cümle gerekiyor: 'Hero bir bant değil ÖNOYUN; koyu=yazılım / kâğıt=stüdyo anlamı 2. bölümden başlar.'
- Logo şeridi KOYU kalmak zorunda — IŞIK TEZGÂHI'nın yakaladığı gerçek kısıt: `MarkaSeridi.tsx`'in kendi yorumu logoların çoğunun yalnız beyaz sürümü olduğunu yazıyor. Hero koyuya çekiliyorsa şerit hero'nun ZEMİNİ olur, ayrı bant eklenmez. Ayrıca künyede `logo/teras-kilyos-logo.png` 'diskte bulunamadı' uyarısıyla duruyor; ilk ekranda görünür hale gelecekse önce doğrulanmalı.
- İçerik blokajları uydurulmamalı, içerik ajanından istenmeli: (a) `site-icerik.ts`'de KURGU/EDİT'in kendi hizmet anahtarı YOK, en yakını `video`. Sahibi 'KURGU ve EDİT'i ayrıca vurguladığı için `kurgu-edit` anahtarıyla ayrı bir hizmet doğru karar; `/hizmetler/video#kurgu` çapası geçici çözüm. (b) Mobil hero için ≤110 karakterlik `altMetinKisa` gerekiyor, yoksa mevcut 4 satırlık alt metin mobil ilk ekranı taşırıyor. Doğrulanmış tek rakamlar '244+ gönderi', '12+ marka' ve '13 hizmet alanı'; başka rakam yazılmaz.
- Zaten çözülmüş olanı yeniden çözmeyin: `src/app/site/layout.tsx:84-85` `viewportFit: 'cover'` ve `themeColor: '#0E0E16'` ZATEN ayarlı — yani koyu hero ile uygulama içi tarayıcı çubuğu arasında beyaz şerit sorunu yok ve bu koyu hero lehine bir puan. Aynı şekilde `layout.tsx:97-100`'deki 4 saniye kapı betiği (`js-var` + `af-hazir`) JS'siz yolu zaten garantiliyor; her yeni efektin kapalı/başlangıç durumu YALNIZ `.js-var` altında tanımlanmalı, yoksa JS gelmediğinde ekranın yarısı boş kalır.
- YAYIN ÖNCESİ BEŞ ZORUNLU KONTROL — biri atlanırsa 'saygın kalma' sözü boşa düşer: (1) gerçek orta sınıf Android'de WhatsApp VE Instagram uygulama içi tarayıcısında açılış; (2) 3G kısıtlı Lighthouse koşusu — LCP ≤2,5 sn, CLS ≤0,02, TBT ≤150 ms; (3) `prefers-reduced-motion: reduce` açıkken ekran görüntüsü; (4) JS tamamen kapalıyken ekran görüntüsü; (5) 375×667 ve 1440×900'de kompozisyonun kırpılma davranışı. `mix-blend-mode` içeren bir çözüm seçilirse (1) numaralı kontrol o teknik için ölçüm kapısıdır, gözlem değil.


---
## KAYNAK KONSEPTLERDEN ALINACAK İKİ PARÇA

### IŞIK TEZGÂHI — ışık/doku doktrini
DOM BÜTÇESİ (ilk ekran, toplam ~56 düğüm): section 1 · zemin katmanı 1 + dev sembol svg/2 path 3 · kapsayıcı 1 · metin bloğu 1 · üst etiket 1 · h1 1 · alt metin bloğu 1 + 12 mevcut SSR sektör varyantı 12 + mobil kısa metin 1 · hizmet çipi listesi 1 + 5 li + 5 a + 5 svg 16 · düğmeler 5 · not 1 · yarık 9 (sızıntı+img 2, kapak 1, img 1, video 1, oynat düğmesi 2, cam 1, açılış çizgisi 1) · ipucu 2. Bugünkü hero'ya göre net artış ~31 düğüm; 16'sı hizmet çipi (metin, SEO'ya yazıyor), 9'u yarık, 4'ü sembol.

DOSYA VE BAYT BÜTÇESİ (ilk ekran kritik yolu): HTML (SSR) ~18 KB gz · site.css tek istek ~14 KB gz · Bricolage Grotesque YALNIZ `latin` alt kümesi, YALNIZ H1 ağırlığı `<link rel=preload>` (latin-ext tembel) · grain data-URI ~390 bayt (istek yok) · dev sembol satır içi ~1,3 KB (istek yok) · ışık havuzu/cam/sızıntı 0 bayt (CSS gradyan) · yarık görseli: `poster/hero-mas-gokart-gece-grid.jpg`'den üretilecek 960px WebP ≈26 KB, `fetchpriority="low" decoding="async"`. İlk ekran için JS: SIFIR. GSAP+ScrollTrigger+SplitText+Lenis ≈48 KB gz, LCP'den sonra.

CSS TEKNİKLERİ (hepsi mevcut token'larla, yeni renk icat etmeden):
1. Işık havuzu: `.af-hero` üzerinde üç katmanlı `radial-gradient`, tek `background-image`. `background-attachment: fixed` YASAK (mobil kaydırma katili). Şiddet tek değişkenden: `--af-isik: 1`.
2. Grain: `url("data:image/svg+xml,<svg…><filter id=g><feTurbulence baseFrequency='.9' numOctaves='3'/></filter><rect filter='url(%23g)'/></svg>")`, `background-size: 180px`, `mix-blend-mode: overlay`, opaklık `--af-zerre`. `.af-bant` üzerine `isolation: isolate` (blend sayfa köküne taşmasın). 180px tile şart: Safari büyük feTurbulence yüzeyini yavaş rasterler.
3. Cam: tam ekran panelde `backdrop-filter` YASAK (repo'nun kendi üst bar yorumu da bunu söylüyor: tam viewport readback). Cam = statik `linear-gradient(104deg, rgba(255,255,255,.07) 0 18%, transparent 18.5% 40%, rgba(255,255,255,.04) 40.5% 46%, transparent 47%)` + mevcut `--af-ic-isik` iç çizgisi. Gerçek `backdrop-filter: blur(6px) saturate(130%)` yalnızca `@supports` + `@media (min-width:900px) and (hover:hover)` altında ve yalnız 320×180'lik küçük cam kartta.
4. Yarık maskesi: `clip-path: polygon(...)` STATİK, asla tween edilmez (clip-path animasyonu compositor'da değil, her karede repaint). Açılış = kapsayıcıda `transform: scaleY()`, içeride ters `scaleY()`. İki eleman, tek tween, compositor-only.
5. Derinlik: `perspective` ve scroll'a bağlı 3D YOK (jank). Derinlik 5 ayrık z-katmanının farklı scrub hızından geliyor; her katman yalnız `translate3d(0,Ypx,0)`. `will-change: transform` tam o 5 elemanda, başka hiçbir yerde.
6. Renk geçişleri `color-mix(in oklab, …)` — sRGB'de turuncu→açık ramp çamur griye düşüyor. Repo bugün `in srgb` kullanıyor; gradyanlarda oklab tek satırlık kalite yükseltmesi.
7. Yükseklik birimi `svh`, `vh` DEĞİL: `min-height: calc(88svh - var(--af-ustbar-h))`, `max-height: 880px`. Alt boşluk `max(var(--af-b-24), env(safe-area-inset-bottom))`.
8. Fold altı bantlara `content

### DÖRT DÜĞÜM — kurgu kapısı ve CSS-önce kuralı
TEMEL KARAR: giriş ekranının animasyonu CSS'tir, GSAP değil. GSAP ilk kaydırmaya kadar hiç çalışmaz. Bu, 3G/2,5 sn şartını tek başına çözen karardır.

1) İKİ AYRI SVG (hizalama matematiği yok)
- `HeroGraf.tsx` (SUNUCU bileşeni, satır içi SVG): masaüstü `viewBox="0 0 1200 420"`, düğümler x=150/450/750/1050, y=180. Mobil varyant `viewBox="0 0 360 1100"`, omurga x=24. İkisi aynı SVG içinde iki `<g>`; biri `@media` ile `display:none`. JS ile DOM kurma yok.
- İNİŞ TRASESİ ayrı bir SVG: `position:absolute` + mevcut `.af-akis` ile BİREBİR AYNI CSS (`inset-inline-start: max(6px, min(64px, calc(50vw - 640px))); width:48px`), yolu x=24'ten iner. Böylece hero hattı ile sayfa boyu hat ölçek matematiği olmadan, inşa gereği hizalanır. (site.css satır 1760–1794 geometrisi.)

2) DOM BÜTÇESİ
SVG: 4 düğüm çerçevesi + 5 bağlantı + 3 reklam giriş hattı + 1 dalga yolu + 2 `<use>` + 6 parçacık `<circle>` + 1 trase + 2 `<defs>` gradyan ≈ 24 öge. HTML: 4 × (a + 2 span) + h1 + p + görsel-gizli `<ol>` ≈ 22 öge. Hero toplam ≤ 55 DOM. Satır içi SVG ≈ 5,2 KB ham / ~1,7 KB gzip.

3) HERO KRİTİK CSS SATIR İÇİ
site.css 2000 satır ve render-blocking. Hero'nun kendi kurallarını (~2 KB) hero sunucu bileşeninden `<style>` olarak bas; site.css normal yolundan gelsin. İlk boya CSS dosyasını beklemez.

4) PARÇACIKLAR — SIFIR JS
`offset-path: path('M150 180 H450')` + `@keyframes { to { offset-distance: 100% } }`, `animation: 2,6s linear infinite`, `animation-delay` ile düzensiz kademe. `@supports (offset-path: path('M0 0 H1'))` içinde GÖSTERİLİR; varsayılan `display:none`. Desteklemeyen tarayıcıda parçacık yok, diyagram bozulmaz. MotionPathPlugin'e gerek kalmaz (JS'den tamamen çıkar).

5) DALGA FORMU — SIFIR JS
3 periyotluk sabit sinüs `<path>` + 2 `<use>` (bir periyot ötelenmiş), `<g clip-path>` içinde. `transform: translateX(-400px)` keyframe, `will-change: transform`. Compositor'da döner, ana iş parçacığına dokunmaz.

6) KURGU KAPISI — REFLOW YOK
Sabit 220×220 kutu, içinde `clip-path: inset()` ile 16:9 pencere; 2,2 s'de 9:16 inset'e geçer (520 ms). `aspect-ratio` DEĞİŞTİRİLMEZ (düzen kaydırır). CLS 0.

7) GSAP NE ZAMAN VE NE KADAR
`Efektler` → `dynamic(() => import(...), { ssr: false })`, `requestIdleCallback` ya da ilk `scroll`/`pointerdown` ile. Eklentiler: ScrollTrigger (zorunlu), DrawSVG (bölüm başlıklarının düğüm rozetleri), ScrambleText (en çok 8 mono etiket), SplitText (yalnız bölüm H2'leri). MorphSVG, Flip, Physics2D, Observer, InertiaPlugin GİRMEZ — her biri boşuna kilobayt.

8) MEVC
