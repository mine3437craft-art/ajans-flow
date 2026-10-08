import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import Video from '@/components/site/Video';
import { CerceveTelefon } from '@/components/site/Cerceve';
import { Ikon, IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { ILETISIM, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  BIRINCIL_CAGRI,
  HIZMETLER,
  hizmetSlugBul,
  hizmetVakalari,
  hizmetYolu,
  ilgiliHizmetleri,
  medyaYolu,
  vakaYolu,
  type Hizmet,
} from '@/lib/site-icerik';
import { HIZMET_SAYISI_YAZI, hizmetGrubu, hizmetIkonu } from '../gruplar';
import { hizmetMedyasi, ilkFotograf } from '../medya';
import '../sayfa.css';

type Parametre = { hizmet: string };

/** On beş hizmet sayfası derleme anında üretilir. */
export function generateStaticParams(): Parametre[] {
  return HIZMETLER.map((h) => ({ hizmet: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Parametre>;
}): Promise<Metadata> {
  const { hizmet: slug } = await params;
  const hizmet = hizmetSlugBul(slug);
  if (!hizmet) {
    return { title: 'Hizmet bulunamadı', robots: { index: false, follow: false } };
  }
  const yol = `/hizmetler/${hizmet.slug}`;
  return {
    // metaBaslik zaten "… | Ajans Flow" taşıyor; şablon ikinci kez eklemesin.
    title: { absolute: hizmet.metaBaslik },
    description: hizmet.metaAciklama,
    keywords: hizmet.anahtarKelimeler,
    alternates: { canonical: yol },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: yol,
      title: hizmet.metaBaslik,
      description: hizmet.metaAciklama,
    },
    twitter: {
      card: 'summary_large_image',
      title: hizmet.metaBaslik,
      description: hizmet.metaAciklama,
    },
  };
}

/* Hizmete bağlı ayrıntılı sayfa varsa hero'da ikinci kapı olarak gösterilir. */
const EK_SAYFA: Record<string, { etiket: string; href: string }> = {
  'qr-menu': { etiket: 'QR menü sayfası ve mevzuat', href: '/qr-menu' },
  'web-sitesi': { etiket: 'Otomotiv yazılımı örneklerimiz', href: '/otomotiv-yazilimlari' },
};

function kademe(i: number): CSSProperties {
  return { ['--i' as string]: i } as CSSProperties;
}

/**
 * Hizmet adını devasa tipografiye hazırlar: son kelime ayrı düğüme
 * geçer ve marka gradyanıyla dolar. Metin DEĞİŞMEZ, yalnız kırılır.
 *
 * Burada blend knockout KULLANILMAZ: 15 hizmetin adı 2-7 kelime ve
 * en uzun kelimesi 21 karaktere kadar çıkıyor ("(Instagram/Facebook),").
 * Knockout `white-space: nowrap` ister; nowrap bir satır kutusundan
 * taşarsa taşan parça `color: transparent` olduğu için GÖRÜNMEZ olur.
 * Akan metinde ise taşma yok, kırılma var. Doluluk marka gradyanından
 * geliyor (`background-clip: text` GRADYANLA her yerde çalışır).
 */
function DevBaslik({
  ad,
  etiket = 'h1',
  boy = 'dev',
}: {
  ad: string;
  etiket?: 'h1' | 'h2' | 'h3';
  /** `dev` hero'da, `orta` bölüm içinde (vaka başlığı gibi). */
  boy?: 'dev' | 'orta';
}) {
  const Etiket = etiket;
  const parcalar = ad.trim().split(/\s+/);
  const son = parcalar.pop() ?? ad;
  return (
    <Etiket className={boy === 'orta' ? 'af-hz-dev af-hz-dev--orta' : 'af-hz-dev'}>
      {parcalar.length ? `${parcalar.join(' ')} ` : ''}
      <span className="af-hz-dev-vurgu">{son}</span>
    </Etiket>
  );
}

/* Yapısal veri: Service + BreadcrumbList. Fiyat alanı YOK. */
function yapisalVeri(hizmet: Hizmet, grupAdi: string | undefined) {
  const kok = siteAdresi();
  const adres = `${kok}/hizmetler/${hizmet.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${adres}#hizmet`,
        name: hizmet.ad,
        serviceType: hizmet.ad,
        description: hizmet.ozet,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: { '@type': 'City', name: ILETISIM.sehir },
        ...(grupAdi ? { category: grupAdi } : {}),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${hizmet.ad} paket kapsamları`,
          itemListElement: hizmet.paket.map((p) => ({
            '@type': 'Offer',
            name: p.ad,
            itemOffered: {
              '@type': 'Service',
              name: `${hizmet.ad} — ${p.ad}`,
              description: p.kapsam.join(' · '),
            },
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#iz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Hizmetler', item: `${kok}/hizmetler` },
          { '@type': 'ListItem', position: 3, name: hizmet.ad, item: adres },
        ],
      },
    ],
  };
}

export default async function HizmetSayfasi({ params }: { params: Promise<Parametre> }) {
  const { hizmet: slug } = await params;
  const hizmet = hizmetSlugBul(slug);
  if (!hizmet) notFound();

  const grup = hizmetGrubu(hizmet.anahtar);
  const heroBant = grup?.bant ?? 'kagit';
  const medya = hizmetMedyasi(hizmet.medya);
  const vakalar = hizmetVakalari(hizmet.anahtar);
  const ilgili = ilgiliHizmetleri(hizmet);
  const ek = EK_SAYFA[hizmet.anahtar];
  const waBaglanti = whatsappBaglantisi(
    `Merhaba, ${hizmet.ad} hizmeti hakkında bilgi almak istiyorum.`,
  );

  // İlgili çalışmalar: ilki BÜYÜK medyayla, kalanlar normal kart.
  const [basVaka, ...otekiVakalar] = vakalar;
  const basVakaFoto = basVaka ? ilkFotograf(basVaka.medya.foto) : undefined;

  // Bant ritmi: aynı renk iki bölüm yan yana gelmesin.
  const sssBant = vakalar.length ? 'beyaz' : 'kagit';
  const ilgiliBant = vakalar.length ? 'kagit' : 'beyaz';

  /* ---- Gövde metni (her hizmette var) ---- */
  const govde = (
    <div className="af-metin">
      {hizmet.aciklama.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );

  /* ---- Yan sütundaki görsel / video ---- */
  let gorsel: ReactNode = null;
  if (medya?.tur === 'video') {
    gorsel = (
      <div className="af-hz-yan">
        <Video
          ad={medya.dosya}
          oran={medya.oran}
          baslik={medya.baslik}
          kunyeGoster
          sinif={medya.oran === 'dikey' ? 'af-hz-dikey' : undefined}
        />
      </div>
    );
  } else if (medya?.tur === 'telefon') {
    gorsel = (
      <div className="af-hz-yan">
        <CerceveTelefon altyazi={medya.altyazi} boy="buyuk">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={medyaYolu(medya.dosya)}
            alt={medya.alt}
            width={medya.genislik}
            height={medya.yukseklik}
            loading="lazy"
            decoding="async"
          />
        </CerceveTelefon>
      </div>
    );
  } else if (medya?.tur === 'gorsel') {
    gorsel = (
      <figure className="af-hz-yan">
        <div className="af-gorsel-kutu" style={{ ['--af-oran' as string]: medya.oran } as CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={medyaYolu(medya.dosya)}
            alt={medya.alt}
            width={medya.genislik}
            height={medya.yukseklik}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="af-cerceve-altyazi">{medya.altyazi}</figcaption>
      </figure>
    );
  } else if (medya?.tur === 'logo') {
    gorsel = (
      <figure className="af-hz-yan">
        <div className="af-hz-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={medyaYolu(medya.dosya)}
            alt={medya.alt}
            width={medya.genislik}
            height={medya.yukseklik}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="af-cerceve-altyazi">{medya.altyazi}</figcaption>
      </figure>
    );
  }

  return (
    <>
      <YapisalVeri veri={yapisalVeri(hizmet, grup?.ad)} />

      {/* ============ Site izi + hero: DEVASA TİPOGRAFİ ============ */}
      <div data-alt-cta-gizle>
        <div className={`af-bant af-bant--${heroBant} af-bant--altsiz af-bant--sikis`}>
          <div className="af-kap">
            <nav className="af-hz-iz">
              <a href={siteYolu('/')}>Ana sayfa</a>
              <span aria-hidden="true">/</span>
              <a href={siteYolu('/hizmetler')}>Hizmetler</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{hizmet.kisaAd}</span>
            </nav>
          </div>
        </div>

        {/* Bolum KULLANILMIYOR: hero'nun başlığı normal `.af-h1` değil,
            devasa tipografi. Grain + tek ışık havuzu `af-hz-doku`
            tarafından basılıyor (tek ::before + tek ::after, 0 istek). */}
        <section
          className={`af-bant af-bant--${heroBant} af-bant--ustsuz af-hz-doku af-hz-hero-detay`}
          data-akis="duz"
        >
          <div className="af-kap">
            <div data-belir>
              <p className="af-ust-etiket">{grup?.ad ?? 'Hizmet'}</p>
              <DevBaslik ad={hizmet.ad} etiket="h1" />
              <p className="af-giris af-ust-24">{hizmet.ozet}</p>
            </div>

            {/* Sayfanın künyesi: nerede ne kadar yazılı olduğu tek satırda */}
            <p className="af-hz-kunye af-ust-24" data-belir>
              <span>{hizmet.neleriKapsar.length} kapsam maddesi</span>
              <span>{hizmet.surec.length} adımlı süreç</span>
              <span>{hizmet.paket.length} kapsam seçeneği</span>
              {hizmet.sss.length ? <span>{hizmet.sss.length} sık sorulan</span> : null}
            </p>

            <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-32">
              <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
                {BIRINCIL_CAGRI.etiket}
              </Dugme>
              <Dugme tur="ikincil" href={waBaglanti} whatsapp>
                <IkonWhatsApp />
                WhatsApp’tan yazın
              </Dugme>
              {ek ? (
                <Dugme tur="hayalet" href={siteYolu(ek.href)}>
                  {ek.etiket}
                  <Ikon ad="ok" className="af-hz-ok" />
                </Dugme>
              ) : null}
            </div>
            <p className="af-dugme-not">{BIRINCIL_CAGRI.altMetin}</p>
          </div>
        </section>
      </div>

      {/* ============ Bu iş nasıl bir iş ============ */}
      <Bolum
        bant="beyaz"
        id="anlatim"
        sinif="af-hz-iri-bas"
        ustEtiket="Ne yapıyoruz"
        baslik={`${hizmet.kisaAd} tarafında ne yapıyoruz?`}
        genislik={gorsel ? 'normal' : 'dar'}
      >
        {gorsel ? (
          <div className="af-ikili">
            {govde}
            {gorsel}
          </div>
        ) : (
          govde
        )}
      </Bolum>

      {/* ============ Neleri kapsar — NUMARALI VERİ ŞERİDİ ============
          Kart içinde tikli bir yığın değil: mono sıra · ince çizgi ·
          madde. Uzun liste böyle taranabiliyor. */}
      <Bolum
        bant="kagit"
        id="kapsam"
        sinif="af-hz-iri-bas af-hz-doku"
        ustEtiket="Kapsam"
        baslik="Bu hizmette neler var?"
        giris="Aşağıdaki maddeler paket kapsamına göre değişebilir; teklifte hangilerinin dahil olduğunu tek tek yazıyoruz."
        akis={grup?.akis ?? 'duz'}
      >
        <ol className="af-hz-serit">
          {hizmet.neleriKapsar.map((madde, i) => (
            <li key={`${i}-${madde}`} data-belir="solma" style={kademe(i)}>
              <span className="af-hz-serit-no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{madde}</span>
            </li>
          ))}
        </ol>
      </Bolum>

      {/* ============ Kimin için ============ */}
      <Bolum
        bant="beyaz"
        id="kimin-icin"
        sinif="af-hz-iri-bas"
        ustEtiket="Kimin için"
        baslik="Bu hizmet şu işletmelerde işe yarıyor."
        giris="Listede kendinizi görmüyorsanız da yazın: ücretsiz analizde bu hizmetin size gerekli olup olmadığını açıkça söylüyoruz."
      >
        <div className="af-izgara af-izgara--3">
          {hizmet.kimeGore.map((madde, i) => (
            <article
              className="af-kart af-kart--veri af-hz-isikli"
              key={`${i}-${madde}`}
              data-belir
              style={kademe(i)}
            >
              <span className="af-hz-sayi" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="af-kart-metin">{madde}</p>
            </article>
          ))}
        </div>
      </Bolum>

      {/* ============ Süreç — kaydırmaya bağlı çizgi ============
          Çizgi `animation-timeline: view()` ile kaydırmayla dolar;
          desteklemeyen tarayıcıda TAM DOLU durur (bilgi kaybı yok). */}
      <Bolum
        bant="koyu"
        id="surec"
        sinif="af-hz-iri-bas"
        ustEtiket="Süreç"
        baslik="Hangi adımda ne olduğunu baştan biliyorsunuz."
        giris="Her adımda sizden ne isteyeceğimizi ve ne teslim edeceğimizi söylüyoruz; sürpriz çıkarmıyoruz."
        akis="veri"
      >
        <ol className="af-hz-surec">
          {hizmet.surec.map((adim, i) => (
            <li key={adim.adim} data-belir style={kademe(i)}>
              <span className="af-hz-adim-no" aria-hidden="true">
                {String(adim.adim).padStart(2, '0')}
              </span>
              <h3 className="af-hz-adim-baslik">{adim.baslik}</h3>
              <p className="af-hz-adim-metin">{adim.aciklama}</p>
            </li>
          ))}
        </ol>
      </Bolum>

      {/* ============ Paketler — KARŞILAŞTIRMA KARTI, FİYAT YOK ============ */}
      <Bolum
        bant="beyaz"
        id="paketler"
        sinif="af-hz-iri-bas"
        ustEtiket="Paket kapsamları"
        baslik="Sitede fiyat yazmıyoruz; kapsamı yazıyoruz."
        giris="Fiyat; kaç platform yönetileceğine, ayda kaç içerik üretileceğine ve çekim günü olup olmadığına göre değişiyor. Kapsamı birlikte netleştirip net bir teklif gönderiyoruz."
      >
        <div
          className="af-hz-kiyas"
          data-belir
          style={{ ['--hz-paket' as string]: hizmet.paket.length } as CSSProperties}
        >
          {hizmet.paket.map((paket, i) => (
            <div
              className={['af-hz-kiyas-kolon', i === 1 ? 'af-hz-kiyas-kolon--vurgulu' : '']
                .filter(Boolean)
                .join(' ')}
              key={paket.ad}
            >
              <div className="af-hz-kiyas-bas">
                <h3>{paket.ad}</h3>
                <span className="af-hz-kiyas-kalem">{paket.kapsam.length} kalem</span>
              </div>
              <ul className="af-tikli af-hz-kiyas-govde">
                {paket.kapsam.map((k, j) => (
                  <li key={`${j}-${k}`}>
                    <IkonTik />
                    {k}
                  </li>
                ))}
              </ul>
              <div className="af-hz-kiyas-alt">
                <Dugme tur="ikincil" blok href={siteYolu(BIRINCIL_CAGRI.href)}>
                  Bu kapsam için teklif isteyin
                </Dugme>
              </div>
            </div>
          ))}
        </div>
        <p className="af-dugme-not af-ust-24">
          Reklam bütçesi her durumda hizmet bedelinden ayrıdır. Paket adları sabit bir liste değil;
          kapsam işletmenize göre eklenip çıkarılabilir. Üç kapsamın maddeleri birbirinin üst kümesi
          değildir — her biri kendi başına okunur.
        </p>
      </Bolum>

      {/* ============ İlgili çalışmalar — ilki BÜYÜK medyayla ============ */}
      {basVaka ? (
        <Bolum
          bant="kagit"
          id="calismalar"
          sinif="af-hz-iri-bas af-hz-doku"
          ustEtiket="Çalışmalar"
          baslik={`${hizmet.kisaAd} işini yaptığımız markalar`}
          giris="Her işte müşterinin sorunu neydi, biz ne yaptık ve ne teslim ettik; hepsini açıkça yazdık."
          basYani={
            <Dugme tur="ikincil" href={siteYolu('/calismalar')}>
              Tüm çalışmalar
            </Dugme>
          }
        >
          <div className="af-hz-vaka-dev" data-belir="olcek">
            {basVakaFoto ? (
              <figure
                className="af-hz-vaka-dev-medya"
                style={
                  {
                    ['--af-oran' as string]: `${basVakaFoto.genislik} / ${basVakaFoto.yukseklik}`,
                  } as CSSProperties
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={medyaYolu(basVakaFoto.dosya)}
                  alt={basVakaFoto.alt}
                  width={basVakaFoto.genislik}
                  height={basVakaFoto.yukseklik}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ) : null}
            <div className="af-hz-vaka-dev-govde">
              <p className="af-mono-etiket">{basVaka.sektor}</p>
              <DevBaslik ad={basVaka.marka} etiket="h3" boy="orta" />
              <p className="af-giris">{basVaka.ozet}</p>
              <p>
                <a className="af-bag-ok" href={vakaYolu(basVaka)}>
                  {`${basVaka.marka} çalışmasını okuyun`}
                  <Ikon ad="ok" className="af-hz-ok" />
                </a>
              </p>
            </div>
          </div>

          {otekiVakalar.length ? (
            <div className="af-izgara af-izgara--3 af-ust-48">
              {otekiVakalar.map((vaka, i) => {
                const foto = ilkFotograf(vaka.medya.foto);
                return (
                  <article
                    className="af-kart af-kart--tikla af-hz-isikli"
                    key={vaka.slug}
                    data-isik
                    data-belir
                    style={kademe(i)}
                  >
                    {foto ? (
                      <div className="af-kart-gorsel af-hz-vaka-gorsel">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={medyaYolu(foto.dosya)}
                          alt={foto.alt}
                          width={foto.genislik}
                          height={foto.yukseklik}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : null}
                    <p className="af-mono-etiket">{vaka.sektor}</p>
                    <h3 className="af-kart-baslik">{vaka.marka}</h3>
                    <p className="af-kart-metin">{vaka.ozet}</p>
                    <p className="af-kart-alt">
                      <span className="af-bag-ok" aria-hidden="true">
                        Çalışmayı oku
                        <Ikon ad="ok" />
                      </span>
                    </p>
                    <a className="af-kaplayan-bag" href={vakaYolu(vaka)}>
                      <span className="af-gizli-metin">
                        {`${vaka.marka} — ${vaka.baslik} çalışmasını okuyun`}
                      </span>
                    </a>
                  </article>
                );
              })}
            </div>
          ) : null}
        </Bolum>
      ) : null}

      {/* ============ Hizmete özel SSS ============ */}
      {hizmet.sss.length ? (
        <Bolum
          bant={sssBant}
          id="sss"
          genislik="dar"
          sinif="af-hz-iri-bas"
          ustEtiket="Sık sorulanlar"
          baslik={`${hizmet.kisaAd} hakkında merak edilenler`}
          giris="Cevabını burada bulamadığınız her şeyi doğrudan sorabilirsiniz; aynı gün dönüyoruz."
        >
          <SSS sorular={hizmet.sss} grup={`af-sss-${hizmet.slug}`} />
        </Bolum>
      ) : null}

      {/* ============ İlgili hizmetler ============ */}
      {ilgili.length ? (
        <Bolum
          bant={ilgiliBant}
          id="ilgili"
          sinif="af-hz-iri-bas"
          ustEtiket="Birlikte iyi çalışıyor"
          baslik="Bu hizmetin yanında sık istenenler"
          giris="Hepsini birden almak zorunda değilsiniz; hangisinin sırada olduğunu analizde birlikte belirliyoruz."
        >
          <div className="af-izgara af-izgara--2">
            {ilgili.map((h, i) => (
              <a
                className="af-hz-bag-kart af-hz-isikli"
                href={hizmetYolu(h)}
                key={h.anahtar}
                data-isik
                data-belir
                style={kademe(i)}
              >
                <Ikon ad={hizmetIkonu(h.anahtar)} />
                {h.ad}
                <Ikon ad="ok" className="af-hz-ok" />
              </a>
            ))}
          </div>
          <p className="af-ust-24">
            <a className="af-bag-ok" href={siteYolu('/hizmetler')}>
              {`${HIZMET_SAYISI_YAZI} hizmetin tamamını görün`}
              <Ikon ad="ok" className="af-hz-ok" />
            </a>
          </p>
        </Bolum>
      ) : null}

      {/* ============ Çağrı ============ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        sinif="af-hz-iri-bas"
        ustEtiket="Ücretsiz analiz"
        baslik={`${hizmet.kisaAd} size gerekli mi, önce bakalım.`}
        giris="Instagram hesabınıza, varsa web sitenize ve Google İşletme Profilinize bakıp eksikleri yazılı paylaşıyoruz. Ücretsiz, bağlayıcı değil."
        akis="imza"
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-hz-orta-dugmeler">
          <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
            {BIRINCIL_CAGRI.etiket}
          </Dugme>
          <Dugme tur="ikincil" href={waBaglanti} whatsapp>
            <IkonWhatsApp />
            WhatsApp
          </Dugme>
        </div>
      </Bolum>
    </>
  );
}
