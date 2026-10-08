import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import MarkaSeridi from '@/components/site/MarkaSeridi';
import SSS from '@/components/site/SSS';
import { CerceveTelefon } from '@/components/site/Cerceve';
import { Ikon, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  ANA_SAYFA,
  BIRINCIL_CAGRI,
  HIZMETLER,
  SSS_GENEL,
  SSS_GENEL_BOLUMU,
  SUREC,
  SUREC_BOLUMU,
  hizmetYolu,
  medyaYolu,
  type Hizmet,
} from '@/lib/site-icerik';
import {
  GRUP_MOZAIK,
  HIZMET_GRUPLARI,
  HIZMET_SAYISI_YAZI,
  grupHizmetleri,
  hizmetGrubu,
  hizmetIkonu,
  type HizmetGrubu,
} from './gruplar';
import { Duvar, HeroDuzlemi, kadrajKat } from './kadraj';
import { hizmetMedyasi } from './medya';
import Isik from '../iletisim/_ortak/Isik';
import './sayfa.css';

const YOL = '/hizmetler';
const BASLIK = 'Hizmetler | Sosyal Medya, Reklam ve Yazılım';
const ACIKLAMA =
  'Sosyal medya yönetimi, fotoğraf ve video prodüksiyonu, Meta ve Google reklamları, web sitesi, QR dijital menü ve kurumsal kimlik. On beş hizmet, tek ekip.';

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: ['dijital ajans hizmetleri', 'sosyal medya ajansı İstanbul', 'reklam ajansı', 'web sitesi yazılım ajansı'],
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

/* Yapısal veri: hizmet listesi + site izi. FAQPage KULLANILMAZ. */
function yapisalVeri() {
  const kok = siteAdresi();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${kok}${YOL}#iz`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Hizmetler', item: `${kok}${YOL}` },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${kok}${YOL}#liste`,
        name: 'Ajans Flow hizmetleri',
        numberOfItems: HIZMETLER.length,
        itemListElement: HIZMETLER.map((h, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: h.ad,
          description: h.ozet,
          url: `${kok}/hizmetler/${h.slug}`,
        })),
      },
    ],
  };
}

function kademe(i: number): CSSProperties {
  return { ['--i' as string]: i } as CSSProperties;
}

/* ==================================================================== */
/* HERO DUVARI — sayfadaki TEK harf kadrajı                             */
/*                                                                      */
/* Metin bire bir eski H1 cümlesidir ("On beş hizmet, tek ekip, tek     */
/* takvim."); yalnız SATIR DÜZENİ değişti ve sayı artık                 */
/* HIZMETLER.length'ten türüyor. Dolu satır TEK: "tek ekip," — sayfanın */
/* iddiası tam orada ve harflerin içinden gerçek klip akıyor.           */
/* ==================================================================== */
const HERO_SATIRLARI = [
  { metin: `${HIZMET_SAYISI_YAZI} hizmet, ` },
  { metin: 'tek ekip, ', dolu: true },
  { metin: 'tek takvim. ' },
];

/* ==================================================================== */
/* Hub kartı — kartın tamamı tıklanabilir (görünmez kaplayan bağlantı)  */
/* ==================================================================== */
function HizmetKarti({ hizmet, sira }: { hizmet: Hizmet; sira: number }) {
  return (
    <article
      className="af-kart af-kart--tikla af-hz-isikli"
      data-isik
      data-belir
      style={kademe(sira)}
    >
      <div className="af-hz-kart-ust">
        <span className="af-ikon-kutu">
          <Ikon ad={hizmetIkonu(hizmet.anahtar)} />
        </span>
        <h3 className="af-kart-baslik">{hizmet.kisaAd}</h3>
      </div>
      <p className="af-kart-metin">{hizmet.ozet}</p>
      <p className="af-kart-alt">
        <span className="af-bag-ok" aria-hidden="true">
          İncele
          <Ikon ad="ok" />
        </span>
      </p>
      <a className="af-kaplayan-bag" href={hizmetYolu(hizmet)}>
        <span className="af-gizli-metin">{`${hizmet.ad} hizmetini inceleyin`}</span>
      </a>
    </article>
  );
}

/** Öbeğin başındaki ince çizgili ölçü satırı. */
function GrupUstu({ sayi, rejim }: { sayi: number; rejim: string }) {
  return (
    <div className="af-hz-grup-ust" data-belir>
      <p className="af-hz-grup-sayi">{sayi} hizmet</p>
      <p className="af-hz-grup-sayi">{rejim}</p>
    </div>
  );
}

/* ---- Mozaik: GERÇEK dosyalar, oranları bilerek farklı (CLS 0) ---- */
function Mozaik({ grup }: { grup: HizmetGrubu }) {
  const kutular = (GRUP_MOZAIK[grup.anahtar] ?? [])
    .map((dosya) => hizmetMedyasi(dosya))
    .filter((m) => m?.tur === 'gorsel' || m?.tur === 'telefon');
  if (kutular.length < 2) return null;
  return (
    <div className="af-hz-mozaik" data-belir="olcek">
      {kutular.map((m) =>
        m && (m.tur === 'gorsel' || m.tur === 'telefon') ? (
          <figure
            key={m.dosya}
            style={{ ['--af-oran' as string]: `${m.genislik} / ${m.yukseklik}` } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={medyaYolu(m.dosya)}
              alt={m.alt}
              width={m.genislik}
              height={m.yukseklik}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{m.altyazi}</figcaption>
          </figure>
        ) : null,
      )}
    </div>
  );
}

/* ==================================================================== */
/* REJİM 1 — KÂĞIT: editoryal. Mozaik + ölçek farklı kart dizisi.       */
/* ==================================================================== */
function KagitObegi({ grup, liste }: { grup: HizmetGrubu; liste: Hizmet[] }) {
  return (
    <Bolum
      id={grup.anahtar}
      bant={grup.bantHub}
      sinif="af-hz-iri-bas af-hz-doku af-hz-kesik-ust"
      ustEtiket={grup.ustEtiket}
      baslik={grup.ad}
      giris={grup.giris}
      akis={grup.akis}
    >
      <Mozaik grup={grup} />
      <div className="af-ust-32">
        <GrupUstu sayi={liste.length} rejim="Kâğıt bant · stüdyo" />
        <div className="af-hz-oncu">
          {liste.map((h, i) => (
            <HizmetKarti key={h.anahtar} hizmet={h} sira={i} />
          ))}
        </div>
      </div>
    </Bolum>
  );
}

/* ==================================================================== */
/* REJİM 2 — VERİ: her hizmet bir satır. Rakamlar İÇERİKTEN SAYILIR     */
/* (kapsam maddesi · süreç adımı · paket seçeneği). Uydurma oran,       */
/* "%X artış", fiyat YOK.                                              */
/* ==================================================================== */
const SURECIN_ADIMLARI = ['kurulum', 'hedefleme', 'ölçüm', 'rapor'];

function VeriObegi({ grup, liste }: { grup: HizmetGrubu; liste: Hizmet[] }) {
  return (
    <Bolum
      id={grup.anahtar}
      bant={grup.bantHub}
      sinif="af-hz-iri-bas af-hz-doku af-hz-kesik-once"
      ustEtiket={grup.ustEtiket}
      baslik={grup.ad}
      giris={grup.giris}
      akis={grup.akis}
    >
      <div className="af-cipler" data-belir>
        {SURECIN_ADIMLARI.map((adim, i) => (
          <span className="af-mono-etiket" key={adim}>
            {String(i + 1).padStart(2, '0')} · {adim}
          </span>
        ))}
      </div>

      <div className="af-ust-24">
        <GrupUstu sayi={liste.length} rejim="Veri şeridi · ölçüm" />
        <div className="af-hz-tablo" data-belir>
          <div className="af-hz-tablo-bas" aria-hidden="true">
            <span>No</span>
            <span>Hizmet</span>
            <span className="af-hz-tablo-sag">
              <span>Kapsam</span>
              <span>Adım</span>
              <span>Paket</span>
            </span>
          </div>
          {liste.map((h, i) => (
            <a className="af-hz-tablo-satir" key={h.anahtar} href={hizmetYolu(h)}>
              <span className="af-hz-tablo-no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="af-hz-tablo-ad">
                <strong>{h.kisaAd}</strong>
                <span>{h.ozet}</span>
              </span>
              <span className="af-hz-tablo-sag">
                <span className="af-hz-tablo-olcu">
                  <b>{h.neleriKapsar.length}</b>
                  <span aria-hidden="true">kapsam</span>
                </span>
                <span className="af-hz-tablo-olcu">
                  <b>{h.surec.length}</b>
                  <span aria-hidden="true">adım</span>
                </span>
                <span className="af-hz-tablo-olcu">
                  <b>{h.paket.length}</b>
                  <span aria-hidden="true">paket</span>
                </span>
                <Ikon ad="ok" className="af-hz-ok" />
              </span>
            </a>
          ))}
        </div>
        <p className="af-dugme-not af-ust-16">
          Şeritteki rakamlar bu sayfalarda yazılı madde sayılarıdır: kapsam maddesi, süreç adımı ve
          paket seçeneği. Reklam bütçesi hizmet bedelinden ayrıdır.
        </p>
      </div>
    </Bolum>
  );
}

/* ==================================================================== */
/* REJİM 3 — PLAKA: koyu plaka, devasa tek kelime, telefon çerçevesinde */
/* GERÇEK ürün ekranı. Sayfanın ikinci "nefes kesen" anı.               */
/* Bolum KULLANILMAZ: plaka kendi bant bağlamını yazıyor.               */
/* ==================================================================== */
function PlakaObegi({ grup, liste }: { grup: HizmetGrubu; liste: Hizmet[] }) {
  const mozaik = (GRUP_MOZAIK[grup.anahtar] ?? []).map((d) => hizmetMedyasi(d));
  return (
    <section
      id={grup.anahtar}
      className="af-hz-plaka af-hz-kesik-ust af-hz-kesik-once"
      data-akis={grup.akis}
    >
      <span className="af-hz-isik" aria-hidden="true" />
      <span className="af-hz-zerre" aria-hidden="true" />
      <div className="af-hz-plaka-ic af-hz-plaka-bant">
        <div className="af-kap">
          <div className="af-bolum-bas" data-belir>
            <p className="af-ust-etiket">{grup.ustEtiket}</p>
            {/* Devasa kelime öbek adının İÇİNDEN alınır; yeni metin
                değil, bu yüzden dekoratif ve ekran okuyucudan saklı. */}
            <p className="af-hz-tek-kelime" aria-hidden="true">
              <span>{grup.anahtarKelime}</span>
            </p>
            <h2 className="af-h2">{grup.ad}</h2>
            <p className="af-giris">{grup.giris}</p>
          </div>

          <GrupUstu sayi={liste.length} rejim="Plaka · yazılım" />

          <div className="af-hz-plaka-kartlar">
            {liste.map((h, i) => {
              const m = mozaik[i];
              return (
                <article
                  className="af-hz-plaka-kart af-hz-isikli"
                  key={h.anahtar}
                  data-isik
                  data-belir
                  style={kademe(i)}
                >
                  {m?.tur === 'telefon' ? (
                    <CerceveTelefon altyazi={m.altyazi} boy="kucuk">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={medyaYolu(m.dosya)}
                        alt={m.alt}
                        width={m.genislik}
                        height={m.yukseklik}
                        loading="lazy"
                        decoding="async"
                      />
                    </CerceveTelefon>
                  ) : null}
                  <p className="af-mono-etiket">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="af-hz-plaka-kart-ad">{h.kisaAd}</h3>
                  <p className="af-kart-metin">{h.ozet}</p>
                  <p className="af-kart-alt">
                    <span className="af-bag-ok" aria-hidden="true">
                      İncele
                      <Ikon ad="ok" />
                    </span>
                  </p>
                  <a className="af-kaplayan-bag" href={hizmetYolu(h)}>
                    <span className="af-gizli-metin">{`${h.ad} hizmetini inceleyin`}</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* REJİM 4 — İMZA: tek hizmetlik geniş şerit + logo vitrini             */
/* ==================================================================== */
function ImzaObegi({ grup, liste }: { grup: HizmetGrubu; liste: Hizmet[] }) {
  const vitrin = (GRUP_MOZAIK[grup.anahtar] ?? []).map((d) => hizmetMedyasi(d));
  const tekKelime = !/\s/.test(grup.ad.trim());
  return (
    <Bolum
      id={grup.anahtar}
      bant={grup.bantHub}
      sinif="af-hz-iri-bas af-hz-doku af-hz-kesik-ust"
      ustEtiket={grup.ustEtiket}
      akis={grup.akis}
    >
      <div className="af-hz-imza">
        <div data-belir>
          {/* Öbek adı tek kelimeyse ("Tasarım") devasa kelime başlığın
              KENDİSİDİR — aynı kelimeyi iki kez yazmak yerine. Çok
              kelimeliyse devasa kelime dekoratif kalır, başlık normal. */}
          {tekKelime ? (
            <h2 className="af-hz-tek-kelime af-hz-tek-kelime--acik">
              <span>{grup.ad}</span>
            </h2>
          ) : (
            <>
              <p className="af-hz-tek-kelime af-hz-tek-kelime--acik" aria-hidden="true">
                <span>{grup.anahtarKelime}</span>
              </p>
              <h2 className="af-h2 af-ust-16">{grup.ad}</h2>
            </>
          )}
          <p className="af-giris af-ust-16">{grup.giris}</p>
          <div className="af-ust-24">
            <GrupUstu sayi={liste.length} rejim="İmza · kimlik" />
            {liste.map((h, i) => (
              <a
                className="af-hz-bag-kart af-hz-isikli"
                key={h.anahtar}
                href={hizmetYolu(h)}
                data-isik
                style={kademe(i)}
              >
                <Ikon ad={hizmetIkonu(h.anahtar)} />
                {h.ad}
                <Ikon ad="ok" className="af-hz-ok" />
              </a>
            ))}
          </div>
        </div>

        <div className="af-hz-imza-vitrin" data-belir="olcek">
          {vitrin.map((m) => {
            if (m?.tur === 'logo') {
              return (
                <figure key={m.dosya}>
                  <div className="af-hz-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu(m.dosya)}
                      alt={m.alt}
                      width={m.genislik}
                      height={m.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="af-cerceve-altyazi">{m.altyazi}</figcaption>
                </figure>
              );
            }
            if (m?.tur === 'gorsel' || m?.tur === 'telefon') {
              return (
                <figure key={m.dosya}>
                  <div
                    className="af-gorsel-kutu"
                    style={{ ['--af-oran' as string]: `${m.genislik} / ${m.yukseklik}` } as CSSProperties}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu(m.dosya)}
                      alt={m.alt}
                      width={m.genislik}
                      height={m.yukseklik}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="af-cerceve-altyazi">{m.altyazi}</figcaption>
                </figure>
              );
            }
            return null;
          })}
        </div>
      </div>
    </Bolum>
  );
}

/* ==================================================================== */

export default function HizmetlerHub() {
  const waBaglanti = whatsappBaglantisi(ANA_SAYFA.hazirMesajlar.whatsappGenel);
  // Güvenlik ağı: içeriğe yeni bir hizmet eklenip gruba yazılmadıysa
  // sayfadan sessizce düşmesin.
  const grupsuz = HIZMETLER.filter((h) => !hizmetGrubu(h.anahtar));
  const heroKat = kadrajKat(HERO_SATIRLARI.map((s) => s.metin));

  return (
    <>
      <YapisalVeri veri={yapisalVeri()} />

      {/* ============ Hero — SİYAH PLAKA + harf kadrajı ============ */}
      <div data-alt-cta-gizle>
        <section className="af-hz-plaka af-hz-hero" data-akis="duz">
          {/* Işık ve zerre İÇERİĞİN ÜSTÜNDE (z 3/4): altta dururlarsa
              knockout maskesinin saf siyahı ışık havuzunu duvarın kutusu
              boyunca KESER ve video dikdörtgen olarak sızmış görünür. */}
          <span className="af-hz-isik" aria-hidden="true" />
          <span className="af-hz-zerre" aria-hidden="true" />

          <div className="af-hz-plaka-ic">
            <div className="af-kap">
              <nav className="af-hz-iz">
                <a href={siteYolu('/')}>Ana sayfa</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Hizmetler</span>
              </nav>

              <p className="af-ust-etiket af-hz-ust-24">
                Hizmetler · {HIZMETLER.length} başlık
              </p>

              <Duvar
                satirlar={HERO_SATIRLARI}
                kat={heroKat}
                baslikEtiketi="h1"
                duzlem={<HeroDuzlemi sira={0} />}
              />

              <p className="af-giris af-ust-24">
                Çekimden reklama, web sitesinden QR dijital menüye kadar ihtiyacınız olan işleri
                aynı masada yürütüyoruz. Tamamını almak zorunda değilsiniz: hangi başlığın işinize
                yarayacağını ücretsiz analizde birlikte seçiyoruz.
              </p>

              <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
                <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
                  {BIRINCIL_CAGRI.etiket}
                </Dugme>
                <Dugme tur="ikincil" href={waBaglanti} whatsapp>
                  <IkonWhatsApp />
                  WhatsApp’tan yazın
                </Dugme>
              </div>
              <p className="af-dugme-not">{BIRINCIL_CAGRI.altMetin}</p>

              <div className="af-cipler af-ust-32">
                {HIZMET_GRUPLARI.map((g) => (
                  <a className="af-cip af-hz-cip" key={g.anahtar} href={`#${g.anahtar}`}>
                    {g.cipEtiketi}
                  </a>
                ))}
              </div>

              <div className="af-veri-serit af-ust-24">
                <div className="af-veri-oge">
                  <span className="af-veri-etiket">Hizmet</span>
                  <span className="af-veri-deger">{HIZMETLER.length}</span>
                  <span className="af-veri-not">dört grupta</span>
                </div>
                <div className="af-veri-oge">
                  <span className="af-veri-etiket">Marka</span>
                  <span className="af-veri-deger" data-sayac="12" data-ek="+">
                    12+
                  </span>
                  <span className="af-veri-not">birlikte çalıştığımız</span>
                </div>
                <div className="af-veri-oge">
                  <span className="af-veri-etiket">Gönderi</span>
                  <span className="af-veri-deger" data-sayac="244" data-ek="+">
                    244+
                  </span>
                  <span className="af-veri-not">Instagram’da ürettik</span>
                </div>
                <div className="af-veri-oge">
                  <span className="af-veri-etiket">Merkez</span>
                  <span className="af-veri-deger">4.Levent</span>
                  <span className="af-veri-not">İstanbul</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ============ Dört grup, dört rejim ============ */}
      {HIZMET_GRUPLARI.map((grup) => {
        const liste = grupHizmetleri(grup);
        if (!liste.length) return null;
        if (grup.rejim === 'veri') return <VeriObegi key={grup.anahtar} grup={grup} liste={liste} />;
        if (grup.rejim === 'plaka') return <PlakaObegi key={grup.anahtar} grup={grup} liste={liste} />;
        if (grup.rejim === 'imza') return <ImzaObegi key={grup.anahtar} grup={grup} liste={liste} />;
        return <KagitObegi key={grup.anahtar} grup={grup} liste={liste} />;
      })}

      {grupsuz.length ? (
        <Bolum
          bant="beyaz"
          id="diger"
          ustEtiket="Diğer"
          baslik="Diğer hizmetler"
          giris="Hangi başlığın işinize yarayacağını ücretsiz analizde birlikte seçiyoruz."
        >
          <div className="af-izgara af-izgara--3">
            {grupsuz.map((h, i) => (
              <HizmetKarti key={h.anahtar} hizmet={h} sira={i} />
            ))}
          </div>
        </Bolum>
      ) : null}

      {/* ============ Nasıl çalışıyoruz — kaydırmaya bağlı çizgi ============ */}
      <Bolum
        bant="beyaz"
        id="surec"
        sinif="af-hz-iri-bas af-hz-doku"
        ustEtiket={SUREC_BOLUMU.ustEtiket}
        baslik={SUREC_BOLUMU.baslik}
        giris={SUREC_BOLUMU.aciklama}
        akis="veri"
      >
        <ol className="af-hz-surec">
          {SUREC.map((adim, i) => (
            <li key={adim.no} data-belir style={kademe(i)}>
              <span className="af-hz-adim-no" aria-hidden="true">
                {String(adim.no).padStart(2, '0')}
              </span>
              <h3 className="af-hz-adim-baslik">{adim.baslik}</h3>
              <p className="af-hz-adim-metin">{adim.aciklama}</p>
              <div className="af-cipler af-ust-16">
                {adim.ciktilar.map((c, j) => (
                  <span className="af-mono-etiket" key={`${j}-${c}`}>
                    {c}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Bolum>

      {/* ============ Marka şeridi ============ */}
      <Bolum
        bant="koyu"
        genislik="tasma"
        sinif="af-hz-iri-bas"
        ustEtiket={ANA_SAYFA.guven.ustEtiket}
        baslik="Bu hizmetleri gerçek markalarla yürüttük."
        giris="Aşağıdaki markaların işlerini biz yaptık; her birinin ne olduğunu çalışmalar bölümünde tek tek yazdık. Logosu olmayan markalar adıyla geçiyor."
      >
        <MarkaSeridi bant="koyu" />
        <div className="af-kap">
          <div className="af-sira af-ust-24">
            <Dugme tur="ikincil" href={siteYolu('/calismalar')}>
              Tüm çalışmaları görün
            </Dugme>
            <Dugme tur="hayalet" href={siteYolu('/sektorler')}>
              Sektörünüzü seçin
            </Dugme>
          </div>
        </div>
      </Bolum>

      {/* ============ Sık sorulanlar ============ */}
      <Bolum
        bant="kagit"
        id="sss"
        genislik="dar"
        sinif="af-hz-doku"
        ustEtiket={SSS_GENEL_BOLUMU.ustEtiket}
        baslik={SSS_GENEL_BOLUMU.baslik}
        giris={SSS_GENEL_BOLUMU.aciklama}
      >
        <SSS sorular={SSS_GENEL} grup="af-sss-hizmetler" />
      </Bolum>

      {/* ============ Çağrı ============ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        sinif="af-hz-iri-bas"
        ustEtiket={ANA_SAYFA.sonCagri.ustEtiket}
        baslik={ANA_SAYFA.sonCagri.baslik}
        giris={ANA_SAYFA.sonCagri.aciklama}
        akis="imza"
      >
        <div className="af-dugmeler af-dugmeler--mobil-blok af-hz-orta-dugmeler">
          <Dugme buyuk href={siteYolu(BIRINCIL_CAGRI.href)}>
            {ANA_SAYFA.sonCagri.cagri}
          </Dugme>
          <Dugme tur="ikincil" href={waBaglanti} whatsapp>
            <IkonWhatsApp />
            WhatsApp
          </Dugme>
        </div>
      </Bolum>

      {/* İmleç ışığı: `.af-kart--tikla` / `.af-hz-isikli` kartlarında havuz
          imleci izler. TEK `pointermove` dinleyicisi, rAF ile kısıtlı;
          dokunmatikte ve saveData/2g'de hiç kurulmaz. */}
      <Isik />
    </>
  );
}
