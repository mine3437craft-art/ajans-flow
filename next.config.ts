import type { NextConfig } from 'next';

// Tüm sayfalar `export const dynamic = 'force-dynamic'` ile çalışıyor;
// finans verisi hiçbir zaman önbelleğe alınmaz.
const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
};

export default nextConfig;
