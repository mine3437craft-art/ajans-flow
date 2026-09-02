import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * Kurulum doğrulaması. Oturum gerektirmediği için hiçbir gizli değer
 * dışarı verilmez — yalnızca "ayar doğru mu" bilgisi döner.
 */
export async function GET() {
  // Oturum anahtarı: değerin kendisi asla döndürülmez, yalnızca durumu.
  const secret = process.env.SESSION_SECRET ?? '';
  const oturumAnahtari = !secret
    ? 'EKSİK — Vercel ortam değişkenlerine eklenmeli'
    : secret.length < 32
      ? `ÇOK KISA — ${secret.length} karakter, en az 32 olmalı`
      : 'tamam';

  let veritabani: string;
  let kullanici: number | null = null;
  try {
    const rows = (await sql`SELECT COUNT(*)::int AS n FROM users`) as Array<{ n: number }>;
    kullanici = rows[0]?.n ?? 0;
    veritabani = 'tamam';
  } catch (error) {
    const mesaj = error instanceof Error ? error.message : 'bilinmeyen hata';
    console.error('[health] veritabanı hatası:', mesaj);
    veritabani = 'BAĞLANILAMADI — ayrıntı sunucu günlüğünde';
  }

  const ok = veritabani === 'tamam' && oturumAnahtari === 'tamam';

  return NextResponse.json(
    { ok, veritabani, kullanici, oturumAnahtari },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
