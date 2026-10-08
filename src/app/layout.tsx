import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Uygulamanın kendi sunucusundan, önceden yüklenerek gelir: Google Fonts
// stil dosyası sayfanın ilk çizimini bekletiyordu (özellikle tanıtım sitesi).
//
// Dosya DEPODA: `next/font/google` derleme anında fonts.googleapis.com'a
// gidiyordu ve Turbopack'in o indirmesinde bir yarış durumu var (aynı
// kaynakla 6 derlemeden 2'si patlıyordu). Artık derleme ağa çıkmıyor.
// `./fonts/inter.woff2`, google/fonts deposundaki değişken Inter'den
// fontTools ile üretildi: `opsz` Google'ın sunduğu gibi varsayılanda
// sabit, `wght` 100–900 değişken (aralık fontun fvar tablosundan okundu),
// alt küme `latin` + `latin-ext` birleşimi (Türkçe ş ğ ı İ dahil).
const inter = localFont({
  src: './fonts/inter.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
});

// Paylaşım kartlarındaki (og:image, og:url) göreli adresler bununla tam
// adrese çevrilir. Vercel üretim adresini kendisi verir.
const siteAdresi = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteAdresi),
  title: 'AJANS Flow | Yönetim Paneli',
  description: 'Ajans yönetim paneli — müşteri, iş takibi, gelir-gider ve borç takibi.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6B35',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
