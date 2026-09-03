import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';
import { sql } from '@/lib/db';
import { NAV_ITEMS } from '@/lib/permissions';

/** "/finans" -> 'finans' gibi, kasa sayfalarının yol -> izin anahtarı eşlemesi. */
const KASA_YOLLARI = new Map(
  NAV_ITEMS.filter((n) => n.pageKey).map((n) => [n.href, n.pageKey!]),
);

function kasaAnahtari(pathname: string): string | null {
  for (const [yol, anahtar] of KASA_YOLLARI) {
    if (pathname === yol || pathname.startsWith(`${yol}/`)) return anahtar;
  }
  return null;
}

/**
 * İlk savunma hattı (Next 16 "proxy" katmanı): oturumu olmayanı /login'e,
 * yetkisiz personeli kasa sayfalarından panoya yollar. Next 16'da proxy
 * Node.js ortamında çalıştığı için veritabanına erişebiliyor — kasa
 * erişimi kişi bazlı (user_page_access) olduğundan burada gerçek bir
 * kontrol yapılıyor. Asıl güvenlik sınırı yine de sayfaların ve server
 * action'ların içindeki requirePageAccess/assertPageAccess'tir; burası
 * yalnızca ilk hattır.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('af_session')?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = pathname === '/' ? '' : `?donus=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (session.role !== 'admin') {
    const anahtar = kasaAnahtari(pathname);
    if (anahtar) {
      const rows = (await sql`
        SELECT 1 FROM user_page_access WHERE user_id = ${session.uid} AND page_key = ${anahtar}
      `) as unknown[];
      if (rows.length === 0) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.search = '?yetkisiz=1';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // /login, statik dosyalar ve Next iç yolları hariç her şey korumalı.
  matcher: ['/((?!login|api/health|_next/static|_next/image|favicon.ico).*)'],
};
