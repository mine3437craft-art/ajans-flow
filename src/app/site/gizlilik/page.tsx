import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import { IkonEposta } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { ILETISIM, MARKA, siteAdresi, siteYolu } from '@/lib/site';
import { GIZLILIK_METNI, SON_GUNCELLEME } from '@/lib/site-yasal';
import Ilerleme from '../iletisim/_ortak/Ilerleme';
import Iz from '../iletisim/_ortak/Iz';
import { izYapisalVerisi, type IzOgesi } from '../iletisim/_ortak/kurumsal';
import YasalGovde from '../iletisim/_ortak/YasalGovde';

const YOL = '/gizlilik';
const BASLIK = 'Gizlilik Politikası';
const ACIKLAMA =
  'Bu sitede üyelik, ödeme ve reklam takip kodu yok. Hangi bilgiyi neden aldığımızı, çerez kullanmadığımızı ve dış bağlantıların nasıl çalıştığını açıklıyoruz.';

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
  { ad: 'Gizlilik Politikası', yol: YOL },
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

export default function GizlilikSayfasi() {
  return (
    <div className="af-kr">
      <YapisalVeri veri={yapisalVeri()} />

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
          giris="Kısa bir sayfa, çünkü toplanan bilgi az. Sitenin çalışması için gerekli olmayan hiçbir çerez kullanılmıyor; bu yüzden çerez onay penceresi de göstermiyoruz."
          genislik="dar"
          akis="duz"
        >
          <div className="af-sira af-sira--sik">
            <span className="af-mono-etiket af-mono-etiket--vurgu">
              Son güncelleme: {SON_GUNCELLEME}
            </span>
            <span className="af-mono-etiket">takip çerezi yok</span>
            <span className="af-mono-etiket">dış oynatıcı yok</span>
          </div>
        </Bolum>
      </div>

      <Bolum bant="beyaz" id="metin" genislik="normal">
        <YasalGovde bolumler={GIZLILIK_METNI} />
      </Bolum>

      <Bolum
        bant="kagit"
        sinif="af-kr-iri"
        ustEtiket="Sorunuz mu var"
        baslik="Gizlilikle ilgili her şeyi doğrudan sorabilirsiniz."
        genislik="dar"
      >
        <div className="af-nap">
          <a href={`mailto:${ILETISIM.eposta}`}>
            <IkonEposta />
            {ILETISIM.eposta}
          </a>
        </div>
        <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
          <Dugme tur="ikincil" href={siteYolu('/kvkk')}>
            KVKK aydınlatma metni
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
