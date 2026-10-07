import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import { IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { EKSIKLER, SEKTORLER as PANEL_SEKTORLERI } from '@/lib/adaylar';
import { ILETISIM, MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { ANA_SAYFA, SEKTORLER, SSS_GENEL, SUREC, sektorYolu } from '@/lib/site-icerik';
import Iz from '../iletisim/_ortak/Iz';
import Isik from '../iletisim/_ortak/Isik';
import { Plaka } from '../iletisim/_ortak/Plaka';
import { izYapisalVerisi, kademe, type IzOgesi } from '../iletisim/_ortak/kurumsal';
import TalepFormu from '../iletisim/TalepFormu';
import AdimRayi, { type RayAdimi } from './AdimRayi';
import AkisOzeti from './AkisOzeti';
import EksikSecimi from './EksikSecimi';
import SektorSecimi from './SektorSecimi';
import './sayfa.css';

const YOL = '/analiz';
const FORM_ID = 'af-analiz-formu';
const BASLIK = 'Ücretsiz Dijital Analiz';
const ACIKLAMA =
  'Sektörünüzü seçin, eksikleri işaretleyin. Instagram hesabınıza, web sitenize ve Google profilinize bakıp eksikleri yazılı paylaşıyoruz. Ücretsiz ve bağlayıcı değil.';

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: [
    'ücretsiz dijital analiz',
    'sosyal medya analizi',
    'web sitesi incelemesi',
    'Google İşletme Profili kontrolü',
  ],
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
  { ad: 'Ücretsiz analiz', yol: YOL },
];

/* Yapısal veri: Service + BreadcrumbList. Fiyat/teklif alanı YAZILMAZ. */
function yapisalVeri() {
  const kok = siteAdresi();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${kok}${YOL}#hizmet`,
        name: 'Ücretsiz dijital analiz',
        serviceType: 'Dijital varlık incelemesi',
        description: ACIKLAMA,
        url: `${kok}${YOL}`,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: { '@type': 'Country', name: 'Türkiye' },
        audience: { '@type': 'BusinessAudience', name: 'Küçük ve orta ölçekli işletmeler' },
      },
      { ...izYapisalVerisi(kok, IZ), '@id': `${kok}${YOL}#iz` },
    ],
  };
}

/* Adım 1 çipleri: sayfa sözlüğündeki sektörler + listede olmayanlar için
   "Başka bir iş" (panel sözlüğündeki "diger" anahtarı). */
const SEKTOR_CIPLERI = [
  ...SEKTORLER.map((s) => ({ anahtar: s.anahtar, ad: s.ad, yol: sektorYolu(s) })),
  { anahtar: 'diger', ad: 'Başka bir iş', yol: undefined },
];

const EKSIK_SECENEKLERI = EKSIKLER.map((e) => ({ anahtar: e.anahtar, ad: e.ad }));
const OZET_ONERILERI = EKSIKLER.map((e) => ({
  anahtar: e.anahtar,
  baslik: e.baslik,
  hizmet: e.hizmet,
}));
const FORM_SEKTORLERI = PANEL_SEKTORLERI.map((s) => ({ anahtar: s.anahtar, ad: s.ad }));

const RAY_ADIMLARI: RayAdimi[] = [
  { id: 'adim-1', no: '01', ad: 'Sektör' },
  { id: 'adim-2', no: '02', ad: 'Eksikler' },
  { id: 'adim-3', no: '03', ad: 'İletişim' },
];

/* Analiz adımının çıktıları içerik dosyasından gelir (SUREC[0]). */
const ANALIZ_ADIMI = SUREC[0];

const ANALIZ_SSS = SSS_GENEL.filter((s) =>
  [
    'Ücretsiz dijital analiz tam olarak nedir?',
    'Fiyatlarınız ne kadar?',
    'Yalnızca tek bir hizmet alabilir miyim?',
    'Ne zaman başlarız, ilk sonuçlar ne zaman görünür?',
  ].includes(s.soru),
);

export default function AnalizSayfasi() {
  const waBaglanti = whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappAnaliz);

  return (
    <div className="af-kr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

      {/* ================================================================
          GİRİŞ — PLAKA (sayfanın tek plakası)
          Harf kadrajı burada KULLANILMIYOR: bu sayfa bir araç, imza
          değil. Nefes kesen an plakanın kendisi + devasa başlık +
          kenara dayanan veri şeridi.
          ================================================================ */}
      <div data-alt-cta-gizle>
        <Plaka>
          <Iz ogeler={IZ} />

          <p className="af-ust-etiket af-an-etiket">Ücretsiz dijital analiz · üç adım</p>
          <h1 className="af-an-bas">Dijitalde nerede durduğunuzu üç adımda öğrenin.</h1>
          <p className="af-giris af-an-giris">
            İşinizi seçin, eksik gördüğünüz yerleri işaretleyin, iletişim bilgilerinizi bırakın.
            Geri kalanı bizde: hesaplarınıza bakıp ne işe yaradığını, neyin boşa gittiğini ve
            nereden başlanması gerektiğini yazıyoruz.
          </p>

          <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
            <Dugme buyuk href="#adim-1">
              1. adımdan başla
            </Dugme>
            <Dugme tur="ikincil" href={waBaglanti} whatsapp>
              <IkonWhatsApp />
              Formu doldurmak istemiyorum
            </Dugme>
          </div>

          <div className="af-veri-serit af-kr-veri-dev af-an-veri">
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Adım</span>
              <span className="af-veri-deger">3</span>
              <span className="af-veri-not">sektör · eksikler · iletişim</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Zorunlu alan</span>
              <span className="af-veri-deger">3</span>
              <span className="af-veri-not">işletme · ad · telefon</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Ücret</span>
              <span className="af-veri-deger">yok</span>
              <span className="af-veri-not">bağlayıcı değil</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Dönüş</span>
              <span className="af-veri-deger">aynı gün</span>
              <span className="af-veri-not">telefon ya da WhatsApp</span>
            </div>
          </div>
        </Plaka>
      </div>

      {/* ================================================================
          ARAÇ GÖVDESİ
          Yapışkan ray yalnız BU sarmalayıcının içinde yapışır: üç adım
          bitince serbest bırakır, SSS'yi takip etmez. Plakadan kâğıt
          banda geçişi de bu koyu şerit yapıyor — bu yüzden analizde
          `clip-path` kesik kenarı KULLANILMIYOR (kesik, yapışkan ögeyi
          kırpma bağlamına alıp bozardı).
          ================================================================ */}
      <div className="af-an-arac">
        <AdimRayi adimlar={RAY_ADIMLARI} eksikSayisi={EKSIK_SECENEKLERI.length} />

        {/* ---------------- ADIM 1 — sektör ---------------- */}
        <Bolum bant="kagit" id="adim-1" sinif="af-an-ekran" akis="kare">
          <div className="af-an-adim">
            <span className="af-an-adim-no" aria-hidden="true">
              01
            </span>
            <div>
              <h2 className="af-an-adim-bas" id="af-an-sektor-baslik">
                İşiniz hangisi?
              </h2>
              <p className="af-giris af-an-adim-giris">
                Bir go kart pistiyle bir hukuk bürosunun dijital ihtiyacı aynı değil. Seçiminiz bu
                ziyaret boyunca sayfalarda korunur ve formda hazır gelir.
              </p>
            </div>
          </div>

          <div className="af-an-cipler">
            <SektorSecimi sektorler={SEKTOR_CIPLERI} etiketId="af-an-sektor-baslik" />
          </div>
        </Bolum>

        {/* ---------------- ADIM 2 — eksikler + Akış Kartı ---------------- */}
        <Bolum bant="beyaz" id="adim-2" sinif="af-an-ekran" akis="veri">
          <div className="af-an-adim">
            <span className="af-an-adim-no" aria-hidden="true">
              02
            </span>
            <div>
              <h2 className="af-an-adim-bas" id="af-an-eksik-baslik">
                Sizce neyin eksiği var?
              </h2>
              <p className="af-giris af-an-adim-giris">
                Aklınıza ilk geleni işaretleyin; emin olmadıklarınızı boş bırakın. Analizde zaten
                hepsine bakıyoruz — bu liste yalnızca sizin önceliğinizi anlamamızı sağlıyor.
              </p>
            </div>
          </div>

          <div className="af-an-duzen">
            <div>
              <div className="af-an-cipler">
                <EksikSecimi
                  eksikler={EKSIK_SECENEKLERI}
                  etiketId="af-an-eksik-baslik"
                  formId={FORM_ID}
                />
              </div>
              <p className="af-yardim af-ust-16">
                İşaretlediğiniz maddeler aşağıdaki forma otomatik ekleniyor; tekrar yazmanız
                gerekmiyor.
              </p>
            </div>

            <AkisOzeti
              sektorler={SEKTOR_CIPLERI}
              oneriler={OZET_ONERILERI}
              cagri={{ etiket: '3. adıma geç', href: '#adim-3' }}
              yapiskan
            />
          </div>
        </Bolum>

        {/* ---------------- ÇIKTI — koyu bant (ne alıyorsunuz) ---------------- */}
        <Bolum
          bant="koyu"
          id="cikti"
          sinif="af-kr-iri"
          ustEtiket="Analizde ne alıyorsunuz"
          baslik={ANALIZ_ADIMI.baslik}
          giris={ANALIZ_ADIMI.aciklama}
          akis="duz"
        >
          <div className="af-an-cikti">
            <div className="af-kart af-kart--genis" data-isik data-belir>
              <p className="af-ust-etiket">Elinize geçen</p>
              <ul className="af-tikli af-an-cikti-liste">
                {ANALIZ_ADIMI.ciktilar.map((c) => (
                  <li key={c}>
                    <IkonTik />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="af-kart af-kart--genis" data-isik data-belir style={kademe(1)}>
              <p className="af-ust-etiket">Nereye bakıyoruz</p>
              <ul className="af-tikli af-an-cikti-liste">
                {ANA_SAYFA.sonCagri.maddeler.map((m) => (
                  <li key={m}>
                    <IkonTik />
                    {m}
                  </li>
                ))}
              </ul>
              <p className="af-dugme-not">
                Rakam vaadi vermiyoruz; ne yapacağımızı ve neyi ölçeceğimizi yazıyoruz.
              </p>
            </div>
          </div>
        </Bolum>

        {/* ---------------- ADIM 3 — form ---------------- */}
        <Bolum bant="kagit" id="adim-3" sinif="af-an-ekran" akis="imza">
          <div className="af-an-adim">
            <span className="af-an-adim-no" aria-hidden="true">
              03
            </span>
            <div>
              <h2 className="af-an-adim-bas">Size nasıl dönelim?</h2>
              <p className="af-giris af-an-adim-giris">
                Telefon numarası olmadan dönemiyoruz; kalan alanlar isteğe bağlı. Seçtiğiniz sektör
                ve işaretlediğiniz eksikler bu talebe ekli gidiyor.
              </p>
            </div>
          </div>

          <div className="af-an-form-sarmal">
            <div className="af-kart af-an-form-kart" id="form">
              <p className="af-an-form-ust">
                <span className="af-mono-etiket af-mono-etiket--vurgu">Analiz talebi</span>
                <span className="af-an-form-not">3 zorunlu alan · 1 onay</span>
              </p>
              <TalepFormu
                sektorler={FORM_SEKTORLERI}
                eksikler={EKSIK_SECENEKLERI}
                tesekkurYolu={siteYolu('/tesekkurler')}
                kvkkYolu={siteYolu('/kvkk')}
                akisModu
                formId={FORM_ID}
                gonderEtiketi="Analizimi istiyorum"
              />
            </div>

            <p className="af-dugme-not af-ust-24">
              Form yerine konuşmayı tercih ederseniz{' '}
              <a className="af-bag" href={ILETISIM.telefonBaglanti}>
                {ILETISIM.telefonGorunum}
              </a>{' '}
              numarasını arayabilir ya da{' '}
              <a className="af-bag" href={ILETISIM.instagramDm}>
                Instagram’dan DM
              </a>{' '}
              gönderebilirsiniz.
            </p>
          </div>
        </Bolum>
      </div>

      {/* ================================================================
          SSS — araç gövdesinin dışında, ray burada yapışmaz
          ================================================================ */}
      <Bolum
        bant="beyaz"
        id="sss"
        sinif="af-kr-iri"
        ustEtiket="Sık sorulanlar"
        baslik="Analiz öncesi merak edilenler"
        genislik="dar"
      >
        <SSS sorular={ANALIZ_SSS} grup="af-analiz-sss" />
        <p className="af-dugme-not af-ust-24">
          Burada cevabını bulamadığınız her şeyi{' '}
          <a className="af-bag" href={siteYolu('/iletisim')}>
            iletişim sayfasından
          </a>{' '}
          doğrudan sorabilirsiniz. {MARKA.ad}, {ILETISIM.adres}.
        </p>
      </Bolum>

      <Isik />
    </div>
  );
}
