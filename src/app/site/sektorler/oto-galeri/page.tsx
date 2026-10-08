import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import { CerceveTelefon } from '@/components/site/Cerceve';
import { Ikon, IkonOk, IkonTik, IkonWhatsApp } from '@/components/site/Ikonlar';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import { MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  SEKTORLER,
  hizmetBul,
  hizmetYolu,
  medyaYolu,
  sektorBul,
  sektorYolu,
  vakaBul,
  vakaYolu,
} from '@/lib/site-icerik';
import Isik from '../../iletisim/_ortak/Isik';
import Iz from '../../iletisim/_ortak/Iz';
import { HarfSatiri, Plaka } from '../../iletisim/_ortak/Plaka';
import { izYapisalVerisi, kademe, type IzOgesi } from '../../iletisim/_ortak/kurumsal';
import { DizustuEkrani, KutuEkrani, OrnekDamgasi, TelefonEkrani } from './Ekran';
import { EKRANLAR, EKRAN_SAYISI, PAKETLER, SUREC_ADIMLARI } from './paketler';
import './sayfa.css';

/* ==================================================================
   SUNUM SAYFASI — /sektorler/oto-galeri

   Bu sayfa dinamik `[sektor]` şablonunun bir kopyası DEĞİL: galericiye
   satış görüşmesinde telefondan açılıp gösterilecek bir sunum. Bu
   yüzden iskelet de başka: önce ÜÇ PAKET, sonra her paketin May Motors
   işinden gerçek ekranları.

   DEĞİŞMEZLER
   · Fiyat YAZILMAZ (SITE-BRIEF.md §8.1).
   · Yazılımlar "May Motors için yaptığımız iş" dilinde anlatılır;
     ürün/lisans satışı dili yok.
   · sahibinden.com tarafında "otomatik veri çekme / senkronizasyon"
     İDDİA EDİLMEZ; doğru çerçeve "ilan açıklaması ve görseli hazırlama,
     ilan yönetim akışı, fiyat araştırması".
   · Her ekran görüntüsünün yanında "örnek veri" damgası vardır.
   · Uydurma yok: fiyat, yorum, ödül, yüzde, süre, sertifika.
   ================================================================== */

const YOL = '/sektorler/oto-galeri';
const SEKTOR_ANAHTARI = 'oto-galeri';
/** İletişim formu PANEL sözlüğünü okur: oto-galeri → otomotiv. */
const FORM_YOLU = `${siteYolu('/iletisim')}?sektor=otomotiv`;

const BASLIK = 'Oto Galeri Dijital Paket: Site, Muhasebe, İlan';
const ACIKLAMA =
  'Oto galeriler için üç paket: galeriye özel web sitesi, galeri muhasebesi, ilan açıklaması ve görseli. ' +
  'May Motors için yaptığımız işten ekranlarla.';

export const metadata: Metadata = {
  title: { absolute: `${BASLIK} | ${MARKA.ad}` },
  description: ACIKLAMA,
  keywords: [
    'oto galeri web sitesi',
    'galeri muhasebe programı',
    'araç ilanı hazırlama',
    'araç değerleme yazılımı',
    'oto galeri dijital pazarlama',
  ],
  alternates: { canonical: YOL },
  openGraph: {
    type: 'article',
    locale: 'tr_TR',
    siteName: MARKA.ad,
    url: YOL,
    title: `${BASLIK} | ${MARKA.ad}`,
    description: ACIKLAMA,
  },
  twitter: { card: 'summary_large_image', title: BASLIK, description: ACIKLAMA },
};

const IZ: IzOgesi[] = [
  { ad: 'Ana sayfa', yol: '/' },
  { ad: 'Sektörler', yol: '/sektorler' },
  { ad: 'Oto Galeri', yol: YOL },
];

/* ------------------------------------------------------------------ */
/* Yapısal veri — Service + BreadcrumbList                             */
/* FAQPage KULLANILMAZ (SITE-TASARIM.md §9). Katalogta FİYAT YOK.      */
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
        name: 'Oto galeri için web sitesi, muhasebe ve ilan hazırlama',
        serviceType: 'Oto galeri dijital çözümleri',
        description: ACIKLAMA,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: 'TR',
        audience: { '@type': 'BusinessAudience', name: 'Oto galeri ve otomotiv işletmeleri' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Oto galeri paketleri',
          itemListElement: PAKETLER.map((p) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: p.ad,
              description: p.neIseYarar,
              url: `${kok}${siteYolu(p.urunYolu)}`,
            },
          })),
        },
      },
      { ...izYapisalVerisi(kok, IZ), '@id': `${adres}#iz` },
    ],
  };
}

/* ------------------------------------------------------------------ */

export default function OtoGaleriSayfasi() {
  const sektor = sektorBul(SEKTOR_ANAHTARI);
  if (!sektor) notFound();

  const vaka = vakaBul('may-motors');
  const sosyalHizmeti = hizmetBul('sosyal-medya');
  const digerSektorler = SEKTORLER.filter((s) => s.anahtar !== SEKTOR_ANAHTARI).slice(0, 6);
  const waMetni =
    `Merhaba, ${MARKA.ad} sitesindeki oto galeri sayfasından yazıyorum. ` +
    'Galerim için web sitesi, muhasebe ve ilan tarafını konuşmak istiyorum.';

  return (
    <div className="af-og af-kr">
      <YapisalVeri veri={yapisalVeri()} />
      {/* İmleç ışığı: yalnız ince imleçte kurulur, dokunmatikte hiç gelmez.
          Gelmezse plaka.css havuzu kartın üst kenarından açar. */}
      <Isik />

      {/* ============================================================
          S1 · PLAKA — sayfanın tek plakası, tek harf kadrajı.
          İLK EKRAN SÖZLEŞMESİ: üç paket katlama çizgisinin ÜSTÜNDE
          görünür. Bu yüzden giriş paragrafı iki cümle, ray üç satır.
          ============================================================ */}
      <div data-alt-cta-gizle>
        <Plaka id="ust">
          <Iz ogeler={IZ} />

          <p className="af-ust-etiket af-og-etiket">
            Oto galeri · May Motors için yaptığımız iş
          </p>
          <HarfSatiri kelime="Galeri" en={3.75} tavan="7rem" gorsel />
          <h1 className="af-og-bas">Oto galerinin üç işi, tek ekipten.</h1>
          <p className="af-giris af-og-giris">
            Aracı almak, aracı satmak ve parayı takip etmek. Üçünü de May Motors için kurduk —
            aşağıdaki ekranların hepsi o işten.
          </p>

          <ol className="af-og-ray" aria-label="Üç paket">
            {PAKETLER.map((p) => (
              <li key={p.anahtar}>
                <a href={`#paket-${p.no}`}>
                  <span className="af-og-ray-no" aria-hidden="true">
                    {p.no}
                  </span>
                  <span className="af-og-ray-metin">
                    <b>{p.kisaAd}</b>
                    <span>{p.raySatiri}</span>
                  </span>
                  <IkonOk />
                </a>
              </li>
            ))}
          </ol>

          <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-24">
            <Dugme buyuk href={FORM_YOLU}>
              Ücretsiz analiz iste
            </Dugme>
            <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
              <IkonWhatsApp />
              WhatsApp’tan yazın
            </Dugme>
          </div>
          <p className="af-dugme-not af-ust-16">
            Formda sektör <strong>Otomotiv</strong> olarak hazır gelir; baştan anlatmanız
            gerekmez.
          </p>
        </Plaka>
      </div>

      {/* ============================================================
          S2 · ÜÇ PAKET — sayfanın omurgasının girişi.
          ============================================================ */}
      <Bolum
        bant="koyu"
        id="paketler"
        sinif="af-kr-kesik af-kr-iri"
        ustEtiket="Üç paket"
        baslik="Hangisi sizin derdiniz?"
        giris="Üçü birden alınmak zorunda değil; çoğu galeri tek paketle başlıyor ve ikincisini eklerken birincisini baştan yazmak gerekmiyor. Aşağıdaki ekranların hepsi May Motors için yaptığımız işten — stok görsel yok. Araç, tutar, plaka ve tarih bilgileri örnektir."
        akis="veri"
      >
        <div className="af-og-paketler">
          {PAKETLER.map((p, i) => (
            <article
              key={p.anahtar}
              id={`paket-${p.no}`}
              className="af-kart af-kart--tikla af-og-paket"
              data-isik
              data-belir
              style={kademe(i)}
            >
              <div className="af-og-paket-ekran">
                <TelefonEkrani ekran={p.kartEkrani} boy="kucuk" oncelikli={i === 0} />
              </div>

              <p className="af-og-paket-ust">
                <span className="af-og-paket-no" aria-hidden="true">
                  {p.no}
                </span>
                <span className="af-ikon-kutu">
                  <Ikon ad={p.simge} />
                </span>
              </p>

              <h3 className="af-kart-baslik">{p.ad}</h3>
              <p className="af-kart-metin">{p.neIseYarar}</p>

              <ul className="af-tikli af-og-kapsam">
                {p.kapsam.map((m) => (
                  <li key={m}>
                    <IkonTik />
                    {m}
                  </li>
                ))}
              </ul>

              <p className="af-kart-alt">
                <span className="af-bag-ok">
                  {p.urunEtiketi}
                  <IkonOk />
                </span>
              </p>

              <a className="af-kaplayan-bag" href={siteYolu(p.urunYolu)}>
                <span className="af-gizli-metin">
                  {p.ad} — {p.urunEtiketi} sayfasını açın
                </span>
              </a>
            </article>
          ))}
        </div>

        <p className="af-dugme-not af-ust-32">
          Sitede fiyat yazmıyoruz: kapsamı konuşup galerinize özel teklif çıkarıyoruz.
        </p>
      </Bolum>

      {/* ============================================================
          S3 · MAY MOTORS — vakanın künyesi. Kâğıt bant: burada
          anlatılan şey yazılımın kendisi değil, İŞİN HİKÂYESİ.
          ============================================================ */}
      {vaka ? (
        <Bolum
          bant="kagit"
          id="may-motors"
            ustEtiket="Örnek iş · May Motors"
          baslik={vaka.baslik}
          giris={vaka.ozet}
          akis="duz"
        >
          <div className="af-og-vaka">
            <div className="af-yigin af-yigin--genis">
              <span className="af-og-logo-levha">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="af-og-logo"
                  src={medyaYolu('logo/maymotors-logo-yatay.svg')}
                  alt="May Motors"
                  width={289}
                  height={34}
                  loading="lazy"
                  decoding="async"
                />
              </span>

              <blockquote className="af-og-alinti">
                <p className="af-og-alinti-etiket">Başlarken</p>
                <p>{vaka.zorluk}</p>
              </blockquote>

              <ul className="af-tikli">
                {vaka.yaptiklarimiz.slice(0, 5).map((is) => (
                  <li key={is}>
                    <IkonTik />
                    {is}
                  </li>
                ))}
              </ul>

              <div className="af-dugmeler">
                <Dugme tur="ikincil" href={vakaYolu(vaka)}>
                  İşin tamamını okuyun
                </Dugme>
              </div>
            </div>

            <figure className="af-og-ekran af-og-ekran--tel af-og-canli" data-belir="olcek">
              <CerceveTelefon boy="buyuk">
                {/* Bu kare maket değil, CANLI sitenin telefon görünümü:
                    "Hemen Sat" akışının ilk adımı. Müşteri verisi yok,
                    bu yüzden "örnek veri" damgası da yok. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={medyaYolu('foto/maymotors-web-mobil-form.jpg')}
                  alt="May Motors sitesinin telefon görünümü: “Aracını Sat” akışının ilk adımında model yılı seçimi."
                  width={739}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </CerceveTelefon>
              <figcaption className="af-og-altyazi">
                <span>Canlı site · telefon</span>
              </figcaption>
            </figure>
          </div>

          <dl className="af-veri-serit af-og-veri af-ust-32">
            <div className="af-veri-oge">
              <dt className="af-veri-etiket">Paket</dt>
              <dd className="af-veri-deger">{PAKETLER.length}</dd>
              <dd className="af-veri-not">site · muhasebe · ilan</dd>
            </div>
            <div className="af-veri-oge">
              <dt className="af-veri-etiket">Ekran</dt>
              <dd className="af-veri-deger">{EKRAN_SAYISI}</dd>
              <dd className="af-veri-not">bu sayfada, örnek veriyle</dd>
            </div>
            <div className="af-veri-oge">
              <dt className="af-veri-etiket">Yaptığımız iş</dt>
              <dd className="af-veri-deger">{vaka.yaptiklarimiz.length}</dd>
              <dd className="af-veri-not">madde, vaka sayfasında yazılı</dd>
            </div>
            <div className="af-veri-oge">
              <dt className="af-veri-etiket">Ekip</dt>
              <dd className="af-veri-deger">tek</dd>
              <dd className="af-veri-not">yazılım da içerik de bizde</dd>
            </div>
          </dl>
        </Bolum>
      ) : null}

      {/* ============================================================
          S4 · PAKET 01 — WEB SİTESİ (koyu = yazılım kanadı)
          ============================================================ */}
      <Bolum
        bant="koyu"
        id="web-sitesi"
        sinif="af-kr-iri"
        ustEtiket="Paket 01 · Web sitesi"
        baslik="Aracını satmak isteyen kişi, galeriye gelmeden fiyatı görüyor."
        giris="“Aracını Sat” akışı müşteriyi basamaklı sorularla ilerletiyor: yıl, marka, model, yakıt, kasa, vites, paket; sonra kaporta durumu. Telefon doğrulamasının ardından tahmini nakit alış fiyatı ve randevu düğmesi çıkıyor. Gelen talep galerinin kendi paneline düşüyor."
        akis="veri"
      >
        <div className="af-og-cihazlar" data-belir="olcek">
          <DizustuEkrani ekran={EKRANLAR.satFiyatMasaustu} sinif="af-og-ekran--genis" />
          <TelefonEkrani ekran={EKRANLAR.satFiyatTelefon} boy="kucuk" />
        </div>

        <div className="af-og-ikili af-ust-48">
          <KutuEkrani ekran={EKRANLAR.degerlemeMasaustu} />

          <div className="af-kart af-og-not" data-isik data-belir>
            <p className="af-mono-etiket af-mono-etiket--vurgu">Aynı hesap</p>
            <h3 className="af-kart-baslik">
              Dükkandaki ekranla sitedeki ekran aynı hesabı kullanır.
            </h3>
            <p className="af-kart-metin">
              Müşterinin sitede doldurduğu kaporta şemasının aynısı galerinin içeride baktığı
              ekranda da duruyor. Hangi kırıcının kaç puan götürdüğü yazılı; sonuç kesin fiyat
              değil, beyana dayalı bir ön fiyat fikri. Yeterli veri yoksa rakam gösterilmiyor,
              “ekibimiz sizinle iletişime geçecek” deniyor.
            </p>
            <p className="af-kart-alt">
              <Dugme tur="ikincil" href={siteYolu(PAKETLER[0].urunYolu)}>
                Değerleme akışını okuyun
              </Dugme>
            </p>
          </div>
        </div>
      </Bolum>

      {/* ============================================================
          S5 · PAKET 02 — MUHASEBE (beyaz = nötr; ekranlar açık
          arayüzlü, kendi kontrastını taşıyor)
          ============================================================ */}
      <Bolum
        bant="beyaz"
        id="muhasebe"
        sinif="af-kr-iri"
        ustEtiket="Paket 02 · Muhasebe ve finans takibi"
        baslik="Bu aracın kârı kimin kasasına yazılıyor?"
        giris="Galeride satılan şey stoktan düşen bir ürün değil; kendi dosyası olan bir varlık: alış, noter, plaka, kaporta, lastik, bakım, sigorta, MTV, sonra satış ve belki taksit. Hepsi tek araca yazılmadığında “bu araç kâr etti mi” sorusu cevapsız kalıyor. Ortaklı yapıda iş bir kat daha karışıyor."
        akis="veri"
      >
        <div data-belir="olcek">
          <DizustuEkrani ekran={EKRANLAR.finansAylikMasaustu} sinif="af-og-ekran--orta" />
        </div>

        <div className="af-og-ikili af-ust-48">
          <KutuEkrani ekran={EKRANLAR.finansKasaMasaustu} />

          <div className="af-kart af-og-not" data-isik data-belir>
            <p className="af-mono-etiket af-mono-etiket--vurgu">Ortaklı galeri</p>
            <h3 className="af-kart-baslik">Kasayı tartışmak yerine ekrandan okumak.</h3>
            <p className="af-kart-metin">
              Araç bir ortağın kasasından alınıyor, masrafı başkası ödüyor, satış parası üçüncü
              kasaya giriyor. Ortak kasaları ekranı bakiyeyi, avansı, para giriş-çıkışını ve araç
              başına düşen payı aynı yerde tutuyor. Kâr hesabı tek formülden geliyor; iki ekranda
              iki farklı kâr görmeniz mümkün değil.
            </p>
            <p className="af-kart-alt">
              <Dugme tur="ikincil" href={siteYolu(PAKETLER[1].urunYolu)}>
                Galeri muhasebesini okuyun
              </Dugme>
            </p>
          </div>
        </div>

        <div className="af-ust-32" data-belir="olcek">
          <KutuEkrani ekran={EKRANLAR.finansAracMasaustu} />
        </div>

        <p className="af-ust-etiket af-ust-48">Telefondan günlük kullanım</p>
        <div className="af-og-tel-sira">
          <TelefonEkrani ekran={EKRANLAR.finansOzetTelefon} boy="kucuk" />
          <TelefonEkrani ekran={EKRANLAR.finansGirisTelefon} boy="kucuk" />
          <TelefonEkrani ekran={EKRANLAR.finansKayitlarTelefon} boy="kucuk" />
        </div>
      </Bolum>

      {/* ============================================================
          S6 · PAKET 03 — İLAN AÇIKLAMASI VE GÖRSELİ
          DİL UYARISI: burada "otomatik veri çekme" ya da
          "senkronizasyon" İDDİA EDİLMEZ. Aşağıdaki "Ne iddia
          etmiyoruz" kartı bu sözleşmenin sayfadaki karşılığıdır.
          ============================================================ */}
      <Bolum
        bant="koyu"
        id="ilan"
        sinif="af-kr-iri"
        ustEtiket="Paket 03 · İlan açıklaması ve görseli"
        baslik="Aracı bir kez girin; metin, kart ve gönderi birlikte çıksın."
        giris="İlan açıklaması galeride en acele yazılan metin: araç geldiği gün satışa çıkması gerekiyor, metni kim boşsa o yazıyor. Bir ilanda tramer bilgisi var, diğerinde yok. Sihirbaz aynı bilgiyi bir kez alıyor; metin, baskıya hazır araç kartı ve sosyal medya gönderisi aynı kayıttan kuruluyor."
        akis="veri"
      >
        {/*
          Altı adımın üçü gösteriliyor. "Fiyat ve yayın" adımı BİLEREK YOK:
          o ekranda galerinin alış teklif aralığı ("piyasanın %10-15 altı",
          490.000-520.000) açıkça yazılı ve bu sayfa galericilere açık bir
          sunum sayfası — müşterinin alım marjını yayınlamayız. Aynı karede
          hedef ilan sitesinin adı iki yerde geçiyor ve SITE-BRIEF §8.1'in
          temkinli dil kuralına aykırı duruyor.
        */}
        <p className="af-ust-etiket">Altı adımın üçü</p>
        <div className="af-og-tel-sira" data-belir="olcek">
          <TelefonEkrani ekran={EKRANLAR.ilanKimlikTelefon} boy="kucuk" />
          <TelefonEkrani ekran={EKRANLAR.ilanHasarTelefon} boy="kucuk" />
          <TelefonEkrani ekran={EKRANLAR.ilanOnizlemeTelefon} boy="kucuk" />
        </div>

        <div className="af-kart af-og-not af-og-not--uyari af-ust-48" data-isik data-belir>
          <p className="af-mono-etiket af-mono-etiket--vurgu">Ne iddia etmiyoruz</p>
          <h3 className="af-kart-baslik">İlan sitesiyle otomatik bağlantı sözü vermiyoruz.</h3>
          <p className="af-kart-metin">
            Yaptığımız iş ilan açıklamasının ve ilan görselinin hazırlanması, ilanların galeri
            panelinden düzenli yönetilmesi ve fiyat araştırmasının derli toplu tutulması. İlan
            sitelerinin kendi kuralları ve kullanım koşulları bağlayıcı; bu yüzden veri aktarımı ya
            da senkronizasyon konusunda söz vermiyoruz. Metin kalıbı da sizin: üslubunuzu bir kez
            yazıyoruz, her ilan o kalıptan çıkıyor ve yayına girmeden siz onaylıyorsunuz.
          </p>
          <p className="af-kart-alt">
            <Dugme tur="ikincil" href={siteYolu(PAKETLER[2].urunYolu)}>
              İlan hazırlamayı okuyun
            </Dugme>
          </p>
        </div>
      </Bolum>

      {/* ============================================================
          S7 · SOSYAL MEDYA — kâğıt bant = stüdyo kanadı.
          Ağırlık yazılımda; bu bölüm bilinçli olarak kısa.
          ============================================================ */}
      <Bolum
        bant="kagit"
        id="sosyal"
        ustEtiket="Yanında"
        baslik="Araçların içeriğini de aynı ekip üretiyor."
        giris="Sitenin ve panelin yanında galerinin akışını da biz yürütüyoruz. Araç çekimi, Reels kurgusu ve tasarım aynı yerden çıktığı için ilan görseliyle Instagram gönderisi birbirini tutuyor."
        akis="duz"
      >
        <div className="af-og-sosyal">
          <ol className="af-og-sosyal-liste">
            {sektor.sosyalTarafi.maddeler.map((m, i) => (
              <li key={m} data-belir style={kademe(Math.min(i, 6))}>
                <span className="af-og-sosyal-no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ol>

          <figure className="af-og-ekran af-og-dikey" data-belir="olcek">
            <span className="af-og-kutu af-og-kutu--dikey">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/maymotors-reels-tasarimi.jpg')}
                alt="May Motors için hazırlanan dikey Reels tasarımı: üç adımlı anlatım ve “Teklif al” çağrısı."
                width={900}
                height={1600}
                loading="lazy"
                decoding="async"
              />
            </span>
            <figcaption className="af-og-altyazi">
              <span>Reels tasarımı · May Motors</span>
            </figcaption>
          </figure>
        </div>

        {sosyalHizmeti ? (
          <div className="af-dugmeler af-ust-32">
            <Dugme tur="ikincil" href={hizmetYolu(sosyalHizmeti)}>
              Sosyal medya yönetimi
            </Dugme>
          </div>
        ) : null}
      </Bolum>

      {/* ============================================================
          S8 · SÜREÇ — kurulumdan teslime
          ============================================================ */}
      <Bolum
        bant="koyu"
        id="surec"
        sinif="af-kr-iri"
        ustEtiket="Nasıl ilerliyor"
        baslik="Kurulumdan teslime beş adım."
        giris="Her galeride aynı sırayı izliyoruz. Hangi adımda olduğunuzu, bir sonraki adımda ne olacağını ve sizden ne isteyeceğimizi baştan biliyorsunuz. Süre taahhüdünü sitede değil, kapsamı konuştuktan sonra yazılı veriyoruz."
        akis="duz"
      >
        <ol className="af-og-surec">
          {SUREC_ADIMLARI.map((a, i) => (
            <li key={a.no} data-belir style={kademe(Math.min(i, 6))}>
              <span className="af-og-surec-no" aria-hidden="true">
                {a.no}
              </span>
              <div>
                <h3 className="af-og-surec-bas">{a.baslik}</h3>
                <p className="af-kart-metin">{a.metin}</p>
                <p className="af-og-surec-cikti">
                  <span className="af-veri-etiket">Çıktı</span>
                  {a.cikti}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Bolum>

      {/* ============================================================
          S9 · SSS — sektör verisinden, `<details>` tabanlı (JS’siz)
          ============================================================ */}
      <Bolum
        bant="kagit"
        sinif="af-bant--cizgili"
        id="sss"
        genislik="dar"
        ustEtiket="Sık sorulanlar"
        baslik="Galericilerin en çok sorduğu beş şey"
        giris="Cevaplar iddiasız: bilmediğimizi bilmiyoruz diyoruz, söz veremeyeceğimiz yere söz vermiyoruz."
      >
        <SSS sorular={sektor.sss} grup="sss-oto-galeri" ilkAcik />
      </Bolum>

      {/* ============================================================
          S10 · ÇAĞRI
          ============================================================ */}
      <Bolum
        bant="koyu"
        orta
        genislik="dar"
        ustEtiket="Sırada ne var"
        baslik="Galerinizde zincir nerede kopuyor?"
        giris="Sitenize, ilanlarınıza ve Google profilinize bakıp hangi parçanın eksik olduğunu yazılı söyleyelim. Ücretsiz ve bağlayıcı değil; listeyi kendiniz uygulamak isterseniz de elinizde kalır."
        akis="imza"
      >
        <div className="af-og-cagri" data-alt-cta-gizle>
          <div className="af-dugmeler af-dugmeler--mobil-blok">
            <Dugme buyuk href={FORM_YOLU}>
              Ücretsiz analiz iste
            </Dugme>
            <Dugme tur="ikincil" href={whatsappBaglantisi(waMetni)} whatsapp>
              <IkonWhatsApp />
              WhatsApp
            </Dugme>
          </div>
          <p className="af-dugme-not">
            Sitede fiyat yazmıyoruz: kapsamı konuşup size özel teklif çıkarıyoruz.
          </p>
          <p className="af-og-damga-not">
            <OrnekDamgasi />
            <span>
              Bu sayfadaki bütün ekran görüntüleri yalnızca demo veriyle hazırlandı. Gerçek müşteri,
              araç veya kasa bilgisi gösterilmez.
            </span>
          </p>
        </div>
      </Bolum>

      {/* ============================================================
          S11 · Diğer sektörler — dizin
          ============================================================ */}
      <Bolum bant="beyaz" sikis ustEtiket="Diğer sektörler" baslik="Başka bir işiniz de var mı?">
        <ul className="af-og-indeks">
          {digerSektorler.map((s) => (
            <li key={s.anahtar}>
              <a href={sektorYolu(s)}>
                <span>{s.ad}</span>
                <IkonOk />
              </a>
            </li>
          ))}
          <li>
            <a href={siteYolu('/sektorler')}>
              <span>Bütün sektörler</span>
              <IkonOk />
            </a>
          </li>
        </ul>
      </Bolum>
    </div>
  );
}
