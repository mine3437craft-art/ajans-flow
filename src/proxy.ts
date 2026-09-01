import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';
import { isAdminPath } from '@/lib/permissions';

/**
 * İlk savunma hattı (Next 16 “proxy” katmanı): oturumu olmayanı /login'e, personeli yönetici
 * sayfalarından panoya yollar. Asıl yetki kontrolü sayfaların ve server
 * action'ların içinde (requireAdmin / assertAdmin) yapılır — burada
 * kullanılan rol çerezden gelir ve bayat olabilir.
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

  if (session.role !== 'admin' && isAdminPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '?yetkisiz=1';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // /login, statik dosyalar ve Next iç yolları hariç her şey korumalı.
  matcher: ['/((?!login|api/health|_next/static|_next/image|favicon.ico).*)'],
};
