import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import { IkonEposta, IkonTelefon } from '@/components/site/Ikonlar';
import { ILETISIM, MARKA, siteAdresi, siteYolu } from '@/lib/site';
import { KVKK_METNI, SON_GUNCELLEME } from '@/lib/site-yasal';
import Ilerleme from '../iletisim/_ortak/Ilerleme';
import Iz from '../iletisim/_ortak/Iz';
import { izYapisalVerisi, type IzOgesi } from '../iletisim/_ortak/kurumsal';
import YasalGovde from '../iletisim/_ortak/YasalGovde';

const YOL = '/kvkk';
const BASLIK = 'KVKK Aydınlatma Metni';
const ACIKLAMA =
  'Ajans Flow iletişim formunda hangi kişisel verileri topladığını, neden işlediğini, ne kadar süre sakladığını ve KVKK kapsamındaki haklarınızı açıklar.';

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  alternates: { canonical: YOL },
  openGraph: {
    type: 'article',
    locale: 'tr_TR',
    url: YOL,
    title: BASLIK,
    description: ACIKLAMA,
  },
  twitter: { card: 'summary_large_image', title: BASLIK, description: ACIKLAMA },
};

const IZ: IzOgesi[] = [
  { ad: 'Ana sayfa', yol: '/' },
  { ad: 'KVKK Aydınlatma Metni', yol: YOL },
];

function yapisalVeri() {
  const kok = siteAdresi();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${kok}${YOL}#sayfa`,
        url: `${kok}${YOL}`,
        name: `${BASLIK} — ${MARKA.ad}`,
        description: ACIKLAMA,
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${kok}/#kurulus` },
      },
      { ...izYapisalVerisi(kok, IZ), '@id': `${kok}${YOL}#iz` },
    ],
  };
}

export default function KvkkSayfasi() {
  return (
    <div className="af-kr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

      <div data-alt-cta-gizle>
        <div className="af-bant af-bant--koyu af-bant--altsiz af-bant--sikis">
          <div className="af-kap">
            <Iz ogeler={IZ} />
          </div>
        </div>

        <Bolum
          bant="koyu"
          sinif="af-bant--ustsuz"
          baslikEtiketi="h1"
          ustEtiket="Yasal metin"
          baslik={BASLIK}
          giris="Bu metin, sitedeki iletişim formunun gerçekte topladığı bilgilere göre yazıldı. Form IP adresinizi saklamıyor; bu yüzden metinde IP’den söz edilmiyor."
          genislik="dar"
          akis="duz"
        >
          <div className="af-sira af-sira--sik">
            <span className="af-mono-etiket af-mono-etiket--vurgu">
              Son güncelleme: {SON_GUNCELLEME}
            </span>
            <span className="af-mono-etiket">6698 sayılı KVKK</span>
          </div>
        </Bolum>
      </div>

      <Bolum bant="beyaz" id="metin" genislik="normal">
        <YasalGovde bolumler={KVKK_METNI} />
      </Bolum>

      <Bolum
        bant="kagit"
        sinif="af-kr-iri"
        ustEtiket="Başvuru"
        baslik="Haklarınızı kullanmak için bize yazın."
        giris="Verilerinizle ilgili her talebi aynı kanaldan alıyoruz; başvurunuza en geç otuz gün içinde dönüş yapılır."
        genislik="dar"
      >
        <div className="af-nap">
          <a href={`mailto:${ILETISIM.eposta}`}>
            <IkonEposta />
            {ILETISIM.eposta}
          </a>
          <a href={ILETISIM.telefonBaglanti}>
            <IkonTelefon />
            {ILETISIM.telefonGorunum}
          </a>
        </div>
        <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
          <Dugme tur="ikincil" href={siteYolu('/gizlilik')}>
            Gizlilik politikası
          </Dugme>
          <Dugme tur="hayalet" href={siteYolu('/iletisim')}>
            İletişim sayfası
          </Dugme>
        </div>
      </Bolum>
      <Ilerleme />
    </div>
  );
}
