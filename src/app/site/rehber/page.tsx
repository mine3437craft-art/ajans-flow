import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Bolum, { type Bant } from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import { Ikon, IkonWhatsApp } from '@/components/site/Ikonlar';
import { siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { ANA_SAYFA, BIRINCIL_CAGRI, SSS_GENEL, hizmetBul, hizmetYolu } from '@/lib/site-icerik';
import {
  REHBER,
  REHBER_SAYFASI,
  doluKumeler,
  kumeBul,
  kumeCapasi,
  kumeYazilari,
  rehberSirali,
  rehberYolu,
  tarihYaz,
  type RehberYazisi,
} from '@/icerik/rehber';
import Isik from '../iletisim/_ortak/Isik';
import { Plaka } from '../iletisim/_ortak/Plaka';
import './sayfa.css';

const YOL = '/rehber';

export const metadata: Metadata = {
  title: REHBER_SAYFASI.metaBaslik,
  description: REHBER_SAYFASI.metaAciklama,
  keywords: [...REHBER_SAYFASI.anahtarKelimeler],
  alternates: {
    canonical: YOL,
    types: { 'application/rss+xml': `${YOL}/feed.xml` },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: YOL,
    title: REHBER_SAYFASI.metaBaslik,
    description: REHBER_SAYFASI.metaAciklama,
  },
  twitter: {
    card: 'summary_large_image',
    title: REHBER_SAYFASI.metaBaslik,
    description: REHBER_SAYFASI.metaAciklama,
  },
};

/* Yapısal veri: Blog + yazı listesi + site izi. FAQPage KULLANILMAZ. */
function yapisalVeri() {
  const kok = siteAdresi();
  const adres = `${kok}${YOL}`;
  const yazilar = rehberSirali();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${adres}#rehber`,
        name: 'Ajans Flow Rehber',
        description: REHBER_SAYFASI.metaAciklama,
        url: adres,
        inLanguage: 'tr-TR',
        publisher: { '@id': `${kok}/#kurulus` },
        ...(yazilar.length
          ? {
              blogPost: yazilar.map((y) => ({
                '@type': 'BlogPosting',
                '@id': `${kok}${YOL}/${y.slug}#yazi`,
                headline: y.baslik,
                description: y.ozet,
                url: `${kok}${YOL}/${y.slug}`,
                datePublished: y.tarih,
                dateModified: y.guncelleme ?? y.tarih,
                author: { '@id': `${kok}/#kurulus` },
              })),
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#iz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Rehber', item: adres },
        ],
      },
    ],
  };
}

function kademe(i: number): CSSProperties {
  return { ['--i' as string]: i } as CSSProperties;
}

/**
 * Bant ritmi: aynı renk iki bölüm yan yana gelmesin. Küme kendi bandını
 * tercih eder (koyu = yazılım, kâğıt = stüdyo); çakışırsa nötr banda düşer.
 */
function bantSec(tercih: Bant, onceki: Bant): Bant {
  if (tercih !== onceki) return tercih;
  return onceki === 'beyaz' ? 'kagit' : 'beyaz';
}

/** Liste kartı — kartın tamamı tıklanabilir (görünmez kaplayan bağlantı). */
function YaziKarti({
  yazi,
  sira,
  oneCikan,
}: {
  yazi: RehberYazisi;
  sira: number;
  oneCikan?: boolean;
}) {
  const kume = kumeBul(yazi.kume);
  return (
    <article
      className={['af-kart', 'af-kart--tikla', 'af-rb-kart', oneCikan ? 'af-rb-one-cikan' : '']
        .filter(Boolean)
        .join(' ')}
      data-isik
      data-belir
      style={kademe(sira)}
    >
      <div className="af-rb-kart-ust">
        <span className="af-mono-etiket">{kume?.kisaAd ?? 'Rehber'}</span>
        <span className="af-rb-kunye">
          <span>{tarihYaz(yazi.tarih)}</span>
          <span className="af-rb-kunye-ayrac" aria-hidden="true">
            ·
          </span>
          <span>{yazi.okuma} dk okuma</span>
        </span>
      </div>
      <h3 className="af-rb-kart-bas">{yazi.baslik}</h3>
      <p className="af-rb-kart-isaret">{yazi.onIsaret}</p>
      <p className="af-kart-metin">{yazi.ozet}</p>
      <p className="af-kart-alt">
        <span className="af-bag-ok">
          Yazıyı okuyun
          <Ikon ad="ok" className="af-rb-ok" />
        </span>
      </p>
      <a className="af-kaplayan-bag" href={rehberYolu(yazi)}>
        <span className="af-gizli-metin">{yazi.baslik}</span>
      </a>
    </article>
  );
}

export default function RehberHub() {
  const yazilar = rehberSirali();
  const kumeler = doluKumeler();
  // Dört yazıya kadar "son yazılar" şeridi gereksiz: konu öbekleri yeterli.
  const sonListe = yazilar.length > 4 ? yazilar.slice(0, 4) : [];

  // Bantlar sırayla hesaplanır; hero koyu, "son yazılar" (varsa) beyaz.
  const bastakiBant: Bant = sonListe.length ? 'beyaz' : 'koyu';
  const kumeBantlari: Bant[] = [];
  for (const k of kumeler) {
    kumeBantlari.push(bantSec(k.bant, kumeBantlari.at(-1) ?? bastakiBant));
  }
  // SSS bandı hem son kümeden hem de kapanış çağrısının koyu bandından farklı.
  const sonBant: Bant = kumeBantlari.at(-1) ?? bastakiBant;
  const sssBant: Bant = sonBant === 'kagit' ? 'beyaz' : 'kagit';
  /* Kesik kenar (clip-path) plakadan SONRAKİ ilk banda verilir; hangi
     bölümün basıldığı yazı sayısına göre değişiyor. İçinde yapışkan
     sütun olan bir banda asla verilmez — kesik, kırpma bağlamı kurup
     `position: sticky`'yi bozardı. */
  const kesikHedefi: 'son' | 'bos' | 'kume' = sonListe.length
    ? 'son'
    : yazilar.length
      ? 'kume'
      : 'bos';
  const kesik = (hedef: typeof kesikHedefi, ilk = true) =>
    hedef === kesikHedefi && ilk ? 'af-kr-kesik af-kr-iri' : 'af-kr-iri';
  const waBaglanti = whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappGenel);

  return (
    <div className="af-kr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

      {/* ================================================================
          GİRİŞ — PLAKA (sayfanın tek plakası)
          Harf kadrajı rehberde KULLANILMIYOR: imza seyrek kalsın diye
          kurumsal kanatta yalnız /hakkimizda ve /tesekkurler kullanıyor.
          Buradaki nefes kesen an devasa başlık + kenara dayanan veri
          şeridi; sayfanın işi okutmak.
          ================================================================ */}
      <div data-alt-cta-gizle>
        <Plaka>
          <nav className="af-rb-iz" aria-label="Site izi">
            <a href={siteYolu('/')}>Ana sayfa</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Rehber</span>
          </nav>

          <p className="af-ust-etiket af-rb-etiket">{REHBER_SAYFASI.ustEtiket}</p>
          <h1 className="af-rb-bas">{REHBER_SAYFASI.baslik}</h1>
          <p className="af-giris af-rb-giris">{REHBER_SAYFASI.giris}</p>

          {kumeler.length ? (
            <div className="af-cipler af-rb-cipler">
              {kumeler.map((k) => (
                <a className="af-cip" key={k.anahtar} href={kumeCapasi(k.anahtar)}>
                  {k.kisaAd}
                </a>
              ))}
            </div>
          ) : null}

          {REHBER.length ? (
            <div className="af-veri-serit af-kr-veri-dev af-rb-veri">
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Yazı</span>
                <span className="af-veri-deger">{REHBER.length}</span>
                <span className="af-veri-not">yayında</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Konu</span>
                <span className="af-veri-deger">{kumeler.length}</span>
                <span className="af-veri-not">öbek</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Kaynak</span>
                <span className="af-veri-deger">açık</span>
                <span className="af-veri-not">mevzuat yazılarında</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">RSS</span>
                <span className="af-veri-deger">
                  <a href={siteYolu('/rehber/feed.xml')}>feed.xml</a>
                </span>
                <span className="af-veri-not">takip edin</span>
              </div>
            </div>
          ) : null}
        </Plaka>
      </div>

      {/* ============ Son yazılar ============
          Yazı sayısı azken bu bölüm basılmaz: aşağıdaki konu öbekleri
          hepsini zaten gösteriyor, aynı kartı iki kez basmak istemiyoruz. */}
      {sonListe.length ? (
        <Bolum
          bant="beyaz"
          id="son"
          sinif={kesik('son')}
          ustEtiket="Son yazılar"
          baslik="Yeniden eskiye"
          giris="Her yazının başında tek satırlık bir kısa cevap var; aceleniz varsa onu okumanız yeterli."
        >
          <div className="af-izgara af-izgara--2">
            {sonListe.map((y, i) => (
              <YaziKarti key={y.slug} yazi={y} sira={i} oneCikan={i === 0} />
            ))}
          </div>
        </Bolum>
      ) : null}

      {/* ============ Hiç yazı yoksa: boş durum ============ */}
      {yazilar.length ? null : (
        <Bolum
          bant="beyaz"
          id="son"
          genislik="dar"
          sinif={kesik('bos')}
          ustEtiket="Son yazılar"
          baslik={REHBER_SAYFASI.bosBaslik}
          giris={REHBER_SAYFASI.bosMetin}
        >
          <div className="af-rb-bos">
            <p className="af-mono-etiket">hazırlanıyor</p>
            <p className="af-ikincil-metin">
              Yazılar yayına girdikçe burada listelenecek. Sorunuz bekleyemiyorsa WhatsApp’tan
              yazabilir ya da ücretsiz analiz isteyebilirsiniz.
            </p>
            <div className="af-dugmeler af-dugmeler--mobil-blok">
              <Dugme href={siteYolu(BIRINCIL_CAGRI.href)}>{BIRINCIL_CAGRI.etiket}</Dugme>
              <Dugme tur="ikincil" href={waBaglanti} whatsapp>
                <IkonWhatsApp />
                WhatsApp’tan yazın
              </Dugme>
            </div>
          </div>
        </Bolum>
      )}

      {/* ============ Konu öbekleri ============ */}
      {kumeler.map((kume, k) => {
        const liste = kumeYazilari(kume.anahtar);
        const hizmet = hizmetBul(kume.ilgiliHizmet);
        return (
          <Bolum
            key={kume.anahtar}
            id={kume.anahtar}
            bant={kumeBantlari[k]}
            sinif={kesik('kume', k === 0)}
            ustEtiket={kume.kisaAd}
            baslik={kume.ad}
            giris={kume.aciklama}
            basYani={
              hizmet ? (
                <Dugme tur="ikincil" href={hizmetYolu(hizmet)}>
                  {hizmet.kisaAd} hizmeti
                </Dugme>
              ) : undefined
            }
          >
            <p className="af-rb-sayi">{liste.length} yazı</p>
            <div className="af-izgara af-izgara--2 af-ust-16">
              {liste.map((y, i) => (
                <YaziKarti key={y.slug} yazi={y} sira={i} oneCikan={liste.length === 1} />
              ))}
            </div>
          </Bolum>
        );
      })}

      {/* ============ Sık sorulanlar ============ */}
      <Bolum
        bant={sssBant}
        id="sss"
        genislik="dar"
        sinif="af-kr-iri"
        ustEtiket="Sık sorulanlar"
        baslik="Çalışma biçimimiz hakkında merak edilenler"
        giris="Rehber yazıları bilgilendirme amaçlı; işinize özgü soruları doğrudan sorabilirsiniz."
      >
        <SSS sorular={SSS_GENEL} grup="af-sss-rehber" />
      </Bolum>

      {/* ============ Çağrı ============ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        ustEtiket={ANA_SAYFA.sonCagri.ustEtiket}
        baslik={ANA_SAYFA.sonCagri.baslik}
        giris={ANA_SAYFA.sonCagri.aciklama}
        akis="imza"
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-rb-orta-dugmeler">
          <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
            {ANA_SAYFA.sonCagri.cagri}
          </Dugme>
          <Dugme tur="ikincil" href={waBaglanti} whatsapp>
            <IkonWhatsApp />
            WhatsApp
          </Dugme>
        </div>
      </Bolum>
      <Isik />
    </div>
  );
}
