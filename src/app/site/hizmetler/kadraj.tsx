/**
 * HARF KADRAJI — hizmet sayfalarının tek "nefes kesen" başlık anı.
 *
 * Teknik SITE-GIRIS.md'nin kazanan konseptinden birebir alındı: BLEND
 * KNOCKOUT. `background-clip: text` canlı video alamaz, SVG `mask` +
 * `foreignObject` iOS Safari'de güvenilmez, harfi path'e çevirmek SSR
 * metnini ve ekran okuyucuyu öldürür. `mix-blend-mode` knockout her
 * yerde çalışır ve METİN GERÇEK DOM METNİ KALIR.
 *
 *   .af-hz-taban   turuncu gradyan  (kontrast tabanı, ÇIKARILAMAZ)
 *   .af-hz-plan    <img> + <video>  · mix-blend-mode: screen
 *   .af-hz-maske   saf siyah        · mix-blend-mode: multiply
 *
 * KURAL — SAYFADA EN ÇOK BİR KEZ, tek satırlık bir anahtar kelimede.
 * Her başlığa konulmaz; konulduğu an "şablon dark mode" olur. Bu yüzden
 * bileşen yalnız hub hero'sunda çağrılır, detay sayfalarında ÇAĞRILMAZ
 * (orada doluluk marka gradyanından gelir: `.af-hz-dev-vurgu`).
 *
 * `giris.css`/`HarfKadraji.tsx` ana sayfanın dosyaları ve BAŞKA BİR
 * AJANIN sahipliğinde; buradaki kopya `af-hz-` ön ekiyle kendi
 * klasöründe yaşıyor ve o dosyalara hiç dokunmuyor.
 */

import type { CSSProperties, ReactNode } from 'react';
import { medyaYolu } from '@/lib/site-icerik';

/* ------------------------------------------------------------------ */
/* Medya — diskte VAR OLAN dosyalar (public/site/medya/)              */
/* Harf içine YALNIZCA YATAY klip girer: duvarın açıklığı ~5:1 geniş,  */
/* dikey bir klip oraya 2,5× ölçeklenir ve karenin %14'ü görünür.      */
/* ------------------------------------------------------------------ */
const KLIP = medyaYolu('video/hero-mas-gokart-gece-grid.mp4'); // 640×360, 972 KB
const DOLGU_AVIF = medyaYolu('poster/hk-dolgu-gece-grid.avif'); // 1024×576, ~18 KB
const DOLGU_WEBP = medyaYolu('poster/hk-dolgu-gece-grid.webp'); // ~26 KB yedek

/* ------------------------------------------------------------------ */
/* PUNTO TAVANI — taşma matematiği                                    */
/*                                                                    */
/* Duvar satırları `white-space: nowrap`. Bir satır kutusundan taşarsa */
/* taşan parça knockout'un DIŞINDA kalır ve `color: transparent`       */
/* olduğu için GÖRÜNMEZ olur — yani sessiz bir hata. Bu yüzden punto,  */
/* en uzun satırın tahmini em genişliğinden türetilir ve CSS'te        */
/* `min(tasarım ölçeği, görünen genişlik / kat, kapsayıcı / kat)`      */
/* olarak uygulanır.                                                   */
/*                                                                    */
/* Ölçüler Bricolage Grotesque 800 ağırlık, BÜYÜK HARF, -0,045em       */
/* tracking için kaba üst sınırlar. Kasıtlı olarak CÖMERT: hata payı   */
/* taşma değil, biraz küçük punto yönünde olsun.                       */
/* ------------------------------------------------------------------ */
const EM_INCE = 0.32; // I İ i l j 1 . , ' ! | boşluk
const EM_GENIS = 0.78; // M W Ğ Ö Ü O Q G D C Ç
const EM_ORTA = 0.6; // kalanı
const TRACKING = 0.045; // letter-spacing: -0.045em
const GUVENLIK = 1.1; // %10 pay (ölçüldü: 1,06'da 360px'te yalnız 12px kalıyordu)

const INCE = new Set([...'Iİiljt1.,\'!| ']);
const GENIS = new Set([...'MWĞÖÜOQGDCÇ']);

/** Bir satırın tahmini genişliği (em). */
function satirEm(metin: string): number {
  const harfler = [...metin.trim().toLocaleUpperCase('tr')];
  let em = 0;
  for (const h of harfler) {
    if (INCE.has(h) || INCE.has(h.toLocaleLowerCase('tr'))) em += EM_INCE;
    else if (GENIS.has(h)) em += EM_GENIS;
    else em += EM_ORTA;
  }
  return Math.max(0, em - harfler.length * TRACKING);
}

/**
 * Duvarın punto katsayısı: en uzun satırın em genişliği.
 * CSS `font-size: min(..., (görünen genişlik) / kat)` ile kullanır,
 * yani sonuç "satır kutuya tam sığan en büyük punto"dur.
 */
export function kadrajKat(satirlar: readonly string[]): number {
  const en = satirlar.reduce((a, s) => Math.max(a, satirEm(s)), 0);
  return Math.max(3, Number((en * GUVENLIK).toFixed(2)));
}

/* ------------------------------------------------------------------ */
/* VİDEO DÜZLEMİ — üç katmanlı yığının orta katmanı                   */
/*                                                                    */
/* `data-video` / `data-video-kaynak` / `data-video-sira` sözleşmesi   */
/* Efektler.tsx'in mevcut "aynı anda tek video" denetleyicisiyle       */
/* birebir aynı; `data-video-bekle="yukleme"` ise yükseltilmiş ağ      */
/* kapısı: `src` ancak window.load + boşta zaman + (2g/3g DEĞİL ve     */
/* downlink ≥ 1,5) koşulları BİRLİKTE sağlanınca atanır.               */
/* ------------------------------------------------------------------ */
export function HeroDuzlemi({ sira = 0 }: { sira?: number }) {
  return (
    <div
      className="af-hz-plan"
      aria-hidden="true"
      data-video=""
      data-video-kaynak={KLIP}
      data-video-sira={sira}
      data-video-bekle="yukleme"
    >
      {/* Durağan kare KALICI. Video hiç gelmezse (ağ kapısı, saveData,
          play() reddi) duvar yine DOLU görünür — "karanlık kare geldi,
          kelime kayboldu" hatası mimari olarak imkânsız, çünkü altta
          turuncu `.af-hz-taban` gradyanı duruyor. */}
      <picture>
        <source srcSet={DOLGU_AVIF} type="image/avif" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DOLGU_WEBP} alt="" width={1024} height={576} decoding="async" />
      </picture>
      {/* `poster` çapraz geçişin YERİNE geçer: `src` atandıktan sonra
          ilk kare gelene kadar <video> aynı dolgu karesini boyar, bu
          yüzden "siyah kare" anı HİÇ oluşmaz ve CSS'in bilemediği
          "oynuyor" durumuna bağımlılık kalmaz.
          Ses yok, kontrol yok, künye yok: başlığın içine altyazı girmez. */}
      <video
        muted
        playsInline
        loop
        preload="none"
        poster={DOLGU_AVIF}
        tabIndex={-1}
        aria-hidden="true"
        disablePictureInPicture
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DUVAR                                                              */
/*                                                                    */
/* İki metin katmanı AYNI ızgara gözünde (`grid-area: 1/1`) durur,     */
/* piksel piksel çakışırlar:                                           */
/*   1. `.af-hz-maske` içindeki KOPYA (aria-hidden) — dolu satır       */
/*      beyaz, kalanlar plaka rengi. Knockout'u bu yapar.              */
/*   2. Gerçek başlık — dolu satır `transparent`, kalanlar beyaz.      */
/*      Seçilebilir, SSR'da basılı; SEO ve ekran okuyucu bunu okur.    */
/* ------------------------------------------------------------------ */
export type DuvarSatiri = { metin: string; dolu?: boolean };

export function Duvar({
  satirlar,
  kat,
  baslikEtiketi = 'h2',
  duzlem,
  id,
}: {
  satirlar: readonly DuvarSatiri[];
  kat: number;
  baslikEtiketi?: 'h1' | 'h2';
  duzlem: ReactNode;
  id?: string;
}) {
  const Baslik = baslikEtiketi;
  const stil = {
    ['--hz-kat' as string]: kat,
    ['--hz-satir-sayi' as string]: satirlar.length,
  } as CSSProperties;

  const govde = satirlar.map((s, i) => (
    <span
      className={['af-hz-satir', s.dolu ? 'af-hz-satir--dolu' : ''].filter(Boolean).join(' ')}
      key={`${i}-${s.metin}`}
    >
      <span className="af-hz-i">{s.metin}</span>
    </span>
  ));

  return (
    <div className="af-hz-oyuk" style={stil}>
      <div className="af-hz-duvar" aria-hidden="true">
        <span className="af-hz-taban" />
        {duzlem}
        <div className="af-hz-maske">
          <p className="af-hz-satirlar">{govde}</p>
        </div>
      </div>
      {/* Başlık TEK, GERÇEK ve TAM bir cümledir; görsel olarak satırlara
          bölünür ama anlamı bölünmez. */}
      <Baslik className="af-hz-satirlar af-hz-yazi" id={id}>
        {govde}
      </Baslik>
    </div>
  );
}
