import type { Metadata, Viewport } from 'next';
import TanitimSayfasi from '@/components/tanitim/TanitimSayfasi';
import { tanitimIletisim } from '@/lib/tanitim';

// WhatsApp numarası veritabanındaki ayardan okunuyor; her istekte güncel olsun.
export const dynamic = 'force-dynamic';

// Tam ekran (çentik altı dahil; kenar boşlukları safe-area ile) ve koyu
// tarayıcı çubuğu — yönetim panelinin turuncu tema rengi yerine.
export const viewport: Viewport = { viewportFit: 'cover', themeColor: '#0e0e16' };

const BASLIK = 'Ajans Flow | Sosyal Medya Ajansı · İstanbul';
const ACIKLAMA =
  'İstanbul 4.Levent merkezli sosyal medya ajansı: sosyal medya yönetimi, Reels ve drone çekimleri, Meta & Google reklam yönetimi, web sitesi ve QR menü. Ücretsiz dijital analiz için bize yazın.';

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  alternates: { canonical: '/tanitim' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/tanitim',
    siteName: 'Ajans Flow',
    title: BASLIK,
    description: ACIKLAMA,
  },
  twitter: {
    card: 'summary_large_image',
    title: BASLIK,
    description: ACIKLAMA,
  },
};

/** Herkese açık, genel tanıtım sitesi (kişiye özel sürüm: /t/[kod]). */
export default async function TanitimPage() {
  const iletisim = await tanitimIletisim();
  return <TanitimSayfasi iletisim={iletisim} kisisel={null} />;
}
