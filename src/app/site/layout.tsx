import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ILETISIM, MARKA, siteAdresi, siteYolu } from '@/lib/site';
import Ustbar from '@/components/site/Ustbar';
import Altbilgi from '@/components/site/Altbilgi';
import { NAV, ALT_MENU, BIRINCIL_CAGRI } from '@/lib/site-icerik';
import AkisHatti from '@/components/site/AkisHatti';
import AltCtaSerit from '@/components/site/AltCtaSerit';
import EfektlerKapisi from '@/components/site/EfektlerKapisi';
import { YapisalVeri } from '@/components/site/YapisalVeri';
import './site.css';

/* ------------------------------------------------------------------ */
/* Yazı tipleri — DEPODAN (next/font/local), latin + latin-ext          */
/*                                                                      */
/* NEDEN: `next/font/google` dosyaları DERLEME ANINDA indiriyordu ve    */
/* Turbopack'in o indirmesinde bir yarış durumu var — aynı kaynakla     */
/* yapılan 6 derlemeden 2'si "Can't resolve '@vercel/turbopack-next/    */
/* internal/font/google/font'" hatasıyla patlıyordu (ağ sağlamdı, 12    */
/* hatanın tamamı JetBrains Mono'nun 6 alt kümesi × 2 ağırlığındandı).  */
/* Dosyalar artık `./fonts/` altında: derleme HİÇ ağ isteği yapmıyor.   */
/*                                                                      */
/* DOSYALAR: google/fonts deposundaki değişken (variable) TTF'ten,       */
/* fontTools ile üretildi:                                              */
/*   1. Google'ın CSS2'de sunduğu eksenler sabitlendi (Bricolage için   */
/*      `wdth=100`; `opsz` ve `wght` değişken kaldı — eski              */
/*      `axes: ['opsz']` davranışı `font-optical-sizing: auto` tarayıcı */
/*      varsayılanıyla aynen korunuyor).                                */
/*   2. `latin` + `latin-ext` unicode aralıklarının BİRLEŞİMİne alt     */
/*      küme alındı (1546 kod noktası) — diğer alt kümeler (kiril,      */
/*      yunan, vietnam) dışarıda.                                       */
/* Google'ın ayrı sunduğu iki alt küme dosyası BİRLEŞTİRİLDİ, çünkü     */
/* o dosyalar AYRIK: `latin`te ş ğ İ Ş Ğ yok, `latin-ext`te a 0 · — ’   */
/* yok. İki ayrı dosya `unicode-range` gerektirir; Turbopack ise        */
/* `declarations` ile verilen `font-family`'yi @font-face'e yazıp CSS   */
/* değişkenini yine değişken ADINDAN üretiyor (webpack'ten farklı), bu  */
/* yüzden iki dosyalı kurulum Turbopack'te bozuk CSS üretiyor. Tek      */
/* dosya = tek `src`, `unicode-range` gereksiz, iki paketleyicide aynı. */
/*                                                                      */
/* Üretilen dosyalar Google'ın sunduklarıyla BİREBİR doğrulandı:        */
/* upem/ascent/descent/capHeight/xHeight aynı ve kullanılan her         */
/* ağırlıkta (400/500/600/700/800) harf ilerleme genişlikleri aynı.     */
/*                                                                      */
/* Ağırlık aralıkları dosyaların KENDİ `fvar` tablosundan okundu:       */
/* Bricolage wght 200–800 (+ opsz 12–96), JetBrains wght 100–800.       */
/* Mono'da yalnız 400–500 bildiriliyor: Google'ın CSS'i de tam olarak   */
/* bu iki ağırlığı sunuyordu, site.css'te mono yalnız 400/500           */
/* kullanıyor — ağırlık seçimi birebir aynı kalsın diye.                */
/*                                                                      */
/* Metin yazı tipi (Inter) kök layout'tan `--font-inter` ile geliyor.   */
/* ------------------------------------------------------------------ */

/* DİKKAT: Turbopack `next/font/local` ailesini JS DEĞİŞKEN ADINDAN
   üretiyor (webpack'teki gibi hash'lemiyor). Bu yüzden değişken adları
   proje genelinde TEKİL olmak zorunda: aynı adı kullanan iki çağrı aynı
   `font-family` adını ve aynı `… Fallback` yüzünü üretir, biri diğerini
   ezer. Adı değiştirirken bunu unutmayın. */
const siteBaslikYazisi = localFont({
  src: './fonts/bricolage-grotesque.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-baslik',
});

const siteMonoYazisi = localFont({
  src: './fonts/jetbrains-mono.woff2',
  weight: '400 500',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono',
});

/* ------------------------------------------------------------------ */
/* Üst veri                                                            */
/* ------------------------------------------------------------------ */

const BASLIK = 'Ajans Flow | Sosyal medya, prodüksiyon ve yazılım — İstanbul';
const ACIKLAMA =
  'İçeriği de yazılımı da aynı ekip yazıyor. Sosyal medya yönetimi, video ve fotoğraf prodüksiyonu, ' +
  'Meta ve Google reklamları, web sitesi, QR dijital menü ve otomotiv yazılımları. İstanbul / 4.Levent.';

export const metadata: Metadata = {
  metadataBase: new URL(siteAdresi()),
  title: {
    default: BASLIK,
    // Alt sayfalar yalnız kendi başlığını yazar: "QR dijital menü" → "QR dijital menü | Ajans Flow"
    template: `%s | ${MARKA.ad}`,
  },
  description: ACIKLAMA,
  applicationName: MARKA.ad,
  authors: [{ name: MARKA.ad }],
  creator: MARKA.ad,
  publisher: MARKA.ad,
  // DİKKAT (sayfa ajanları): bu kök değer yalnız ana sayfa için doğrudur.
  // HER sayfa kendi `alternates: { canonical: '/…' }` değerini YAZMALIDIR.
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: MARKA.ad,
    url: '/',
    title: BASLIK,
    description: ACIKLAMA,
  },
  twitter: {
    card: 'summary_large_image',
    title: BASLIK,
    description: ACIKLAMA,
  },
  icons: {
    icon: [{ url: siteYolu('/marka/flow-sembol.svg'), type: 'image/svg+xml' }],
    shortcut: [{ url: siteYolu('/marka/flow-sembol.svg'), type: 'image/svg+xml' }],
    apple: [{ url: siteYolu('/marka/flow-sembol.svg'), type: 'image/svg+xml' }],
  },
  category: 'business',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0E0E16',
};

/* ------------------------------------------------------------------ */
/* Animasyon kapısı — 4 saniye kuralı                                   */
/*                                                                     */
/* İçerik VARSAYILAN OLARAK GÖRÜNÜR. Bu betik `js-var` sınıfını koyar;  */
/* CSS ancak o zaman `[data-belir]` ögelerini gizler. Efektler bağlanınca */
/* `af-hazir` eklenir. 4 saniyede gelmezse `js-var` kaldırılır ve her    */
/* şey açılır — JS hiç gelmese bile sayfa okunur kalır.                 */
/* ------------------------------------------------------------------ */
const KOK_ID = 'af-kok';
const KAPI_BETIGI =
  `(function(){var k=document.getElementById('${KOK_ID}');if(!k)return;` +
  `k.classList.add('js-var');` +
  `setTimeout(function(){if(!k.classList.contains('af-hazir'))k.classList.remove('js-var');},4000);})();`;

/* ------------------------------------------------------------------ */
/* Yapısal veri — Organization + LocalBusiness                          */
/* Uydurma yok: çalışma saati, açık adres ve koordinat YAZILMAZ         */
/* (sahibinin kararı, SITE-BRIEF.md §8.1). Google İşletme Profili       */
/* açılınca buradaki bilgiler profille BİREBİR aynı olacak.             */
/* ------------------------------------------------------------------ */
function yapisalVeri() {
  const kok = siteAdresi();
  const sembol = `${kok}${siteYolu('/marka/flow-sembol.svg')}`;
  const adres = {
    '@type': 'PostalAddress',
    addressLocality: ILETISIM.sehir,
    addressRegion: ILETISIM.sehir,
    addressCountry: 'TR',
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${kok}/#kurulus`,
        name: MARKA.ad,
        alternateName: MARKA.tamAd,
        url: kok,
        logo: sembol,
        image: sembol,
        email: ILETISIM.eposta,
        telephone: ILETISIM.telefonBaglanti.replace('tel:', ''),
        address: adres,
        areaServed: ILETISIM.sehir,
        sameAs: [ILETISIM.instagramProfil],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${kok}/#isletme`,
        name: MARKA.ad,
        url: kok,
        image: sembol,
        description: ACIKLAMA,
        email: ILETISIM.eposta,
        telephone: ILETISIM.telefonBaglanti.replace('tel:', ''),
        address: adres,
        areaServed: ILETISIM.sehir,
        sameAs: [ILETISIM.instagramProfil],
        parentOrganization: { '@id': `${kok}/#kurulus` },
      },
    ],
  };
}

/* ------------------------------------------------------------------ */

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: aşağıdaki satır içi kapı betiği React
    // hidrasyondan ÖNCE `js-var` sınıfını ekliyor; bu bilinçli bir fark.
    <div
      id={KOK_ID}
      className={`af ${siteBaslikYazisi.variable} ${siteMonoYazisi.variable}`}
      suppressHydrationWarning
    >
      {/* Kök layout (panel) <head>'e roket emojili bir favicon basıyor ve o
          sırada metadata'nın ikonlarından SONRA geliyor. React 19 bu <link>'i
          <head>'in sonuna taşır, böylece site sayfalarında marka sembolü
          kazanır. Kök layout bizim dosyamız değil; tek dokunmadan çözüm bu. */}
      <link rel="icon" href={siteYolu('/marka/flow-sembol.svg')} type="image/svg+xml" />
      <script dangerouslySetInnerHTML={{ __html: KAPI_BETIGI }} />
      <YapisalVeri veri={yapisalVeri()} />

      <a className="af-atla" href="#af-icerik">
        İçeriğe geç
      </a>

      {/* Menü tek kaynaktan: site-icerik.ts içindeki NAV. */}
      <Ustbar nav={NAV} cagri={BIRINCIL_CAGRI} />
      <AkisHatti />

      <main id="af-icerik">{children}</main>

      <Altbilgi sutunlar={NAV} yasal={ALT_MENU} />
      <AltCtaSerit />
      {/* GSAP + Lenis (≈54 KB gz) LCP yolunda DURMAZ: kapı bileşeni
          `next/dynamic(..., { ssr:false })` ile ilk boyamadan sonra,
          boşta ya da ilk etkileşimde indirir. Bkz. EfektlerKapisi.tsx */}
      <EfektlerKapisi kokId={KOK_ID} />
    </div>
  );
}
