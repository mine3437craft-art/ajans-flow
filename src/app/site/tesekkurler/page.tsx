import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import {
  IkonEposta,
  IkonInstagram,
  IkonTelefon,
  IkonTik,
  IkonWhatsApp,
} from '@/components/site/Ikonlar';
import { ILETISIM, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { ANA_SAYFA } from '@/lib/site-icerik';
import Isik from '../iletisim/_ortak/Isik';
import { HarfSatiri, Plaka } from '../iletisim/_ortak/Plaka';
import { kademe } from '../iletisim/_ortak/kurumsal';
import './sayfa.css';

const YOL = '/tesekkurler';
const BASLIK = 'Talebiniz bize ulaştı';

export const metadata: Metadata = {
  title: BASLIK,
  description: 'Ücretsiz dijital analiz talebiniz Ajans Flow ekibine ulaştı. Aynı gün içinde size dönüyoruz.',
  alternates: { canonical: YOL },
  // Dönüşüm sonrası sayfa aramada görünmez; sitemap'e de girmiyor.
  robots: { index: false, follow: true },
  openGraph: { type: 'website', locale: 'tr_TR', url: YOL, title: BASLIK },
};

const SIRADAKI = [
  'Talebiniz müşteri takip panelimize aday olarak düştü ve bugünün arama listesine girdi.',
  'Hesaplarınıza bakıp eksikleri ve hızlı kazanımları yazılı bir listeye çeviriyoruz.',
  'Telefonla ulaşamazsak WhatsApp’tan yazıyoruz; numaranızı kaydettiğinizden emin olun.',
];

const BEKLERKEN = [
  {
    baslik: 'Çalışmalar',
    metin:
      'Gerçek markalarda ne yaptığımızı, müşterinin sorunu neydi ve ne teslim ettik diye açıkça yazdık.',
    etiket: 'Çalışmaları gör',
    yol: '/calismalar',
  },
  {
    baslik: 'Rehber',
    metin:
      'QR menü mevzuatından reklam bütçesine kadar, işletme sahibinin sorduğu soruları kaynak göstererek yanıtlıyoruz.',
    etiket: 'Rehbere göz at',
    yol: '/rehber',
  },
  {
    baslik: 'Hakkımızda',
    metin:
      'Çalışma felsefemiz, tek çatı altında ne anlama geldiği ve merkezimiz hakkında kısa bir sayfa.',
    etiket: 'Hakkımızda',
    yol: '/hakkimizda',
  },
];

export default function TesekkurlerSayfasi() {
  const waBaglanti = whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappGenel);

  return (
    <div className="af-kr" data-alt-cta-gizle>
      {/* ================================================================
          PLAKA — kısa ve sıcak.
          Sıcaklık burada görüntüden değil, harflerin İÇİNDEKİ marka
          gradyanından geliyor: `gorsel` kapalı, yani 0 bayt indiriliyor
          ve harfler #E2541F → #FF8900 → #FFCF3B ile doluyor. Dönüşüm
          sonrası sayfada ağ harcamak anlamsız; etki ölçekten geliyor.
          Sayfadaki TEK plaka ve TEK harf kadrajı.
          ================================================================ */}
      <Plaka dar sinif="af-ts-plaka">
        {/* Mono üst etiket BİLİNÇLİ OLARAK YOK: devasa kelimenin kendisi
            zaten "Teşekkürler" diyor; üstüne küçük bir "TEŞEKKÜRLER"
            etiketi koymak aynı kelimeyi iki kez okutmak olurdu. */}
        <HarfSatiri kelime="Teşekkürler" en={6.5} tavan="6.5rem" />
        <h1 className="af-ts-bas">Aldık. Aynı gün içinde dönüyoruz.</h1>
        <p className="af-giris af-ts-giris">
          Formunuz bize ulaştı. Bundan sonrası bizde: hesaplarınıza bakıp ne işe yaradığını, neyin
          boşa gittiğini ve nereden başlanması gerektiğini yazacağız.
        </p>

        <ul className="af-tikli af-ts-liste">
          {SIRADAKI.map((s, i) => (
            <li key={s} data-belir style={kademe(i)}>
              <IkonTik />
              {s}
            </li>
          ))}
        </ul>

        {/* Birincil çağrı Instagram: beklerken yaptığımız işi görmenin en
            hızlı yolu ve ilk görüşmeyi kısaltıyor. */}
        <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-32">
          <Dugme buyuk href={ILETISIM.instagramProfil}>
            <IkonInstagram />
            Instagram’da işlerimize bakın
          </Dugme>
          <Dugme tur="ikincil" href={waBaglanti} whatsapp>
            <IkonWhatsApp />
            Eklemek istediğim bir şey var
          </Dugme>
        </div>
        <p className="af-dugme-not af-ts-not">
          Acelesi olan bir iş varsa WhatsApp’tan yazmanız yeterli; aynı sohbette devam ederiz.
        </p>
      </Plaka>

      {/* ================================================================
          BEKLERKEN — üç kapı, imleç ışıklı
          ================================================================ */}
      <Bolum
        bant="kagit"
        sinif="af-kr-kesik af-kr-iri"
        ustEtiket="Beklerken"
        baslik="Bu arada göz atabileceğiniz yerler"
        giris="Nasıl çalıştığımızı ve hangi işleri yaptığımızı görmek, ilk görüşmeyi kısaltıyor."
        genislik="dar"
      >
        <div className="af-ts-kapilar">
          {BEKLERKEN.map((k, i) => (
            <article
              className="af-kart af-kart--tikla af-ts-kapi"
              key={k.yol}
              data-isik
              data-belir
              style={kademe(i)}
            >
              <h3 className="af-ts-kapi-bas">{k.baslik}</h3>
              <p className="af-kart-metin">{k.metin}</p>
              <p className="af-kart-alt">
                <span className="af-bag-ok">{k.etiket}</span>
              </p>
              <a className="af-kaplayan-bag" href={siteYolu(k.yol)}>
                <span className="af-gizli-metin">{k.baslik} sayfasına git</span>
              </a>
            </article>
          ))}
        </div>

        <div className="af-ts-dogrudan">
          <p className="af-ust-etiket">Doğrudan ulaşmak isterseniz</p>
          <div className="af-nap">
            <a href={ILETISIM.telefonBaglanti}>
              <IkonTelefon />
              {ILETISIM.telefonGorunum}
            </a>
            <a href={`mailto:${ILETISIM.eposta}`}>
              <IkonEposta />
              {ILETISIM.eposta}
            </a>
          </div>
        </div>
      </Bolum>

      <Isik />
    </div>
  );
}
