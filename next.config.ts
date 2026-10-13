import type { NextConfig } from 'next';

// Tüm sayfalar `export const dynamic = 'force-dynamic'` ile çalışıyor;
// finans verisi hiçbir zaman önbelleğe alınmaz.
const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
  // /dky: DKY Auto Parts önizlemesi (public/dky — dky-autoparts/scripts/yayinla-ajansflow.mjs
  // üretir). Arama motorlarına kapalı: HTML'deki robots meta'sına ek olarak başlık.
  async headers() {
    return [
      { source: '/dky/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  // public/ klasöründe dizin-indeksi çözümlemesi yok: /mimarelif/index.html
  // bulunur ama çıplak /mimarelif 404 verir. Tek yönlendirme bunu kapatıyor.
  async rewrites() {
    return [
      { source: '/mimarelif', destination: '/mimarelif/index.html' },
      { source: '/dky', destination: '/dky/index.html' },
    ];
  },
};

export default nextConfig;
