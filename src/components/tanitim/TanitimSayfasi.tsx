import type { CSSProperties, JSX } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './tanitim.css';

import type { Iletisim, Kisisel } from './tipler';
import {
  ALT_BILGI,
  ALT_CTA_BAR,
  CALISMALAR,
  CALISMALAR_BOLUMU,
  HERO,
  HIZMETLER,
  HIZMETLER_BOLUMU,
  MARKA,
  MARKA_BANDI,
  MARKALAR,
  NAV,
  NAV_ONERILER,
  NEDEN_BOLUMU,
  NEDEN_KONUM,
  NEDENLER,
  HIZLI_ILETISIM_YALNIZ_INSTAGRAM,
  ONCE_SONRA,
  ONERILER,
  QR_BOLUMU,
  RAKAM_BANDI,
  RAKAMLAR,
  SON_CTA,
  SSS,
  SSS_BOLUMU,
  SUREC,
  SUREC_BOLUMU,
  VIDEO_BOLUMU,
  WHATSAPP_MESAJI,
  sektorCumlesi,
} from './icerik';
import {
  HeroTelefon,
  InstagramKimlik,
  Logo,
  OnceProfil,
  QrKamera,
  SonraProfil,
  VakaGorseli,
  Vizor,
} from './Gorseller';
import {
  HizmetIkonu,
  IkonGrafik,
  IkonInstagram,
  IkonKamera,
  IkonKatman,
  IkonKonum,
  IkonOk,
  IkonOkSagUst,
  IkonSohbet,
  IkonTik,
  IkonWhatsApp,
  IkonYildiz,
} from './Ikonlar';
import Efektler from './Efektler';
import MobilMenu from './MobilMenu';
import OnceSonra from './OnceSonra';
import QrMenu from './QrMenu';
import Sss from './Sss';

/** Başlık yazı tipi: Türkçe karakterler için latin-ext şart. */
const baslikYazisi = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--tn-font-baslik',
  display: 'swap',
});

const KOK_ID = 'tn-kok';

/**
 * JS açıksa animasyon kapısını boyamadan ÖNCE aç (.tn-js). Paket 4 sn
 * içinde yüklenmezse (yavaş uygulama içi tarayıcı) kapıyı geri kapatıp
 * içeriği animasyonsuz göster — hiçbir içerik görünmez kalmasın.
 */
const KAPI_BETIGI = `(function(){var k=document.getElementById('${KOK_ID}');if(!k)return;k.classList.add('tn-js');setTimeout(function(){if(!k.classList.contains('tn-hazir')){k.classList.remove('tn-js');k.classList.add('tn-js-yok');}},4000);})();`;

type Stil = CSSProperties & Record<`--${string}`, string | number>;
const sira = (i: number): Stil => ({ '--i': i });
const iki = (n: number) => String(n).padStart(2, '0');

const DIS = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * Ajans Flow tanıtım sitesi. Sunucu bileşeni: tüm metin SSR'da gelir;
 * istemci tarafı yalnızca efektleri ve küçük etkileşim adacıklarını
 * (menü, kaydırıcı, QR demo, SSS) ekler.
 */
export default function TanitimSayfasi({
  iletisim,
  kisisel = null,
}: {
  iletisim: Iletisim;
  kisisel?: Kisisel | null;
}): JSX.Element {
  /* ---------- Bağlantılar ---------- */
  const igDm = `https://ig.me/m/${iletisim.instagram}`;
  const igProfil = `https://www.instagram.com/${iletisim.instagram}/`;
  const waNumara = iletisim.whatsapp?.replace(/\D/g, '') || null;
  const waMetni = kisisel ? WHATSAPP_MESAJI.kisisel(kisisel.ad) : WHATSAPP_MESAJI.genel;
  const wa = waNumara ? `https://wa.me/${waNumara}?text=${encodeURIComponent(waMetni)}` : null;
  /** "Ücretsiz analiz iste": WhatsApp varsa hazır mesajla oraya, yoksa Instagram DM. */
  const birincil = wa ?? igDm;

  const firsatlar = kisisel?.firsatlar ?? [];
  const firsatVar = firsatlar.length > 0;
  const nav = kisisel ? [firsatVar ? NAV_ONERILER : { ...NAV_ONERILER, etiket: 'Analiz' }, ...NAV] : NAV;
  const heroAciklama = kisisel
    ? `${HERO.kisiselAciklama(kisisel.ad, firsatVar)}${kisisel.sektor ? ` ${sektorCumlesi(kisisel.sektor)}` : ''}`
    : HERO.aciklama;
  const yil = new Date().getFullYear();

  return (
    <div id={KOK_ID} className={`tn ${baslikYazisi.variable}`} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: KAPI_BETIGI }} />
      <a className="tn-atla" href="#tn-icerik">
        İçeriğe geç
      </a>

      {/* ================= Üst bar ================= */}
      <header className="tn-baslik">
        <div className="tn-ilerleme" aria-hidden="true">
          <span data-ilerleme />
        </div>
        <div className="tn-kap tn-baslik-ic">
          <a href="#tn-ust" className="tn-marka" aria-label="Ajans Flow, sayfanın başına dön">
            <Logo />
            <span className="tn-marka-yazi" aria-hidden="true">
              Ajans<b>Flow</b>
            </span>
          </a>
          <nav className="tn-nav" aria-label="Ana menü">
            <ul>
              {nav.map((b) => (
                <li key={b.href}>
                  <a href={b.href}>{b.etiket}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="tn-dugme tn-dugme--birincil tn-dugme--kucuk tn-baslik-cta" href={birincil} {...DIS} data-miknatis>
            Ücretsiz analiz
            <IkonOkSagUst className="tn-dugme-ok" />
          </a>
          <MobilMenu
            kokId={KOK_ID}
            baglantilar={nav}
            instagramDm={igDm}
            instagramProfil={igProfil}
            instagram={iletisim.instagram}
            whatsapp={wa}
          />
        </div>
      </header>

      <main id="tn-icerik">
        {/* ================= Hero ================= */}
        <section
          id="tn-ust"
          className="tn-hero tn-koyu"
          aria-labelledby="tn-hero-baslik"
          data-anim-alan
          data-alt-cta-gizle
        >
          <div className="tn-hero-arka" aria-hidden="true">
            <div className="tn-hero-bloblar" data-parallax="0.16">
              <span className="tn-blob tn-blob--1" />
              <span className="tn-blob tn-blob--2" />
              <span className="tn-blob tn-blob--3" />
            </div>
            <span className="tn-hero-izgara" />
            <span className="tn-gren" />
          </div>

          <div className="tn-kap tn-hero-ic">
            <div className="tn-hero-metin">
              {kisisel ? (
                <a href="#oneriler" className="tn-cip tn-cip--parlak tn-hero-giris" style={sira(0)}>
                  <IkonYildiz className="tn-cip-ikon" />
                  {HERO.kisiselCip}
                </a>
              ) : (
                <p className="tn-cip tn-hero-giris" style={sira(0)}>
                  <span className="tn-canli-nokta" aria-hidden="true" />
                  {HERO.ustEtiket}
                </p>
              )}

              {kisisel && (
                <p className="tn-selam tn-hero-giris" style={sira(1)}>
                  {HERO.kisiselSelam} <b>{kisisel.ad}</b>{' '}
                  <span className="tn-el" aria-hidden="true">
                    👋
                  </span>
                </p>
              )}

              <h1 id="tn-hero-baslik" className="tn-h1">
                {HERO.baslik.map((k, i) => (
                  <span key={k} className={`tn-kelime${i === HERO.baslik.length - 1 ? ' tn-kelime--vurgu' : ''}`}>
                    <span style={sira(i)}>{k}</span>{' '}
                  </span>
                ))}
              </h1>

              <p className="tn-donen-satir tn-hero-giris" style={sira(3)}>
                <span>{HERO.donenOnEk}:</span>
                <span className="tn-donen" aria-hidden="true">
                  {HERO.donenKelimeler.map((k, i) => (
                    <span key={k} style={sira(i)}>
                      {k}
                    </span>
                  ))}
                </span>
                <span className="tn-sr">{HERO.donenKelimeler.join(', ')}</span>
              </p>

              <p className="tn-hero-aciklama tn-hero-giris" style={sira(4)}>
                {heroAciklama}
              </p>

              <div className="tn-hero-cta tn-hero-giris" style={sira(5)}>
                <a className="tn-dugme tn-dugme--birincil tn-dugme--buyuk" href={birincil} {...DIS} data-miknatis>
                  {kisisel ? HERO.kisiselBirincilCta : HERO.birincilCta}
                  <IkonOk className="tn-dugme-ok" />
                </a>
                <a className="tn-dugme tn-dugme--cam tn-dugme--buyuk" href={kisisel ? '#oneriler' : '#calismalar'} data-miknatis>
                  {kisisel ? HERO.kisiselIkincilCta(firsatVar) : HERO.ikincilCta}
                </a>
              </div>

              <ul className="tn-hero-guven tn-hero-giris" style={sira(6)}>
                <li>
                  <a href={igProfil} {...DIS} className="tn-hero-ig">
                    <IkonInstagram className="tn-hero-ig-ikon" />
                    <InstagramKimlik kullanici={iletisim.instagram} />
                  </a>
                </li>
                <li>
                  <b>244+</b> paylaşım
                </li>
                <li>
                  <b>12+</b> marka
                </li>
              </ul>
            </div>

            <div className="tn-hero-gorsel">
              <HeroTelefon />
            </div>
          </div>

          <a href={kisisel ? '#oneriler' : '#markalar'} className="tn-kaydir-ipucu">
            <span className="tn-kaydir-cizgi" aria-hidden="true" />
            {HERO.kaydir}
          </a>
        </section>

        {/* ================= Kişiye özel öneriler ================= */}
        {kisisel && (
          <section id="oneriler" className="tn-bolum tn-oneriler tn-acik" aria-labelledby="tn-oneriler-baslik">
            <div className="tn-kap">
              <div className="tn-bolum-bas" data-reveal>
                <p className="tn-ust-baslik">{ONERILER.ustEtiket}</p>
                <h2 id="tn-oneriler-baslik" className="tn-h2">
                  {ONERILER.baslik(kisisel.ad, firsatVar)}
                </h2>
                {firsatlar.length > 0 && <p className="tn-giris">{ONERILER.aciklama(firsatlar.length)}</p>}
              </div>

              {firsatlar.length > 0 ? (
                <ol className="tn-firsatlar">
                  {firsatlar.map((f, i) => (
                    <li key={f.anahtar} className="tn-firsat-sar" data-reveal style={sira(i % 3)}>
                      <article className="tn-firsat" data-egim>
                        <div className="tn-firsat-ust">
                          <span className="tn-firsat-simge" aria-hidden="true">
                            {f.simge}
                          </span>
                          <span className="tn-firsat-no" aria-hidden="true">
                            {iki(i + 1)}
                          </span>
                        </div>
                        <h3>{f.baslik}</h3>
                        <p>{f.aciklama}</p>
                        <p className="tn-firsat-cozum">
                          <svg className="tn-tik-ciz" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m7.5 12.5 3 3 6-6.5" />
                          </svg>
                          <span>
                            {ONERILER.cozumEtiketi}: <b>{f.hizmet}</b>
                          </span>
                        </p>
                      </article>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="tn-analiz-blok" data-reveal>
                  <div className="tn-analiz-sol">
                    <span className="tn-analiz-rozet">
                      <IkonYildiz />
                    </span>
                    <h3>{ONERILER.bosBaslik}</h3>
                    <p>{ONERILER.bosAciklama}</p>
                  </div>
                  <ul className="tn-tik-liste">
                    {ONERILER.bosMaddeler.map((m) => (
                      <li key={m}>
                        <span className="tn-tik-daire" aria-hidden="true">
                          <IkonTik />
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tn-oneriler-cta" data-reveal>
                <a className="tn-dugme tn-dugme--koyu tn-dugme--buyuk" href={birincil} {...DIS} data-miknatis>
                  {firsatlar.length > 0 ? ONERILER.cta : ONERILER.bosCta}
                  <IkonOk className="tn-dugme-ok" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ================= Marka bandı ================= */}
        <section id="markalar" className="tn-markalar tn-koyu" aria-labelledby="tn-markalar-baslik" data-anim-alan>
          <div className="tn-kap">
            <h2 id="tn-markalar-baslik" className="tn-ust-baslik tn-ust-baslik--orta">
              {MARKA_BANDI.ustEtiket}
            </h2>
          </div>
          <div className="tn-kayan">
            <div className="tn-kayan-serit">
              <MarkaListesi />
              <MarkaListesi gizli />
            </div>
          </div>
          <div className="tn-kayan tn-kayan--ters" aria-hidden="true">
            <div className="tn-kayan-serit">
              <MarkaListesi gizli ters />
              <MarkaListesi gizli ters />
            </div>
          </div>
        </section>

        {/* ================= Hizmetler ================= */}
        <section id="hizmetler" className="tn-bolum tn-hizmetler tn-acik" aria-labelledby="tn-hizmetler-baslik">
          <div className="tn-kap">
            <div className="tn-bolum-bas tn-bolum-bas--iki" data-reveal>
              <div>
                <p className="tn-ust-baslik">{HIZMETLER_BOLUMU.ustEtiket}</p>
                <h2 id="tn-hizmetler-baslik" className="tn-h2">
                  {HIZMETLER_BOLUMU.baslik}
                </h2>
              </div>
              <p className="tn-giris">{HIZMETLER_BOLUMU.aciklama}</p>
            </div>
            <ul className="tn-hizmet-izgara">
              {HIZMETLER.map((h, i) => (
                <li key={h.baslik} data-reveal style={sira(i % 4)}>
                  <article className="tn-hizmet" data-egim>
                    <span className="tn-hizmet-no" aria-hidden="true">
                      {iki(i + 1)}
                    </span>
                    <span className="tn-hizmet-ikon">
                      <HizmetIkonu ad={h.ikon} />
                    </span>
                    <h3>{h.baslik}</h3>
                    <p>{h.aciklama}</p>
                    <span className="tn-hizmet-grup">{h.grup}</span>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= Rakamlar ================= */}
        <section id="rakamlar" className="tn-rakamlar" aria-labelledby="tn-rakamlar-baslik">
          <div className="tn-rakamlar-arka" aria-hidden="true">
            <span data-parallax="-0.12">FLOW</span>
          </div>
          <div className="tn-kap">
            <h2 id="tn-rakamlar-baslik" className="tn-sr">
              Rakamlarla Ajans Flow
            </h2>
            <dl className="tn-rakam-izgara">
              {RAKAMLAR.map((r, i) => (
                <div key={r.etiket} className="tn-rakam" data-reveal style={sira(i)}>
                  <dt>{r.etiket}</dt>
                  <dd>
                    <span data-sayac={r.deger} data-ek={r.ek}>
                      {r.deger}
                      {r.ek}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="tn-rakam-konum" data-reveal>
              <IkonKonum className="tn-rakam-konum-ikon" />
              {RAKAM_BANDI.konumEtiket}: <b>{RAKAM_BANDI.konum}</b>
            </p>
          </div>
        </section>

        {/* ================= Önce / Sonra ================= */}
        <section id="once-sonra" className="tn-bolum tn-os-bolum tn-koyu" aria-labelledby="tn-os-baslik">
          <div className="tn-bolum-arka" aria-hidden="true">
            <span className="tn-isima tn-isima--sol" />
          </div>
          <div className="tn-kap tn-iki-kolon">
            <div data-reveal>
              <p className="tn-ust-baslik">{ONCE_SONRA.ustEtiket}</p>
              <h2 id="tn-os-baslik" className="tn-h2">
                {ONCE_SONRA.baslik}
              </h2>
              <p className="tn-giris">{ONCE_SONRA.aciklama}</p>
              <ul className="tn-tik-liste">
                {ONCE_SONRA.maddeler.map((m) => (
                  <li key={m}>
                    <span className="tn-tik-daire" aria-hidden="true">
                      <IkonTik />
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal="olcek">
              <OnceSonra
                once={<OnceProfil />}
                sonra={<SonraProfil />}
                onceEtiket={ONCE_SONRA.onceEtiket}
                sonraEtiket={ONCE_SONRA.sonraEtiket}
                etiket={ONCE_SONRA.kaydiriciEtiket}
                ipucu={ONCE_SONRA.ipucu}
                srAciklama={ONCE_SONRA.srAciklama}
              />
            </div>
          </div>
        </section>

        {/* ================= QR menü vitrini ================= */}
        <section id="qr-menu" className="tn-bolum tn-qr-bolum tn-acik" aria-labelledby="tn-qr-baslik" data-anim-alan>
          <div className="tn-kap tn-iki-kolon tn-iki-kolon--ters">
            <div data-reveal>
              <p className="tn-ust-baslik">{QR_BOLUMU.ustEtiket}</p>
              <h2 id="tn-qr-baslik" className="tn-h2">
                {QR_BOLUMU.baslik}
              </h2>
              <p className="tn-giris">{QR_BOLUMU.aciklama}</p>
              <ul className="tn-tik-liste">
                {QR_BOLUMU.maddeler.map((m) => (
                  <li key={m}>
                    <span className="tn-tik-daire" aria-hidden="true">
                      <IkonTik />
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
              <div className="tn-bolum-cta">
                <a className="tn-dugme tn-dugme--koyu" href={birincil} {...DIS} data-miknatis>
                  {QR_BOLUMU.cta}
                  <IkonOk className="tn-dugme-ok" />
                </a>
              </div>
              <p className="tn-demo-notu">
                <span className="tn-canli-nokta" aria-hidden="true" />
                {QR_BOLUMU.demoNotu}
              </p>
            </div>
            <div data-reveal="olcek">
              <QrMenu kamera={<QrKamera />} />
            </div>
          </div>
        </section>

        {/* ================= Süreç ================= */}
        <section id="surec" className="tn-bolum tn-surec-bolum tn-koyu" aria-labelledby="tn-surec-baslik">
          <div className="tn-bolum-arka" aria-hidden="true">
            <span className="tn-isima tn-isima--sag" />
          </div>
          <div className="tn-kap tn-surec-duzen">
            <div className="tn-surec-bas" data-reveal>
              <p className="tn-ust-baslik">{SUREC_BOLUMU.ustEtiket}</p>
              <h2 id="tn-surec-baslik" className="tn-h2">
                {SUREC_BOLUMU.baslik}
              </h2>
              <p className="tn-giris">{SUREC_BOLUMU.aciklama}</p>
              <div className="tn-bolum-cta">
                <a className="tn-dugme tn-dugme--birincil" href={birincil} {...DIS} data-miknatis>
                  {HERO.birincilCta}
                  <IkonOk className="tn-dugme-ok" />
                </a>
              </div>
            </div>
            <div className="tn-surec-kutu" data-surec>
              <div className="tn-surec-cizgi" aria-hidden="true">
                <span data-surec-dolgu />
              </div>
              <ol className="tn-surec-liste">
                {SUREC.map((s, i) => (
                  <li key={s.baslik} className="tn-adim" data-adim>
                    <span className="tn-adim-nokta" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="tn-adim-kart" data-reveal>
                      <span className="tn-adim-no">Adım {i + 1}</span>
                      <h3>{s.baslik}</h3>
                      <p>{s.aciklama}</p>
                      <span className="tn-adim-cip">{s.cip}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ================= Çalışmalar ================= */}
        <section id="calismalar" className="tn-bolum tn-calismalar tn-acik" aria-labelledby="tn-calismalar-baslik" data-anim-alan>
          <div className="tn-kap">
            <div className="tn-bolum-bas tn-bolum-bas--iki" data-reveal>
              <div>
                <p className="tn-ust-baslik">{CALISMALAR_BOLUMU.ustEtiket}</p>
                <h2 id="tn-calismalar-baslik" className="tn-h2">
                  {CALISMALAR_BOLUMU.baslik}
                </h2>
              </div>
              <p className="tn-giris">{CALISMALAR_BOLUMU.aciklama}</p>
            </div>

            <div data-reveal>
              <ul
                id="tn-vakalar"
                className="tn-vakalar"
                data-karusel
                tabIndex={0}
                aria-label="Çalışmalarımız, yatay kaydırılabilir liste"
              >
                {CALISMALAR.map((v, i) => (
                  <li key={v.marka} className="tn-vaka-sar" style={sira(i)} data-anim-alan>
                    <article className="tn-vaka" aria-labelledby={`tn-vaka-${v.gorsel}`}>
                      <VakaGorseli tur={v.gorsel} />
                      <div className="tn-vaka-metin">
                        <p className="tn-vaka-marka">
                          <span aria-hidden="true">{iki(i + 1)}</span>
                          {v.marka}
                        </p>
                        <h3 id={`tn-vaka-${v.gorsel}`}>{v.baslik}</h3>
                        <p>{v.aciklama}</p>
                        {v.alinti && <blockquote>“{v.alinti}”</blockquote>}
                        <ul className="tn-etiketler" aria-label="Kapsam">
                          {v.etiketler.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
              <div className="tn-karusel-alt" aria-hidden="true">
                <span className="tn-karusel-cubuk">
                  <i data-karusel-cubuk="tn-vakalar" />
                </span>
                <span className="tn-karusel-sayac" data-karusel-sayac="tn-vakalar">
                  1 / {CALISMALAR.length}
                </span>
                <span className="tn-karusel-ipucu">
                  {CALISMALAR_BOLUMU.kaydirIpucu} <IkonOk className="tn-karusel-ok" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= Video & Drone ================= */}
        <section id="video" className="tn-bolum tn-video tn-koyu" aria-labelledby="tn-video-baslik" data-anim-alan>
          <div className="tn-kap">
            <div className="tn-bolum-bas tn-bolum-bas--iki" data-reveal>
              <div>
                <p className="tn-ust-baslik">{VIDEO_BOLUMU.ustEtiket}</p>
                <h2 id="tn-video-baslik" className="tn-h2">
                  {VIDEO_BOLUMU.baslik}
                </h2>
              </div>
              <p className="tn-giris">{VIDEO_BOLUMU.aciklama}</p>
            </div>
            <div data-reveal="olcek">
              <Vizor altyazi={VIDEO_BOLUMU.vizorAltyazi} />
            </div>
            <div className="tn-video-alt">
              <ul className="tn-tik-liste tn-tik-liste--izgara" data-reveal>
                {VIDEO_BOLUMU.maddeler.map((m) => (
                  <li key={m}>
                    <span className="tn-tik-daire" aria-hidden="true">
                      <IkonTik />
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
              <ul className="tn-video-etiketler" aria-label="Uzmanlık alanları" data-reveal>
                {VIDEO_BOLUMU.etiketler.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= Neden Ajans Flow ================= */}
        <section id="neden" className="tn-bolum tn-neden tn-acik" aria-labelledby="tn-neden-baslik" data-anim-alan>
          <div className="tn-kap">
            <div className="tn-bolum-bas" data-reveal>
              <p className="tn-ust-baslik">{NEDEN_BOLUMU.ustEtiket}</p>
              <h2 id="tn-neden-baslik" className="tn-h2">
                {NEDEN_BOLUMU.baslik}
              </h2>
            </div>

            <div className="tn-bento">
              <article className="tn-bento-kart tn-bento-kart--genis" data-reveal style={sira(0)}>
                <span className="tn-bento-ikon">
                  <IkonKatman />
                </span>
                <h3>{NEDENLER[0].baslik}</h3>
                <p>{NEDENLER[0].aciklama}</p>
                <ul className="tn-bento-cipler" aria-label="Tek çatı altındaki hizmetler">
                  {HIZMETLER.map((h, i) => (
                    <li key={h.kisa} style={sira(i)}>
                      {h.kisa}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="tn-bento-kart tn-bento-kart--ekipman" data-reveal style={sira(1)}>
                <span className="tn-bento-ikon">
                  <IkonKamera />
                </span>
                <h3>{NEDENLER[1].baslik}</h3>
                <p>{NEDENLER[1].aciklama}</p>
                <span className="tn-bento-lens" aria-hidden="true">
                  <i />
                </span>
              </article>

              <article className="tn-bento-kart tn-bento-kart--veri" data-reveal style={sira(0)}>
                <span className="tn-bento-ikon">
                  <IkonGrafik />
                </span>
                <h3>{NEDENLER[2].baslik}</h3>
                <p>{NEDENLER[2].aciklama}</p>
                <span className="tn-bento-cubuklar" aria-hidden="true">
                  {Array.from({ length: 7 }, (_, i) => (
                    <i key={i} style={sira(i)} />
                  ))}
                </span>
              </article>

              <blockquote className="tn-bento-kart tn-bento-alinti" data-reveal style={sira(1)}>
                <IkonYildiz className="tn-bento-alinti-ikon" />
                <p>{NEDEN_BOLUMU.alinti}</p>
                <footer>— {MARKA.ad}</footer>
              </blockquote>

              <article className="tn-bento-kart tn-bento-kart--iletisim" data-reveal style={sira(2)}>
                <span className="tn-bento-ikon">
                  <IkonSohbet />
                </span>
                <h3>{NEDENLER[3].baslik}</h3>
                <p>{wa ? NEDENLER[3].aciklama : HIZLI_ILETISIM_YALNIZ_INSTAGRAM}</p>
                <div className="tn-bento-sohbet" aria-hidden="true">
                  <span className="tn-balon tn-balon--siz">Merhaba! Ücretsiz analiz istiyorum.</span>
                  <span className="tn-balon tn-balon--biz">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </article>

              <article className="tn-bento-kart tn-bento-kart--konum" data-reveal style={sira(0)}>
                <span className="tn-bento-harita" aria-hidden="true">
                  <span className="tn-bento-pin">
                    <IkonKonum />
                  </span>
                </span>
                <div>
                  <h3>{NEDEN_KONUM.baslik}</h3>
                  <p>{NEDEN_KONUM.aciklama}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================= SSS ================= */}
        <section id="sss" className="tn-bolum tn-sss tn-beyaz" aria-labelledby="tn-sss-baslik">
          <div className="tn-kap tn-sss-duzen">
            <div className="tn-sss-bas" data-reveal>
              <p className="tn-ust-baslik">{SSS_BOLUMU.ustEtiket}</p>
              <h2 id="tn-sss-baslik" className="tn-h2">
                {SSS_BOLUMU.baslik}
              </h2>
              <p className="tn-giris">{SSS_BOLUMU.aciklama}</p>
              <div className="tn-bolum-cta">
                <a className="tn-dugme tn-dugme--cizgi" href={igDm} {...DIS}>
                  <IkonInstagram className="tn-dugme-ikon" />
                  {SSS_BOLUMU.cta}
                </a>
              </div>
            </div>
            <div data-reveal>
              <Sss sorular={SSS} />
            </div>
          </div>
        </section>

        {/* ================= Son çağrı ================= */}
        <section id="iletisim" className="tn-son" aria-labelledby="tn-son-baslik" data-anim-alan data-alt-cta-gizle>
          <div className="tn-son-arka" aria-hidden="true">
            <span className="tn-halka tn-halka--1" />
            <span className="tn-halka tn-halka--2" />
            <span className="tn-halka tn-halka--3" />
            <span className="tn-gren" />
          </div>
          <div className="tn-kap tn-son-ic">
            <DonenRozet metin={SON_CTA.rozet} />
            <p className="tn-ust-baslik tn-ust-baslik--orta" data-reveal>
              {SON_CTA.ustEtiket}
            </p>
            <h2 id="tn-son-baslik" className="tn-son-baslik" data-reveal>
              {SON_CTA.baslik}
            </h2>
            <p className="tn-son-aciklama" data-reveal>
              {SON_CTA.aciklama}
            </p>
            <ul className="tn-son-maddeler" data-reveal aria-label="Ücretsiz analizde baktıklarımız">
              {SON_CTA.maddeler.map((m) => (
                <li key={m}>
                  <IkonTik className="tn-son-tik" />
                  {m}
                </li>
              ))}
            </ul>
            <div className="tn-son-dugmeler" data-reveal>
              <a className="tn-dugme tn-dugme--koyu tn-dugme--buyuk" href={birincil} {...DIS} data-miknatis>
                {SON_CTA.analizCta}
                <IkonOk className="tn-dugme-ok" />
              </a>
              {/* WhatsApp numarası yoksa birincil düğme zaten Instagram DM'i açıyor:
                  aynı yere giden ikinci düğme gösterilmez. */}
              {wa && (
                <a className="tn-dugme tn-dugme--beyaz tn-dugme--buyuk" href={igDm} {...DIS} data-miknatis>
                  <IkonInstagram className="tn-dugme-ikon" />
                  {SON_CTA.instagramCta}
                </a>
              )}
              {wa && (
                <a className="tn-dugme tn-dugme--wa tn-dugme--buyuk" href={wa} {...DIS} data-miknatis>
                  <IkonWhatsApp className="tn-dugme-ikon" />
                  {SON_CTA.whatsappCta}
                </a>
              )}
            </div>
            <a className="tn-son-profil" href={igProfil} {...DIS} data-reveal>
              <InstagramKimlik kullanici={iletisim.instagram} />
              <span aria-hidden="true">·</span> {MARKA.konum}
            </a>
          </div>
        </section>
      </main>

      {/* ================= Alt bilgi ================= */}
      <footer className="tn-alt" data-alt-cta-gizle>
        <div className="tn-kap tn-alt-ic">
          <div className="tn-alt-marka">
            <Logo />
            <div>
              <b>{MARKA.ad}</b>
              <p>{ALT_BILGI.slogan}</p>
            </div>
          </div>
          <p className="tn-alt-aciklama">{ALT_BILGI.aciklama}</p>
          <nav aria-label="Alt menü" className="tn-alt-nav">
            <ul>
              {nav.map((b) => (
                <li key={b.href}>
                  <a href={b.href}>{b.etiket}</a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="tn-alt-iletisim">
            <li>
              <a href={igProfil} {...DIS}>
                <IkonInstagram className="tn-alt-ikon" />
                <InstagramKimlik kullanici={iletisim.instagram} />
              </a>
            </li>
            {wa && (
              <li>
                <a href={wa} {...DIS}>
                  <IkonWhatsApp className="tn-alt-ikon" />
                  WhatsApp
                </a>
              </li>
            )}
            <li>
              <span>
                <span aria-hidden="true">📍</span>
                {MARKA.konum}
              </span>
            </li>
          </ul>
        </div>
        <div className="tn-kap tn-alt-son">
          <small>
            © {yil} {MARKA.ad}. Tüm hakları saklıdır.
          </small>
          <a href="#tn-ust">Başa dön ↑</a>
        </div>
        <div className="tn-alt-dev" aria-hidden="true">
          FLOW
        </div>
      </footer>

      {/* ================= Mobil alt çağrı çubuğu ================= */}
      <div className="tn-alt-cta" data-alt-cta>
        <a className="tn-alt-cta-ig" href={igDm} {...DIS}>
          <IkonInstagram className="tn-dugme-ikon" />
          {wa ? ALT_CTA_BAR.instagram : ALT_CTA_BAR.instagramTek}
        </a>
        {wa && (
          <a className="tn-alt-cta-wa" href={wa} {...DIS}>
            <IkonWhatsApp className="tn-dugme-ikon" />
            {ALT_CTA_BAR.whatsapp}
          </a>
        )}
      </div>

      <div className="tn-imlec-isik" data-imlec-isik aria-hidden="true" />
      <Efektler kokId={KOK_ID} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Küçük yardımcı parçalar                                             */
/* ------------------------------------------------------------------ */

function MarkaListesi({ gizli = false, ters = false }: { gizli?: boolean; ters?: boolean }) {
  const liste = ters ? [...MARKALAR.slice(6), ...MARKALAR.slice(0, 6)] : MARKALAR;
  return (
    <ul className="tn-kayan-liste" aria-hidden={gizli || undefined}>
      {liste.map((m) => (
        <li key={m.ad}>
          <span className={`tn-mlogo tn-mlogo--${m.stil}`} lang={m.dil}>
            {m.ad}
          </span>
        </li>
      ))}
    </ul>
  );
}

function DonenRozet({ metin }: { metin: string }) {
  return (
    <div className="tn-rozet" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="tn-rozet-yazi">
        <defs>
          <path id="tn-rozet-yol" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
        </defs>
        <text>
          <textPath href="#tn-rozet-yol" textLength="274" lengthAdjust="spacing">
            {metin.toLocaleUpperCase('tr-TR')}
          </textPath>
        </text>
      </svg>
      <span className="tn-rozet-orta">
        <IkonOkSagUst />
      </span>
    </div>
  );
}
