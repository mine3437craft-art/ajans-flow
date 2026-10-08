import { siteAdresi } from '@/lib/site';

/**
 * flowajans.com/robots.txt — alan adında proxy bu yolu /site/robots.txt'e
 * yazdığı için dosya burada duruyor.
 *
 * NEDEN `robots.ts` DEĞİL: Next'in `robots.ts` üstveri dosyası YALNIZCA app
 * kökünde çalışır (`app/robots.ts` → `/robots.txt`). İç bir segmentte duran
 * `app/site/robots.ts` hiçbir yol üretmiyordu; `/site/robots.txt` 404
 * veriyordu. Bu yüzden düz bir yol işleyicisine çevrildi.
 *
 * Panel (/login, /api) ve kişiye özel sunum sayfaları (/t/<kod>) aramaya
 * kapalı. Teşekkür ve tasarım sistemi sayfaları da indekslenmemeli.
 */
export const dynamic = 'force-dynamic';

/** `Host:` satırı — yalnız adres gerçekten bir kökse ve yol taşımıyorsa. */
function anaMakine(kok: string): string[] {
  try {
    const u = new URL(kok);
    if (u.pathname !== '/' && u.pathname !== '') return [];
    return [`Host: ${u.host}`];
  } catch {
    return [];
  }
}

export function GET(): Response {
  const kok = siteAdresi();
  const govde = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /t/',
    'Disallow: /api/',
    'Disallow: /login',
    'Disallow: /tesekkurler',
    'Disallow: /tasarim-sistemi',
    '',
    `Sitemap: ${kok}/sitemap.xml`,
    // `Host` yalnız alan adı alır, yol alamaz. `siteAdresi()` alan adı
    // bağlanmadan önce ".../site" gibi bir YOL döndürüyor; metni düz
    // kırpsaydık "Host: ornek.vercel.app/site" gibi geçersiz bir satır
    // çıkardı. Bu yüzden ana makine adı ayrıştırılıyor, çözülemezse satır
    // hiç basılmıyor (Host standart dışıdır, yalnız Yandex okur).
    ...anaMakine(kok),
    '',
  ].join('\n');

  return new Response(govde, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
