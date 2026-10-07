import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import { Ikon, IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { ILETISIM, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { BIRINCIL_CAGRI, hizmetBul, hizmetYolu } from '@/lib/site-icerik';
import {
  REHBER,
  icindekiler,
  kelimeSayisi,
  ilgiliYazilar,
  kumeBul,
  rehberBul,
  rehberYolu,
  sonTarih,
  tarihYaz,
  type RehberYazisi,
} from '@/icerik/rehber';
import Ilerleme from '../../iletisim/_ortak/Ilerleme';
import Isik from '../../iletisim/_ortak/Isik';
import { Plaka } from '../../iletisim/_ortak/Plaka';
import '../sayfa.css';

type Parametre = { yazi: string };

/** Bütün yazılar derleme anında üretilir. */
export function generateStaticParams(): Parametre[] {
  return REHBER.map((y) => ({ yazi: y.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Parametre>;
}): Promise<Metadata> {
  const { yazi: slug } = await params;
  const yazi = rehberBul(slug);
  if (!yazi) {
    return { title: 'Yazı bulunamadı', robots: { index: false, follow: false } };
  }
  const yol = `/rehber/${yazi.slug}`;
  return {
    // seoBaslik zaten "… | Ajans Flow" taşıyor; şablon ikinci kez eklemesin.
    title: { absolute: yazi.seoBaslik },
    description: yazi.ozet,
    keywords: yazi.etiketler,
    alternates: { canonical: yol },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: yol,
      title: yazi.seoBaslik,
      description: yazi.ozet,
      publishedTime: yazi.tarih,
      modifiedTime: sonTarih(yazi),
    },
    twitter: { card: 'summary_large_image', title: yazi.seoBaslik, description: yazi.ozet },
  };
}

/* Yapısal veri: Article + BreadcrumbList. FAQPage KULLANILMAZ. */
function yapisalVeri(yazi: RehberYazisi, kumeAdi: string | undefined) {
  const kok = siteAdresi();
  const adres = `${kok}/rehber/${yazi.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${adres}#yazi`,
        headline: yazi.baslik,
        name: yazi.baslik,
        description: yazi.ozet,
        url: adres,
        mainEntityOfPage: { '@type': 'WebPage', '@id': adres },
        inLanguage: 'tr-TR',
        datePublished: yazi.tarih,
        dateModified: sonTarih(yazi),
        author: { '@id': `${kok}/#kurulus` },
        publisher: { '@id': `${kok}/#kurulus` },
        isPartOf: { '@type': 'Blog', '@id': `${kok}/rehber#rehber` },
        keywords: yazi.etiketler.join(', '),
        ...(kumeAdi ? { articleSection: kumeAdi } : {}),
        wordCount: kelimeSayisi(yazi.govde),
        timeRequired: `PT${yazi.okuma}M`,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#iz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Rehber', item: `${kok}/rehber` },
          { '@type': 'ListItem', position: 3, name: yazi.baslik, item: adres },
        ],
      },
    ],
  };
}

function kademe(i: number): CSSProperties {
  return { ['--i' as string]: i } as CSSProperties;
}

export default async function RehberYazisiSayfasi({ params }: { params: Promise<Parametre> }) {
  const { yazi: slug } = await params;
  const yazi = rehberBul(slug);
  if (!yazi) notFound();

  const kume = kumeBul(yazi.kume);
  const basliklar = icindekiler(yazi.govde);
  const hizmet = hizmetBul(yazi.ilgiliHizmet);
  const oneriler = ilgiliYazilar(yazi, 2);
  const waBaglanti = whatsappBaglantisi(
    `Merhaba, sitenizdeki “${yazi.baslik}” yazısını okudum. İşletmem için konuşabilir miyiz?`,
  );

  return (
    <div className="af-kr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri(yazi, kume?.ad)) }}
      />

      {/* ================================================================
          BAŞLIK — PLAKA
          Yazı sayfasının işi OKUTMAK, bu yüzden plaka tek ve sakin:
          harf kadrajı yok, veri şeridi yok. Ölçek merdiveni iki
          kademeli (devasa başlık → iri ön işaret), künye mono.
          Üst barın altındaki ilerleme çizgisi (0 JS) ne kadar kaldığını
          söyler.
          ================================================================ */}
      <div data-alt-cta-gizle>
        <Plaka dar>
          <nav className="af-rb-iz" aria-label="Site izi">
            <a href={siteYolu('/')}>Ana sayfa</a>
            <span aria-hidden="true">/</span>
            <a href={siteYolu('/rehber')}>Rehber</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{kume?.kisaAd ?? 'Yazı'}</span>
          </nav>

          <p className="af-ust-etiket af-rb-etiket">{kume?.ad ?? 'Rehber'}</p>
          <h1 className="af-rb-yazi-bas">{yazi.baslik}</h1>

          <p className="af-rb-isaret">{yazi.onIsaret}</p>

          <p className="af-rb-kunye af-ust-24">
            <span>
              Yayın: <time dateTime={yazi.tarih}>{tarihYaz(yazi.tarih)}</time>
            </span>
            {yazi.guncelleme ? (
              <>
                <span className="af-rb-kunye-ayrac" aria-hidden="true">
                  ·
                </span>
                <span>
                  Güncelleme: <time dateTime={yazi.guncelleme}>{tarihYaz(yazi.guncelleme)}</time>
                </span>
              </>
            ) : null}
            <span className="af-rb-kunye-ayrac" aria-hidden="true">
              ·
            </span>
            <span>{yazi.okuma} dk okuma</span>
            <span className="af-rb-kunye-ayrac" aria-hidden="true">
              ·
            </span>
            <span>{basliklar.length} bölüm</span>
          </p>

          <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
            <Dugme href={siteYolu(BIRINCIL_CAGRI.href)}>{BIRINCIL_CAGRI.etiket}</Dugme>
            <Dugme tur="ikincil" href={waBaglanti} whatsapp>
              <IkonWhatsApp />
              WhatsApp’tan sorun
            </Dugme>
          </div>
        </Plaka>
      </div>

      {/* ============ İçindekiler + gövde ============ */}
      <Bolum bant="beyaz" id="yazi" sinif="af-rb-govde-bant">
        <div className="af-rb-duzen">
          {basliklar.length ? (
            <nav className="af-rb-icindekiler af-yapiskan" aria-labelledby="af-rb-ic-baslik">
              <p className="af-rb-icindekiler-baslik" id="af-rb-ic-baslik">
                İçindekiler
              </p>
              <ol>
                {basliklar.map((s) => (
                  <li key={s.id} className={s.duzey === 3 ? 'af-rb-ic-alt' : undefined}>
                    <a href={`#${s.id}`}>{s.baslik}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {/* Gövde bu dosyadaki içerik modülünden geliyor; dış girdi yok. */}
          <div
            className="af-metin af-rb-govde"
            dangerouslySetInnerHTML={{ __html: yazi.govde }}
          />
        </div>

        <div className="af-rb-etiketler">
          <div className="af-cipler">
            {yazi.etiketler.map((e) => (
              <span className="af-cip af-cip--mono" key={e}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </Bolum>

      {/* ============ Yazıya özel SSS ============ */}
      {yazi.sss.length ? (
        <Bolum
          bant="kagit"
          id="sss"
          genislik="dar"
          sinif="af-kr-iri"
          ustEtiket="Sık sorulanlar"
          baslik="Bu konuda en çok sorulanlar"
          giris="Cevabını burada bulamadığınız her şeyi doğrudan sorabilirsiniz; aynı gün dönüyoruz."
        >
          <SSS sorular={yazi.sss} grup={`af-sss-${yazi.slug}`} />
        </Bolum>
      ) : null}

      {/* ============ İlgili hizmet ============ */}
      {hizmet ? (
        <Bolum
          bant="beyaz"
          id="hizmet"
          sinif="af-kr-iri"
          ustEtiket="Bu işi biz yapıyoruz"
          baslik={`${hizmet.kisaAd} tarafında ne yapıyoruz`}
          giris="Yazıdaki adımları kendiniz uygulamak isterseniz bu sayfa elinizde kalır. Bizimle yürütmek isterseniz kapsamı birlikte belirliyoruz."
        >
          <article className="af-kart af-kart--genis af-rb-hizmet" data-isik>
            <span className="af-ikon-kutu">
              <Ikon ad={kume?.simge ?? 'kod'} />
            </span>
            <div className="af-yigin af-yigin--sik">
              <h3 className="af-kart-baslik">{hizmet.ad}</h3>
              <p className="af-kart-metin">{hizmet.ozet}</p>
              <ul className="af-tikli">
                {hizmet.neleriKapsar.slice(0, 4).map((k) => (
                  <li key={k}>
                    <IkonTik />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <div className="af-dugmeler af-dugmeler--mobil-blok af-rb-hizmet-dugmeler">
              <Dugme href={hizmetYolu(hizmet)}>Hizmet sayfasını açın</Dugme>
              <Dugme tur="ikincil" href={siteYolu('/calismalar')}>
                Gerçek işleri görün
              </Dugme>
            </div>
            <p className="af-dugme-not af-rb-hizmet-dugmeler">
              Fiyat yazmıyoruz; kapsamı işletmenize göre belirleyip teklif veriyoruz.
            </p>
          </article>
        </Bolum>
      ) : null}

      {/* ============ Sırada ne okunur ============ */}
      {oneriler.length ? (
        <Bolum
          bant="kagit"
          id="devam"
          sinif="af-kr-iri"
          ustEtiket="Sırada"
          baslik="Bunları da okuyun"
          basYani={
            <Dugme tur="ikincil" href={siteYolu('/rehber')}>
              Tüm rehber
            </Dugme>
          }
        >
          <div className="af-izgara af-izgara--2">
            {oneriler.map((o, i) => {
              const oKume = kumeBul(o.kume);
              return (
                <article
                  className="af-kart af-kart--tikla af-rb-kart"
                  key={o.slug}
                  data-isik
                  data-belir
                  style={kademe(i)}
                >
                  <div className="af-rb-kart-ust">
                    <span className="af-mono-etiket">{oKume?.kisaAd ?? 'Rehber'}</span>
                    <span className="af-rb-kunye">{o.okuma} dk okuma</span>
                  </div>
                  <h3 className="af-rb-kart-bas">{o.baslik}</h3>
                  <p className="af-kart-metin">{o.ozet}</p>
                  <p className="af-kart-alt">
                    <span className="af-bag-ok">
                      Yazıyı okuyun
                      <Ikon ad="ok" className="af-rb-ok" />
                    </span>
                  </p>
                  <a className="af-kaplayan-bag" href={rehberYolu(o)}>
                    <span className="af-gizli-metin">{o.baslik}</span>
                  </a>
                </article>
              );
            })}
          </div>
        </Bolum>
      ) : null}

      {/* ============ Ücretsiz analiz ============ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        ustEtiket="Ücretsiz analiz"
        baslik="Bu listeyi sizin işiniz için çıkaralım."
        giris={`Instagram hesabınıza, varsa web sitenize ve Google İşletme Profilinize bakıp eksikleri yazılı paylaşıyoruz. Ücretsiz, bağlayıcı değil. Merkezimiz ${ILETISIM.adres}.`}
        akis="imza"
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-rb-orta-dugmeler">
          <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
            {BIRINCIL_CAGRI.etiket}
          </Dugme>
          <Dugme tur="ikincil" href={waBaglanti} whatsapp>
            <IkonWhatsApp />
            WhatsApp
          </Dugme>
        </div>
        <p className="af-dugme-not">{BIRINCIL_CAGRI.altMetin}</p>
      </Bolum>
      <Ilerleme />
      <Isik />
    </div>
  );
}
