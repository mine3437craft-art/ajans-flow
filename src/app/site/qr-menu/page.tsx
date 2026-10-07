import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

import Bolum from '@/components/site/Bolum';
import Dugme from '@/components/site/Dugme';
import SSS from '@/components/site/SSS';
import Video from '@/components/site/Video';
import { CerceveDizustu, CerceveTelefon } from '@/components/site/Cerceve';
import {
  IkonArama,
  IkonGrafik,
  IkonKalkan,
  IkonKutu,
  IkonOkSagUst,
  IkonQr,
  IkonTik,
  IkonWhatsApp,
} from '@/components/site/Ikonlar';
import { ILETISIM, MARKA, siteAdresi, siteYolu, whatsappBaglantisi } from '@/lib/site';
import {
  QR_MENU_BILGI,
  hizmetBul,
  hizmetYolu,
  medyaYolu,
  sektorBul,
  sektorYolu,
  vakaBul,
  vakaYolu,
} from '@/lib/site-icerik';

import './sayfa.css';

/** İçerik dosyasından gelen kayıt eksikse derleme değil, istek anında patlar. */
function gerekli<T>(deger: T | undefined, ad: string): T {
  if (!deger) throw new Error(`site-icerik.ts içinde "${ad}" bulunamadı.`);
  return deger;
}

/* Metinlerin tek kaynağı src/lib/site-icerik.ts; burada yalnız okunur. */
const HIZMET = gerekli(hizmetBul('qr-menu'), 'qr-menu');

const KULE = vakaBul('kule-istanbul-cafe');
const KOK = vakaBul('kok-cafe-lounge');
const KAFE = sektorBul('kafe-restoran');

const YOL = '/qr-menu';
const DEMO_YOLU = siteYolu('/demo/qr-menu');

/** Mevzuat künyesindeki madde sayısı: elle yazılmaz, sayılır. */
const MADDE_SAYISI = QR_MENU_BILGI.bolumler.reduce((t, g) => t + g.maddeler.length, 0);

/** data-belir kademesi için --i değişkeni. */
const sira = (i: number) => ({ ['--i' as string]: i }) as CSSProperties;

export const metadata: Metadata = {
  title: 'QR Dijital Menü ve Karekod Mevzuatı',
  description:
    'Çok dilli, aranabilir ve alerjen filtreli QR dijital menü kuruyoruz. Karekod mevzuatını kaynaklarıyla açıklıyor, canlı demoyu telefonunuzda açıyoruz.',
  keywords: [...HIZMET.anahtarKelimeler, ...QR_MENU_BILGI.anahtarKelimeler],
  alternates: { canonical: YOL },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: MARKA.ad,
    url: YOL,
    title: 'QR dijital menü: dört dil, arama, alerjen filtresi ve mevzuat',
    description:
      'Kule İstanbul Cafe için kurduğumuz dört dilli QR menünün nasıl çalıştığını anlatıyor, karekod mevzuatını madde ve Resmî Gazete kaynaklarıyla açıklıyoruz.',
    images: [{ url: medyaYolu('foto/kule-istanbul-qr-menu-masaustu.jpg'), width: 1400, height: 620, alt: 'Kule İstanbul Cafe QR menüsünün masaüstü görünümü' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR dijital menü ve karekod mevzuatı',
    description: 'Çok dilli, aranabilir ve alerjen filtreli QR menü kuruyoruz. Mevzuatı kaynaklarıyla açıklıyoruz.',
  },
};

/* ------------------------------------------------------------------ */
/* Yapısal veri: Service + BreadcrumbList (FAQPage KULLANILMAZ)        */
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
        name: HIZMET.ad,
        serviceType: 'QR dijital menü kurulumu',
        description: HIZMET.ozet,
        url: adres,
        provider: { '@id': `${kok}/#kurulus` },
        areaServed: ILETISIM.sehir,
        audience: { '@type': 'BusinessAudience', name: 'Kafe, restoran, pastane ve otel işletmeleri' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'QR dijital menü paket kapsamları',
          itemListElement: HIZMET.paket.map((p) => ({
            '@type': 'OfferCatalog',
            name: p.ad,
            itemListElement: p.kapsam.map((k) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: k },
            })),
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${adres}#kirintilar`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: kok },
          { '@type': 'ListItem', position: 2, name: 'Hizmetler', item: `${kok}/hizmetler` },
          { '@type': 'ListItem', position: 3, name: HIZMET.ad, item: adres },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------------------ */

const YETENEKLER = [
  {
    Ikon: IkonKutu,
    baslik: 'Dört dile kadar menü',
    metin:
      'Türkçe esas alınır, diğer diller üzerine eklenir. Ürün adı, açıklaması ve içindekiler her dil için ayrı alanda durur; arayüz metinleri de çevrilir. Arapçada menü sağdan sola akar.',
    ornek: [
      { dil: 'tr', metin: 'Mercimek çorbası' },
      { dil: 'en', metin: 'Lentil soup' },
      { dil: 'de', metin: 'Linsensuppe' },
      { dil: 'ar', metin: 'شوربة العدس', rtl: true },
    ],
  },
  {
    Ikon: IkonArama,
    baslik: 'Menü içinde anlık arama',
    metin:
      'Misafir yazdıkça sonuçlar süzülür; kategoriler arasında dolaşmak gerekmez. Arama ürün adında da açıklamada da çalışır, uzun menüde aradığını iki harfte bulur.',
    ornek: [{ dil: 'tr', metin: 'ara: "bur" → 1 sonuç' }],
  },
  {
    Ikon: IkonKalkan,
    baslik: 'Alerjen ve diyet filtreleri',
    metin:
      'Vegan, glutensiz ve kuruyemişsiz filtreleri rozet olarak elle işaretlenmez; ürünün alerjen ve içindekiler listesinden hesaplanır. Böylece veri tek kaynaktan gelir ve menüde çelişki çıkmaz.',
    ornek: [{ dil: 'tr', metin: 'gluten · süt · yumurta · kuruyemiş · susam' }],
  },
  {
    Ikon: IkonGrafik,
    baslik: 'Fiyat tek yerden değişir',
    metin:
      'Fiyatı panelden değiştirdiğiniz anda menünün tamamına yansır; baskı beklemek gerekmez. Giriş kapısına asılacak fiyat listesinin basılabilir çıktısı da aynı veriden üretilir.',
    ornek: [{ dil: 'tr', metin: 'panel → menü → basılabilir liste' }],
  },
];

/** Kök Cafe çekim arşivinden menüde kullanılan kareler (kunye.json'da var). */
const KOK_KARELER = [
  { dosya: 'foto/kok-cafe-cheese-burger.jpg', alt: 'Kök Cafe Lounge menüsü için çekilmiş cheese burger karesi' },
  { dosya: 'foto/kok-cafe-izgara-pirzola.jpg', alt: 'Kök Cafe Lounge menüsü için çekilmiş ızgara pirzola karesi' },
  { dosya: 'foto/kok-cafe-kahvalti-tabagi.jpg', alt: 'Kök Cafe Lounge menüsü için çekilmiş kahvaltı tabağı karesi' },
  { dosya: 'foto/kok-cafe-sezar-salata.jpg', alt: 'Kök Cafe Lounge menüsü için çekilmiş sezar salata karesi' },
];

const MODULLER = [
  {
    baslik: 'QR üzerinden sipariş',
    metin:
      'Misafir menüden seçimini yapar, masa numarasını girer ve siparişi gönderir. Sipariş panele düşer; mutfak veya kasa ekranından takip edilir. Ürün bilgisi sipariş akışının içinde kalır, misafir bilgiye bakmak için menüden çıkmak zorunda olmaz.',
    maddeler: [
      'Masa numarası ve sipariş notu alanları',
      'Panele düşen sipariş listesi ve durum takibi',
      'Ürün detayının sipariş ekranının içinde kalması',
      'Servis, masa veya kuver ücreti satırı eklenemeyen kurgu',
    ],
    not: 'Yazar kasa ve fiş yazıcı bağlantısı standart kurgumuzda yok; ihtiyaç varsa kapsamı ayrıca değerlendiriyoruz.',
  },
  {
    baslik: 'Rezervasyon talebi',
    metin:
      'Menünün içinden açılan kısa bir form: tarih, saat, kişi sayısı, ad ve telefon. Talep işletmeye iletilir, onay işletmede kalır. Otomatik masa ataması yapan bir sistem kurduğumuzu iddia etmiyoruz; burada yaptığımız iş talebi düzenli ve eksiksiz toplamak.',
    maddeler: [
      'Tarih, saat ve kişi sayısı seçimi',
      'Ad ve telefon ile tek ekranda talep',
      'İşletmeye bildirim ve talep listesi',
      'KVKK aydınlatma bağlantısı ve açık onay kutusu',
    ],
    not: 'Her iki modül de menüyle birlikte ya da sonradan eklenebilir.',
  },
];

export default function QrMenuSayfasi() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

      {/* ============ 1 · Hero PLAKASI (yazılım kanadı) ============
          Plaka = başlık anı (SITE-GIRIS.md): saf siyah zemin, tek ışık
          havuzu ve grain `.af-yk-plaka` pseudo'larından gelir, ek DOM
          yok. Telefon hero'da büyür ve ekranı CANLI durur: gerçek
          ekran görüntüsü ağır ağır kayar, üstünden tarama ışığı geçer.
          İkisi de `transform` (compositor), kutu `aspect-ratio` ile
          rezerve → CLS 0. */}
      <div data-alt-cta-gizle="">
        <Bolum bant="koyu" akis="kare" sinif="af-yk-plaka">
          <div className="af-qr-hero-ic">
            <div className="af-yigin" data-belir>
              <p className="af-ust-etiket">Yazılım kanadı · kafe ve restoran</p>
              <h1 className="af-h1 af-qr-h1 af-yk-devasa" data-baslik-ac>
                Menü telefonda açılsın, fiyat tek yerden değişsin.
              </h1>
              <p className="af-giris">{HIZMET.ozet}</p>
              <div className="af-dugmeler af-dugmeler--mobil-blok">
                <Dugme buyuk href={DEMO_YOLU}>
                  <IkonQr />
                  Canlı demoyu dene
                </Dugme>
                <Dugme tur="ikincil" href={siteYolu('/iletisim')}>
                  Ücretsiz analiz iste
                </Dugme>
              </div>
              <p className="af-dugme-not">
                Demo gerçekten çalışır: dört dil, arama ve filtreler açık. Sipariş iletilmez, fiyatlar örnektir.
              </p>
            </div>

            <div className="af-qr-cihaz af-qr-cihaz--buyuk" data-belir="olcek" style={sira(1)}>
              <div className="af-qr-kadraj-kose">
                <CerceveTelefon boy="buyuk" altyazi="Kule İstanbul Cafe · dört dilli QR menü">
                  <div className="af-qr-ekran">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={medyaYolu('foto/kule-istanbul-qr-menu-mobil.jpg')}
                      alt="Kule İstanbul Cafe QR menüsünün telefon görünümü: kategori şeridi ve ürün kartları"
                      width={390}
                      height={844}
                      decoding="async"
                    />
                    <span className="af-qr-tarama" aria-hidden="true" />
                    {/* Çip ne gördüğünü söyler, iddia etmez: bu bir
                        ekran görüntüsüdür ve gerçek bir kurulumdan
                        alınmıştır. Kayma ve tarama ışığı dekordur. */}
                    <p className="af-qr-canli">Gerçek kurulum · ekran görüntüsü</p>
                  </div>
                </CerceveTelefon>
              </div>
            </div>
          </div>

          <div className="af-veri-serit af-qr-serit af-ust-32" data-belir style={sira(2)}>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Dil</span>
              <span className="af-veri-deger">4</span>
              <span className="af-veri-not">TR · EN · DE · AR</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Diyet filtresi</span>
              <span className="af-veri-deger">3</span>
              <span className="af-veri-not">vegan · glutensiz · kuruyemişsiz</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Arama</span>
              <span className="af-veri-deger">anlık</span>
              <span className="af-veri-not">yazdıkça süzülür</span>
            </div>
            <div className="af-veri-oge">
              <span className="af-veri-etiket">Fiyat güncelleme</span>
              <span className="af-veri-deger">tek yer</span>
              <span className="af-veri-not">baskı beklemeden</span>
            </div>
          </div>
        </Bolum>
      </div>

      {/* ============ 2 · Ne yapıyoruz ============ */}
      <Bolum
        bant="beyaz"
        id="ne-yapiyoruz"
        ustEtiket="Yaptığımız iş"
        baslik="Hazır bir uygulamaya kaydolmak değil; menüyü işletmeye göre kurmak."
        giris="Misafir uygulama indirmiyor, kayıt olmuyor; kodu okutuyor ve menü açılıyor. Arkasındaki düzeni biz kuruyoruz."
      >
        <div className="af-ikili">
          <div className="af-metin">
            {HIZMET.aciklama.map((p, i) => (
              <p key={i} data-belir style={sira(i)}>
                {p}
              </p>
            ))}
          </div>

          <div className="af-yigin af-yapiskan">
            <article className="af-kart" data-belir style={sira(1)}>
              <h3 className="af-kart-baslik">Kapsam</h3>
              <ul className="af-tikli">
                {HIZMET.neleriKapsar.map((m) => (
                  <li key={m}>
                    <IkonTik />
                    {m}
                  </li>
                ))}
              </ul>
            </article>
            <article className="af-kart af-kart--veri" data-belir style={sira(2)}>
              <p className="af-mono-etiket">Kimin işine yarıyor</p>
              <ul className="af-tikli">
                {HIZMET.kimeGore.map((m) => (
                  <li key={m}>
                    <IkonTik />
                    {m}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </Bolum>

      {/* ============ 3 · Yetenekler + canlı demo ============
          Sayfanın NEFES KESEN ANI. Kesik kenarla açılan siyah plaka ve
          HARF KADRAJI: tek satırlık anahtar kelimenin içinden gerçek
          çekim arşivinden bir kare akar (blend knockout). Sayfada
          yalnız BURADA, yalnız BİR KEZ. */}
      <Bolum
        bant="koyu"
        id="nasil-calisiyor"
        ustEtiket="Menünün içi"
        baslik="Dört dil, anlık arama, alerjenden hesaplanan filtreler."
        giris="Aşağıdaki dördü bir menüyü basılı listeden ayıran şeyler. Hepsini canlı demoda deneyebilirsiniz."
        akis="veri"
        sinif="af-yk-plaka af-yk-kesik"
      >
        {/* Kadraj DEKORATİFTİR: bölümün kendi başlığındaki kelimeyi
            devasa boyda tekrar eder, bu yüzden ekran okuyucuya iki kez
            okutulmaz (`aria-hidden`). Knockout'un harf biçimi maske
            katmanının GERÇEK DOM metninden gelir; path'e çevrilmiş SVG
            ya da görsel değildir. */}
        <div className="af-qr-kadraj" data-belir aria-hidden="true">
          <div className="af-qr-kd-duvar">
            <span className="af-qr-kd-taban" />
            <div className="af-qr-kd-plan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={medyaYolu('foto/kok-cafe-karisik-pide.jpg')}
                alt=""
                width={1600}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="af-qr-kd-maske">
              <p className="af-qr-kd-satir">
                <span className="af-qr-kd-i">MENÜ</span>
              </p>
            </div>
          </div>
          <p className="af-qr-kd-kunye">
            <span>Kök Cafe Lounge · menü karesi</span>
            <span>çekim arşivi · Ajans Flow</span>
          </p>
        </div>

        <div className="af-izgara af-izgara--2 af-qr-isik">
          {YETENEKLER.map(({ Ikon, baslik, metin, ornek }, i) => (
            <article className="af-kart" key={baslik} data-belir style={sira(i)}>
              <span className="af-ikon-kutu">
                <Ikon />
              </span>
              <h3 className="af-kart-baslik">{baslik}</h3>
              <p className="af-kart-metin">{metin}</p>
              <div className="af-qr-ornek">
                {ornek.map((o) => (
                  <span key={o.metin} lang={o.dil} dir={o.rtl ? 'rtl' : undefined}>
                    {o.metin}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="af-qr-demo af-ust-48">
          <div className="af-yigin" data-belir>
            <p className="af-ust-etiket af-ust-etiket--cizgisiz">Canlı demo</p>
            <h3 className="af-h3">Anlatmak yerine açalım.</h3>
            <p className="af-ikincil-metin">
              Örnek bir kafe menüsü kurduk: on sekiz ürün, beş kategori, dört dil. Dili değiştirin, arama kutusuna
              iki harf yazın, glutensiz filtresini açın, bir ürüne dokunup içindekiler ve alerjen bilgisine bakın.
              Sipariş ve rezervasyon ekranları da duruyor ama hiçbir veri gönderilmiyor.
            </p>
            <div className="af-dugmeler af-dugmeler--mobil-blok">
              <Dugme buyuk href={DEMO_YOLU}>
                Demoyu aç
              </Dugme>
              {KULE ? (
                <Dugme tur="hayalet" href={vakaYolu(KULE)}>
                  Kule İstanbul işini oku
                  <IkonOkSagUst />
                </Dugme>
              ) : null}
            </div>
            <p className="af-dugme-not">
              Demodaki ürünler, fiyatlar ve kalori değerleri örnektir; gerçek bir işletmeye ait değildir.
            </p>
          </div>

          {/* Üçüncü bir telefon görseli yerine DEMO KÜNYESİ: aynı
              ekran görüntüsü sayfada iki kez dönmez, ritim kart →
              panel olarak değişir. Rakamlar bu bölümün kendi
              metninden (on sekiz ürün, beş kategori, dört dil). */}
          <div className="af-qr-kapi" data-belir="olcek" style={sira(1)}>
            <p className="af-mono-etiket af-mono-etiket--vurgu">Demo künyesi</p>
            <dl className="af-qr-kapi-liste">
              <div>
                <dt>Ürün</dt>
                <dd>18</dd>
              </div>
              <div>
                <dt>Kategori</dt>
                <dd>5</dd>
              </div>
              <div>
                <dt>Dil</dt>
                <dd>4</dd>
              </div>
              <div>
                <dt>Gönderilen veri</dt>
                <dd>yok</dd>
              </div>
            </dl>
            <p className="af-qr-kapi-diller" aria-hidden="true">
              <span>TR</span>
              <span>EN</span>
              <span>DE</span>
              <span>AR</span>
            </p>
            <p className="af-qr-kapi-not">
              <span className="af-ornek-damga">örnek</span> işletme, örnek ürün, örnek fiyat.
            </p>
          </div>
        </div>
      </Bolum>

      {/* ============ 4 · İsteğe bağlı modüller ============ */}
      <Bolum
        bant="beyaz"
        id="moduller"
        ustEtiket="İsteğe bağlı"
        baslik="Sipariş ve rezervasyon: isterseniz eklenir."
        giris="Menü tek başına da çalışır. Bu iki modül, menünün üstüne sonradan da konabilen eklerdir."
      >
        <div className="af-izgara af-izgara--2 af-qr-isik">
          {MODULLER.map((m, i) => (
            <article className="af-kart" key={m.baslik} data-belir style={sira(i)}>
              <h3 className="af-kart-baslik">{m.baslik}</h3>
              <p className="af-kart-metin">{m.metin}</p>
              <ul className="af-tikli">
                {m.maddeler.map((x) => (
                  <li key={x}>
                    <IkonTik />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="af-dugme-not">{m.not}</p>
            </article>
          ))}
        </div>
        <p className="af-ikincil-metin af-dar-metin af-ust-24" data-belir style={sira(2)}>
          Her iki modülün arayüzünü{' '}
          <a className="af-bag" href={DEMO_YOLU}>
            demoda
          </a>{' '}
          görebilirsiniz. Demoda gönder düğmeleri çalışır ama hiçbir veri iletilmez ve kaydedilmez.
        </p>
      </Bolum>

      {/* ============ 5 · İşler (kâğıt bant = stüdyo tarafı) ============ */}
      <Bolum
        bant="kagit"
        id="isler"
        ustEtiket="Yaptığımız işler"
        baslik="İki kafe, iki ayrı iş."
        giris="Biri menünün yazılım tarafı, diğeri menüyü dolduran görsel taraf. İkisi de aynı ekipten çıktı."
        akis="kare"
      >
        {KULE ? (
          <div className="af-ikili af-ust-0" data-belir>
            <div className="af-yigin">
              <p className="af-ust-etiket af-ust-etiket--cizgisiz">{KULE.marka}</p>
              <h3 className="af-h3">{KULE.baslik}</h3>
              <p className="af-ikincil-metin">{KULE.zorluk}</p>
              <ul className="af-tikli">
                {KULE.yaptiklarimiz.slice(0, 6).map((m) => (
                  <li key={m}>
                    <IkonTik />
                    {m}
                  </li>
                ))}
              </ul>
              <div className="af-dugmeler">
                <Dugme tur="ikincil" href={vakaYolu(KULE)}>
                  Vakanın tamamı
                </Dugme>
                <Dugme tur="hayalet" href={DEMO_YOLU}>
                  Benzerini demoda dene
                </Dugme>
              </div>
            </div>
            <div className="af-yigin" data-belir="yan" style={sira(1)}>
              <CerceveDizustu altyazi="Kule İstanbul Cafe · menünün masaüstü görünümü">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={medyaYolu('foto/kule-istanbul-qr-menu-masaustu.jpg')}
                  alt="Kule İstanbul Cafe QR menüsünün geniş ekrandaki görünümü"
                  width={1400}
                  height={620}
                  loading="lazy"
                  decoding="async"
                />
              </CerceveDizustu>
            </div>
          </div>
        ) : null}

        <hr className="af-ayrac" />

        {KOK ? (
          <div className="af-ikili" data-belir>
            <div className="af-yigin">
              <p className="af-ust-etiket af-ust-etiket--cizgisiz">{KOK.marka}</p>
              <h3 className="af-h3">Menüyü dolduran kareler</h3>
              <p className="af-ikincil-metin">{KOK.ozet}</p>
              <p className="af-ikincil-metin">
                QR menünün en çok takıldığı yer fotoğraf oluyor: telefonla, farklı ışıkta çekilmiş kareler yan yana
                gelince menü olduğundan zayıf görünüyor. Kök Cafe Lounge’da önce çekim arşivini kurduk; aynı arşiv
                hem menüde hem sosyal medyada kullanılıyor.
              </p>
              <div className="af-qr-galeri af-qr-galeri--olcekli">
                {KOK_KARELER.map((k) => (
                  <span className="af-gorsel-kutu" key={k.dosya}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={medyaYolu(k.dosya)} alt={k.alt} loading="lazy" decoding="async" />
                  </span>
                ))}
              </div>
              <div className="af-dugmeler">
                <Dugme tur="ikincil" href={vakaYolu(KOK)}>
                  Vakanın tamamı
                </Dugme>
              </div>
            </div>
            <div className="af-qr-video">
              <Video
                ad="kok-cafe-burger-sunumu.mp4"
                oran="dikey"
                baslik="Kök Cafe Lounge — burger sunumu"
                kunyeGoster
              />
            </div>
          </div>
        ) : null}

        <p className="af-ikincil-metin af-dar-metin af-ust-24">
          Kafe ve restoran tarafında yaptığımız bütün işler{' '}
          {KAFE ? (
            <a className="af-bag" href={sektorYolu(KAFE)}>
              kafe ve restoran sektör sayfasında
            </a>
          ) : (
            'sektör sayfalarında'
          )}
          ; menünün hizmet özeti ise{' '}
          <a className="af-bag" href={hizmetYolu(HIZMET)}>
            {HIZMET.ad} sayfasında
          </a>{' '}
          duruyor.
        </p>
      </Bolum>

      {/* ============ 6 · Süreç ============ */}
      <Bolum
        bant="koyu"
        id="surec"
        ustEtiket="Nasıl kuruyoruz"
        baslik="Beş adım; menü envanterinden eğitime."
        akis="duz"
        genislik="dar"
      >
        <ol className="af-qr-adimlar af-qr-adimlar--iri">
          {HIZMET.surec.map((a, i) => (
            <li className="af-qr-adim" key={a.adim} data-belir style={sira(i)}>
              <span className="af-qr-adim-no" aria-hidden="true">
                {String(a.adim).padStart(2, '0')}
              </span>
              <div>
                <h3 className="af-h4">{a.baslik}</h3>
                <p className="af-ikincil-metin">{a.aciklama}</p>
              </div>
            </li>
          ))}
        </ol>
      </Bolum>

      {/* ============ 7 · Paket kapsamı (fiyat YAZILMAZ) ============ */}
      <Bolum
        bant="kagit"
        id="paketler"
        ustEtiket="Paket kapsamı"
        baslik="Hangi paketin içinde ne var?"
        giris="Sitede rakam yazmıyoruz; kapsamı yazıyoruz. Hangi paketin işinize uyduğunu ücretsiz analizden sonra birlikte netleştiriyoruz."
      >
        <div className="af-izgara af-izgara--3 af-qr-isik">
          {HIZMET.paket.map((p, i) => (
            <article className="af-kart" key={p.ad} data-belir style={sira(i)}>
              <h3 className="af-kart-baslik">{p.ad}</h3>
              <ul className="af-tikli">
                {p.kapsam.map((k) => (
                  <li key={k}>
                    <IkonTik />
                    {k}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="af-dugmeler af-dugmeler--mobil-blok af-ust-32" data-belir style={sira(3)}>
          <Dugme href={siteYolu('/iletisim')}>Kapsamı birlikte belirleyelim</Dugme>
          <Dugme
            tur="ikincil"
            whatsapp
            href={whatsappBaglantisi('Merhaba, QR dijital menü hakkında bilgi almak istiyorum.')}
          >
            <IkonWhatsApp />
            WhatsApp’tan yazın
          </Dugme>
        </div>
      </Bolum>

      {/* ============ 8 · Mevzuat: kısa cevap ve yanlış bilinenler ============ */}
      <Bolum
        bant="beyaz"
        id="mevzuat"
        ustEtiket={QR_MENU_BILGI.ustEtiket}
        baslik={QR_MENU_BILGI.baslik}
        genislik="dar"
      >
        {/* Mevzuat KORKUTMAZ, künyesini verir: kaç düzenleme, kaç
            madde, ne zaman kontrol edildi. Üç sayı da hesaplanmış
            (QR_MENU_BILGI), elle yazılmadı. */}
        <div className="af-veri-serit af-qr-mevzuat-serit" data-belir>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Düzenleme</span>
            <span className="af-veri-deger">{QR_MENU_BILGI.bolumler.length}</span>
            <span className="af-veri-not">iki ayrı bakanlık</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Dayanaklı madde</span>
            <span className="af-veri-deger">{MADDE_SAYISI}</span>
            <span className="af-veri-not">her biri kaynağıyla yazılı</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">Karekod zorunluluğu</span>
            <span className="af-veri-deger">yok</span>
            <span className="af-veri-not">izin verilen yollardan biri</span>
          </div>
          <div className="af-veri-oge">
            <span className="af-veri-etiket">{QR_MENU_BILGI.sonKontrolEtiketi}</span>
            <span className="af-veri-deger af-qr-tarih">{QR_MENU_BILGI.sonKontrolTarihi}</span>
            <span className="af-veri-not">tarih elle güncellenir</span>
          </div>
        </div>

        <p className="af-qr-kisa-cevap af-ust-24" data-belir style={sira(1)}>
          {QR_MENU_BILGI.kisaCevap}
        </p>

        <div className="af-metin af-ust-24">
          {QR_MENU_BILGI.giris.map((p, i) => (
            <p key={i} data-belir style={sira(i)}>
              {p}
            </p>
          ))}
        </div>

        <h3 className="af-h3 af-ust-48">{QR_MENU_BILGI.yanlisBilinenlerBaslik}</h3>
        {/* Kart yığını değil DEFTER: numaralı ray, saç teli ayraç,
            iddia üstü çizili. Kırmızı ve ünlem yok. */}
        <ul className="af-qr-yanlis af-qr-yanlis--defter af-ust-16">
          {QR_MENU_BILGI.yanlisBilinenler.map((y, i) => (
            <li className="af-qr-yanlis-oge" key={y.iddia} data-belir style={sira(i)}>
              <p className="af-qr-yanlis-no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="af-qr-iddia">{y.iddia}</p>
              <p className="af-qr-dogru">{y.dogrusu}</p>
            </li>
          ))}
        </ul>
      </Bolum>

      {/* ============ 9 · Mevzuat: madde madde dayanaklar ============ */}
      <Bolum
        bant="kagit"
        id="mevzuat-maddeler"
        ustEtiket="Dayanaklar"
        baslik="İki bakanlık, iki ayrı düzenleme."
        giris="Her maddenin altında dayandığı yönetmelik, madde numarası ve Resmî Gazete bilgisi yazılı. Listede olmayan bir madde numarasını ya da tarihi kullanmıyoruz."
        genislik="dar"
      >
        {/* DÜZENLİ BİLGİ TABLOSU: masaüstünde sol kolon künye
            (yönetmelik · madde · Resmî Gazete), sağ kolon maddenin
            kendisi. 760px altında tek kolona iner — gerçek <table>
            kullanılmadığı için 360px'te de taşma yok. */}
        {QR_MENU_BILGI.bolumler.map((grup, g) => (
          <section
            className="af-qr-grup af-qr-grup--defter"
            key={grup.anahtar}
            id={`mevzuat-${grup.anahtar}`}
          >
            <header className="af-qr-grup-bas" data-belir>
              <p className="af-qr-grup-sira" aria-hidden="true">
                {String(g + 1).padStart(2, '0')} / {String(QR_MENU_BILGI.bolumler.length).padStart(2, '0')}
                <span>{grup.maddeler.length} madde</span>
              </p>
              <p className="af-qr-kurum">{grup.kurum}</p>
              <h3 className="af-h3 af-qr-grup-baslik">{grup.baslik}</h3>
              <p className="af-ikincil-metin">{grup.aciklama}</p>
            </header>
            <ul className="af-qr-maddeler af-qr-maddeler--defter">
              {grup.maddeler.map((m, i) => (
                <li className="af-qr-madde" key={m.baslik} data-belir style={sira(i % 4)}>
                  <p className="af-qr-kaynak">
                    <span>{m.kaynak.mevzuat}</span>
                    {m.kaynak.madde ? <span>{m.kaynak.madde}</span> : null}
                    {m.kaynak.resmiGazete ? <span>{m.kaynak.resmiGazete}</span> : null}
                    {m.kaynak.baglanti ? (
                      <a href={m.kaynak.baglanti} target="_blank" rel="noopener noreferrer nofollow">
                        kaynağı aç
                      </a>
                    ) : null}
                  </p>
                  <h4 className="af-h4">{m.baslik}</h4>
                  <p>{m.metin}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <h3 className="af-h3 af-ust-48">{QR_MENU_BILGI.gecisTakvimiBaslik}</h3>
        <ul className="af-qr-takvim af-qr-takvim--ray af-ust-16">
          {QR_MENU_BILGI.gecisTakvimi.map((s) => (
            <li key={`${s.kim}-${s.tarih}-${s.konu}`}>
              <p className="af-qr-takvim-tarih af-mono">{s.tarih}</p>
              <p className="af-qr-takvim-kim">{s.kim}</p>
              <p className="af-qr-takvim-konu">{s.konu}</p>
            </li>
          ))}
        </ul>
        <p className="af-qr-not af-ust-16">{QR_MENU_BILGI.gecisTakvimiNotu}</p>
      </Bolum>

      {/* ============ 10 · Menüyü kurarken yaptığımız işler + kaynaklar ============ */}
      <Bolum
        bant="beyaz"
        id="mevzuat-uygulama"
        ustEtiket="Uygulama"
        baslik={QR_MENU_BILGI.denetimeHazirlikBaslik}
        giris={QR_MENU_BILGI.denetimeHazirlikNotu}
        genislik="dar"
      >
        <ul className="af-tikli" data-belir>
          {QR_MENU_BILGI.denetimeHazirlik.map((m) => (
            <li key={m}>
              <IkonTik />
              {m}
            </li>
          ))}
        </ul>

        <h3 className="af-h3 af-ust-48">{QR_MENU_BILGI.yaptirimBaslik}</h3>
        <div className="af-yigin af-qr-isik af-ust-16">
          {QR_MENU_BILGI.yaptirim.map((y, i) => (
            <article className="af-kart af-kart--veri" key={y.taraf} data-belir style={sira(i)}>
              <p className="af-qr-kurum">{y.taraf}</p>
              <p className="af-kart-metin">{y.metin}</p>
              <p className="af-qr-kaynak">
                <span>{y.kaynak}</span>
              </p>
            </article>
          ))}
        </div>

        <h3 className="af-h3 af-ust-48">{QR_MENU_BILGI.kaynaklarBaslik}</h3>
        <ul className="af-qr-kaynak-liste af-ust-16">
          {QR_MENU_BILGI.kaynaklar.map((k) => (
            <li key={k.baglanti}>
              <a href={k.baglanti} target="_blank" rel="noopener noreferrer nofollow">
                <IkonOkSagUst />
                {k.ad}
              </a>
            </li>
          ))}
        </ul>

        <p className="af-qr-not af-ust-32">{QR_MENU_BILGI.sorumlulukNotu}</p>
      </Bolum>

      {/* ============ 11 · SSS ============ */}
      <Bolum
        bant="kagit"
        id="sss"
        ustEtiket="Sık sorulanlar"
        baslik="QR menü hakkında en çok sorulanlar"
        genislik="dar"
        akis="duz"
      >
        <SSS sorular={HIZMET.sss} grup="qr-menu-sss" ilkAcik />
      </Bolum>

      {/* ============ 12 · Çağrı ============ */}
      <div data-alt-cta-gizle="">
        <Bolum bant="koyu" id="iletisim" baslik={QR_MENU_BILGI.cagri} giris={QR_MENU_BILGI.cagriAciklama} orta akis="imza" genislik="dar">
          <div className="af-dugmeler af-dugmeler--mobil-blok af-qr-orta-dugmeler">
            <Dugme buyuk href={siteYolu('/iletisim')}>
              Ücretsiz analiz iste
            </Dugme>
            <Dugme
              tur="ikincil"
              whatsapp
              href={whatsappBaglantisi('Merhaba, mevcut menümüzü ve fiyat listesi düzenimizi gözden geçirmenizi istiyorum.')}
            >
              <IkonWhatsApp />
              WhatsApp
            </Dugme>
            <Dugme tur="hayalet" href={DEMO_YOLU}>
              Önce demoyu gör
            </Dugme>
          </div>
          <p className="af-dugme-not af-orta af-ust-24">
            {ILETISIM.adres} · {ILETISIM.telefonGorunum}
          </p>
        </Bolum>
      </div>
    </>
  );
}
