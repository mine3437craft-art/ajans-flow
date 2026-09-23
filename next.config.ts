import type { NextConfig } from 'next';

// Tüm sayfalar `export const dynamic = 'force-dynamic'` ile çalışıyor;
// finans verisi hiçbir zaman önbelleğe alınmaz.
const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
  // public/ klasöründe dizin-indeksi çözümlemesi yok: /mimarelif/index.html
  // bulunur ama çıplak /mimarelif 404 verir. Tek yönlendirme bunu kapatıyor.
  async rewrites() {
    return [{ source: '/mimarelif', destination: '/mimarelif/index.html' }];
  },
};

export default nextConfig;
