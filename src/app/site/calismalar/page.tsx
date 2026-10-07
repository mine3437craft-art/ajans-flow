import type { Metadata } from 'next';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import MarkaSeridi from '@/components/site/MarkaSeridi';
import { IkonOkAsagi, IkonWhatsApp } from '@/components/site/Ikonlar';
import { ANA_SAYFA, BIRINCIL_CAGRI, VAKALAR } from '@/lib/site-icerik';
import { siteYolu, whatsappBaglantisi } from '@/lib/site';
import Duvar from './Duvar';
import ImlecIsigi from './ImlecIsigi';
import VitrinKarti from './VitrinKarti';
import {
  ARSIV,
  CALISMALAR_YOLU,
  FILTRELER,
  KADRAJ_KLIBI,
  KAPILI_SEKTORLER,
  kisalt,
  tamAdres,
} from './ortak';
import './sayfa.css';

const BASLIK = 'Çalışmalar: gerçek markalar, gerçek işler';
const ACIKLAMA = kisalt(
  `${VAKALAR.map((v) => v.marka).join(', ')} için yaptığımız işler: çekim, içerik, web ve yazılım.`,
);

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  alternates: { canonical: CALISMALAR_YOLU },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: CALISMALAR_YOLU,
    title: BASLIK,
    description: ACIKLAMA,
  },
  twitter: { card: 'summary_large_image', title: BASLIK, description: ACIKLAMA },
};

/* ------------------------------------------------------------------ */
/* JS'siz filtre ve sektör kapısı kuralları — veriden üretilir, böylece
   hizmet ya da vaka listesi değişince elle güncelleme gerekmez.       */
/* ------------------------------------------------------------------ */

const URETILEN_CSS = [
  ...FILTRELER.map(
    (f) =>
      `.af-vk-liste:has(#vk-f-${f.anahtar}:checked) .af-vk-kart:not([data-vk-hizmet~="${f.anahtar}"]){display:none}`,
  ),
  ...KAPILI_SEKTORLER.flatMap((s) => [
    `:root[data-sektor="${s.anahtar}"] .af-vk-kart[data-vk-sektor~="${s.anahtar}"]{order:-1}`,
    `:root[data-sektor="${s.anahtar}"] .af-vk-kart[data-vk-sektor~="${s.anahtar}"] .af-vk-sizin{display:inline-flex}`,
  ]),
].join('\n');

/* ------------------------------------------------------------------ */
/* Veri şeridi — hepsi SAYIM (vaka verisi + medya künyesi). Uydurma
   oran, yüzde ya da "artış" yok; 12+ marka içerik kurallarındaki
   doğrulanmış rakam.                                                  */
/* ------------------------------------------------------------------ */

const SERIT: { etiket: string; deger: number; ek?: string; not: string }[] = [
  { etiket: 'Çalışma', deger: ARSIV.calisma, not: 'yazılı vaka' },
  { etiket: 'İş kolu', deger: ARSIV.sektor, not: 'kafeden otomotive' },
  { etiket: 'Hizmet', deger: ARSIV.hizmet, not: 'bu işlerde kullandık' },
  { etiket: 'Klip', deger: ARSIV.klip, not: 'çekip kurguladık' },
  { etiket: 'Kare', deger: ARSIV.kare, not: 'fotoğraf arşivi' },
  { etiket: 'Marka', deger: 12, ek: '+', not: 'birlikte çalıştık' },
];

/* ------------------------------------------------------------------ */
/* Yapısal veri — CollectionPage + ItemList + BreadcrumbList            */
/* ------------------------------------------------------------------ */

function yapisalVeri() {
  const adres = tamAdres(CALISMALAR_YOLU);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${adres}#liste`,
        url: adres,
        name: BASLIK,
        description: ACIKLAMA,
        inLanguage: 'tr-TR',
        publisher: { '@id': `${tamAdres()}/#kurulus` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: VAKALAR.length,
          itemListOrder: 'https://schema.org/ItemListUnordered',
          itemListElement: VAKALAR.map((v, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: tamAdres(`${CALISMALAR_YOLU}/${v.slug}`),
            name: `${v.marka} — ${v.baslik}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#yoliz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: tamAdres('/') },
          { '@type': 'ListItem', position: 2, name: 'Çalışmalar', item: adres },
        ],
      },
    ],
  };
}

export default function CalismalarSayfasi() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />
      <style>{URETILEN_CSS}</style>

      {/* ============================================================
          1. PLAKA — bölümün tek "nefes kesen" anı. Siyah plaka
          (--af-plaka), harf kadrajı: ÇALIŞMALAR kelimesinin içinden
          gerçek klip akar. Plakada ÜÇ işaret var (duvar · cümle ·
          çağrı); dördüncüsü konulmadı. Mobil alt şerit burada gizli.
          ============================================================ */}
      <div data-alt-cta-gizle>
        <section className="af-vk-plaka" data-akis="duz" aria-labelledby="af-vk-bas">
          <span className="af-vk-havuz" aria-hidden="true" />
          <span className="af-vk-zerre" aria-hidden="true" />

          <div className="af-vk-plaka-ic">
            <Duvar
              kelime="Çalışmalar"
              klip={KADRAJ_KLIBI}
              sira={0}
              etiket="h1"
              id="af-vk-bas"
            />

            <p className="af-vk-plaka-cumle">{ANA_SAYFA.vakalar.baslik}</p>
            <p className="af-giris af-vk-plaka-giris">{ANA_SAYFA.vakalar.giris}</p>

            <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
              <Dugme href={siteYolu(BIRINCIL_CAGRI.href)} buyuk>
                {BIRINCIL_CAGRI.etiket}
              </Dugme>
              <Dugme tur="hayalet" href="#liste">
                Listeye in
                <IkonOkAsagi />
              </Dugme>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          2. VERİ ŞERİDİ — alt kenarı kesik (clip-path, 0 bayt): koyu
          bant beyaz vitrine çapraz giriyor.
          ============================================================ */}
      <Bolum bant="koyu" sikis sinif="af-vk-veri-bant af-vk-kesik-alt" akis="veri">
        <div className="af-veri-serit af-vk-veri">
          {SERIT.map((o) => (
            <div className="af-veri-oge" key={o.etiket}>
              <span className="af-veri-etiket">{o.etiket}</span>
              <span className="af-veri-deger" data-sayac={o.deger} data-ek={o.ek}>
                {o.deger}
                {o.ek ?? ''}
              </span>
              <span className="af-veri-not">{o.not}</span>
            </div>
          ))}
        </div>
        <p className="af-dugme-not af-vk-veri-not">{ANA_SAYFA.guven.notlar[1]}</p>
      </Bolum>

      {/* ============================================================
          3. VİTRİN — ölçek farklı büyük kartlar, JS'siz hizmet filtresi
          ============================================================ */}
      <Bolum
        bant="beyaz"
        id="liste"
        ustEtiket="Liste"
        baslik="Hangi işi görmek istersiniz?"
        akis="kare"
      >
        <div className="af-vk-liste">
          <fieldset className="af-vk-filtre-kutu">
            <legend className="af-etiket af-vk-filtre-bas">Hizmete göre süzün</legend>
            <div className="af-vk-filtre">
              <label className="af-cip af-vk-cip">
                <input type="radio" name="vk-filtre" id="vk-f-tumu" value="tumu" defaultChecked />
                Tümü
                <span className="af-vk-cip-sayi">{VAKALAR.length}</span>
              </label>
              {FILTRELER.map((f) => (
                <label className="af-cip af-vk-cip" key={f.anahtar}>
                  <input type="radio" name="vk-filtre" id={`vk-f-${f.anahtar}`} value={f.anahtar} />
                  {f.etiket}
                  <span className="af-vk-cip-sayi">{f.sayi}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="af-vk-vitrin af-ust-32">
            {VAKALAR.map((vaka, i) => (
              <VitrinKarti key={vaka.slug} vaka={vaka} sira={i} />
            ))}
          </div>
        </div>

        <p className="af-dugme-not af-vk-filtre-not">
          Her kartta o işte kullandığımız hizmetler yazılı; çalışmanın tamamını açınca
          müşterinin sorunu, yaptıklarımız ve teslim ettiğimiz çıktılar sırayla okunur.
        </p>
      </Bolum>

      {/* ============================================================
          4. REFERANS ŞERİDİ — üst kenarı kesik (beyaz vitrine çapraz)
          ============================================================ */}
      <Bolum
        bant="koyu"
        genislik="tasma"
        sinif="af-vk-kesik-ust"
        ustEtiket="Referanslar"
        baslik={ANA_SAYFA.guven.ustEtiket}
        giris={`Yukarıdaki ${ARSIV.calisma} işin hikâyesini bu sayfada yazdık. Şeritteki diğer markalarla da içerik, tasarım ve çekim tarafında çalıştık.`}
        akis="veri"
      >
        <MarkaSeridi bant="koyu" />
      </Bolum>

      {/* ============================================================
          5. SON ÇAĞRI
          ============================================================ */}
      <Bolum
        bant="kagit"
        orta
        genislik="dar"
        akis="imza"
        ustEtiket={ANA_SAYFA.sonCagri.ustEtiket}
        baslik={ANA_SAYFA.sonCagri.baslik}
        giris={ANA_SAYFA.sonCagri.aciklama}
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-vk-orta-sira">
          <Dugme href={siteYolu(BIRINCIL_CAGRI.href)} buyuk>
            {ANA_SAYFA.sonCagri.cagri}
          </Dugme>
          <Dugme
            tur="ikincil"
            href={whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappGenel)}
            whatsapp
          >
            <IkonWhatsApp />
            WhatsApp’tan yazın
          </Dugme>
        </div>
        <p className="af-dugme-not">{BIRINCIL_CAGRI.altMetin}</p>
      </Bolum>

      <ImlecIsigi />
    </>
  );
}
