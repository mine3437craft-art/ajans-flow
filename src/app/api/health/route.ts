import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { anahtarKaynagi } from '@/lib/session';

/**
 * Kurulum doğrulaması. Oturum gerektirmediği için hiçbir gizli değer
 * dışarı verilmez — yalnızca "ayar doğru mu" bilgisi döner.
 */
export async function GET() {
  // Oturum anahtarı: değerin kendisi asla döndürülmez, yalnızca kaynağı.
  const oturumAnahtari = anahtarKaynagi();

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

  const ok = veritabani === 'tamam';

  // Hangi commit yayında? Vercel derlemede VERCEL_GIT_COMMIT_SHA verir;
  // yerelde tanımsızdır. Gizli değil: deponun kendi kısa kimliği. Dağıtımın
  // gerçekten alındığını dışarıdan doğrulamanın en kestirme yolu.
  const surum = (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 8) || 'yerel';

  return NextResponse.json(
    { ok, veritabani, kullanici, oturumAnahtari, surum },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
