import type { MetadataRoute } from 'next';
import { siteAdresi } from '@/lib/site';
import { HIZMETLER, SEKTORLER, VAKALAR } from '@/lib/site-icerik';
import { URUNLER } from '@/app/site/otomotiv-yazilimlari/icerik';
import { REHBER, sonTarih } from '@/icerik/rehber';

/**
 * flowajans.com/sitemap.xml — alan adında proxy bu yolu /site/sitemap.xml'e
 * yazıyor. Kişiye özel sunum sayfaları (/t/<kod>) ve panel burada YER ALMAZ.
 *
 * Öncelikler: ana sayfa ve dönüşüm sayfaları en yüksek, hizmet ve sektör
 * sayfaları onların altında, kurumsal/yasal sayfalar en düşük.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const kok = siteAdresi();
  const simdi = new Date();
  const adres = (yol: string) => `${kok}${yol === '/' ? '' : yol}`;

  const sabitler: Array<{ yol: string; oncelik: number; siklik: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { yol: '/', oncelik: 1, siklik: 'weekly' },
    { yol: '/analiz', oncelik: 0.9, siklik: 'monthly' },
    { yol: '/hizmetler', oncelik: 0.9, siklik: 'monthly' },
    { yol: '/qr-menu', oncelik: 0.9, siklik: 'monthly' },
    { yol: '/otomotiv-yazilimlari', oncelik: 0.8, siklik: 'monthly' },
    { yol: '/demo/qr-menu', oncelik: 0.6, siklik: 'yearly' },
    { yol: '/sektorler', oncelik: 0.8, siklik: 'monthly' },
    { yol: '/calismalar', oncelik: 0.8, siklik: 'monthly' },
    { yol: '/rehber', oncelik: 0.7, siklik: 'weekly' },
    { yol: '/hakkimizda', oncelik: 0.6, siklik: 'yearly' },
    { yol: '/iletisim', oncelik: 0.8, siklik: 'yearly' },
    { yol: '/kvkk', oncelik: 0.2, siklik: 'yearly' },
    { yol: '/gizlilik', oncelik: 0.2, siklik: 'yearly' },
  ];

  return [
    ...sabitler.map((s) => ({
      url: adres(s.yol),
      lastModified: simdi,
      changeFrequency: s.siklik,
      priority: s.oncelik,
    })),
    ...HIZMETLER.map((h) => ({
      url: adres(`/hizmetler/${h.slug}`),
      lastModified: simdi,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...SEKTORLER.map((s) => ({
      url: adres(`/sektorler/${s.slug}`),
      lastModified: simdi,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...VAKALAR.map((v) => ({
      url: adres(`/calismalar/${v.slug}`),
      lastModified: simdi,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    /* Rehber yazıları — lastModified yazının kendi güncelleme tarihi
       (yoksa yayın tarihi); "şimdi" yazmak her dağıtımda bütün yazıları
       değişmiş gibi gösterirdi. */
    ...REHBER.map((y) => ({
      url: adres(`/rehber/${y.slug}`),
      lastModified: new Date(`${sonTarih(y)}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    /* Otomotiv ürün detayları — hub sayfası sitemap'teydi ama üç alt sayfa
       dışarıda kalmıştı; üçü de 200 dönüyor ve robots'ta engelli değil. */
    ...URUNLER.map((u) => ({
      url: adres(`/otomotiv-yazilimlari/${u.slug}`),
      lastModified: simdi,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
