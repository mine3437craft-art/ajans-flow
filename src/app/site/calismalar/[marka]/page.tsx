import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import Video from '@/components/site/Video';
import { CerceveDizustu, CerceveTelefon } from '@/components/site/Cerceve';
import { Ikon, IkonOk, IkonOkSagUst, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import {
  ANA_SAYFA,
  BIRINCIL_CAGRI,
  VAKALAR,
  hizmetYolu,
  medyaYolu,
  sektorYolu,
  vakaBul,
  vakaHizmetleri,
  type Vaka,
} from '@/lib/site-icerik';
import { siteYolu, whatsappBaglantisi } from '@/lib/site';
import Duvar from '../Duvar';
import ImlecIsigi from '../ImlecIsigi';
import VakaKarti from '../VakaKarti';
import { altMetni, type MedyaKaydi } from '../medya';
import {
  CALISMALAR_YOLU,
  alanAdi,
  anahtarKelime,
  bagliIs,
  cihazTuru,
  cumleAyir,
  digerVakalar,
  hizmetIkonu,
  kadrajKlibi,
  kisalt,
  markaYaziVaryanti,
  tamAdres,
  vakaKapagi,
  vakaLogosu,
  vakaMedyasi,
  vakaSektorleri,
} from '../ortak';
import '../sayfa.css';

type Parametre = { params: Promise<{ marka: string }> };

export function generateStaticParams() {
  return VAKALAR.map((v) => ({ marka: v.slug }));
}

/* ------------------------------------------------------------------ */
/* Üst veri                                                            */
/* ------------------------------------------------------------------ */

export async function generateMetadata({ params }: Parametre): Promise<Metadata> {
  const { marka } = await params;
  const vaka = vakaBul(marka);
  if (!vaka) return { title: 'Çalışma bulunamadı', robots: { index: false, follow: true } };

  const yol = `${CALISMALAR_YOLU}/${vaka.slug}`;
  const anaHizmet = vakaHizmetleri(vaka)[0];
  const baslik = anaHizmet ? `${vaka.marka} · ${anaHizmet.kisaAd}` : `${vaka.marka} çalışması`;
  const aciklama = kisalt(vaka.ozet);
  // Paylaşım görseli: kanonik adresle aynı mantık — ziyaretçinin gördüğü yol.
  const kapak = vakaKapagi(vaka);
  const gorseller = kapak
    ? [
        {
          url: `/medya/${kapak.dosya}`,
          width: kapak.genislik,
          height: kapak.yukseklik,
          alt: altMetni(kapak),
        },
      ]
    : undefined;

  return {
    title: baslik,
    description: aciklama,
    alternates: { canonical: yol },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: yol,
      title: `${vaka.marka} — ${vaka.baslik}`,
      description: aciklama,
      images: gorseller,
    },
    twitter: {
      card: 'summary_large_image',
      title: baslik,
      description: aciklama,
      images: gorseller,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Yapısal veri — CreativeWork + BreadcrumbList (FAQPage KULLANILMAZ)   */
/* ------------------------------------------------------------------ */

function yapisalVeri(vaka: Vaka, gorseller: MedyaKaydi[]) {
  const adres = tamAdres(`${CALISMALAR_YOLU}/${vaka.slug}`);
  const kurulus = { '@id': `${tamAdres()}/#kurulus` };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${adres}#calisma`,
        url: adres,
        name: `${vaka.marka} — ${vaka.baslik}`,
        headline: vaka.baslik,
        description: vaka.ozet,
        inLanguage: 'tr-TR',
        creator: kurulus,
        provider: kurulus,
        about: { '@type': 'Organization', name: vaka.marka },
        keywords: vakaHizmetleri(vaka).map((h) => h.ad).join(', '),
        isPartOf: {
          '@type': 'CollectionPage',
          '@id': `${tamAdres(CALISMALAR_YOLU)}#liste`,
          url: tamAdres(CALISMALAR_YOLU),
          name: 'Çalışmalar',
        },
        ...(gorseller.length
          ? { image: gorseller.slice(0, 6).map((g) => tamAdres(`/medya/${g.dosya}`)) }
          : {}),
        ...(vaka.canliBaglanti ? { sameAs: vaka.canliBaglanti } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#yoliz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: tamAdres('/') },
          { '@type': 'ListItem', position: 2, name: 'Çalışmalar', item: tamAdres(CALISMALAR_YOLU) },
          { '@type': 'ListItem', position: 3, name: vaka.marka, item: adres },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* AKIŞ ADIMI — zorluk → yaptıklarımız → teslim                        */
/* Üç adım görsel olarak ayrışır: her birinin kendi bandı, kendi        */
/* numara damgası ve kendi hizası var. Numara damgası `aria-hidden`:    */
/* sıra bilgisi başlığın kendisinde ("Zorluk", "Yaptıklarımız") zaten   */
/* var, ekran okuyucuya "sıfır bir" okutmanın anlamı yok.               */
/* ------------------------------------------------------------------ */

function Adim({
  no,
  etiket,
  baslik,
  children,
  genis,
}: {
  no: string;
  etiket: string;
  baslik: string;
  children: ReactNode;
  genis?: boolean;
}) {
  return (
    <div className={['af-vk-adim', genis ? 'af-vk-adim--genis' : ''].filter(Boolean).join(' ')}>
      <p className="af-vk-adim-damga" aria-hidden="true">
        {no}
      </p>
      <div className="af-vk-adim-bas" data-belir>
        <p className="af-ust-etiket">{etiket}</p>
        <h2 className="af-h2 af-vk-adim-baslik">{baslik}</h2>
      </div>
      <div className="af-vk-adim-govde" data-belir style={{ ['--i' as string]: 1 }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sayfa                                                               */
/* ------------------------------------------------------------------ */

export default async function VakaSayfasi({ params }: Parametre) {
  const { marka } = await params;
  const vaka = vakaBul(marka);
  if (!vaka) notFound();

  const hizmetler = vakaHizmetleri(vaka);
  const sektor = vakaSektorleri(vaka)[0];
  const logo = vakaLogosu(vaka);
  const medya = vakaMedyasi(vaka);
  const zorluk = cumleAyir(vaka.zorluk);
  const teslim = cumleAyir(vaka.sonuc);
  const benzerler = digerVakalar(vaka);
  const kapak = vakaKapagi(vaka);
  const kopru = bagliIs(vaka);
  // Köprü bölümü bir ürün ekranını cihaz çerçevesinde zaten gösteriyorsa
  // aynı kare medya bandında ikinci kez basılmaz.
  const cihazlar = medya.cihazlar.filter((k) => k.dosya !== kopru?.ekran?.dosya);
  const yapisalGorseller = [kapak, ...medya.cihazlar, ...medya.bento.map((g) => g.kayit)].filter(
    (g): g is MedyaKaydi => Boolean(g),
  );

  const medyaParcalari = [
    medya.klipSayi > 0 ? `${medya.klipSayi} klip` : '',
    medya.kareSayi > 0 ? `${medya.kareSayi} kare` : '',
  ].filter(Boolean);

  const waMetni = `Merhaba, sitedeki ${vaka.marka} çalışmanızı gördüm. Benzer bir iş için bilgi almak istiyorum.`;

  return (
    <>
      <YapisalVeri veri={yapisalVeri(vaka, yapisalGorseller)} />

      {/* ============================================================
          PLAKA — markanın tek sözcüklü anahtarı devasa, harf kadrajı
          içinde (yatay klibi olan markada video akar, diğerlerinde
          marka gradyanı). Sayfadaki TEK kadraj burası.
          ============================================================ */}
      <div data-alt-cta-gizle>
        <section
          className="af-vk-plaka af-vk-plaka--vaka"
          data-akis="duz"
          aria-labelledby="af-vk-bas"
        >
          <span className="af-vk-havuz" aria-hidden="true" />
          <span className="af-vk-zerre" aria-hidden="true" />

          <div className="af-vk-plaka-ic">
            <nav className="af-vk-ekmek" aria-label="Yol izi">
              <ol>
                <li>
                  <a href={siteYolu('/')}>Ana sayfa</a>
                </li>
                <li>
                  <a href={siteYolu(CALISMALAR_YOLU)}>Çalışmalar</a>
                </li>
                <li aria-current="page">{vaka.marka}</li>
              </ol>
            </nav>

            <p className="af-ust-etiket af-vk-plaka-etiket">{vaka.sektor}</p>

            <Duvar kelime={anahtarKelime(vaka)} klip={kadrajKlibi(vaka)} sira={0} />

            <div className="af-vk-plaka-alt">
              <div className="af-vk-plaka-metin">
                <h1 className="af-h1 af-vk-plaka-h1" id="af-vk-bas">
                  {vaka.baslik}
                </h1>
                <p className="af-giris af-vk-plaka-giris">{vaka.ozet}</p>

                <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
                  <Dugme href={siteYolu(BIRINCIL_CAGRI.href)} buyuk>
                    Benzer bir iş için yazın
                  </Dugme>
                  {vaka.canliBaglanti ? (
                    <Dugme tur="ikincil" href={vaka.canliBaglanti}>
                      Canlı işi açın
                      <IkonOkSagUst />
                    </Dugme>
                  ) : (
                    <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
                      <IkonWhatsApp />
                      WhatsApp
                    </Dugme>
                  )}
                </div>
              </div>

              <div className="af-vk-plaka-kunye">
                {logo ? (
                  <span className={`af-marka af-vk-hero-logo af-marka--kutu-${logo.ton}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu(logo.kayit.dosya)}
                      alt={`${vaka.marka} logosu`}
                      width={logo.kayit.genislik}
                      height={logo.kayit.yukseklik}
                      decoding="async"
                    />
                  </span>
                ) : (
                  <span
                    className={`af-marka-yazi af-vk-hero-yazi af-marka-yazi--${markaYaziVaryanti(
                      vaka.marka,
                    )}`}
                  >
                    {vaka.marka}
                  </span>
                )}

                <table className="af-veri-tablo">
                  <tbody>
                    <tr>
                      <th scope="row">Marka</th>
                      <td>{vaka.marka}</td>
                    </tr>
                    <tr>
                      <th scope="row">Sektör</th>
                      <td>{sektor ? <a href={sektorYolu(sektor)}>{sektor.ad}</a> : vaka.sektor}</td>
                    </tr>
                    <tr>
                      <th scope="row">Kapsam</th>
                      <td>{hizmetler.map((h) => h.kisaAd).join(' · ')}</td>
                    </tr>
                    {medya.toplam > 0 ? (
                      <tr>
                        <th scope="row">Arşiv</th>
                        <td>{medyaParcalari.join(' · ')}</td>
                      </tr>
                    ) : null}
                    {vaka.canliBaglanti ? (
                      <tr>
                        <th scope="row">Canlı</th>
                        <td>
                          <a href={vaka.canliBaglanti} target="_blank" rel="noopener noreferrer">
                            {alanAdi(vaka.canliBaglanti)}
                          </a>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          01 — ZORLUK (kâğıt bant: müşterinin kendi derdi, insan dili)
          ============================================================ */}
      <Bolum bant="kagit" genislik="dar" sinif="af-vk-akis" akis="duz">
        <Adim no="01" etiket="Zorluk" baslik="İşe başlarken durum neydi?">
          <p className="af-aksan af-vk-aksan-iri">{zorluk.ilk}</p>
          {zorluk.kalan ? <p className="af-giris af-ust-16">{zorluk.kalan}</p> : null}
        </Adim>
      </Bolum>

      {/* ============================================================
          02 — YAPTIKLARIMIZ (beyaz bant: işin içi, numaralı akış)
          ============================================================ */}
      <Bolum bant="beyaz" sinif="af-vk-akis" akis="veri">
        <Adim no="02" etiket="Yaptıklarımız" baslik="İşin içinde ne vardı?" genis>
          <p className="af-mono-etiket af-vk-adim-sayi">
            {vaka.yaptiklarimiz.length} kalem · teslim edilen iş
          </p>
          <ol className="af-vk-adimlar">
            {vaka.yaptiklarimiz.map((madde, i) => (
              <li key={madde} data-vk-isik="">
                <span className="af-vk-isik-havuz" aria-hidden="true" />
                <span className="af-vk-adim-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="af-vk-adim-metin">{madde}</span>
              </li>
            ))}
          </ol>
        </Adim>
      </Bolum>

      {/* ============================================================
          MEDYA — yalnız künyede gerçekten duran dosyalar. Videolar
          sessiz döngüde ve oranı kilitli; kareler bento ızgarasında
          farklı ölçeklerde. Üst kenar kesik (beyaz banda çapraz giriş).
          ============================================================ */}
      {medya.toplam > 0 ? (
        <Bolum
          bant="koyu"
          sinif="af-vk-kesik-ust"
          ustEtiket="Medya"
          baslik="Bu işten kareler"
          giris={`${medyaParcalari.join(' · ')} — hepsi bu iş için ürettiğimiz dosyalar.`}
          akis="kare"
        >
          <div className="af-vk-medya">
            {medya.klipler.length || cihazlar.length ? (
              <div className="af-cihazlar af-vk-cihazlar">
                {medya.klipler.map((klip, i) => (
                  <Video
                    key={klip.kayit.dosya}
                    ad={klip.kayit.dosya}
                    poster={klip.poster}
                    oran={klip.oran}
                    baslik={klip.kayit.baslik ?? vaka.baslik}
                    kunyeGoster
                    sira={i + 1}
                    sinif={`af-vk-video af-vk-video--${klip.oran}`}
                  />
                ))}
                {cihazlar.map((kare) => {
                  const gorsel = (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={medyaYolu(kare.dosya)}
                      alt={altMetni(kare)}
                      width={kare.genislik}
                      height={kare.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                  );
                  return cihazTuru(kare) === 'telefon' ? (
                    <CerceveTelefon key={kare.dosya} altyazi={kare.baslik}>
                      {gorsel}
                    </CerceveTelefon>
                  ) : (
                    <CerceveDizustu key={kare.dosya} altyazi={kare.baslik}>
                      {gorsel}
                    </CerceveDizustu>
                  );
                })}
              </div>
            ) : null}

            {medya.bento.length ? (
              <div className="af-vk-bento">
                {medya.bento.map((goz) => (
                  <figure
                    key={goz.kayit.dosya}
                    className="af-vk-goz"
                    data-vk-sigdir={goz.sigdir ? '' : undefined}
                    style={
                      {
                        gridColumn: `span ${goz.en}`,
                        gridRow: `span ${goz.boy}`,
                      } as React.CSSProperties
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu(goz.kayit.dosya)}
                      alt={altMetni(goz.kayit)}
                      width={goz.kayit.genislik}
                      height={goz.kayit.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                    {goz.kayit.baslik ? (
                      <figcaption className="af-vk-goz-altyazi">{goz.kayit.baslik}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        </Bolum>
      ) : null}

      {/* ============================================================
          03 — TESLİM (kâğıt bant: ne teslim ettik; rakam uydurulmaz)
          Arkada hayalet kelime: dolgu yok, yalnız 1px kontur — 0 bayt.
          ============================================================ */}
      <Bolum bant="kagit" genislik="dar" sinif="af-vk-akis af-vk-akis--teslim" akis="imza">
        <p className="af-vk-hayalet" aria-hidden="true">
          Teslim
        </p>
        <Adim no="03" etiket="Teslim" baslik="Ne teslim ettik?">
          <p className="af-aksan af-vk-aksan-iri">{teslim.ilk}</p>
          {teslim.kalan ? <p className="af-giris af-ust-16">{teslim.kalan}</p> : null}
          <p className="af-dugme-not af-vk-not-dar af-ust-24">{ANA_SAYFA.guven.notlar[2]}</p>
        </Adim>
      </Bolum>

      {/* ============================================================
          BAĞLI İŞ — vakadan çalışan ürüne köprü (Kule → QR demo,
          May Motors → otomotiv yazılımları). Yalnız gerçek sayfalara.
          ============================================================ */}
      {kopru ? (
        <Bolum
          bant="koyu"
          sinif="af-vk-kesik-ust"
          ustEtiket={kopru.ustEtiket}
          baslik={kopru.baslik}
          giris={kopru.giris}
          akis="kare"
        >
          <div className="af-vk-kopru">
            {kopru.ekran ? (
              <div className="af-vk-kopru-ekran" data-belir="olcek">
                {kopru.cerceve === 'telefon' ? (
                  <CerceveTelefon altyazi={kopru.ekran.baslik}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu(kopru.ekran.dosya)}
                      alt={altMetni(kopru.ekran)}
                      width={kopru.ekran.genislik}
                      height={kopru.ekran.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                  </CerceveTelefon>
                ) : (
                  <CerceveDizustu altyazi={kopru.ekran.baslik}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu(kopru.ekran.dosya)}
                      alt={altMetni(kopru.ekran)}
                      width={kopru.ekran.genislik}
                      height={kopru.ekran.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                  </CerceveDizustu>
                )}
              </div>
            ) : null}

            <ul className="af-vk-kopru-liste">
              {kopru.baglantilar.map((b, i) => (
                <li
                  key={b.yol}
                  data-belir
                  data-vk-isik=""
                  style={{ ['--i' as string]: Math.min(i, 6) } as React.CSSProperties}
                >
                  <span className="af-vk-isik-havuz" aria-hidden="true" />
                  <a href={siteYolu(b.yol)} className="af-vk-kopru-bag">
                    <span className="af-vk-kopru-ad">
                      {b.etiket}
                      <IkonOk />
                    </span>
                    {b.ozet ? <span className="af-vk-kopru-ozet">{b.ozet}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Bolum>
      ) : null}

      {/* ============================================================
          KAPSAM — bu işte kullandığımız hizmetler
          ============================================================ */}
      <Bolum
        bant="beyaz"
        ustEtiket="Kapsam"
        baslik="Bu işte kullandığımız hizmetler"
        giris="Her biri ayrı bir hizmet: kapsamını ve nasıl çalıştığımızı hizmet sayfasında anlattık."
      >
        <div className="af-izgara af-izgara--3">
          {hizmetler.map((hizmet, i) => (
            <article
              className="af-kart af-kart--tikla af-vk-hizmet-kart"
              key={hizmet.anahtar}
              data-belir
              data-vk-isik=""
              style={{ ['--i' as string]: Math.min(i, 6) } as React.CSSProperties}
            >
              <span className="af-vk-isik-havuz" aria-hidden="true" />
              <span className="af-ikon-kutu">
                <Ikon ad={hizmetIkonu(hizmet.anahtar)} />
              </span>
              <h3 className="af-kart-baslik">{hizmet.kisaAd}</h3>
              <p className="af-kart-metin">{hizmet.ozet}</p>
              <p className="af-kart-alt">
                <span className="af-bag-ok" aria-hidden="true">
                  İncele
                  <IkonOk />
                </span>
              </p>
              <a className="af-kaplayan-bag" href={hizmetYolu(hizmet)}>
                <span className="af-gizli-metin">{`${hizmet.ad} hizmetini inceleyin`}</span>
              </a>
            </article>
          ))}
        </div>
      </Bolum>

      {/* ============================================================
          DEVAMI — diğer çalışmalar
          ============================================================ */}
      {benzerler.length ? (
        <Bolum
          bant="kagit"
          ustEtiket="Devamı"
          baslik="Diğer çalışmalar"
          basYani={
            <Dugme tur="ikincil" href={siteYolu(CALISMALAR_YOLU)}>
              Tüm çalışmalar
            </Dugme>
          }
        >
          <div className="af-izgara af-izgara--3">
            {benzerler.map((benzer, i) => (
              <VakaKarti key={benzer.slug} vaka={benzer} sira={i} sade belir />
            ))}
          </div>
          <p className="af-ust-24 af-mobil-ozel">
            <Dugme tur="ikincil" href={siteYolu(CALISMALAR_YOLU)} blok>
              Tüm çalışmalar
            </Dugme>
          </p>
        </Bolum>
      ) : null}

      {/* ============================================================
          SON ÇAĞRI
          ============================================================ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        akis="imza"
        ustEtiket="Benzer bir iş"
        baslik="Sizin işinizde ne yapabiliriz?"
        giris={`${vaka.sektor} tarafında ne yaptığımızı okudunuz. Kendi işletmeniz için neyin eksik olduğunu ücretsiz analizde yazılı paylaşıyoruz.`}
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-vk-orta-sira">
          <Dugme href={siteYolu(BIRINCIL_CAGRI.href)} buyuk>
            {BIRINCIL_CAGRI.etiket}
          </Dugme>
          <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
            <IkonWhatsApp />
            WhatsApp’tan yazın
          </Dugme>
        </div>
        <p className="af-dugme-not">{BIRINCIL_CAGRI.altMetin}</p>
      </Bolum>

      <ImlecIsigi />
    </>
  );
}
