import type { Metadata, Viewport } from 'next';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { after } from 'next/server';
import TanitimSayfasi from '@/components/tanitim/TanitimSayfasi';
import { kisiselSunum, tanitimIletisim, gercekZiyaretci, ziyaretKaydet } from '@/lib/tanitim';

export const dynamic = 'force-dynamic';

// Tam ekran (çentik altı dahil; kenar boşlukları safe-area ile) ve koyu
// tarayıcı çubuğu — yönetim panelinin turuncu tema rengi yerine.
export const viewport: Viewport = { viewportFit: 'cover', themeColor: '#0e0e16' };

/**
 * Müşteri adayına gönderilen kişisel tanıtım sayfası: /t/<kod>. Genel
 * tanıtım sitesinin aynısı, üstte adaya özel selamlama ve ekibin
 * işaretlediği eksiklerden çıkan öneriler. Arama motorlarına kapalı.
 */
export async function generateMetadata(
  { params }: { params: Promise<{ kod: string }> },
): Promise<Metadata> {
  const { kod } = await params;
  const sunum = await kisiselSunum(kod);
  const baslik = sunum && sunum !== 'hata'
    ? `${sunum.kisisel.ad} için hazırlandı · Ajans Flow`
    : 'Ajans Flow | Sosyal Medya Ajansı · İstanbul';
  const aciklama = 'Markanızı büyütmek için hazırladığımız öneriler: içerik, reklam, çekim ve web.';
  return {
    title: baslik,
    description: aciklama,
    robots: { index: false, follow: false },
    openGraph: {
      title: baslik, description: aciklama, type: 'website', locale: 'tr_TR', siteName: 'Ajans Flow',
      images: [{ url: '/tanitim/opengraph-image', width: 1200, height: 630, alt: 'Ajans Flow' }],
    },
    twitter: { card: 'summary_large_image', title: baslik, description: aciklama, images: ['/tanitim/opengraph-image'] },
  };
}

export default async function KisiselTanitim({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const [sunum, iletisim] = await Promise.all([kisiselSunum(kod), tanitimIletisim()]);
  // Yanlış / silinmiş kod: genel tanıtım sitesi açılsın, hata sayfası değil.
  if (sunum === null) redirect('/tanitim');
  // Veritabanı yanıt vermediyse genel sürüm gösterilir; yönlendirme yok ki
  // birazdan yeniden açıldığında kişisel sayfa gelsin.
  if (sunum === 'hata') return <TanitimSayfasi iletisim={iletisim} kisisel={null} />;

  // Açılma sayısı: ekip (oturum ya da ekip çerezi olan) ve bağlantı önizleme
  // botları sayılmaz. Yanıtı bekletmemek için sayfa gönderildikten sonra yazılır.
  const [cerez, basliklar] = await Promise.all([cookies(), headers()]);
  const ekip = cerez.has('af_session') || cerez.has('af_ekip');
  const onYukleme = /prefetch|prerender/i.test(basliklar.get('sec-purpose') ?? basliklar.get('purpose') ?? '');
  if (!ekip && !onYukleme && gercekZiyaretci(basliklar.get('user-agent'))) {
    after(() => ziyaretKaydet(sunum.id).catch(() => {}));
  }

  return <TanitimSayfasi iletisim={iletisim} kisisel={sunum.kisisel} />;
}
