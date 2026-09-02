import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * Veritabanı bağlantısını doğrular. Oturum gerektirmez, bu yüzden
 * dışarıya ayrıntı sızdırmaz: hata metni yalnızca sunucu günlüğüne yazılır.
 */
export async function GET() {
  try {
    const rows = (await sql`SELECT COUNT(*)::int AS n FROM users`) as Array<{ n: number }>;
    return NextResponse.json(
      { ok: true, kullanici: rows[0]?.n ?? 0 },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const mesaj = error instanceof Error ? error.message : 'bilinmeyen hata';
    console.error('[health] veritabanı hatası:', mesaj);
    return NextResponse.json(
      { ok: false, hata: 'Veritabanına bağlanılamadı. Ayrıntı sunucu günlüğünde.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
