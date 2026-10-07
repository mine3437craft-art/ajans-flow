/**
 * HARF KADRAJI — ana sayfanın giriş ekranı (SITE-GIRIS.md, kazanan konsept)
 *
 * SUNUCU BİLEŞENİ. İstemciye hiç JS taşımaz; hareket katmanı ayrı
 * (`GirisEfekti.tsx`) ve GSAP'i ilk kaydırmaya kadar hiç indirmez.
 * Açılış animasyonunun TAMAMI saf CSS'tir (`giris.css` → af-hk-perde).
 *
 * YAPIM SIRASI TERSİNE ÇEVRİLMEZ — bu bileşen üç hâlde de eksiksiz ve
 * SAYGIN görünecek biçimde yazıldı, efekt sonra eklendi:
 *   (a) JS hiç gelmemiş  → `js-var` yok: dört satır tam, yüklem satırı
 *       KIRPILMADAN tam, beş hizmet bağlantısı okunur, durağan kare
 *       harflerin içinde.
 *   (b) prefers-reduced-motion → scrub/devir/video yok, AYNI
 *       kompozisyon (bkz. giris.css §9).
 *   (c) saveData / 2g → görsel de yok; harfler marka sembolünün KENDİ
 *       gradyanıyla dolar (0 bayt, 5,52:1 kontrast korunur).
 *
 * İKİ PLAKA, İKİ KUTUP:
 *   S1 siyah plaka  — "ne yaptığımız": devasa dört satır, iki dolu kelime.
 *   S2 beyaz plaka  — "nasıl yaptığımız": üç fiil, üretim zinciri.
 * Plaka ÜÇÜNCÜ ve NADİR bir yüzeydir (bant değil ÖNOYUN): sayfada en çok
 * iki kez. Marka bantları (#0E0E16 / #F7F5F2) dokunulmaz; bant anlamı
 * (koyu = yazılım, kâğıt = stüdyo) üçüncü bölümden itibaren geçerli.
 *
 * MEDYA SÖZLEŞMESİ (bozulmaz):
 *   - Kadrajda YALNIZ 640×360 yatay MAS klibi girer. Dikey 404×720
 *     klipler kendi 9:16 kutularında kalır (2,5× yukarı ölçekleme =
 *     bulanık ve amatör).
 *   - Tek dosya, tek çözücü: her iki plaka ve KURGU kapısı aynı 971 KB'lık
 *     `hero-mas-gokart-gece-grid.mp4` üzerinden çalışır. `Efektler.tsx`'in
 *     "aynı anda tek video" denetleyicisi `data-video-sira` ile yönetir.
 *   - Müşteri logo/başlık kartıyla biten klipler ilk ekranda KULLANILMAZ.
 *   - Kişi koruması pazarlık konusu değil: açıklık karenin ÜST %25'ini
 *     asla göstermez (`object-position: 50% 58%` / mobilde `50% 62%`).
 */

import { medyaYolu, hizmetBul, hizmetYolu } from '@/lib/site-icerik';
import { GIRIS_KRITIK_CSS } from './kritik';
import GirisEfekti from './GirisEfekti';
import './giris.css';

/* ------------------------------------------------------------------ */
/* Medya — diskte VAR OLAN tek uygun dosya (ffmpeg bu makinede yok,    */
/* yeni klip üretilemez; dikey kliplerin hepsi 1,3 MB üstü).           */
/* ------------------------------------------------------------------ */
const KLIP = medyaYolu('video/hero-mas-gokart-gece-grid.mp4');
const DOLGU_AVIF = medyaYolu('poster/hk-dolgu-gece-grid.avif');
const DOLGU_WEBP = medyaYolu('poster/hk-dolgu-gece-grid.webp');

/* ------------------------------------------------------------------ */
/* Hizmet şeridi — beşi de GERÇEK bağlantı, SSR'da basılı              */
/* Devir bir YÜKSELTMEDİR; bilginin tek yolu değil, bu yüzden hiçbir   */
/* hâlde gizlenmez.                                                    */
/* ------------------------------------------------------------------ */
type SeritOgesi = {
  anahtar: string;
  /** Şeritte görünen hizmet adı. */
  ad: string;
  /** Marka kelime-işaretleri: ayrı düğümde, hiç dokunulmaz. */
  sabit?: string;
  /** Ekran okuyucunun okuduğu sabit ad. */
  etiket: string;
  /** `EKSIKLER[].anahtar` karşılığı; nesne zinciri bununla devrediyor. */
  eksik?: string;
};

/* Marka kelime-işaretleri (META · GOOGLE · TIKTOK) kendi düğümünde
   durur: hem marka hukuku temiz kalır hem de hizmet adından görsel
   olarak ayrışır. Şeritteki metinlerin HİÇBİRİ çalışma zamanında
   değiştirilmez — devir yalnız renk, opaklık ve kayan iz ile olur
   (bkz. GirisEfekti.tsx §3c). */
const SERIT_TANIMI: readonly SeritOgesi[] = [
  {
    anahtar: 'sosyal-medya',
    ad: 'SOSYAL MEDYA YÖNETİMİ',
    etiket: 'Sosyal medya yönetimi',
    eksik: 'instagram_zayif',
  },
  { anahtar: 'drone', ad: 'DRONE ÇEKİMİ', etiket: 'Drone çekimi' },
  {
    anahtar: 'fotograf',
    ad: 'KAMERA ve FOTOĞRAF',
    etiket: 'Kamera ve fotoğraf çekimi',
    eksik: 'cekim_yok',
  },
  { anahtar: 'kurgu-edit', ad: 'KURGU ve EDİT', etiket: 'Kurgu ve edit', eksik: 'reels_yok' },
  {
    anahtar: 'meta-reklam',
    ad: 'REKLAM YÖNETİMİ',
    sabit: ' · META · GOOGLE · TIKTOK',
    etiket: 'Reklam yönetimi: Meta, Google ve TikTok',
    eksik: 'reklam_yok',
  },
];

/** Anahtarı içerikte bulunmayan madde sessizce düşer (uydurma yol yok). */
const SERIT = SERIT_TANIMI.flatMap((o) => {
  const hizmet = hizmetBul(o.anahtar);
  return hizmet ? [{ ...o, yol: hizmetYolu(hizmet) }] : [];
});

/** Hizmet yolu; anahtar yoksa hizmet hub'ına düşer. */
function yol(anahtar: string, yedek = '/hizmetler'): string {
  const hizmet = hizmetBul(anahtar);
  return hizmet ? hizmetYolu(hizmet) : `/site${yedek}`;
}

/* ------------------------------------------------------------------ */
/* Video düzlemi — üç katmanlı blend yığınının orta katmanı            */
/*                                                                     */
/* `data-video` / `data-video-kaynak` / `data-video-sira` sözleşmesi    */
/* AYNEN korunuyor, böylece Efektler.tsx'in mevcut "aynı anda tek      */
/* video" denetleyicisi hiç değişmeden plakaları da yönetir.           */
/* `data-video-bekle="yukleme"` yeni hero kapısı: src ancak            */
/* window.load + requestIdleCallback + ağ yeterliyken atanır.          */
/* ------------------------------------------------------------------ */
function Duzlem({ sira }: { sira: number }) {
  return (
    <div
      className="af-hk-plan"
      aria-hidden="true"
      data-video=""
      data-video-kaynak={KLIP}
      data-video-sira={sira}
      data-video-bekle="yukleme"
    >
      {/* Durağan kare KALICI: video onun ÜSTÜNE 600 ms'de çapraz geçer.
          ÖLÇÜM NOTU: bu görsel gerçek LCP ögesidir (576 bin px² boyama
          alanıyla başlıktan büyük; tarayıcı blend'i anlamaz). Bu yüzden
          `loading="lazy"` ZARARLIDIR — tembel görsel geç önceliklenir ve
          LCP'yi geriye iter. `eager` + varsayılan öncelik: 24 KB AVIF
          erken gelir, yazı tipiyle yarışmaz (`display:swap` sayesinde
          metin zaten yedek yazı tipiyle basılmıştır) ve `fetchpriority`
          yükseltmesine gerek kalmaz. Video LCP ögesi DEĞİLDİR; ağ kapısı
          onu LCP penceresinden tamamen çıkarır. */}
      <picture>
        <source srcSet={DOLGU_AVIF} type="image/avif" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DOLGU_WEBP} alt="" width={1024} height={576} decoding="async" />
      </picture>
      {/* Ses yok, kontrol yok, künye yok: başlığın içine altyazı girmez.
          RAPOR.md §8.1 — kliplerin ses kanalı dosyanın içinde duruyor,
          `muted` zorunlu; ffmpeg kurulunca kanal tamamen çıkarılacak. */}
      <video
        muted
        playsInline
        loop
        preload="none"
        tabIndex={-1}
        aria-hidden="true"
        disablePictureInPicture
      />
    </div>
  );
}

/* ================================================================== */
/* S1 — SİYAH PLAKA                                                    */
/* ================================================================== */

function SiyahPlaka() {
  return (
    <div className="af-hk-yuva">
      <section
        className="af-hk"
        data-hk="koyu"
        data-akis="duz"
        data-alt-cta-gizle
        aria-labelledby="af-hk-baslik"
      >
        <span className="af-hk-isik" aria-hidden="true" />
        <span className="af-hk-zerre" aria-hidden="true" />

        <div className="af-hk-ic">
          <p className="af-ust-etiket af-hk-etiket">
            Sosyal medya ve yazılım ajansı · İstanbul / 4.Levent
          </p>

          {/* OYUK: iki metin katmanı tek ızgara gözünde. Ölçek scrub'ı
              buraya uygulanır; ikisi birlikte ölçeklenir, hiza bozulmaz. */}
          <div className="af-hk-oyuk" data-hk-oyuk>
            {/* --- blend yığını: taban → düzlem → maske --- */}
            <div className="af-hk-duvar" aria-hidden="true">
              <span className="af-hk-taban" />
              <Duzlem sira={0} />
              <div className="af-hk-maske">
                {/* Knockout kopyası. Gerçek metin AŞAĞIDAKİ <h1>; bu
                    katman yalnız hangi harfin açık olduğunu söyler. */}
                <p className="af-hk-satirlar">
                  <span className="af-hk-satir">
                    <span className="af-hk-i">{'Görünen '}</span>
                  </span>
                  <span className="af-hk-satir af-hk-satir--dolu" data-ikincil>
                    <span className="af-hk-i">{'yüzünüz '}</span>
                  </span>
                  <span className="af-hk-satir">
                    <span className="af-hk-i">
                      <i className="af-hk-kucuk">ve</i> {'arkadaki '}
                    </span>
                  </span>
                  <span className="af-hk-satir af-hk-satir--dolu">
                    <span className="af-hk-i">{'yazılım '}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* <h1> TEK, GERÇEK ve TAM bir cümledir. Görsel olarak beş
                satıra bölünür ama anlamı bölünmez; seçilebilir, SSR'da
                basılı, ekran okuyucu bunu okur. Elle `aria-label`
                EKLENMEZ (çift okuma olur). */}
            <h1 className="af-hk-satirlar af-hk-yazi" id="af-hk-baslik">
              <span className="af-hk-satir">
                <span className="af-hk-i">{'Görünen '}</span>
              </span>
              <span className="af-hk-satir af-hk-satir--dolu" data-ikincil>
                <span className="af-hk-i">{'yüzünüz '}</span>
              </span>
              <span className="af-hk-satir">
                <span className="af-hk-i">
                  <i className="af-hk-kucuk">ve</i> {'arkadaki '}
                </span>
              </span>
              <span className="af-hk-satir af-hk-satir--dolu">
                <span className="af-hk-i">{'yazılım '}</span>
              </span>
              {/* YARIM CÜMLE KANCASI: yüklem, kaydırmanın ödülüdür.
                  Kırpma YALNIZ `.js-var` altında tanımlı — JS gelmezse
                  (ya da 4 saniye kapısı devreye girerse) cümle TAMAMDIR. */}
              <span className="af-hk-yuklem">
                <span>— ikisini de aynı ekip kuruyor.</span>
              </span>
            </h1>
          </div>

          {/* Plakanın ÜÇÜNCÜ ve son işareti. Dördüncüsü konulmaz. */}
          <ul className="af-hk-serit" data-hk-serit>
            {/* Aktif adın altındaki tek 2px turuncu iz. Addan ada KAYAR
                (tek `transform`), bu yüzden her bağlantıya ayrı çizgi
                konmuyor. `<li>` olarak basılıyor ki `<ul>` geçerli
                kalsın; mutlak konumlu olduğu için akışta yer tutmaz. */}
            <li className="af-hk-iz" aria-hidden="true" />
            {SERIT.map((o) => (
              <li key={o.anahtar} data-hk-oge>
                {/* Dış ögede SABİT `aria-label`; görünen metin
                    `aria-hidden` bir span'de durur ve ÇALIŞMA ZAMANINDA
                    HİÇ DEĞİŞMEZ — bir karede bile okunmayan metin
                    çıkmaz. `aria-live` KULLANILMAZ. */}
                <a href={o.yol} aria-label={o.etiket} data-hk-eksik={o.eksik}>
                  <span aria-hidden="true" data-hk-ad={o.ad}>
                    {o.ad}
                  </span>
                  {o.sabit ? (
                    <span aria-hidden="true" className="af-hk-sabit">
                      {o.sabit}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="af-hk-ipucu" aria-hidden="true">
          Aşağı kaydırın
        </p>
      </section>
    </div>
  );
}

/* ================================================================== */
/* S2 — BEYAZ PLAKA: üretim zincirinin kendisi                         */
/* Üç fiil, üç satır. Hizmet listesi değil İŞ AKIŞI.                   */
/* ================================================================== */

function BeyazPlaka() {
  return (
    <section
      className="af-hk af-hk--acik"
      data-hk="acik"
      data-akis="veri"
      aria-labelledby="af-hk-uretim-baslik"
      style={{ ['--hk-satir-sayi' as string]: 3 } as React.CSSProperties}
    >
      <span className="af-hk-isik" aria-hidden="true" />
      <span className="af-hk-zerre" aria-hidden="true" />

      <div className="af-hk-ic">
        <div className="af-hk-uretim">
          <div className="af-hk-oyuk" data-hk-oyuk="sabit">
            <div className="af-hk-duvar" aria-hidden="true">
              <span className="af-hk-taban" />
              <Duzlem sira={1} />
              <div className="af-hk-maske">
                <p className="af-hk-satirlar">
                  <span className="af-hk-satir af-hk-satir--dolu" data-ikincil>
                    <span className="af-hk-i">{'Çekeriz. '}</span>
                  </span>
                  <span className="af-hk-satir">
                    <span className="af-hk-i">{'Kurgularız. '}</span>
                  </span>
                  <span className="af-hk-satir af-hk-satir--dolu">
                    <span className="af-hk-i">{'Yayınlarız. '}</span>
                  </span>
                </p>
              </div>
            </div>

            <h2 className="af-hk-satirlar af-hk-yazi" id="af-hk-uretim-baslik">
              <span className="af-hk-satir af-hk-satir--dolu" data-ikincil>
                <span className="af-hk-i">{'Çekeriz. '}</span>
              </span>
              <span className="af-hk-satir">
                <span className="af-hk-i">{'Kurgularız. '}</span>
              </span>
              <span className="af-hk-satir af-hk-satir--dolu">
                <span className="af-hk-i">{'Yayınlarız. '}</span>
              </span>
            </h2>
          </div>

          {/* --- Sağ kolon: üç fiilin KANITI, iddiası değil --- */}
          <div className="af-hk-kanit">
            {/* ÇEKERİZ → drone + kamera/fotoğraf. Gerçek bağlantılar. */}
            <p className="af-hk-kunye">
              <span>
                <a href={yol('drone')}>Drone</a> · 404×720 · İstinye Koyu
              </span>
              <span>
                <a href={yol('fotograf')}>Kamera</a> · yemek · mekân · 640×360
              </span>
            </p>

            {/* KURGULARIZ → KURGU KAPISI. Kurguyu ikonla değil DURUM
                DEĞİŞİMİYLE anlatır: yatay çekimin dikey yayına kırpılması
                gözün önünde olur. Sabit 220×220 kutu, `aspect-ratio`
                DEĞİŞMEZ → CLS 0. */}
            <div className="af-hk-kapi" data-hk-kapi>
              <p className="af-hk-kapi-ad">KURGU</p>
              <div className="af-hk-kapi-cam">
                <picture>
                  <source srcSet={DOLGU_AVIF} type="image/avif" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={DOLGU_WEBP}
                    alt="Yatay çekilmiş bir karenin dikey yayına kırpılmış hâli"
                    width={1024}
                    height={576}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </picture>
              </div>
              <p className="af-hk-kapi-not">yatay çekim → dikey yayın</p>
            </div>

            {/* BOŞ SES RAYI — klipler sessiz olduğu için dalga formu
                ÇİZMİYORUZ. Sahte dalga formu ölçülebilir bir yalandır. */}
            <div className="af-hk-ray">
              <span className="af-hk-ray-cizgi" aria-hidden="true" />
              <p className="af-hk-ray-etiket">
                <span>Ses yok</span>
                <span>Müzik sonradan</span>
              </p>
            </div>

            {/* KESİM ARALIĞI — kunye.json'daki GERÇEK aralık. Tek rakam
                uydurulmuyor: klip, kaynak montajın 43,5-49,5. saniyesi.
                Bant 40-52 sn'lik bir pencereyi gösterir (sunum penceresi,
                veri değil); seçilen aralık turuncu ayraç içinde. */}
            <div className="af-hk-kesim">
              <div
                className="af-hk-kesim-bant"
                aria-hidden="true"
                style={
                  {
                    ['--hk-giris' as string]: '29.17%',
                    ['--hk-pay' as string]: '50%',
                  } as React.CSSProperties
                }
              >
                <span className="af-hk-kesim-ic" />
              </div>
              <p className="af-hk-ray-etiket">
                <span>40 sn</span>
                <span>Seçilen 43,5 → 49,5</span>
                <span>52 sn</span>
              </p>
            </div>

            {/* YAYINLARIZ → SONUÇ değil SÜREÇ. Rakam yok, yüzde yok,
                grafik yok, platform logosu yok (yalnız mono kelime-işaret:
                marka hukuku temiz, "üçüncü marka panosu" kısıtı korunur).
                Çubuk genişlikleri elle yazılmış sabit; Math.random() YOK. */}
            <div className="af-hk-panel">
              <p className="af-hk-kanal">
                <a href={yol('meta-reklam')}>Meta · Instagram / Facebook</a>
                <span data-cubuk style={{ ['--hk-en' as string]: '58%' } as React.CSSProperties} />
              </p>
              <p className="af-hk-kanal">
                <a href={yol('google-ads')}>Google · arama / pmax</a>
                <span data-cubuk style={{ ['--hk-en' as string]: '44%' } as React.CSSProperties} />
              </p>
              <p className="af-hk-kanal">
                <a href={yol('tiktok')}>TikTok</a>
                <span data-cubuk style={{ ['--hk-en' as string]: '36%' } as React.CSSProperties} />
              </p>
              <p className="af-hk-duraklar">
                <span>Kurulum</span>
                <span aria-hidden="true">→</span>
                <span>Hedefleme</span>
                <span aria-hidden="true">→</span>
                <span>Ölçüm</span>
                <span aria-hidden="true">→</span>
                <span>Rapor</span>
              </p>
              <span className="af-hk-ornek" aria-hidden="true">
                Örnek
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SOSYAL MEDYA YÖNETİMİ üç fiilin hepsini kapsar: yönetim, üç
          fiilin SÜREKLİ hâli olarak plakanın alt kenarında durur. */}
      <p className="af-hk-yonetim">
        <a href={yol('sosyal-medya')}>Aylık içerik akışı</a> · çekim · kurgu · yayın · rapor
      </p>
    </section>
  );
}

/* ================================================================== */

export default function HarfKadraji() {
  return (
    <>
      {/* İlk ekranın düzen kuralları satır içi (~1,6 KB, @layer'lı).
          Yarım uygulanmış stil bile DOĞRU boyar. */}
      <style dangerouslySetInnerHTML={{ __html: GIRIS_KRITIK_CSS }} />
      {/* Ortak sarmalayıcı: scrub mesafesi ve plaka yüksekliği iki
          plakanın da okuyabileceği tek yerde tanımlı. */}
      <div className="af-hk-giris">
        <SiyahPlaka />
        <BeyazPlaka />
      </div>
      <GirisEfekti />
    </>
  );
}
