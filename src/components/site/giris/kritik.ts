/**
 * HARF KADRAJI — İLK EKRAN KRİTİK CSS'İ (satır içi)
 *
 * NEDEN: `site.css` 65 KB ve render-blocking. Giriş ekranının düzeni
 * belirleyen kuralları (plaka yüksekliği, duvar, KİLİTLİ satır
 * yükseklikleri, mono şerit) burada ~1,6 KB olarak duruyor ve
 * `HarfKadraji.tsx` bunu kendi `<style>` ögesiyle basıyor. "Yarım
 * uygulanmış stil bile doğru boyar" (SITE-GIRIS.md).
 *
 * `@layer` SARMALAYICISI ÖNEMLİ: katmansız kurallar katmanlı kuralları
 * HER ZAMAN yener, kaynak sırasından bağımsız. Böylece `giris.css`
 * (katmansız) bu satır içi yedeği sessizce ezer ve @media
 * geçersiz kılmaları çalışır. `@layer` desteklemeyen eski tarayıcı
 * bloğu TÜMÜYLE yok sayar → yalnız `giris.css` kalır, yine doğru.
 *
 * KURAL: buraya yalnız GELMEZSE DÜZEN KAYAN kurallar girer. Hareket,
 * ikinci ekran, KURGU kapısı ve reklam penceresi `giris.css`'e aittir.
 * Ortak değerler `giris.css` ile BİREBİR aynı olmalı; birini
 * değiştiren diğerini de değiştirir.
 */

const KURALLAR = [
  /* Ölçüler — satır yükseklikleri MUTLAK, yazı tipinden bağımsız */
  '.af-hk{--hk-font:clamp(2.75rem,min(14.8vw,13.6vh),8.75rem);'+
    '--hk-satir-h:clamp(46px,min(15.5vw,14.3vh),147px);' +
    '--hk-yuklem-font:clamp(1.1rem,min(5.4vw,5.6vh),3.5rem);'+
    '--hk-yuklem-h:clamp(24px,min(6.6vw,6.8vh),74px);' +
    '--hk-ilerleme:0;--hk-plaka:#000;--hk-kadraj:50% 58%;' +
    'position:relative;isolation:isolate;display:flex;flex-direction:column;' +
    'justify-content:center;min-height:calc(100vh - var(--af-ustbar-h,64px));' +
    'min-height:var(--hk-plaka-h,calc(100svh - var(--af-ustbar-h,64px)));overflow:clip;' +
    'background:var(--hk-plaka);color:#fff;--af-metin:#fff;'+
    'padding-block:clamp(16px,3vh,44px) clamp(46px,7.5vh,82px)}',
  '.af-hk--acik{--hk-plaka:#fff;color:#14141f;--af-metin:#14141f;'+
    '--hk-font:clamp(2.25rem,min(9.4vw,9.6vh),6rem);'+
    '--hk-satir-h:clamp(38px,min(9.9vw,10.1vh),101px)}',
  '@media (max-width:700px){.af-hk{--hk-kadraj:50% 62%;'+
    '--hk-satir-h:clamp(50px,max(15.5vw,9.7vh),132px);justify-content:flex-start}'+
    '.af-hk-ic{flex:1 1 auto;display:flex;flex-direction:column;min-height:0}'+
    '.af-hk-oyuk{margin-block:auto}}',

  '.af-hk-giris{--hk-scrub:70svh;--hk-plaka-h:calc(100svh - var(--af-ustbar-h,64px))}',
  '@media (max-width:700px),(max-height:680px){.af-hk-giris{--hk-scrub:40svh}}',
  '@media (min-width:701px) and (min-height:681px){.af-hk-yuva{height:calc(var(--hk-plaka-h) + var(--hk-scrub))}.af-hk-yuva>.af-hk{position:sticky;inset-block-start:var(--af-ustbar-h,64px)}.af-hk--acik{margin-block-start:calc(-.45 * var(--hk-scrub))}}',

  /* Kap */
  '.af-hk-ic{position:relative;z-index:2;width:100%;max-width:1200px;margin-inline:auto;' +
    'padding-inline:clamp(1rem,.55rem + 2vw,3rem)}',

  /* Duvar — blend yığını, alanı dört satırın kutusuna kırpılı */
  '.af-hk-oyuk{display:grid;grid-template-columns:minmax(0,1fr);transform-origin:0 0}',
  '.af-hk-duvar{grid-area:1/1;align-self:start;height:calc(var(--hk-satir-sayi,4) * var(--hk-satir-h));' +
    'position:relative;isolation:isolate;contain:paint}',
  '.af-hk-taban,.af-hk-plan,.af-hk-maske{position:absolute;inset:0;pointer-events:none}',
  '.af-hk-taban,.af-hk-plan{inset:1px}',
  '.af-hk-taban{background:linear-gradient(100deg,#e2541f,#ff8900 50%,#ffcf3b)}',
  '.af-hk--acik .af-hk-taban{background:linear-gradient(100deg,#861500,#b83c13 50%,#c5410f)}',
  '.af-hk-plan{mix-blend-mode:screen}',
  '.af-hk--acik .af-hk-plan{mix-blend-mode:multiply}',
  '.af-hk-plan img,.af-hk-plan video{position:absolute;inset:0;width:100%;height:100%;' +
    'max-width:none;object-fit:cover;object-position:var(--hk-kadraj)}',
  '.af-hk-plan video{opacity:0}',
  '.af-hk-maske{inset:-2px;padding:2px;background:var(--hk-plaka);mix-blend-mode:multiply}',
  '.af-hk--acik .af-hk-maske{mix-blend-mode:screen}',

  /* Satırlar — CLS 0'ın anahtarı */
  '.af-hk-satirlar{margin:0;font-family:var(--af-yazi-baslik);font-size:var(--hk-font);' +
    'font-weight:800;line-height:var(--hk-satir-h);letter-spacing:-.045em;' +
    'text-transform:uppercase;font-synthesis-weight:none}',
  '.af-hk-satir{display:block;height:var(--hk-satir-h);overflow:clip;white-space:nowrap}',
  '.af-hk-i{display:block;line-height:var(--hk-satir-h)}',
  '.af-hk-kucuk{text-transform:lowercase;font-size:.5em;letter-spacing:-.015em;' +
    'font-weight:600;font-style:normal}',
  '.af-hk-yazi{grid-area:1/1;position:relative;z-index:1}',
  '.af-hk-yazi .af-hk-satir--dolu{color:transparent}',
  '.af-hk-maske .af-hk-satirlar{color:var(--hk-plaka)}',
  '.af-hk-maske .af-hk-satir--dolu{color:#fff}',
  '.af-hk--acik .af-hk-maske .af-hk-satir--dolu{color:#000}',
  '@media (max-width:700px){.af-hk-maske .af-hk-satir--dolu[data-ikincil]{color:var(--hk-plaka)}' +
    '.af-hk-yazi .af-hk-satir--dolu[data-ikincil]{color:inherit}}',

  /* Yüklem — kapalı durumu YALNIZ .js-var altında */
  '.af-hk-yuklem{display:block;height:var(--hk-yuklem-h);overflow:clip;white-space:nowrap;' +
    'font-size:var(--hk-yuklem-font);font-weight:600;letter-spacing:-.02em;' +
    'text-transform:none;color:#fff}',
  '.af-hk--acik .af-hk-yuklem{color:#14141f}',
  '.af-hk-yuklem>span{display:block;line-height:var(--hk-yuklem-h)}',
  '.af.js-var .af-hk-yuklem>span{transform:translateY(calc((1 - var(--hk-ilerleme)) * 56%))}',

  /* Mono şerit — genişlik mono, kayma yok */
  '.af-hk-serit{position:relative;display:flex;flex-wrap:wrap;gap:8px 20px;margin:0;padding:0;' +
    'margin-block-start:clamp(20px,3.4vh,40px);font-family:var(--af-yazi-mono);' +
    'font-size:.75rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase}',
  '.af-hk-serit li{margin:0}',
  '.af-hk-serit a{position:relative;display:block;padding-block:4px;' +
    'color:var(--af-metin-3);text-decoration:none}',
  '.af-hk-iz{position:absolute;inset-block-end:0;inset-inline-start:0;width:1px;height:2px;margin:0;opacity:0}',
].join('');

export const GIRIS_KRITIK_CSS = `@layer af-giris-kritik{${KURALLAR}}`;
