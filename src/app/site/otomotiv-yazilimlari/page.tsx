import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import { CerceveTelefon } from '@/components/site/Cerceve';
import { Ikon, IkonOk, IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { ILETISIM, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  medyaYolu,
  sektorBul,
  sektorYolu,
  vakaBul,
  vakaYolu,
  hizmetBul,
  hizmetYolu,
} from '@/lib/site-icerik';
import AkisKaydi from './_parcalar/AkisKaydi';
import ZincirSema from './_parcalar/ZincirSema';
import ZincirSurucu from './_parcalar/ZincirSurucu';
import { KOK, URUNLER, ZINCIR } from './icerik';
import './sayfa.css';

const YOL = '/otomotiv-yazilimlari';
const SEMA_ID = 'af-oto-zincir';

export const metadata: Metadata = {
  title: KOK.metaBaslik,
  description: KOK.metaAciklama,
  keywords: [
    'oto galeri yazılımı',
    'araç değerleme yazılımı',
    'galeri muhasebe programı',
    'araç ilanı hazırlama',
    'otomotiv yazılım geliştirme',
  ],
  alternates: { canonical: YOL },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: YOL,
    title: KOK.metaBaslik,
    description: KOK.metaAciklama,
  },
  twitter: { card: 'summary_large_image', title: KOK.metaBaslik, description: KOK.metaAciklama },
};

/* ------------------------------------------------------------------ */
/* Yapısal veri — Service + BreadcrumbList (FAQPage kullanılmaz)      */
/* ------------------------------------------------------------------ */
function yapisalVeri() {
  const kok = siteAdresi();
  const adres = `${kok}${YOL}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${adres}#hizmet`,
        name: 'Oto galeri ve otomotiv yazılımı geliştirme',
        serviceType: 'Otomotiv sektörüne özel yazılım geliştirme',
        description: KOK.metaAciklama,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: ILETISIM.sehir,
        audience: { '@type': 'BusinessAudience', name: 'Oto galeriler ve otomotiv işletmeleri' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Galerinin dijital zinciri',
          itemListElement: URUNLER.map((u) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: u.ad,
              description: u.ozet,
              url: `${adres}/${u.slug}`,
            },
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#kirintilar`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Otomotiv yazılımları', item: adres },
        ],
      },
    ],
  };
}

export default function OtomotivYazilimlari() {
  const vaka = vakaBul('may-motors');
  const sektor = sektorBul('oto-galeri');
  const webHizmeti = hizmetBul('web-sitesi');
  const veriHizmeti = hizmetBul('veri-analizi');

  return (
    <>
      <YapisalVeri veri={yapisalVeri()} />
      <AkisKaydi sektor={sektor?.anahtar ?? 'oto-galeri'} />

      {/* ====================== Kahraman PLAKASI ======================
          Yazılım kanadının açılış anı: saf siyah plaka, devasa
          tipografi, tek ışık havuzu ve grain (`.af-yk-plaka`
          pseudo'ları — ek DOM yok). Zincirin dört halkası kart
          ızgarası olarak değil VERİ ŞERİDİ olarak giriyor. */}
      <section
        className="af-bant af-bant--koyu af-yk-plaka"
        data-akis="duz"
        data-alt-cta-gizle
      >
        <div className="af-kap">
          <div className="af-bolum-bas">
            <p className="af-ust-etiket">{KOK.ustEtiket}</p>
            <h1 className="af-h1 af-oto-h1 af-yk-devasa" data-baslik-ac>
              {KOK.h1}
            </h1>
            <p className="af-giris">{KOK.giris}</p>
          </div>

          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href={siteYolu('/iletisim')}>
              Ücretsiz analiz iste
            </Dugme>
            <Dugme
              tur="ikincil"
              href={whatsappBaglantisi(
                'Merhaba, oto galeri için yazılım tarafında bilgi almak istiyorum.',
              )}
              whatsapp
            >
              <IkonWhatsApp />
              WhatsApp&apos;tan yazın
            </Dugme>
          </div>

          <div className="af-veri-serit af-oto-halkalar-serit af-ust-48">
            {ZINCIR.map((d) => (
              <div className="af-veri-oge" key={d.no}>
                <span className="af-veri-etiket">Halka {d.no}</span>
                <span className="af-veri-deger">{d.ad}</span>
                <span className="af-veri-not">{d.kisaNot}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== Zincir şeması ====================== */}
      <Bolum
        bant="beyaz"
        id="zincir"
        ustEtiket="Zincir"
        baslik={KOK.semaBaslik}
        giris={KOK.semaGiris}
        akis="veri"
      >
        <div className="af-ikili">
          <div className="af-yigin af-yigin--genis af-yapiskan af-oto-anlatim">
            <ul className="af-tikli">
              <li>
                <IkonTik />
                Araç bilgisi bir kez giriliyor; değerleme, ilan ve muhasebe aynı kaydı devralıyor.
              </li>
              <li>
                <IkonTik />
                Halkalar arasında bilgi yeniden yazılmadığı için iki ekranda iki farklı rakam
                çıkmıyor.
              </li>
              <li>
                <IkonTik />
                Her halka ayrı ayrı da kurulabiliyor; zincirin tamamını almak zorunda değilsiniz.
              </li>
              <li>
                <IkonTik />
                Talep halkası galerinin kendi web sitesinde yaşıyor, zincir orada başlıyor.
              </li>
            </ul>
            {webHizmeti ? (
              <p>
                <a className="af-bag-ok" href={hizmetYolu(webHizmeti)}>
                  Talep halkası: web sitesi
                  <IkonOk className="af-oto-ok" />
                </a>
              </p>
            ) : null}
          </div>

          <div>
            <ZincirSema id={SEMA_ID} erisimMetni={KOK.semaErisim} />
            <ZincirSurucu hedef={SEMA_ID} durak={ZINCIR.length} />
          </div>
        </div>
      </Bolum>

      {/* ====================== Üç alt sayfa ====================== */}
      <Bolum
        bant="koyu"
        id="halkalar"
        ustEtiket="Yazılım tarafı"
        baslik={KOK.halkalarBaslik}
        giris={KOK.halkalarGiris}
        akis="kare"
        sinif="af-yk-plaka af-yk-kesik"
      >
        <div className="af-izgara af-izgara--3 af-oto-isik">
          {URUNLER.map((u, i) => (
            <article className="af-kart af-kart--tikla" key={u.slug}
              data-belir
              style={{ ['--i' as string]: String(i) } as React.CSSProperties}>
              <span className="af-ikon-kutu">
                <Ikon ad={u.simge} />
              </span>
              <p className="af-oto-halka-no">HALKA {u.no}</p>
              <h3 className="af-kart-baslik">{u.ad}</h3>
              <p className="af-kart-metin">{u.ozet}</p>
              <p className="af-kart-alt">
                <span className="af-bag-ok">
                  Nasıl çalışıyor
                  <IkonOk className="af-oto-ok" />
                </span>
              </p>
              <a className="af-kaplayan-bag" href={siteYolu(`${YOL}/${u.slug}`)}>
                <span className="af-gizli-metin">{u.ad} sayfasına git</span>
              </a>
            </article>
          ))}
        </div>
      </Bolum>

      {/* ====================== Ölçüm halkası ====================== */}
      <Bolum
        bant="beyaz"
        id="olcum"
        ustEtiket={KOK.olcumUstEtiket}
        baslik={KOK.olcumBaslik}
        akis="veri"
      >
        <div className="af-ikili af-oto-isik">
          <div className="af-yigin">
            {KOK.olcumParagraflar.map((p) => (
              <p key={p.slice(0, 24)} className="af-ikincil-metin">
                {p}
              </p>
            ))}
          </div>
          <div className="af-kart af-kart--genis">
            <p className="af-mono-etiket af-mono-etiket--vurgu">Ölçüm zinciri</p>
            <ul className="af-tikli">
              {KOK.olcumMaddeler.map((m) => (
                <li key={m}>
                  <IkonTik />
                  {m}
                </li>
              ))}
            </ul>
            {veriHizmeti ? (
              <p className="af-kart-alt">
                <a className="af-bag-ok" href={hizmetYolu(veriHizmeti)}>
                  Veri analizi ve raporlama
                  <IkonOk className="af-oto-ok" />
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </Bolum>

      {/* ====================== May Motors ====================== */}
      <Bolum
        bant="kagit"
        id="may-motors"
        ustEtiket={KOK.vakaUstEtiket}
        baslik={KOK.vakaBaslik}
        akis="duz"
      >
        <div className="af-ikili af-ikili--esit">
          <div className="af-yigin af-yigin--genis">
            <p className="af-ikincil-metin">{KOK.vakaParagraf}</p>
            {vaka ? (
              <blockquote className="af-alinti">
                <p className="af-aksan">{vaka.ozet}</p>
                <cite>{vaka.marka} · {vaka.sektor}</cite>
              </blockquote>
            ) : null}
            <div className="af-dugmeler">
              {vaka ? (
                <Dugme tur="ikincil" href={vakaYolu(vaka)}>
                  Çalışmayı okuyun
                </Dugme>
              ) : null}
              {sektor ? (
                <Dugme tur="hayalet" href={sektorYolu(sektor)}>
                  Oto galeri sektör sayfası
                </Dugme>
              ) : null}
            </div>
          </div>

          <div className="af-yigin">
            <CerceveTelefon altyazi="Galerinin mobil &quot;aracını sat&quot; akışı — ilk adım">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/maymotors-web-mobil-form.jpg')}
                alt="May Motors sitesinin telefon görünümü: aracını sat akışının model yılı adımı"
                width={739}
                height={1600}
                loading="lazy"
                decoding="async"
              />
            </CerceveTelefon>
            <div className="af-oto-kareler af-oto-kareler--olcekli">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/maymotors-reels-tasarimi.jpg')}
                alt="May Motors için hazırlanan dikey Reels tasarımı: üç adımlı anlatım"
                width={900}
                height={1600}
                loading="lazy"
                decoding="async"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/maymotors-reels-web-tanitimi.jpg')}
                alt="Reels karesi: telefonda galerinin web formunun tanıtımı"
                width={720}
                height={1280}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </Bolum>

      {/* ====================== SSS ====================== */}
      <Bolum
        bant="beyaz"
        id="sss"
        ustEtiket="Sık sorulanlar"
        baslik={KOK.sssBaslik}
        genislik="dar"
        akis="imza"
      >
        <SSS sorular={KOK.sss} grup="af-oto-sss" />
      </Bolum>

      {/* ====================== Son çağrı ====================== */}
      <Bolum bant="koyu" id="analiz" ustEtiket={KOK.sonCagriUstEtiket} baslik={KOK.sonCagriBaslik} sikis>
        <div className="af-ikili">
          <p className="af-giris">{KOK.sonCagriMetin}</p>
          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href={siteYolu('/iletisim')}>
              Ücretsiz analizimi iste
            </Dugme>
            <Dugme tur="ikincil" href={ILETISIM.telefonBaglanti}>
              {ILETISIM.telefonGorunum}
            </Dugme>
          </div>
        </div>
      </Bolum>
    </>
  );
}
