import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import MarkaSeridi from '@/components/site/MarkaSeridi';
import { IkonOk, IkonWhatsApp } from '@/components/site/Ikonlar';
import { MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import { BIRINCIL_CAGRI, SEKTORLER, medyaYolu, sektorVakasi, sektorYolu } from '@/lib/site-icerik';
import { ikiBasamak, kisaVaat, oranaUygun, vakaFotograflari } from './ortak';
import './sayfa.css';

const YOL = '/sektorler';
const BASLIK = 'Sektörler — Web Sitesi ve Sosyal Medya';
const ACIKLAMA =
  'Kafe, oto galeri, go kart, klinik, mimar, otel, emlak: her sektör için web sitesi ' +
  `tarafını ve sosyal medya tarafını ayrı anlattığımız ${SEKTORLER.length} sayfa.`;

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: ['sektöre özel web sitesi', 'sektör sosyal medya yönetimi', 'dijital pazarlama ajansı'],
  alternates: { canonical: YOL },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: MARKA.ad,
    url: YOL,
    title: `${BASLIK} | ${MARKA.ad}`,
    description: ACIKLAMA,
  },
};

/** Örnek işi olan sektör sayısı — veriden sayılır, elle yazılmaz. */
const ORNEK_IS_SAYISI = SEKTORLER.filter((s) => Boolean(s.ornekIs)).length;

/* ------------------------------------------------------------------ */
/* HARF KADRAJI — tek satır varyantı (sayfada EN ÇOK BİR kez)          */
/*                                                                     */
/* Harfin içinde duran kare GERÇEK: gece go-kart pistinin durağan      */
/* karesi (24 KB AVIF / 48 KB WebP, 1024x576). Video DEĞİL: hub'da     */
/* hareket eden bir kadraj 971 KB'ı LCP penceresine sokar ve bu sayfa  */
/* zaten vitrinde 4 gerçek fotoğraf taşıyor. Konsept "zenginlik DURAN  */
/* karede" diyor; burada da öyle uygulandı.                            */
/*                                                                     */
/* Kişi koruması: açıklık karenin üst %25'ini asla göstermez           */
/* (`--sk-kadraj: 50% 58%`, giris.css ile aynı değer).                 */
/* ------------------------------------------------------------------ */
const DOLGU_AVIF = medyaYolu('poster/hk-dolgu-gece-grid.avif');
const DOLGU_WEBP = medyaYolu('poster/hk-dolgu-gece-grid.webp');

/** Giriş cümlesinin üç "derdi" — metin aynen, yalnız düzeni veri şeridi. */
const DERTLER: ReadonlyArray<[string, string]> = [
  ['Bir kafenin derdi', 'menü ve harita görünürlüğü'],
  ['Bir oto galerinin derdi', 'ilan ve değerleme'],
  ['Bir anaokulunun derdi', 'velinin güveni'],
];

/** Her sektör sayfasında tekrarlanan dört bölüm. */
const ISKELET = [
  {
    baslik: 'Sektörün derdi',
    metin: 'Satış cümlesiyle değil, o işin günlük sıkıntısıyla başlıyoruz: dolmayan seans, kaybolan ilan, masada anlatılan menü.',
  },
  {
    baslik: 'Web sitesi tarafı',
    metin: 'Sektöre özel entegrasyonlar: rezervasyon ve seans takvimi, değerleme formu, QR menü, randevu, portföy listesi, yönetim paneli.',
  },
  {
    baslik: 'Sosyal medya tarafı',
    metin: 'Çekim ve kurgu, paylaşım düzeni, Google İşletme Profili ve bölge hedefli reklam — hepsi aynı ekipten.',
  },
  {
    baslik: 'Örnek iş ve sık sorulanlar',
    metin: 'O sektörde gerçekten yaptığımız bir iş varsa gösteriyoruz. Yoksa müşteri uydurmuyoruz; yaklaşımımızı anlatıyoruz.',
  },
];

/* ------------------------------------------------------------------ */
/* Vitrin verisi: her sektör + (varsa) o sektörün GERÇEK karesi        */
/* Sahne kutusu 4/5 olduğu için en az kırpılan kare seçilir.           */
/* ------------------------------------------------------------------ */
const VITRIN = SEKTORLER.map((sektor, i) => {
  const vaka = sektorVakasi(sektor);
  return {
    sektor,
    sira: i + 1,
    vaka,
    kare: oranaUygun(vakaFotograflari(vaka), 0.8),
  };
});

/* ------------------------------------------------------------------ */
/* Yapısal veri: Service + ItemList + BreadcrumbList                   */
/* FAQPage KULLANILMAZ (SITE-TASARIM.md §9).                           */
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
        name: 'Sektöre özel web sitesi ve sosyal medya yönetimi',
        serviceType: 'Dijital pazarlama ve yazılım',
        description: ACIKLAMA,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: 'TR',
      },
      {
        '@type': 'ItemList',
        '@id': `${adres}#liste`,
        name: 'Sektörler',
        numberOfItems: SEKTORLER.length,
        itemListElement: SEKTORLER.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.ad,
          url: `${kok}${YOL}/${s.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#iz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Sektörler', item: adres },
        ],
      },
    ],
  };
}

export default function SektorlerSayfasi() {
  const waMetni = `Merhaba, ${MARKA.ad} sitesindeki sektörler sayfasından yazıyorum. Ücretsiz dijital analiz istiyorum.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

      {/* ============ İz şeridi ============
          Üst bar yapışkan ve kâğıt kutupta. Saf siyah plaka sayfanın ilk
          pikselinden başlasaydı beyaz cam şerit plakanın üstünde dururdu.
          44px'lik bu kâğıt şerit barı kendi kutbunda bırakır, plaka onun
          altından perde gibi açılır. */}
      <div className="af-sk-iz-serit">
        <div className="af-sk-iz-ic">
          <nav className="af-sektor-iz" aria-label="Site yolu">
            <a href={siteYolu('/')}>Ana sayfa</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Sektörler</span>
          </nav>
          <p className="af-sk-iz-sayac">
            <b>{SEKTORLER.length}</b>&nbsp;sektör · <b>{ORNEK_IS_SAYISI}</b>&nbsp;örnek iş
          </p>
        </div>
      </div>

      {/* ============ S1 · PLAKA ============ */}
      <section
        className="af-sk-plaka af-sk-kesik-oncesi"
        data-akis="duz"
        data-alt-cta-gizle
        aria-labelledby="af-sk-baslik"
      >
        <span className="af-sk-isik" aria-hidden="true" />
        <span className="af-sk-zerre" aria-hidden="true" />

        <div className="af-sk-plaka-ic">
          <p className="af-ust-etiket">Sektörler</p>

          <div className="af-sk-oyuk">
            {/* --- blend yığını: taban → düzlem → maske ---
                Knockout kopyası; gerçek metin AŞAĞIDAKİ <h1>. Bu katman
                yalnız hangi satırın "açık" olduğunu söyler. */}
            <div className="af-sk-duvar" aria-hidden="true">
              <span className="af-sk-taban" />
              <div className="af-sk-plan">
                <picture>
                  <source srcSet={DOLGU_AVIF} type="image/avif" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={DOLGU_WEBP} alt="" width={1024} height={576} decoding="async" />
                </picture>
              </div>
              <div className="af-sk-maske">
                <p className="af-sk-satirlar">
                  <span className="af-sk-satir af-sk-satir--dolu">
                    <span className="af-sk-i">{'Her iş '}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* <h1> TEK, GERÇEK ve TAM bir cümledir. Görsel olarak dört
                satıra bölünür ama anlamı bölünmez; seçilebilir, SSR'da
                basılı. Elle `aria-label` EKLENMEZ (çift okuma olur). */}
            <h1 className="af-sk-satirlar af-sk-yazi" id="af-sk-baslik">
              <span className="af-sk-satir af-sk-satir--dolu">
                <span className="af-sk-i">{'Her iş '}</span>
              </span>
              <span className="af-sk-satir">
                <span className="af-sk-i">{'aynı siteyle, '}</span>
              </span>
              <span className="af-sk-satir">
                <span className="af-sk-i">{'aynı içerikle '}</span>
              </span>
              <span className="af-sk-satir">
                <span className="af-sk-i">{'yürümez'}</span>
              </span>
            </h1>
          </div>

          {/* Giriş paragrafı kırıldı: üç "derdi" veri satırına döndü,
              kelimeler aynen duruyor. */}
          <dl className="af-sk-dert">
            {DERTLER.map(([etiket, deger]) => (
              <div key={etiket}>
                <dt>{etiket}</dt>
                <dd>{deger}</dd>
              </div>
            ))}
          </dl>
          <p className="af-giris af-ust-24 af-dar-metin">
            Bu yüzden her sektörü ayrı anlatıyoruz: önce o işin gerçek sıkıntısı, sonra web sitesi
            tarafı, sonra sosyal medya tarafı.
          </p>

          <div className="af-sira af-ust-32">
            <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
              {BIRINCIL_CAGRI.etiket}
            </Dugme>
            <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
              <IkonWhatsApp />
              WhatsApp&apos;tan yazın
            </Dugme>
          </div>
          <p className="af-dugme-not af-ust-16">{BIRINCIL_CAGRI.altMetin}</p>
        </div>
      </section>

      {/* ============ S2 · VİTRİN ============ */}
      <Bolum
        bant="kagit"
        id="liste"
        sinif="af-sk-kesik"
        ustEtiket={`${SEKTORLER.length} sektör`}
        baslik="Sektörünüzü seçin"
        giris="Her satır sizi o sektörün sayfasına götürür. Listede işinizi bulamazsanız yine yazın; çalışma biçimi aynı."
        akis="kare"
      >
        <div className="af-veri-serit af-ust-0">
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Sektör sayfası</span>
            <span className="af-veri-deger" data-sayac={SEKTORLER.length}>
              {SEKTORLER.length}
            </span>
            <span className="af-veri-not">ayrı ayrı yazıldı</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Örnek iş</span>
            <span className="af-veri-deger" data-sayac={ORNEK_IS_SAYISI}>
              {ORNEK_IS_SAYISI}
            </span>
            <span className="af-veri-not">sektörde gerçek iş</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Her sayfada</span>
            <span className="af-veri-deger">2</span>
            <span className="af-veri-not">web + sosyal</span>
          </div>
        </div>

        <div className="af-vitrin af-ust-32">
          <ol className="af-vitrin-liste">
            {VITRIN.map(({ sektor, sira, vaka, kare }) => (
              <li
                className="af-vitrin-satir"
                key={sektor.anahtar}
                data-s={sira}
                data-belir
                style={{ ['--i' as string]: Math.min(sira - 1, 6) } as React.CSSProperties}
              >
                <a className="af-vitrin-bag" href={sektorYolu(sektor)}>
                  <span className="af-vitrin-no" aria-hidden="true">
                    {ikiBasamak(sira)}
                  </span>
                  <span className="af-vitrin-ad-kutu">
                    <span className="af-vitrin-ad">{sektor.ad}</span>
                  </span>
                  <span className="af-vitrin-yan">
                    {vaka ? (
                      <span className="af-vitrin-etiket">Örnek iş · {vaka.marka}</span>
                    ) : null}
                    <span className="af-vitrin-vaat">{kisaVaat(sektor)}</span>
                  </span>
                  <IkonOk className="af-vitrin-ok" />
                </a>
                {/* Mobilde sahne yok: gerçek kare satırın İÇİNDE durur,
                    oranı kilitli (CLS 0), tembel yüklenir. */}
                {kare ? (
                  <span className="af-vitrin-serit">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={kare.yol}
                      alt={kare.alt}
                      width={kare.genislik}
                      height={kare.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          {/* Sahne: masaüstünde yapışkan, oranı kilitli. Dekoratif —
              bütün bilgi satırların kendisinde zaten var. */}
          <div className="af-vitrin-sahne" aria-hidden="true">
            {VITRIN.map(({ sektor, sira, vaka, kare }) =>
              kare ? (
                <figure className="af-vitrin-kare" key={sektor.anahtar} data-s={sira}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={kare.yol}
                    alt=""
                    width={kare.genislik}
                    height={kare.yukseklik}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="af-vitrin-kare-alt">
                    <span>{vaka?.marka}</span>
                    <span>{ikiBasamak(sira)}</span>
                  </figcaption>
                </figure>
              ) : (
                <figure className="af-vitrin-kare" key={sektor.anahtar} data-s={sira}>
                  <div className="af-vitrin-levha">
                    <span className="af-vitrin-levha-no af-sk-gradyan">{ikiBasamak(sira)}</span>
                    <p className="af-vitrin-levha-metin">{kisaVaat(sektor)}</p>
                    <p className="af-vitrin-levha-alt">{sektor.ad}</p>
                  </div>
                </figure>
              ),
            )}
          </div>
        </div>
      </Bolum>

      {/* ============ S3 · SAYFA İSKELETİ (ray) ============ */}
      <Bolum
        bant="koyu"
        ustEtiket="Sayfalarda ne var"
        baslik="Dört bölüm, hep aynı sırada"
        giris="Sektör sayfaları birbirinin kopyası değil ama aynı iskelet üzerine kurulu; aradığınızı aynı yerde buluyorsunuz."
        akis="veri"
      >
        <ol className="af-sk-ray">
          {ISKELET.map(({ baslik, metin }, i) => (
            <li
              key={baslik}
              data-belir
              style={{ ['--i' as string]: i } as React.CSSProperties}
            >
              <span className="af-sk-ray-no af-sk-gradyan" aria-hidden="true">
                {ikiBasamak(i + 1)}
              </span>
              <h3>{baslik}</h3>
              <p>{metin}</p>
            </li>
          ))}
        </ol>
      </Bolum>

      {/* ============ S4 · Marka şeridi ============ */}
      <Bolum
        bant="kagit"
        ustEtiket="Referans"
        baslik="Birlikte çalıştığımız markalar"
        giris="Farklı sektörlerden 12+ markayla çalıştık. Aşağıdaki şeritte işlerini yürüttüğümüz markalar var; logosu olmayanlar adıyla geçiyor."
        genislik="tasma"
        akis="veri"
      >
        <MarkaSeridi bant="kagit" />
      </Bolum>

      {/* ============ S5 · Çağrı ============ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        ustEtiket="Sırada ne var"
        baslik="İşiniz hangi sektörde olursa olsun başlangıç aynı"
        giris="Instagram hesabınıza, varsa web sitenize ve Google profilinize bakıp eksikleri yazılı paylaşıyoruz. Sonrasında ne yapılacağına birlikte karar veriyoruz."
        akis="imza"
      >
        <div className="af-sektor-cagri" data-alt-cta-gizle>
          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
              {BIRINCIL_CAGRI.etiket}
            </Dugme>
            <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
              <IkonWhatsApp />
              WhatsApp
            </Dugme>
          </div>
          <p className="af-dugme-not">
            Sitede fiyat yazmıyoruz: kapsamı konuşup size özel teklif çıkarıyoruz.
          </p>
        </div>
      </Bolum>
    </>
  );
}
