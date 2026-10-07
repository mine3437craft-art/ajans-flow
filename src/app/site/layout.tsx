import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import { ILETISIM, MARKA, siteAdresi, siteYolu } from '@/lib/site';
import Ustbar from '@/components/site/Ustbar';
import Altbilgi from '@/components/site/Altbilgi';
import { NAV, ALT_MENU, BIRINCIL_CAGRI } from '@/lib/site-icerik';
import AkisHatti from '@/components/site/AkisHatti';
import AltCtaSerit from '@/components/site/AltCtaSerit';
import EfektlerKapisi from '@/components/site/EfektlerKapisi';
import './site.css';

/* ------------------------------------------------------------------ */
/* Yazı tipleri — kendi sunucumuzdan, latin + latin-ext                 */
/* Metin yazı tipi (Inter) kök layout'tan `--font-inter` ile geliyor.   */
/* ------------------------------------------------------------------ */

const baslikYazisi = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-baslik',
  display: 'swap',
  axes: ['opsz'],
});

const monoYazisi = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
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
      className={`af ${baslikYazisi.variable} ${monoYazisi.variable}`}
      suppressHydrationWarning
    >
      {/* Kök layout (panel) <head>'e roket emojili bir favicon basıyor ve o
          sırada metadata'nın ikonlarından SONRA geliyor. React 19 bu <link>'i
          <head>'in sonuna taşır, böylece site sayfalarında marka sembolü
          kazanır. Kök layout bizim dosyamız değil; tek dokunmadan çözüm bu. */}
      <link rel="icon" href={siteYolu('/marka/flow-sembol.svg')} type="image/svg+xml" />
      <script dangerouslySetInnerHTML={{ __html: KAPI_BETIGI }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yapisalVeri()) }}
      />

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
