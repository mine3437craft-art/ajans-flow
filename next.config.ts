import type { NextConfig } from 'next';

// Tüm sayfalar `export const dynamic = 'force-dynamic'` ile çalışıyor;
// finans verisi hiçbir zaman önbelleğe alınmaz.
const nextConfig: NextConfig = {
  // PGlite bir WASM paketi — bundle edilmemeli, Node tarafında çözülmeli.
  serverExternalPackages: ['@electric-sql/pglite'],
};

export default nextConfig;
