import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import Video from '@/components/site/Video';
import MarkaSeridi from '@/components/site/MarkaSeridi';
import { CerceveTelefon } from '@/components/site/Cerceve';
import {
  FlowSembolTek,
  Ikon,
  IkonInstagram,
  IkonKod,
  IkonKonum,
  IkonOk,
  IkonTelefon,
  IkonTik,
  IkonWhatsApp,
} from '@/components/site/Ikonlar';
import { ILETISIM, MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  ANA_SAYFA,
  BIRINCIL_CAGRI,
  QR_MENU_BILGI,
  SEKTORLER,
  SSS_GENEL,
  SSS_GENEL_BOLUMU,
  SUREC,
  VAKALAR,
  hizmetBul,
  hizmetYolu,
  medyaYolu,
  sektorYolu,
  vakaBul,
  vakaYolu,
} from '@/lib/site-icerik';
import { EKSIKLER } from '@/lib/adaylar';
import HarfKadraji from '@/components/site/giris/HarfKadraji';
import AkisKarti, { type KartOnerisi, type KartSektoru } from '@/components/site/anasayfa/AkisKarti';
import EksikSecici, { type EksikSecenegi } from '@/components/site/anasayfa/EksikSecici';
import SektorKapisi, { type SektorSecenegi } from '@/components/site/anasayfa/SektorKapisi';
import QrKod from '@/components/site/anasayfa/QrKod';
import Isik from './iletisim/_ortak/Isik';
import {
  EKSIK_HIZMETI,
  HIZMET_GRUPLARI,
  HIZMET_IKONU,
  hizmetinSektorleri,
} from '@/components/site/anasayfa/veri';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import '../../components/site/anasayfa/anasayfa.css';

/* ================================================================== */
/* Üst veri                                                            */
/* ================================================================== */

export const metadata: Metadata = {
  // Kök layout başlığa "| Ajans Flow" ekliyor; ana sayfada başlık 60
  // karakteri geçmesin diye kendi başlığını mutlak veriyor.
  title: { absolute: ANA_SAYFA.metaBaslik },
  description: ANA_SAYFA.metaAciklama,
  keywords: [...ANA_SAYFA.anahtarKelimeler],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: MARKA.ad,
    url: '/',
    title: ANA_SAYFA.metaBaslik,
    description: ANA_SAYFA.metaAciklama,
  },
  twitter: {
    card: 'summary_large_image',
    title: ANA_SAYFA.metaBaslik,
    description: ANA_SAYFA.metaAciklama,
  },
};

/* ------------------------------------------------------------------ */
/* Yapısal veri — WebSite + Organization + LocalBusiness               */
/*                                                                     */
/* Kuruluş ve işletme düğümlerinin ayrıntısı (adres, telefon, e-posta)  */
/* kök layout'ta basılıyor. Burada aynı `@id` değerleriyle referans     */
/* verilip ana sayfaya özel WebSite düğümü ekleniyor; iki betik tek bir */
/* grafikte birleşiyor. FAQPage şeması KULLANILMIYOR.                   */
/* ------------------------------------------------------------------ */
function yapisalVeri() {
  const kok = siteAdresi();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${kok}/#site`,
        url: kok,
        name: MARKA.ad,
        alternateName: MARKA.tamAd,
        description: ANA_SAYFA.metaAciklama,
        inLanguage: 'tr-TR',
        publisher: { '@id': `${kok}/#kurulus` },
      },
      { '@type': 'Organization', '@id': `${kok}/#kurulus`, name: MARKA.ad, url: kok },
      {
        '@type': 'LocalBusiness',
        '@id': `${kok}/#isletme`,
        name: MARKA.ad,
        url: kok,
        areaServed: ILETISIM.sehir,
        parentOrganization: { '@id': `${kok}/#kurulus` },
      },
    ],
  };
}

/* ================================================================== */
/* Hazırlık — içerik verisinden türeyen listeler                        */
/* ================================================================== */

/** Sektör kapısı çipleri. */
const SEKTOR_SECENEKLERI: readonly SektorSecenegi[] = SEKTORLER.map((s) => ({
  anahtar: s.anahtar,
  ad: s.ad,
}));

/** Akış Kartı'nın sektör satırı. */
const KART_SEKTORLERI: readonly KartSektoru[] = SEKTORLER.map((s) => ({
  anahtar: s.anahtar,
  ad: s.ad,
  href: sektorYolu(s),
}));

/** "Neyin eksik?" çipleri — anahtarlar EKSIKLER ile birebir. */
const EKSIK_SECENEKLERI: readonly EksikSecenegi[] = EKSIKLER.map((e) => ({
  anahtar: e.anahtar,
  ad: e.ad,
}));

/** İşaretlenen her eksiğin karşılığındaki öneri ve hizmet sayfası. */
const KART_ONERILERI: readonly KartOnerisi[] = EKSIKLER.map((e) => {
  const hizmet = hizmetBul(EKSIK_HIZMETI[e.anahtar] ?? '');
  return {
    anahtar: e.anahtar,
    baslik: e.baslik,
    hizmetAdi: hizmet?.kisaAd ?? e.hizmet,
    href: hizmet ? hizmetYolu(hizmet) : siteYolu('/hizmetler'),
  };
});

const KART_CAGRISI = { etiket: 'Bu kapsamla teklif isteyin', href: siteYolu('/iletisim') };
const KART_BOS_METNI =
  'Sektörünüzü seçip eksikleri işaretledikçe kart dolar: hangi işi neden önerdiğimizi burada görürsünüz.';

const QR_HIZMETI = hizmetBul('qr-menu');
const MAY_MOTORS = vakaBul('may-motors');

/** Demo menünün tam adresi — QR kodun içine bu yazılıyor. */
const QR_HEDEFI = `${siteAdresi()}/demo/qr-menu`;

/** Otomotiv tarafında yaptığımız işler (ürün satışı değil, vaka dili). */
const OTOMOTIV_ISLERI = [
  {
    ad: 'Araç değerleme akışı',
    metin:
      'Marka, model, yıl, kilometre ve hasar bilgisiyle adım adım ilerleyen form. Veri yetersizse rakam göstermeyip talebi ekibe bağlıyor.',
    yol: '/otomotiv-yazilimlari/arac-degerleme',
  },
  {
    ad: 'İlan hazırlama ve yönetim',
    metin:
      'İlan açıklaması ve ilan görseli hazırlama akışı; tek veri girişinden baskıya ve sosyal medyaya hazır araç kartı çıkıyor.',
    yol: '/otomotiv-yazilimlari/ilan-hazirlama',
  },
  {
    ad: 'Galeri muhasebesi',
    metin:
      'Araç bazlı maliyet ve kârlılık, ortak kasası, taksitli satış tahsilatı ve dönemsel analiz aynı panelde.',
    yol: '/otomotiv-yazilimlari/galeri-muhasebe',
  },
] as const;

/* ================================================================== */
/* Küçük yardımcı bileşenler                                           */
/* ================================================================== */

/** Doğrulanmış rakam: sayı ise sayaçla, değilse olduğu gibi basılır. */
function VeriDegeri({ deger }: { deger: string }) {
  const eslesme = /^(\d+)(\+?)$/.exec(deger);
  if (!eslesme) return <span className="af-veri-deger">{deger}</span>;
  return (
    <span className="af-veri-deger" data-sayac={eslesme[1]} data-ek={eslesme[2] || undefined}>
      {deger}
    </span>
  );
}

function HizmetKarti({ anahtar, sira }: { anahtar: string; sira: number }) {
  const hizmet = hizmetBul(anahtar);
  if (!hizmet) return null;
  return (
    <article
      className="af-kart af-kart--tikla af-as-hizmet"
      data-sektor-oneri={hizmetinSektorleri(anahtar) || undefined}
      data-isik
      data-belir
      style={{ ['--i' as string]: Math.min(sira, 6) } as React.CSSProperties}
    >
      <span className="af-ikon-kutu">
        <Ikon ad={HIZMET_IKONU[anahtar] ?? 'kutu'} />
      </span>
      <div className="af-kart-ust">
        <h4 className="af-kart-baslik">{hizmet.kisaAd}</h4>
        <span className="af-mono-etiket af-mono-etiket--vurgu af-as-oneri">Önerilen</span>
      </div>
      <p className="af-kart-metin">{hizmet.ozet}</p>
      <p className="af-kart-alt">
        <span className="af-bag-ok" aria-hidden="true">
          İncele
          <IkonOk />
        </span>
      </p>
      <a className="af-kaplayan-bag" href={hizmetYolu(hizmet)}>
        <span className="af-gizli-metin">{hizmet.ad} hizmetini inceleyin</span>
      </a>
    </article>
  );
}

/** Vaka kartının görseli: videosu varsa video, yoksa ilk fotoğraf. */
function VakaGorseli({ sira, vaka }: { sira: number; vaka: (typeof VAKALAR)[number] }) {
  if (vaka.medya.video) {
    return (
      <div className="af-kart-gorsel">
        <Video
          ad={vaka.medya.video}
          poster={vaka.medya.poster}
          oran="4 / 3"
          baslik={`${vaka.marka} — ${vaka.baslik}`}
          sira={sira}
          sinif="af-video--cercevesiz"
        />
      </div>
    );
  }
  const foto = vaka.medya.foto?.[0];
  if (!foto) return null;
  return (
    <div className="af-kart-gorsel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={medyaYolu(foto)}
        alt={`${vaka.marka} — ${vaka.baslik}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* ================================================================== */
/* Sayfa                                                               */
/* ================================================================== */

export default function AnaSayfa() {
  const kahraman = ANA_SAYFA.kahraman;

  return (
    <>
      <YapisalVeri veri={yapisalVeri()} />

      {/* ============ 1 · GİRİŞ: HARF KADRAJI ============
          İKİ PLAKA (siyah → beyaz), blend knockout ile harflerin İÇİNDEN
          akan tek video düzlemi, yarım kesilmiş cümle ve KURGU kapısı.
          Tamamı `src/components/site/giris/` içinde; şartname
          SITE-GIRIS.md. Hero bir BANT DEĞİL ÖNOYUNDUR: bant anlamı
          (koyu = yazılım, kâğıt = stüdyo) 3. bölümden itibaren geçerli.

          SITE-TASARIM.md §5 güncellenmeli: hero'da "kontrollü,
          maskelenmiş, ≤1 MB, LCP'den SONRA yüklenen, 3G'de hiç gelmeyen
          TEK klip" serbesttir; tam ekran otomatik oynayan hero videosu
          yasağı sürüyor. */}
      <HarfKadraji />

      {/* ============ 2 · SEKTÖR KAPISI + ÇAĞRILAR (kâğıt bant) ============
          Plaka rejimi burada KAPANIR ve sayfa mevcut iki bant ritmine
          döner — "cafcaf" ilk iki ekranda yoğunlaşır, okuma bölgesini
          kirletmez. Dönüşüm zinciri (sektör → eksik → Akış Kartı → form)
          aynen korunuyor. */}
      <section className="af-bant af-bant--kagit" data-akis="duz">
        <div className="af-kap">
          <div className="af-as-hero-ic">
            <div data-belir>
              <p className="af-giris af-as-genel-metin">{kahraman.altMetin}</p>
              {/* Sektöre göre varyantlar: hepsi sunucuda basılı, biri görünür. */}
              {SEKTORLER.map((s) => (
                <p
                  className="af-giris af-as-sektor-metin"
                  data-sektor-metin={s.anahtar}
                  key={s.anahtar}
                >
                  {s.baslik}.{' '}
                  <a className="af-bag" href={sektorYolu(s)}>
                    {s.ad} sayfasını açın
                  </a>
                </p>
              ))}
            </div>

            <div className="af-dugmeler af-dugmeler--mobil-blok" data-belir>
              <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
                {kahraman.birincilCagri}
              </Dugme>
              <Dugme tur="ikincil" buyuk href={siteYolu('/calismalar')}>
                {kahraman.ikincilCagri}
              </Dugme>
              <Dugme
                tur="hayalet"
                href={whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappGenel)}
                whatsapp
              >
                <IkonWhatsApp />
                {kahraman.ucuncuCagri}
              </Dugme>
            </div>
            <p className="af-dugme-not">{BIRINCIL_CAGRI.altMetin}</p>
          </div>

          <div className="af-as-kapi-blok" data-belir>
            <div className="af-as-kapi-bas">
              <p className="af-as-kapi-soru" id="af-as-kapi-etiket">
                İşletmeniz hangisi?
              </p>
              <p className="af-mono-etiket">{SEKTORLER.length} sektör</p>
            </div>
            <SektorKapisi sektorler={SEKTOR_SECENEKLERI} etiketId="af-as-kapi-etiket" />
          </div>
        </div>
      </section>

      {/* ============ 3 · MARKA ŞERİDİ ============ */}
      <Bolum bant="koyu" sikis genislik="tasma">
        <div className="af-kap">
          <p className="af-ust-etiket" data-belir>
            {ANA_SAYFA.guven.ustEtiket}
          </p>
        </div>
        <MarkaSeridi bant="koyu" />
      </Bolum>

      {/* ============ 3 · NEYİN EKSİK + AKIŞ KARTI ============ */}
      <Bolum
        bant="beyaz"
        id="eksikler"
        ustEtiket="Neyin eksik"
        baslik="İşaretleyin; kapsamı birlikte çıkaralım."
        giris="Size uyan maddeleri seçin. Akış Kartı doldukça hangi işi neden önerdiğimizi görürsünüz; aynı seçimler iletişim formuna hazır gelir."
        akis="veri"
      >
        <div className="af-as-eksik">
          <fieldset className="af-as-alan">
            <legend className="af-etiket af-as-alan-bas" id="af-as-eksik-etiket">
              İşletmenizde eksik olanlar (birden çok seçebilirsiniz)
            </legend>
            <EksikSecici eksikler={EKSIK_SECENEKLERI} etiketId="af-as-eksik-etiket" />
            <p className="af-dugme-not af-ust-16">
              Seçimler yalnızca tarayıcınızda tutulur; formu göndermedikçe bize ulaşmaz.
            </p>
          </fieldset>

          <AkisKarti
            sektorler={KART_SEKTORLERI}
            oneriler={KART_ONERILERI}
            cagri={KART_CAGRISI}
            baslik="Size önerdiğimiz kapsam"
            bosMetin={KART_BOS_METNI}
            yapiskan
          />
        </div>
      </Bolum>

      {/* ============ 4 · HİZMET IZGARASI (4 grup) ============ */}
      <Bolum
        bant="kagit"
        id="hizmetler"
        ustEtiket={ANA_SAYFA.hizmetler.ustEtiket}
        baslik={ANA_SAYFA.hizmetler.baslik}
        giris={ANA_SAYFA.hizmetler.giris}
        akis="duz"
        basYani={
          <Dugme tur="ikincil" href={siteYolu('/hizmetler')}>
            {ANA_SAYFA.hizmetler.cagri}
          </Dugme>
        }
      >
        <div className="af-as-gruplar">
          {HIZMET_GRUPLARI.map((grup) => (
            <div key={grup.ad}>
              <div className="af-as-grup-bas" data-belir>
                <h3 className="af-h3">{grup.ad}</h3>
                <p className="af-mono-etiket">{grup.not}</p>
              </div>
              <div className="af-izgara af-izgara--3">
                {grup.anahtarlar.map((anahtar, i) => (
                  <HizmetKarti key={anahtar} anahtar={anahtar} sira={i} />
                ))}

                {/* Yazılım grubunda otomotiv tarafı: hizmet sayfası değil,
                    kendi bölümü olan bir iş kolu. */}
                {grup.anahtarlar.includes('qr-menu') ? (
                  <article
                    className="af-kart af-kart--tikla af-as-hizmet"
                    data-sektor-oneri="oto-galeri"
                    data-isik
                    data-belir
                    style={{ ['--i' as string]: 1 } as React.CSSProperties}
                  >
                    <span className="af-ikon-kutu">
                      <IkonKod />
                    </span>
                    <div className="af-kart-ust">
                      <h4 className="af-kart-baslik">Otomotiv yazılımları</h4>
                      <span className="af-mono-etiket af-mono-etiket--vurgu af-as-oneri">
                        Önerilen
                      </span>
                    </div>
                    <p className="af-kart-metin">
                      Araç değerleme akışı, ilan hazırlama ve galeri muhasebesi: oto galeriler için
                      yazdığımız işler.
                    </p>
                    <p className="af-kart-alt">
                      <span className="af-bag-ok" aria-hidden="true">
                        İncele
                        <IkonOk />
                      </span>
                    </p>
                    <a className="af-kaplayan-bag" href={siteYolu('/otomotiv-yazilimlari')}>
                      <span className="af-gizli-metin">Otomotiv yazılımları sayfasını açın</span>
                    </a>
                  </article>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="af-dugmeler af-ust-32 af-mobil-ozel">
          <Dugme tur="ikincil" blok href={siteYolu('/hizmetler')}>
            {ANA_SAYFA.hizmetler.cagri}
          </Dugme>
        </div>
      </Bolum>

      {/* ============ 5 · QR MENÜ TEZGÂHI ============ */}
      <Bolum
        bant="koyu"
        id="qr-menu"
        ustEtiket="Çalışan demo"
        baslik={QR_HIZMETI?.ad ?? 'QR dijital menü'}
        giris={QR_HIZMETI?.ozet}
        akis="kare"
      >
        <div className="af-as-tezgah">
          <div className="af-as-tezgah-yan" data-belir="olcek">
            <CerceveTelefon altyazi="Kule İstanbul Cafe · QR menü">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/kule-istanbul-qr-menu-mobil.jpg')}
                alt="Kule İstanbul Cafe QR menüsünün telefondaki görünümü"
                loading="lazy"
                decoding="async"
              />
            </CerceveTelefon>
          </div>

          <div className="af-yigin af-yigin--genis" data-belir>
            <div className="af-veri-serit">
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Dil</span>
                <span className="af-veri-deger">4</span>
                <span className="af-veri-not">TR · EN · DE · AR</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Güncelleme</span>
                <span className="af-veri-deger">anında</span>
                <span className="af-veri-not">panelden, baskı beklemeden</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Filtre</span>
                <span className="af-veri-deger">alerjen</span>
                <span className="af-veri-not">diyet seçenekleri ve menüde arama</span>
              </div>
            </div>

            <p className="af-ikincil-metin">{QR_MENU_BILGI.kisaCevap}</p>

            <div className="af-dugmeler">
              <Dugme href={siteYolu('/demo/qr-menu')}>Demoyu açın</Dugme>
              <Dugme tur="ikincil" href={siteYolu('/qr-menu')}>
                QR menü ve mevzuat
              </Dugme>
            </div>

            {/* Gerçek QR kod — sunucuda üretiliyor, demo menüye gidiyor.
                Telefonda gereksiz: ekranı okutamazsınız, düğme var. */}
            <div className="af-as-qr-panel af-mobil-gizle">
              <QrKod icerik={QR_HEDEFI} baslik={`QR kod: ${QR_HEDEFI}`} />
              <span className="af-as-qr-yazi">
                <strong>Kamerayla okutun.</strong>
                <span className="af-ikincil-metin">
                  Dört dilli demo menü telefonunuzda açılır; masadaki karekodun yaptığı iş birebir
                  bu.
                </span>
                <span className="af-mono af-silik-metin">{QR_HEDEFI}</span>
              </span>
            </div>
          </div>
        </div>
      </Bolum>

      {/* ============ 6 · OTOMOTİV YAZILIMLARI ============ */}
      <Bolum
        bant="koyu"
        id="otomotiv"
        sinif="af-bant--cizgili"
        ustEtiket="Otomotiv yazılımları"
        baslik={MAY_MOTORS?.baslik ?? 'Bir oto galerinin dijital tarafı'}
        giris={MAY_MOTORS?.ozet}
        akis="veri"
        basYani={
          <Dugme tur="ikincil" href={siteYolu('/otomotiv-yazilimlari')}>
            Yazılım tarafını görün
          </Dugme>
        }
      >
        <div className="af-as-otomotiv">
          <div className="af-yigin af-yigin--genis">
            <div className="af-izgara af-izgara--3">
              {OTOMOTIV_ISLERI.map((is, i) => (
                <article
                  className="af-kart af-kart--tikla af-kat-2"
                  key={is.ad}
                  data-isik
                  data-belir
                  style={{ ['--i' as string]: i } as React.CSSProperties}
                >
                  <h3 className="af-kart-baslik">{is.ad}</h3>
                  <p className="af-kart-metin">{is.metin}</p>
                  <p className="af-kart-alt">
                    <span className="af-bag-ok" aria-hidden="true">
                      İncele
                      <IkonOk />
                    </span>
                  </p>
                  <a className="af-kaplayan-bag" href={siteYolu(is.yol)}>
                    <span className="af-gizli-metin">{is.ad} sayfasını açın</span>
                  </a>
                </article>
              ))}
            </div>

            <p className="af-dugme-not">
              İlan sitelerinden otomatik veri çekme ya da senkronizasyon iddiasında bulunmuyoruz;
              yaptığımız iş ilan içeriğinin hazırlanması, ilanların panelden düzenli yönetilmesi ve
              fiyat araştırmasının derli toplu tutulması.
            </p>

            {MAY_MOTORS ? (
              <p>
                <a className="af-bag-ok" href={vakaYolu(MAY_MOTORS)}>
                  {MAY_MOTORS.marka} çalışmasını okuyun
                  <IkonOk />
                </a>
              </p>
            ) : null}
          </div>

          <div className="af-as-otomotiv-yan" data-belir="olcek">
            <CerceveTelefon boy="kucuk" altyazi="May Motors · değerleme formu">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/maymotors-web-mobil-form.jpg')}
                alt="May Motors sitesindeki araç değerleme formunun mobil görünümü"
                loading="lazy"
                decoding="async"
              />
            </CerceveTelefon>
          </div>
        </div>
      </Bolum>

      {/* ============ 7 · İŞLER ŞERİDİ ============ */}
      <Bolum
        bant="kagit"
        id="calismalar"
        ustEtiket={ANA_SAYFA.vakalar.ustEtiket}
        baslik={ANA_SAYFA.vakalar.baslik}
        giris={ANA_SAYFA.vakalar.giris}
        basYani={
          <Dugme tur="ikincil" href={siteYolu('/calismalar')}>
            {ANA_SAYFA.vakalar.cagri}
          </Dugme>
        }
      >
        <div className="af-kaydir">
          {VAKALAR.map((vaka, i) => (
            <article className="af-kart af-kart--tikla af-as-is" key={vaka.slug} data-isik>
              <VakaGorseli vaka={vaka} sira={i} />
              <div className="af-as-is-marka">
                <p className="af-mono-etiket">{vaka.sektor}</p>
              </div>
              <h3 className="af-kart-baslik">{vaka.marka}</h3>
              <p className="af-kart-metin">{vaka.baslik}</p>
              <p className="af-kart-alt">
                <span className="af-bag-ok" aria-hidden="true">
                  Çalışmayı oku
                  <IkonOk />
                </span>
              </p>
              <a className="af-kaplayan-bag" href={vakaYolu(vaka)}>
                <span className="af-gizli-metin">{vaka.marka} çalışmasını okuyun</span>
              </a>
            </article>
          ))}
        </div>

        <div className="af-dugmeler af-ust-32 af-mobil-ozel">
          <Dugme tur="ikincil" blok href={siteYolu('/calismalar')}>
            {ANA_SAYFA.vakalar.cagri}
          </Dugme>
        </div>
      </Bolum>

      {/* ============ 8 · SÜREÇ ============ */}
      <Bolum
        bant="beyaz"
        id="surec"
        ustEtiket={ANA_SAYFA.surec.ustEtiket}
        baslik={ANA_SAYFA.surec.baslik}
        giris={ANA_SAYFA.surec.giris}
        genislik="dar"
        akis="duz"
      >
        <ol className="af-as-surec" role="list">
          {SUREC.map((adim, i) => (
            <li className="af-as-adim" key={adim.no} data-belir style={{ ['--i' as string]: i } as React.CSSProperties}>
              <span className="af-as-adim-no" aria-hidden="true">
                {String(adim.no).padStart(2, '0')}
              </span>
              <h3 className="af-h4">{adim.baslik}</h3>
              <p className="af-ikincil-metin">{adim.aciklama}</p>
              <div className="af-as-adim-ciktilar">
                {adim.ciktilar.map((c) => (
                  <span className="af-cip af-cip--nokta" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="af-dugmeler af-ust-32">
          <Dugme tur="ikincil" href={siteYolu('/hakkimizda')}>
            {ANA_SAYFA.surec.cagri}
          </Dugme>
        </div>
      </Bolum>

      {/* ============ 9 · NEDEN AJANS FLOW + DOĞRULANMIŞ SAYILAR ============ */}
      <Bolum
        bant="kagit"
        id="neden-ajans-flow"
        ustEtiket={ANA_SAYFA.nedenBiz.ustEtiket}
        baslik={ANA_SAYFA.nedenBiz.baslik}
        giris={ANA_SAYFA.nedenBiz.giris}
      >
        <p className="af-mono-etiket" data-belir>
          Doğrulanmış veriler
        </p>
        <div className="af-veri-serit af-ust-16" data-belir>
          {ANA_SAYFA.guven.maddeler.map((m) => (
            <div className="af-veri-oge" key={m.etiket}>
              <VeriDegeri deger={m.deger} />
              <span className="af-veri-not">{m.etiket}</span>
            </div>
          ))}
        </div>

        <div className="af-izgara af-izgara--3 af-ust-48">
          {ANA_SAYFA.nedenBiz.maddeler.map((m, i) => (
            <article className="af-kart" key={m.baslik} data-belir style={{ ['--i' as string]: i } as React.CSSProperties}>
              <h3 className="af-kart-baslik">{m.baslik}</h3>
              <p className="af-kart-metin">{m.aciklama}</p>
            </article>
          ))}
        </div>

        <div className="af-izgara af-izgara--2 af-ust-32">
          <article className="af-kart">
            <span className="af-ikon-kutu" aria-hidden="true">
              <IkonKonum />
            </span>
            <h3 className="af-kart-baslik">{ANA_SAYFA.nedenBiz.konum.baslik}</h3>
            <p className="af-kart-metin">{ANA_SAYFA.nedenBiz.konum.aciklama}</p>
          </article>

          <div className="af-kart af-kart--sade">
            <p className="af-mono-etiket">Söz verdiğimiz dil</p>
            <ul className="af-as-notlar" role="list">
              {ANA_SAYFA.guven.notlar.map((n) => (
                <li key={n}>
                  <IkonTik />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Bolum>

      {/* ============ 10 · SSS ============
          FAQPage şeması yok (Google kaldırdı, SITE-TASARIM.md §9). */}
      <Bolum
        bant="beyaz"
        id="sss"
        ustEtiket={SSS_GENEL_BOLUMU.ustEtiket}
        baslik={SSS_GENEL_BOLUMU.baslik}
        giris={SSS_GENEL_BOLUMU.aciklama}
        genislik="dar"
      >
        <SSS sorular={SSS_GENEL} grup="af-sss-anasayfa" />
        <p className="af-dugme-not af-ust-24">
          Mevzuat, reklam ve web sitesi konularını ayrıntılı yazdığımız yer:{' '}
          <a className="af-bag" href={siteYolu('/rehber')}>
            Rehber
          </a>
          . Cevabını bulamadığınız soruyu{' '}
          <a className="af-bag" href={siteYolu('/iletisim')}>
            doğrudan bize sorun
          </a>
          .
        </p>
      </Bolum>

      {/* ============ 11 · KAPANIŞ: AKIŞ KARTI + ÇAĞRI ============ */}
      <section
        className="af-bant af-bant--koyu"
        id="ucretsiz-analiz"
        data-akis="imza"
        data-alt-cta-gizle
      >
        <FlowSembolTek className="af-filigran" />
        <div className="af-kap">
          <div className="af-as-kapanis">
            <div className="af-yigin af-yigin--genis" data-belir>
              <p className="af-ust-etiket">{ANA_SAYFA.sonCagri.ustEtiket}</p>
              <h2 className="af-h2" data-baslik-ac>
                {ANA_SAYFA.sonCagri.baslik}
              </h2>
              <p className="af-giris">{ANA_SAYFA.sonCagri.aciklama}</p>

              <ul className="af-tikli af-as-kapanis-liste">
                {ANA_SAYFA.sonCagri.maddeler.map((m) => (
                  <li key={m}>
                    <IkonTik />
                    {m}
                  </li>
                ))}
              </ul>

              <div className="af-dugmeler af-dugmeler--mobil-blok">
                <Dugme buyuk href={siteYolu('/iletisim')}>
                  {ANA_SAYFA.sonCagri.cagri}
                </Dugme>
                <Dugme
                  tur="ikincil"
                  buyuk
                  whatsapp
                  href={whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappAnaliz)}
                >
                  <IkonWhatsApp />
                  {ANA_SAYFA.iletisim.whatsappCagri}
                </Dugme>
              </div>

              <div className="af-sira">
                <Dugme tur="hayalet" href={ILETISIM.telefonBaglanti}>
                  <IkonTelefon />
                  {ILETISIM.telefonGorunum}
                </Dugme>
                <Dugme tur="hayalet" href={ILETISIM.instagramDm}>
                  <IkonInstagram />
                  {ANA_SAYFA.iletisim.instagramCagri}
                </Dugme>
              </div>

              <p className="af-dugme-not">{ANA_SAYFA.iletisim.kvkkNotu}</p>
            </div>

            <AkisKarti
              sektorler={KART_SEKTORLERI}
              oneriler={KART_ONERILERI}
              cagri={KART_CAGRISI}
              baslik="Akış Kartınız"
              bosMetin={KART_BOS_METNI}
            />
          </div>
        </div>
      </section>

      {/* İmleç ışığı: `[data-isik]` ve `.af-kart--tikla` kartlarında havuz
          imleci izler. TEK `pointermove` dinleyicisi, rAF ile kısıtlı;
          dokunmatikte ve saveData/2g'de hiç kurulmaz. Gelmezse havuz
          kartın üst kenarından açılır (site.css kart katmanı). */}
      <Isik />
    </>
  );
}
