import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/** Vercel'de veritabanı bağlantısını doğrulamak için. Oturum gerektirmez. */
export async function GET() {
  try {
    const rows = (await sql`SELECT COUNT(*)::int AS n FROM users`) as Array<{ n: number }>;
    return NextResponse.json({ ok: true, kullanici: rows[0]?.n ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, hata: error instanceof Error ? error.message : 'bilinmeyen hata' },
      { status: 500 },
    );
  }
}
