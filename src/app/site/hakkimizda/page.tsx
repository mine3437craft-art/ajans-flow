import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import MarkaSeridi from '@/components/site/MarkaSeridi';
import {
  IkonEposta,
  IkonInstagram,
  IkonKonum,
  IkonTelefon,
  IkonTik,
  IkonWhatsApp,
} from '@/components/site/Ikonlar';
import { ILETISIM, MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { ANA_SAYFA, BIRINCIL_CAGRI, HAKKIMIZDA, HIZMETLER, SEKTORLER } from '@/lib/site-icerik';
import Iz from '../iletisim/_ortak/Iz';
import Isik from '../iletisim/_ortak/Isik';
import { HarfSatiri, Plaka } from '../iletisim/_ortak/Plaka';
import { izYapisalVerisi, kademe, type IzOgesi } from '../iletisim/_ortak/kurumsal';
import './sayfa.css';

const YOL = '/hakkimizda';
const BASLIK = 'Hakkımızda — İstanbul 4.Levent';
const ACIKLAMA = HAKKIMIZDA.metaAciklama;

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: [...HAKKIMIZDA.anahtarKelimeler],
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
  { ad: 'Hakkımızda', yol: YOL },
];

/* Yapısal veri: AboutPage + BreadcrumbList. Kuruluş yılı, ekip sayısı ve
   çalışma saati YAZILMAZ (doğrulanmamış bilgi). */
function yapisalVeri() {
  const kok = siteAdresi();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${kok}${YOL}#sayfa`,
        url: `${kok}${YOL}`,
        name: `${MARKA.ad} — Hakkımızda`,
        description: ACIKLAMA,
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${kok}/#kurulus` },
        about: { '@id': `${kok}/#kurulus` },
      },
      { ...izYapisalVerisi(kok, IZ), '@id': `${kok}${YOL}#iz` },
    ],
  };
}

export default function HakkimizdaSayfasi() {
  const waBaglanti = whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappGenel);

  return (
    <div className="af-kr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

      {/* ================================================================
          GİRİŞ — PLAKA (sayfanın tek plakası)
          Ekip fotoğrafı YOK, o yüzden yükü YAZI ve IŞIK taşıyor. Ölçek
          merdiveni bilinçli ve üç kademeli:
            ~112 px  marka kelime-işareti (harf kadrajı, DEKOR)
            ~52 px   gerçek <h1> (cümle, BİLGİ)
            ~22 px   özet · ~13 px mono şerit
          Böylece "nefes kesen an" ile okunan bilgi birbiriyle yarışmaz.
          ================================================================ */}
      <div data-alt-cta-gizle>
        <Plaka>
          <Iz ogeler={IZ} />

          <p className="af-ust-etiket af-hak-etiket">
            {HAKKIMIZDA.ustEtiket} · {ILETISIM.adres}
          </p>

          {/* HARF KADRAJI — bu sayfadaki TEK kullanım. Tek satır, tek
              anahtar kelime: ajansın kendi adı. Dekoratiftir; marka adı
              zaten üst barda, alt bilgide ve <h1>'in bağlamında duruyor.
              `en` değeri 390 px ve 1440 px'te tarayıcıda ölçüldü. */}
          <HarfSatiri kelime={MARKA.ad} en={5.95} tavan="7.25rem" gorsel />

          <h1 className="af-hak-bas">{HAKKIMIZDA.baslik}</h1>
          <p className="af-giris af-hak-giris">{HAKKIMIZDA.ozet}</p>

          <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
            <Dugme buyuk href={siteYolu('/analiz')}>
              {HAKKIMIZDA.cagri}
            </Dugme>
            <Dugme tur="ikincil" href={siteYolu('/calismalar')}>
              Yaptığımız işleri gör
            </Dugme>
          </div>

          {/* Yalnız doğrulanmış veriler (SITE-BRIEF §8). Küçük kart
              ızgarası değil, plakanın kenarına dayanan tek veri şeridi. */}
          <div className="af-veri-serit af-kr-veri-dev af-hak-veri">
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Marka</span>
              <span className="af-veri-deger" data-sayac="12" data-ek="+">
                12+
              </span>
              <span className="af-veri-not">birlikte çalıştık</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Gönderi</span>
              <span className="af-veri-deger" data-sayac="244" data-ek="+">
                244+
              </span>
              <span className="af-veri-not">Instagram’da ürettik</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Hizmet</span>
              <span className="af-veri-deger">{HIZMETLER.length}</span>
              <span className="af-veri-not">tek çatı altında</span>
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
          HİKÂYE — zincir dizgisi
          Dört uzun paragraf düz bir metin bloğu değil, numaralı bir
          ZİNCİR: solda mono durak numarası ve 1px dikey hat, sağda
          paragraf. İlk paragraf bir punto iri (giriş etkisi).
          ================================================================ */}
      <Bolum
        bant="kagit"
        id="hikaye"
        sinif="af-kr-kesik af-kr-iri"
        ustEtiket="Nasıl buraya geldik"
        baslik="Sosyal medyayla başladık, yazılımla devam ettik."
        akis="duz"
      >
        <ol className="af-hak-zincir">
          {HAKKIMIZDA.hikaye.map((p, i) => (
            <li key={p} data-belir style={kademe(i)}>
              <span className="af-hak-zincir-no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>{p}</p>
            </li>
          ))}
        </ol>

        {/* İkinci nefes: slogan tam genişlikte, serif aksan, iri. */}
        <blockquote className="af-alinti af-hak-slogan" data-belir>
          <p className="af-aksan">{MARKA.slogan}</p>
          <cite>
            {MARKA.ad} · {ILETISIM.adres}
          </cite>
        </blockquote>
      </Bolum>

      {/* ================================================================
          ÇALIŞMA FELSEFESİ — ölçek farklı ızgara
          İlk madde iki kolon geniş (manifestonun ilk cümlesi), dürüstlük
          notu da iki kolon: 3+3+3 = dokuz göz, delik yok. Her kartta
          hayalet numara ve imleç ışığı var.
          ================================================================ */}
      <Bolum
        bant="beyaz"
        id="felsefe"
        sinif="af-kr-iri"
        ustEtiket="Çalışma biçimimiz"
        baslik={HAKKIMIZDA.felsefeBaslik}
        giris="Altı madde; hepsi günlük işte karşılığı olan şeyler. Satış konuşmasında söyleyip sonra unuttuğumuz bir liste değil."
        akis="veri"
      >
        <div className="af-hak-felsefe">
          {HAKKIMIZDA.felsefe.map((f, i) => (
            <article className="af-kart af-hak-f" key={f.baslik} data-isik data-belir style={kademe(i)}>
              <span className="af-hak-f-no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="af-hak-f-bas">{f.baslik}</h3>
              <p className="af-kart-metin">{f.aciklama}</p>
            </article>
          ))}

          <div className="af-kart af-kart--vurgulu af-hak-kaynak" data-isik data-belir>
            <p className="af-ust-etiket">Sitedeki bilginin kaynağı</p>
            <p className="af-kart-metin">{HAKKIMIZDA.dogrulanmamisBilgiNotu}</p>
            <ul className="af-tikli af-hak-kaynak-liste">
              {ANA_SAYFA.guven.notlar.map((n) => (
                <li key={n}>
                  <IkonTik />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Bolum>

      {/* ================================================================
          TEK ÇATI — koyu bant (yazılım kanadı), veri şeridi iri
          ================================================================ */}
      <Bolum
        bant="koyu"
        id="tek-cati"
        sinif="af-kr-iri"
        ustEtiket="Tek çatı"
        baslik={HAKKIMIZDA.tekCatiBaslik}
        giris={HAKKIMIZDA.tekCati.aciklama}
        akis="kare"
      >
        <div className="af-hak-cati">
          <div className="af-kart af-kart--genis" data-isik data-belir>
            <p className="af-ust-etiket">Pratikte ne demek</p>
            <ul className="af-tikli af-hak-cati-liste">
              {HAKKIMIZDA.tekCati.maddeler.map((m) => (
                <li key={m}>
                  <IkonTik />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="af-yigin af-yigin--genis" data-belir style={kademe(1)}>
            <div className="af-veri-serit af-kr-veri-dev">
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Hizmet</span>
                <span className="af-veri-deger">{HIZMETLER.length}</span>
                <span className="af-veri-not">dört grupta</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Sektör</span>
                <span className="af-veri-deger">{SEKTORLER.length}</span>
                <span className="af-veri-not">ayrı anlatılan iş kolu</span>
              </div>
              <div className="af-veri-oge">
                <span className="af-veri-etiket">Muhatap</span>
                <span className="af-veri-deger">tek</span>
                <span className="af-veri-not">işi yapan ekip</span>
              </div>
            </div>
            <p className="af-ikincil-metin af-dar-metin">
              Hangi başlığın işinize yarayacağına ücretsiz analizde birlikte karar veriyoruz;
              tamamını almak gibi bir zorunluluk yok.
            </p>
            <div className="af-dugmeler af-dugmeler--mobil-blok">
              <Dugme tur="ikincil" href={siteYolu('/hizmetler')}>
                Hizmetlere bak
              </Dugme>
              <Dugme tur="hayalet" href={siteYolu('/sektorler')}>
                Sektörünüzü seçin
              </Dugme>
            </div>
          </div>
        </div>
      </Bolum>

      {/* ================================================================
          MERKEZ
          ================================================================ */}
      <Bolum
        bant="kagit"
        id="merkez"
        sinif="af-kr-iri"
        ustEtiket={HAKKIMIZDA.konumBaslik}
        baslik={HAKKIMIZDA.konum.baslik}
        giris={HAKKIMIZDA.konum.aciklama}
      >
        <div className="af-hak-merkez">
          <ul className="af-tikli af-hak-merkez-liste" data-belir>
            {HAKKIMIZDA.konum.maddeler.map((m) => (
              <li key={m}>
                <IkonTik />
                {m}
              </li>
            ))}
          </ul>

          <div className="af-kart af-kart--genis" data-isik data-belir style={kademe(1)}>
            <span className="af-ikon-kutu">
              <IkonKonum />
            </span>
            <h3 className="af-hak-f-bas">{ILETISIM.adres}</h3>
            <p className="af-kart-metin">
              Açık adres ve çalışma saatlerini, Google İşletme Profilimiz açılınca siteyle birebir
              aynı bilgiyi taşıyacak şekilde yayımlayacağız. O güne kadar görüşmeleri telefonla
              planlıyoruz.
            </p>
            <div className="af-nap">
              <a href={ILETISIM.telefonBaglanti}>
                <IkonTelefon />
                {ILETISIM.telefonGorunum}
              </a>
              <a href={`mailto:${ILETISIM.eposta}`}>
                <IkonEposta />
                {ILETISIM.eposta}
              </a>
              <a href={ILETISIM.instagramProfil}>
                <IkonInstagram />@{ILETISIM.instagram}
              </a>
            </div>
          </div>
        </div>
      </Bolum>

      {/* ================================================================
          MARKALAR — tam genişlik şerit
          ================================================================ */}
      <Bolum
        bant="koyu"
        id="markalar"
        sinif="af-kr-iri"
        ustEtiket={ANA_SAYFA.guven.ustEtiket}
        baslik="Birlikte çalıştığımız markalardan bazıları"
        giris="Logosu burada duran her marka gerçek bir iş. Elimizde ölçülebilir rakam olmayan işlerde rakam değil, ne teslim ettiğimizi yazıyoruz."
        genislik="tasma"
        akis="duz"
      >
        <MarkaSeridi bant="koyu" />
      </Bolum>

      {/* ================================================================
          SON ÇAĞRI
          ================================================================ */}
      <Bolum
        bant="beyaz"
        id="cagri"
        sinif="af-kr-iri"
        ustEtiket="Başlangıç"
        baslik="Tanışmanın en kolay yolu: ücretsiz analiz."
        giris={BIRINCIL_CAGRI.altMetin}
        genislik="dar"
        orta
        akis="imza"
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-hak-orta-dugmeler">
          <Dugme buyuk href={siteYolu('/analiz')}>
            {BIRINCIL_CAGRI.etiket}
          </Dugme>
          <Dugme tur="ikincil" href={waBaglanti} whatsapp>
            <IkonWhatsApp />
            WhatsApp’tan yazın
          </Dugme>
        </div>
      </Bolum>

      <Isik />
    </div>
  );
}
