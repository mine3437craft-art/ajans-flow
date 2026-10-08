import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import { Ikon, IkonOk, IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { ILETISIM, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { sektorBul, sektorYolu, vakaBul, vakaYolu } from '@/lib/site-icerik';
import AkisKaydi from '../_parcalar/AkisKaydi';
import DegerlemeSimulasyonu from '../_parcalar/DegerlemeSimulasyonu';
import IlanUretimi from '../_parcalar/IlanUretimi';
import MuhasebePaneli from '../_parcalar/MuhasebePaneli';
import { ILAN_CIKTILARI, URUNLER, urunBul, type Urun } from '../icerik';
import '../sayfa.css';

const KOK_YOL = '/otomotiv-yazilimlari';

/** Yalnız tanımlı üç alt sayfa; başka slug 404 verir. */
export const dynamicParams = false;

export function generateStaticParams() {
  return URUNLER.map((u) => ({ urun: u.slug }));
}

type Props = { params: Promise<{ urun: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { urun: slug } = await params;
  const urun = urunBul(slug);
  if (!urun) return {};
  const yol = `${KOK_YOL}/${urun.slug}`;
  return {
    title: urun.metaBaslik,
    description: urun.metaAciklama,
    keywords: urun.anahtarKelimeler,
    alternates: { canonical: yol },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: yol,
      title: urun.metaBaslik,
      description: urun.metaAciklama,
    },
    twitter: {
      card: 'summary_large_image',
      title: urun.metaBaslik,
      description: urun.metaAciklama,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Yapısal veri — Service + BreadcrumbList (FAQPage kullanılmaz)      */
/* ------------------------------------------------------------------ */
function yapisalVeri(urun: Urun) {
  const kok = siteAdresi();
  const ust = `${kok}${KOK_YOL}`;
  const adres = `${ust}/${urun.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${adres}#hizmet`,
        name: urun.ad,
        serviceType: 'Otomotiv sektörüne özel yazılım geliştirme',
        description: urun.metaAciklama,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: ILETISIM.sehir,
        audience: { '@type': 'BusinessAudience', name: 'Oto galeriler ve otomotiv işletmeleri' },
        isPartOf: { '@id': `${ust}#hizmet` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#kirintilar`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Otomotiv yazılımları', item: ust },
          { '@type': 'ListItem', position: 3, name: urun.kisaAd, item: adres },
        ],
      },
    ],
  };
}

/** Sayfaya özel çalışan bölüm. */
function Demo({ slug }: { slug: Urun['slug'] }) {
  if (slug === 'arac-degerleme') return <DegerlemeSimulasyonu />;
  if (slug === 'ilan-hazirlama') return <IlanUretimi />;
  return <MuhasebePaneli />;
}

export default async function UrunSayfasi({ params }: Props) {
  const { urun: slug } = await params;
  const urun = urunBul(slug);
  if (!urun) notFound();

  const vaka = vakaBul('may-motors');
  const sektor = sektorBul('oto-galeri');
  const digerleri = URUNLER.filter((u) => u.slug !== urun.slug);

  return (
    <>
      <YapisalVeri veri={yapisalVeri(urun)} />
      <AkisKaydi sektor={sektor?.anahtar ?? 'oto-galeri'} />

      {/* ====================== Kahraman PLAKASI ======================
          Plaka = başlık anı (SITE-GIRIS.md): saf siyah zemin, devasa
          tipografi, tek ışık havuzu + grain `.af-yk-plaka`
          pseudo'larından. Sayfadaki ikinci ve son plaka "çalışan
          örnek" bölümü. */}
      <section className="af-bant af-bant--koyu af-yk-plaka" data-akis="duz" data-alt-cta-gizle>
        <div className="af-kap">
          <nav className="af-cipler" aria-label="Sayfa yolu">
            <a className="af-cip af-cip--mono" href={siteYolu(KOK_YOL)}>
              Otomotiv yazılımları
            </a>
            <span className="af-cip af-cip--mono af-cip--aktif" aria-current="page">
              Halka {urun.no} · {urun.kisaAd}
            </span>
          </nav>

          <div className="af-bolum-bas af-ust-24">
            <p className="af-ust-etiket">{urun.ad} · May Motors için yaptığımız iş</p>
            <h1 className="af-h1 af-oto-h1 af-yk-devasa" data-baslik-ac>
              {urun.h1}
            </h1>
            <p className="af-giris">{urun.giris}</p>
          </div>

          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href="#calisan-ornek">
              Çalışan örneği görün
            </Dugme>
            <Dugme tur="ikincil" href={siteYolu('/iletisim')}>
              Ücretsiz analiz iste
            </Dugme>
          </div>
        </div>
      </section>

      {/* ====================== Sorun ====================== */}
      <Bolum bant="beyaz" id="neden" ustEtiket="Durum" baslik={urun.sorun.baslik} genislik="dar">
        <div className="af-metin">
          {urun.sorun.paragraflar.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Bolum>

      {/* ====================== Ne yaptık ====================== */}
      <Bolum
        bant="kagit"
        id="ne-yaptik"
        ustEtiket="Yaptığımız iş"
        baslik={urun.yaptik.baslik}
        giris={urun.yaptik.giris}
        akis="veri"
      >
        <div className="af-oto-isler">
          {urun.yaptik.maddeler.map((m, i) => (
            <div
              className="af-oto-is"
              key={m.baslik}
              data-belir
              style={{ ['--i' as string]: String(i % 3) } as React.CSSProperties}
            >
              <h3>{m.baslik}</h3>
              <p>{m.metin}</p>
            </div>
          ))}
        </div>
      </Bolum>

      {/* ====================== Çalışan örnek / maket ====================== */}
      <Bolum
        bant="koyu"
        id="calisan-ornek"
        ustEtiket={urun.demo.ustEtiket}
        baslik={urun.demo.baslik}
        giris={urun.demo.giris}
        akis="kare"
        sinif="af-yk-plaka af-yk-kesik"
      >
        <Demo slug={urun.slug} />

        {urun.slug === 'ilan-hazirlama' ? (
          <div className="af-izgara af-izgara--3 af-oto-isik af-ust-48">
            {ILAN_CIKTILARI.map((c) => (
              <article className="af-kart af-kat-2" key={c.baslik} data-belir>
                <h3 className="af-kart-baslik">{c.baslik}</h3>
                <p className="af-kart-metin">{c.metin}</p>
              </article>
            ))}
          </div>
        ) : null}

        <p className="af-dugme-not af-ust-24">{urun.demo.not}</p>
      </Bolum>

      {/* ====================== İlkeler ====================== */}
      <Bolum
        bant="beyaz"
        id="ilkeler"
        ustEtiket="Sınırlar ve ilkeler"
        baslik="Neyi yapıyoruz, neyi iddia etmiyoruz."
        akis="veri"
      >
        <div className="af-izgara af-izgara--2 af-oto-isik">
          {urun.ilkeler.map((i) => (
            <article className="af-kart af-kart--vurgulu" key={i.baslik} data-belir>
              <h3 className="af-kart-baslik">{i.baslik}</h3>
              <p className="af-kart-metin">{i.metin}</p>
            </article>
          ))}
        </div>
      </Bolum>

      {/* ====================== Zincirin kalanı ====================== */}
      <Bolum
        bant="kagit"
        id="zincirin-kalani"
        ustEtiket="Zincirin kalanı"
        baslik="Bu halka tek başına da çalışır, zincirle birlikte daha çok işe yarar."
        giris="Galerinin dijital tarafı dört halkadan oluşuyor. Diğer halkalarda ne yaptığımızı da okuyabilirsiniz."
      >
        <div className="af-izgara af-izgara--3 af-oto-isik">
          {digerleri.map((d) => (
            <article className="af-kart af-kart--tikla" key={d.slug}>
              <span className="af-ikon-kutu">
                <Ikon ad={d.simge} />
              </span>
              <p className="af-oto-halka-no">HALKA {d.no}</p>
              <h3 className="af-kart-baslik">{d.ad}</h3>
              <p className="af-kart-metin">{d.ozet}</p>
              <p className="af-kart-alt">
                <span className="af-bag-ok">
                  Nasıl çalışıyor
                  <IkonOk className="af-oto-ok" />
                </span>
              </p>
              <a className="af-kaplayan-bag" href={siteYolu(`${KOK_YOL}/${d.slug}`)}>
                <span className="af-gizli-metin">{d.ad} sayfasına git</span>
              </a>
            </article>
          ))}
          <article className="af-kart">
            <span className="af-ikon-kutu">
              <IkonTik />
            </span>
            <p className="af-oto-halka-no">HALKA 01</p>
            <h3 className="af-kart-baslik">Zincirin başı: web sitesi</h3>
            <p className="af-kart-metin">
              Talep halkası galerinin kendi sitesinde yaşıyor. Vitrin, &quot;aracını sat&quot; akışı
              ve doğrulamalı form orada duruyor.
            </p>
            <p className="af-kart-alt">
              <a className="af-bag-ok" href={siteYolu(KOK_YOL)}>
                Zincirin tamamı
                <IkonOk className="af-oto-ok" />
              </a>
            </p>
          </article>
        </div>
      </Bolum>

      {/* ====================== SSS ====================== */}
      <Bolum
        bant="beyaz"
        id="sss"
        ustEtiket="Sık sorulanlar"
        baslik={`${urun.kisaAd} tarafında en çok sorulanlar`}
        genislik="dar"
        akis="imza"
      >
        <SSS sorular={urun.sss} grup={`af-oto-${urun.slug}-sss`} />
      </Bolum>

      {/* ====================== Son çağrı ====================== */}
      <Bolum bant="koyu" id="analiz" ustEtiket="Ücretsiz analiz" baslik="Sizin galerinizde nasıl kurulur?" sikis>
        <div className="af-ikili">
          <div className="af-yigin">
            <p className="af-giris">
              Önce ne kullandığınıza ve hangi adımın elinizde kaldığına bakıyoruz. Eksikleri yazılı
              paylaşıyoruz; kapsam onaylanırsa kod yazmadan önce tıklanabilir maketi hazırlıyoruz.
            </p>
            <div className="af-sira af-sira--sik">
              {vaka ? (
                <a className="af-bag-ok" href={vakaYolu(vaka)}>
                  May Motors çalışması
                  <IkonOk className="af-oto-ok" />
                </a>
              ) : null}
              {sektor ? (
                <a className="af-bag-ok" href={sektorYolu(sektor)}>
                  Oto galeri sektör sayfası
                  <IkonOk className="af-oto-ok" />
                </a>
              ) : null}
            </div>
          </div>
          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href={siteYolu('/iletisim')}>
              Ücretsiz analizimi iste
            </Dugme>
            <Dugme
              tur="ikincil"
              href={whatsappBaglantisi(`Merhaba, ${urun.ad} konusunda bilgi almak istiyorum.`)}
              whatsapp
            >
              <IkonWhatsApp />
              WhatsApp
            </Dugme>
          </div>
        </div>
      </Bolum>
    </>
  );
}
