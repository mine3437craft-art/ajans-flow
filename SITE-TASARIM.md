# Ajans Flow sitesi — tasarım ve yapım şartnamesi

Kazanan konsept: **AKIŞ HATTI — dokunulabilir ajans sitesi** (5 konsept, 3 jüri; 2 jüri bunu seçti),
şu eklemelerle: ÇALIŞAN VİTRİN'den iki bant ritmi + renk/kontrast disiplini, KADRAJ'dan video
şartnamesi, Flow Hattı'ndan sektör kapısı.

Bu dosya `SITE-BRIEF.md` ile birlikte okunur. Çelişki olursa BRIEF (sahibinin kararları) üstündür.

---

## 1. Ana fikir

Site bir broşür değil, **tezgâh**: sattığımız şeyin çalışan bir minyatürü sayfanın içinde durur.
Ziyaretçi sektörünü seçer, eksiklerini işaretler, sayfa ona bir **Akış Kartı** (kapsam önerisi)
çıkarır; bu kart forma dönüşür ve panelde sektörü + eksikleri DOLU bir aday olarak düşer.

Konumlandırma: *"İçeriği de yazılımı da aynı ekip yazıyor."*

**Yasak:** sinema jargonu (timecode, 24fps, showreel), tam ekran otomatik oynayan hero videosu,
sektör başına çizilmiş sevimli SVG illüstrasyonlar, "sahibinden senkronizasyonu" iddiası.

---

## 2. Yerleşim ve adresler

Site, panelle aynı Next.js uygulamasında `src/app/site/**` altında yaşar.
`flowajans.com` alan adında proxy her yolu `/site/...`'e yazar; ziyaretçi `/site` görmez.
**Bağlantılarda her zaman `siteYolu('/hizmetler')` yardımcısını kullan** (`src/lib/site.ts`).

| Yol (ziyaretçinin gördüğü) | Dosya | Ne anlatır |
|---|---|---|
| `/` | `src/app/site/page.tsx` | Ana sayfa — 14 sahnelik akış |
| `/analiz` | `site/analiz/` | Ücretsiz dijital analiz aracı + form |
| `/hizmetler` | `site/hizmetler/` | Hizmet hub'ı (4 grup) |
| `/hizmetler/[hizmet]` | `site/hizmetler/[hizmet]/` | 7 hizmet sayfası (veri: `HIZMETLER`) |
| `/qr-menu` | `site/qr-menu/` | QR dijital menü hizmeti + mevzuat bölümü |
| `/demo/qr-menu` | `site/demo/qr-menu/` | Çalışan 4 dilli menü demosu |
| `/otomotiv-yazilimlari` | `site/otomotiv-yazilimlari/` | Galerinin dijital zinciri |
| `/otomotiv-yazilimlari/[urun]` | aynı klasör `[urun]/` | arac-degerleme · ilan-hazirlama · galeri-muhasebe |
| `/sektorler` ve `/sektorler/[sektor]` | `site/sektorler/` | 12 sektör sayfası (veri: `SEKTORLER`) |
| `/calismalar` ve `/calismalar/[marka]` | `site/calismalar/` | Vakalar (veri: `VAKALAR`, `vakaYolu()`) |
| `/rehber`, `/rehber/[yazi]` | `site/rehber/` | SEO rehber yazıları |
| `/hakkimizda` | `site/hakkimizda/` | Ajans, çalışma biçimi |
| `/iletisim` | `site/iletisim/` | Form + WhatsApp + Instagram |
| `/tesekkurler` | `site/tesekkurler/` | Form sonrası |
| `/kvkk`, `/gizlilik` | `site/kvkk/`, `site/gizlilik/` | Metinler `src/lib/site-yasal.ts` içinde hazır |

Not: `sahibinden senkron` diye ayrı sayfa **yapılmayacak**. Konu, `/otomotiv-yazilimlari` içinde
"ilan yönetim akışı" başlığıyla, iddiasız dille geçer.

---

## 3. Görsel sistem

> Giriş ekranı ve imza efekt katmanı için **SITE-GIRIS.md** (kazanan konsept: HARF KADRAJI)
> bu bölümün üstündedir: siyah plaka (`--af-plaka: #000`), harf içinden video (blend knockout),
> yarım cümle kancası, kurgu kapısı, grain + ışık havuzu doktrini.

### Renk ve zemin
```
--koyu:        #0E0E16   (ana kimlik zemini)
--koyu-2:      #15151F   (koyu bant içi kart)
--kagit:       #F7F5F2   (stüdyo bandı — kâğıt beyazı)
--beyaz:       #FFFFFF
--turuncu:     #FF6B35   (vurgu; koyu zeminde metin olarak kullanılabilir)
--turuncu-koyu:#B83C13   (AÇIK zeminde turuncu METİN/bağlantı — kontrast için zorunlu)
--turuncu-dolu:#E2541F   (dolu düğme zemini + beyaz yazı)
--ink:         #14141F   (açık zeminde ana metin)
--ink-2:       #4A4A5A
--cizgi:       rgba(…)   (1px ayraçlar)
```
**Kural:** Açık zeminde turuncu metin **asla** `#FF6B35` olmaz (kontrast 2.9:1), `#B83C13` olur.
Geniş turuncu dolgu yok; turuncu çizgi, çip, aktif durum ve tek vurgu rengidir.

### İki bant ritmi (ÇALIŞAN VİTRİN'den)
- **Açık/kâğıt bant** = stüdyo işleri (sosyal medya, çekim, reklam, tasarım). Yazı: insan dili, serif aksan.
- **Koyu bant** = yazılım işleri (QR menü, otomotiv yazılımları, web). Etiketler mono yazı tipi, veri şeritleri.
Bant rengi dekor değil **bilgi**: ziyaretçi hangi kanadı okuduğunu renkten anlar.

### Akış hattı (imza)
Sayfanın tepesinden altına inen **tek 2px turuncu SVG stroke**. Kaydırma ilerlemesine göre
`stroke-dasharray` ile çizilir; bölümden bölüme şekil değiştirir (QR kodun kenarı, değerleme bandı,
süreç çizgisi, imza). Tek eleman, tek rAF'a bağlı dinleyici. Mobilde sadeleşir (dikey ince çizgi).

### Yazı tipi
- Başlık: değişken ağırlıklı, sıkı grotesk (`next/font/google` ile **Bricolage Grotesque** ya da
  **Plus Jakarta Sans**; latin + latin-ext). Büyük boylarda `letter-spacing: -0.03em`.
- Metin: Inter (projede zaten `--font-inter` var).
- Mono (yazılım bantlarında etiket/veri): `ui-monospace, SFMono-Regular, Menlo`.
- Ölçek: `clamp()` ile akışkan; H1 mobil 34px → masaüstü 76px.

### Marka sembolü
`public/site/marka/flow-sembol.svg` — marka sahibinin verdiği vektörel sembol: turuncu gradyanlı,
şerit biçiminde stilize "F". **Her yerde bu kullanılır** (üst bar, alt bilgi, favicon, OG görseli,
yükleme göstergesi). Yanında kelime-işaret olarak "AJANS FLOW" tipografiyle yazılır
(sembol solda, yazı sağda; dar ekranda yalnız sembol).
Kurallar: sembol asla germe/çarpıtma, renk değiştirme, gölge ekleme yok; koyu ve açık zeminde
olduğu gibi durur (gradyan ikisinde de okunur). Tek renk gerektiğinde (ör. filigran) `currentColor`
ile düz bir kopyası ayrıca üretilir. Satır içi React bileşeni olarak kullanılacaksa gradyan
`id`'leri benzersizleştirilmeli (`useId`), aynı sayfada iki kez basılırsa çakışmasın.

### Cihaz çerçeveleri ve ızgaralar
Telefon/dizüstü çerçeveleri **saf CSS** (1px kenar, iç içe radius, tek iç gölge). Ürün demoları
bunların içinde yaşar. Müşteri logoları için `public/site/medya/logo/` kullanılır; logosu olmayan
marka tipografik kelime-işaret olarak dizilir (serif · kalın · geniş · mono · yuvarlak varyantları).

### Köşe yarıçapı anlamı
`2px` veri/tablo · `14px` kart · `999px` çip. Rastgele radius kullanma.

---

## 4. Hareket (GSAP 3.15 + Lenis kuruldu)

Kullanılabilir: `gsap`, `ScrollTrigger`, `SplitText`, `Flip`, `DrawSVGPlugin`, `Observer`, `lenis`.
**ScrollSmoother kullanma** (Lenis ile çakışır). Tüm GSAP kodu `'use client'` bileşenlerde,
`useGSAP` yerine `useLayoutEffect` + `gsap.context()` ile; `return () => ctx.revert()` zorunlu.

İmza hareketler (en fazla bunlar — her sahneye animasyon koyma):
1. **Akış hattı**: tek SVG stroke, ScrollTrigger scrub ile çizilir.
2. **Sektör kapısı**: hero'daki çipe dokununca `<html data-sektor="kafe">` değişir; metin, eksik
   sıralaması, vaka filtresi SSR'da basılı varyantlar arasından **CSS attribute seçicisiyle** değişir
   (JS ile DOM kurma yok, istek yok).
3. **Akış Kartı**: eksik işaretlendikçe turuncu nokta karta kayar, kart satır satır büyür.
4. **Başlık açılışı**: SplitText ile kelime kelime, yalnızca ana sayfa H1 ve bölüm H2'lerinde.
5. **Değerleme bandı**: kırıcı çiplerine dokundukça bant kayar (tek CSS değişkeni `--kirici-oran`).
6. **Süreç çizgisi**: kaydırmayla dolan dikey çizgi.
7. **Sayaçlar**: bir kez sayılır (yalnız doğrulanmış rakamlar).

**Zorunlu korumalar:** `prefers-reduced-motion: reduce` → bütün animasyonlar kapalı, içerik görünür.
`navigator.connection.saveData` ya da `effectiveType` 2g/slow-2g → ağır efektler ve video kapalı.
Ekran dışındaki animasyonlar duraklatılır. JS yüklenmeden içerik **görünür** olmalı (animasyon için
gizleme yalnızca `.js-var` sınıfı eklendikten sonra uygulanır) ve 4 sn'de JS gelmezse hepsi açılır.

---

## 5. Video şartnamesi (KADRAJ'dan, zorunlu)

`public/site/medya/` altında gerçek dosyalar var: `video/`, `poster/`, `foto/`, `logo/`, `kunye.json`.
**Tek `<Video>` bileşeni** yazılacak (`src/components/site/Video.tsx`) ve kurallar onda olacak:
- `muted playsInline loop` + `poster` + `preload="none"`; `<video>` ancak görünür olunca `src` alır.
- IntersectionObserver %50 eşik; ekrandan çıkınca `pause()`.
- Aynı anda sayfada **tek video** oynar (basit bir denetleyici).
- `saveData` / 2g-3g → `src` hiç atanmaz, poster kalır.
- Otomatik oynatma başarısız olursa poster üstünde görünür turuncu **oynat** düğmesi.
- `aspect-ratio` ile kutu önceden rezerve edilir (CLS 0).
- Dosya yoksa (`kunye.json` kontrolü) `<video>` hiç basılmaz, poster kompozisyonu kalır.
- **Ana sayfa hero'sunda video, YALNIZCA harf kadrajının içinde** (bkz. SITE-GIRIS.md): tam ekran
  otomatik oynayan arka plan videosu hâlâ YASAK, ama "YÜZÜNÜZ" / "YAZILIM" kelimelerinin içinden
  akan maskelenmiş klip kazanan konseptin çekirdeğidir. Ağ kapısı: `src` yalnızca `window.load` +
  boşta zaman + 3G üstü bağlantıda atanır; aksi hâlde 24 KB'lık AVIF dolgu karesi kalır.
  Diğer video kullanımları: İşler kartları, vaka sayfaları, hizmet sayfaları (en çok 1 tane).

---

## 6. Dönüşüm

**Akış Kartı → form → panel.** Form alanları: işletme adı (zorunlu), yetkili adı, telefon (zorunlu),
e-posta, sektör (ön-dolu), eksikler (ön-dolu, çoklu), serbest not.
İki ayrı onay kutusu: (a) KVKK aydınlatma onayı — **zorunlu**, `/kvkk`'ya bağlanır;
(b) ticari ileti izni — **opsiyonel**. Asla tek kutuda birleştirilmez.
Sunucu tarafı hazır: `src/app/site/iletisim/actions.ts` → `talepGonder`. Panelde kaynak "Web sitesi",
arama tarihi bugün. (Eksikler ve sektör alanları bu action'a ana ajan tarafından bağlanacak.)
Her sayfada ulaşılabilir ikincil kapılar: WhatsApp (`whatsappBaglantisi()`), Instagram DM.

---

## 7. Dosya sahipliği (çakışma olmasın)

| Alan | Dosyalar | Sahibi |
|---|---|---|
| Altyapı | `src/proxy.ts`, `src/lib/site.ts`, `src/lib/site-yasal.ts`, `src/app/site/iletisim/actions.ts`, `src/app/site/robots.ts`, `src/app/site/sitemap.ts` | **Ana ajan** |
| İçerik verisi | `src/lib/site-icerik.ts` | İçerik ajanı |
| Medya | `public/site/medya/**` | Medya ajanı |
| Tasarım sistemi | `src/app/site/layout.tsx`, `src/app/site/site.css`, `src/components/site/{Ustbar,Altbilgi,AkisHatti,Efektler,Video,Cerceve,Dugme,Bolum,MarkaSeridi,SSS}.tsx` | **Temel ajanı** |
| Ana sayfa | `src/app/site/page.tsx`, `src/components/site/anasayfa/**` | Ana sayfa ajanı |
| Hizmetler | `src/app/site/hizmetler/**` | Hizmet ajanı |
| QR menü + demo | `src/app/site/qr-menu/**`, `src/app/site/demo/**` | QR ajanı |
| Otomotiv | `src/app/site/otomotiv-yazilimlari/**` | Otomotiv ajanı |
| Sektörler | `src/app/site/sektorler/**` | Sektör ajanı |
| Çalışmalar | `src/app/site/calismalar/**` | Vaka ajanı |
| Rehber | `src/app/site/rehber/**`, `src/icerik/rehber.ts` | Rehber ajanı |
| Kurumsal | `src/app/site/{hakkimizda,iletisim,tesekkurler,kvkk,gizlilik,analiz}/**` | Kurumsal ajanı |

Her sayfa ajanı kendi CSS'ini kendi klasöründe (`sayfa.css`) tutar ve **tasarım sistemindeki
değişkenleri/sınıfları kullanır**; yeni renk, yeni radius, yeni gölge icat etmez.
CSS sınıfları `af-` ön ekiyle başlar (panelin `globals.css`'i ile çakışmasın).

---

## 8. Yazım ve doğruluk kuralları

- Uydurma yok: müşteri yorumu, ödül, sertifika, "%X artış", fiyat, takipçi sayısı, kuruluş yılı, ekip sayısı.
- Kullanılabilir doğrulanmış rakamlar: 12+ marka, 244+ Instagram gönderisi, İstanbul / 4.Levent.
- **Fiyat yazılmaz**; paket kapsamı anlatılır, teklife yönlendirilir.
- Yazılımlar "yaptığımız iş" dilinde anlatılır (ürün/lisans satışı dili yok).
- QR menü mevzuatı: "zorunlu/ceza" dili yasak. Doğru çerçeve `arastirma/02-qr-menu-mevzuati.md`'de.
- Demolarda gösterilen her rakam "örnek" damgalı olur; gerçek müşteri verisi görünmez.
- Erişilebilirlik: anlamlı başlık sırası, `:focus-visible`, 44px dokunma hedefi, renk kontrastı AA,
  `<details>` tabanlı SSS (JS'siz çalışır), görsellerde `alt`.

## 9. Teknik ölçütler

- Mobil öncelikli; 360-430px kusursuz, yatay kaydırma yok.
- Her sayfa JS'siz okunabilir (içerik SSR; JS yalnızca yükseltme).
- `npx tsc --noEmit` ve `npx next build` hatasız.
- Panel bozulmayacak: `globals.css`'e dokunma, `(app)` altındaki hiçbir dosyayı değiştirme.
- Sayfa başına özgün `metadata` (başlık ≤60, açıklama ≤155), `alternates.canonical`,
  OpenGraph; JSON-LD: Organization + LocalBusiness (ana sayfa), Service (hizmet), Article (rehber),
  BreadcrumbList (alt sayfalar). FAQPage şeması kullanma (Google kaldırdı).
