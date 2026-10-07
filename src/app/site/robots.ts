import type { MetadataRoute } from 'next';
import { siteAdresi } from '@/lib/site';

/**
 * flowajans.com/robots.txt — alan adında proxy bu yolu /site/robots.txt'e
 * yazdığı için dosya burada duruyor. Panel (ajans-flow.vercel.app) ve
 * kişiye özel sunum sayfaları aramaya kapalı.
 */
export default function robots(): MetadataRoute.Robots {
  const kok = siteAdresi();
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/t/', '/api/', '/login'] },
    ],
    sitemap: `${kok}/sitemap.xml`,
    host: kok,
  };
}
