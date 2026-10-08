import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import {
  IkonEposta,
  IkonInstagram,
  IkonKalkan,
  IkonKonum,
  IkonTelefon,
  IkonWhatsApp,
} from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { EKSIKLER, SEKTORLER as PANEL_SEKTORLERI } from '@/lib/adaylar';
import { ILETISIM, MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { ANA_SAYFA } from '@/lib/site-icerik';
import Iz from './_ortak/Iz';
import Isik from './_ortak/Isik';
import { Plaka } from './_ortak/Plaka';
import { izYapisalVerisi, kademe, type IzOgesi } from './_ortak/kurumsal';
import { panelSektoru } from './akis-durumu';
import TalepFormu from './TalepFormu';
import './sayfa.css';

const YOL = '/iletisim';
const BASLIK = 'İletişim ve Ücretsiz Analiz';
const ACIKLAMA =
  'Ajans Flow ile iletişime geçin: form, WhatsApp, Instagram DM, telefon ve e-posta. İstanbul 4.Levent. Ücretsiz dijital analiz talebi aynı gün yanıtlanır.';

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: ['Ajans Flow iletişim', 'dijital ajans İstanbul iletişim', 'ücretsiz dijital analiz talebi'],
  alternates: { canonical: YOL },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: YOL,
    title: BASLIK,
    description: ACIKLAMA,
  },
  twitter: { card: 'summary_large_image', title: BASLIK, description: ACIKLAMA },
};

const IZ: IzOgesi[] = [
  { ad: 'Ana sayfa', yol: '/' },
  { ad: 'İletişim', yol: YOL },
];

/* Yapısal veri: ContactPage + BreadcrumbList. FAQPage KULLANILMAZ. */
function yapisalVeri() {
  const kok = siteAdresi();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${kok}${YOL}#sayfa`,
        url: `${kok}${YOL}`,
        name: `${MARKA.ad} — İletişim`,
        description: ACIKLAMA,
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${kok}/#kurulus` },
        about: { '@id': `${kok}/#isletme` },
        mainEntity: {
          '@type': 'Organization',
          '@id': `${kok}/#kurulus`,
          name: MARKA.ad,
          email: ILETISIM.eposta,
          telephone: ILETISIM.telefonBaglanti.replace('tel:', ''),
          sameAs: [ILETISIM.instagramProfil],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'sales',
              telephone: ILETISIM.telefonBaglanti.replace('tel:', ''),
              email: ILETISIM.eposta,
              availableLanguage: ['tr'],
              areaServed: 'TR',
            },
          ],
        },
      },
      { ...izYapisalVerisi(kok, IZ), '@id': `${kok}${YOL}#iz` },
    ],
  };
}

/* Formun seçenekleri panel sözlüğünden gelir; istemciye yalnız ad ve
   anahtar geçer, veri dosyası istemci paketine girmez. */
const SEKTOR_SECENEKLERI = PANEL_SEKTORLERI.map((s) => ({ anahtar: s.anahtar, ad: s.ad }));
const EKSIK_SECENEKLERI = EKSIKLER.map((e) => ({ anahtar: e.anahtar, ad: e.ad }));

const SONRA = [
  {
    no: '01',
    baslik: 'Aynı gün dönüyoruz',
    metin:
      'Talebiniz panelimize aday olarak düşüyor ve o gün aranacaklar listesine giriyor. Telefonla ulaşamazsak WhatsApp’tan yazıyoruz.',
  },
  {
    no: '02',
    baslik: 'Hesaplarınıza bakıyoruz',
    metin:
      'Instagram profilinizi, varsa web sitenizi ve haritadaki görünümünüzü inceliyoruz. Bu iş sizden ek bir şey istemiyor.',
  },
  {
    no: '03',
    baslik: 'Yazılı liste gönderiyoruz',
    metin:
      'Eksikleri, hızlı kazanımları ve nereden başlanacağını yazıyoruz. Listeyi kendiniz uygulamak isterseniz de sizde kalıyor.',
  },
];

export default async function IletisimSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ sektor?: string }>;
}) {
  const { sektor } = await searchParams;
  const baslangicSektoru = panelSektoru(sektor);
  const waBaglanti = whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappAnaliz);

  return (
    <div className="af-kr">
      <YapisalVeri veri={yapisalVeri()} />

      {/* ================================================================
          GİRİŞ — PLAKA (sayfanın tek plakası)
          İletişim sayfasında harf kadrajı KULLANILMIYOR: burada istenen
          şey gösteri değil GÜVEN. Nefes kesen an plakanın kendisi, iri
          ve sıkı başlık ile kenara dayanan veri şeridi.
          ================================================================ */}
      <div data-alt-cta-gizle>
        <Plaka>
          <Iz ogeler={IZ} />

          <p className="af-ust-etiket af-il-etiket">İletişim · {ILETISIM.adres}</p>
          <h1 className="af-il-bas">Yazın, önce bir bakalım.</h1>
          <p className="af-giris af-il-giris">
            İşletmenizi anlatan birkaç satır bırakmanız yeterli. Aynı gün içinde dönüyor, konuşmaya
            nereden başlayacağımızı söylüyoruz. Acelesi varsa WhatsApp daha hızlı.
          </p>

          <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
            <Dugme buyuk href="#form">
              Formu doldurun
            </Dugme>
            <Dugme tur="ikincil" href={waBaglanti} whatsapp>
              <IkonWhatsApp />
              WhatsApp’tan yazın
            </Dugme>
            <Dugme tur="hayalet" href={ILETISIM.instagramDm}>
              <IkonInstagram />
              Instagram’dan DM
            </Dugme>
          </div>

          <div className="af-veri-serit af-kr-veri-dev af-il-veri">
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Dönüş</span>
              <span className="af-veri-deger">aynı gün</span>
              <span className="af-veri-not">talebiniz listeye düşer</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Analiz</span>
              <span className="af-veri-deger">ücretsiz</span>
              <span className="af-veri-not">bağlayıcı değil</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Kanal</span>
              <span className="af-veri-deger">5</span>
              <span className="af-veri-not">form · WhatsApp · DM · telefon · e-posta</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Merkez</span>
              <span className="af-veri-deger">4.Levent</span>
              <span className="af-veri-not">{ILETISIM.sehir}</span>
            </div>
          </div>
        </Plaka>
      </div>

      {/* ================================================================
          FORM EKRANI
          Form bir kart değil, bir EKRAN: kâğıt bandın üstünde geniş beyaz
          bir yüzey, mono künye şeridi, iri alanlar. Yan kolonda WhatsApp
          ve Instagram kartları belirgin (kalın kenar + renkli ray + tam
          genişlik düğme), altında diğer kanallar ve veri notu.
          ================================================================ */}
      <Bolum
        bant="kagit"
        id="form"
        sinif="af-kr-kesik af-kr-iri"
        ustEtiket="Ücretsiz analiz formu"
        baslik="Birkaç satır yeterli."
        giris="Yıldızlı alanlar olmadan size dönemiyoruz; kalanı boş bırakabilirsiniz. Sektör ve eksik listesini sitede daha önce seçtiyseniz form hazır geliyor."
        akis="imza"
      >
        <div className="af-il-duzen">
          <div className="af-kart af-il-ekran" data-belir>
            <p className="af-il-ekran-ust">
              <span className="af-mono-etiket af-mono-etiket--vurgu">Talep formu</span>
              <span className="af-il-ekran-not">3 zorunlu alan · 1 onay</span>
            </p>
            <TalepFormu
              sektorler={SEKTOR_SECENEKLERI}
              eksikler={EKSIK_SECENEKLERI}
              baslangicSektoru={baslangicSektoru}
              tesekkurYolu={siteYolu('/tesekkurler')}
              kvkkYolu={siteYolu('/kvkk')}
            />
          </div>

          <div className="af-kr-yan af-il-yan">
            {/* WhatsApp — en hızlı yol, bu yüzden en belirgin kart. */}
            <article className="af-kart af-il-kanal af-il-kanal--wa" data-isik data-belir style={kademe(1)}>
              <span className="af-il-kanal-ikon">
                <IkonWhatsApp />
              </span>
              <h3 className="af-il-kanal-bas">WhatsApp</h3>
              <p className="af-kart-metin">
                En hızlı yol. Mesajı hazır gönderiyoruz; siz yalnızca işletmenizin adını yazın.
              </p>
              <p className="af-kart-alt">
                <Dugme tur="ikincil" href={waBaglanti} whatsapp blok>
                  <IkonWhatsApp />
                  {ILETISIM.telefonGorunum}
                </Dugme>
              </p>
            </article>

            <article className="af-kart af-il-kanal af-il-kanal--ig" data-isik data-belir style={kademe(2)}>
              <span className="af-il-kanal-ikon">
                <IkonInstagram />
              </span>
              <h3 className="af-il-kanal-bas">Instagram</h3>
              <p className="af-kart-metin">
                Yaptığımız işleri görmek isterseniz profilden bakabilir, doğrudan DM
                gönderebilirsiniz.
              </p>
              <p className="af-kart-alt">
                <Dugme tur="ikincil" href={ILETISIM.instagramDm} blok>
                  <IkonInstagram />@{ILETISIM.instagram}
                </Dugme>
              </p>
            </article>

            <div className="af-kart af-kart--sade af-il-diger" data-belir style={kademe(3)}>
              <p className="af-ust-etiket">Diğer kanallar</p>
              <div className="af-nap">
                <a href={ILETISIM.telefonBaglanti}>
                  <IkonTelefon />
                  {ILETISIM.telefonGorunum}
                </a>
                <a href={`mailto:${ILETISIM.eposta}`}>
                  <IkonEposta />
                  {ILETISIM.eposta}
                </a>
                <p className="af-il-adres">
                  <IkonKonum />
                  {ILETISIM.adres}
                </p>
              </div>
            </div>

            <div className="af-kart af-kart--veri af-il-veri-kart" data-belir style={kademe(4)}>
              <h3 className="af-il-kanal-bas af-il-kanal-bas--kucuk">
                <IkonKalkan />
                Verileriniz
              </h3>
              <p className="af-kart-metin">{ANA_SAYFA.iletisim.kvkkNotu}</p>
              <p className="af-kart-alt">
                <a className="af-bag" href={siteYolu('/kvkk')}>
                  KVKK aydınlatma metni
                </a>
                {' · '}
                <a className="af-bag" href={siteYolu('/gizlilik')}>
                  Gizlilik politikası
                </a>
              </p>
            </div>
          </div>
        </div>
      </Bolum>

      {/* ================================================================
          GÖNDERDİKTEN SONRA — üç durak, iri numaralar, aralarında hat
          ================================================================ */}
      <Bolum
        bant="beyaz"
        id="sonra"
        sinif="af-kr-iri"
        ustEtiket="Formu gönderdikten sonra"
        baslik="Üç adım; sürpriz yok."
        giris="Talebiniz bir e-posta kutusunda kaybolmuyor: kendi yazdığımız müşteri takip panelimize aday olarak düşüyor ve o günün arama listesine giriyor."
        akis="veri"
      >
        <ol className="af-il-duraklar">
          {SONRA.map((a, i) => (
            <li key={a.no} data-belir style={kademe(i)}>
              <span className="af-il-durak-no" aria-hidden="true">
                {a.no}
              </span>
              <h3 className="af-il-durak-bas">{a.baslik}</h3>
              <p className="af-kart-metin">{a.metin}</p>
            </li>
          ))}
        </ol>

        <p className="af-dugme-not af-ust-32">
          Adım adım ilerleyen bir sektör ve eksik listesi görmek isterseniz{' '}
          <a className="af-bag" href={siteYolu('/analiz')}>
            ücretsiz analiz sayfasından
          </a>{' '}
          da başlayabilirsiniz.
        </p>
      </Bolum>

      <Isik />
    </div>
  );
}
