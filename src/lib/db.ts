/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool, types } from 'pg';

/**
 * Tek sürücü: node-postgres. Aynı kod hem yerelde hem Neon'da çalışır,
 * yalnızca DATABASE_URL değişir.
 *
 *   yerel   : postgresql://ajansflow@localhost:54329/ajansflow
 *   üretim  : postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
 */

// DATE sütunları JS Date yerine 'YYYY-AA-GG' metni olarak gelsin.
// Kodun bazı yerlerinde tarihler doğrudan metin olarak karşılaştırılıyor.
types.setTypeParser(1082, (value) => value);

type Rows = Record<string, any>[];
type SqlFn = (strings: TemplateStringsArray, ...params: unknown[]) => Promise<Rows>;

// Hot reload sırasında havuz çoğalmasın diye globalThis üzerinde tutulur.
const g = globalThis as unknown as { __afPool?: Pool };

function pool(): Pool {
  if (!g.__afPool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL tanımlı değil. Yerelde .env.local, Vercel’de ortam değişkenlerini kontrol edin.',
      );
    }
    g.__afPool = new Pool({
      ...baglanti(url),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return g.__afPool;
}

/**
 * TLS ayarını bağlantı adresinden çıkarıp AÇIKÇA belirler.
 *
 * `sslmode` parametresi adresten silinir: `pg` onu kendi yorumluyor ve
 * `require`'ı `verify-full` gibi ele alıyor (sürümler arasında da
 * değişiyor). Böylece davranış sürücü sürümünden bağımsız hale gelir.
 *
 *   localhost                     → TLS yok
 *   sslmode=require / belirtilmemiş → şifreli, sertifika doğrulanmaz
 *   sslmode=verify-full|verify-ca → şifreli, sertifika doğrulanır
 *
 * Supabase kendi sertifika otoritesini kullandığı için doğrulama ancak
 * CA sertifikası elde tutulursa açılabilir; Neon herkese açık bir CA
 * kullandığından orada `verify-full` yazılabilir.
 */
function baglanti(url: string): { connectionString: string; ssl: false | { rejectUnauthorized: boolean } } {
  const u = new URL(url);
  const mod = u.searchParams.get('sslmode');
  u.searchParams.delete('sslmode');
  u.searchParams.delete('uselibpqcompat');

  const yerel = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  const ssl =
    yerel || mod === 'disable' ? false
    : mod === 'verify-full' || mod === 'verify-ca' ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false };

  return { connectionString: u.toString(), ssl };
}

/** `SELECT ... ${a} ... ${b}` → `SELECT ... $1 ... $2` */
function toText(strings: TemplateStringsArray): string {
  return strings.reduce(
    (acc, part, i) => acc + part + (i < strings.length - 1 ? `$${i + 1}` : ''),
    '',
  );
}

/**
 *   const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 *
 * Parametreler her zaman bağlantı değeri olarak gider; string birleştirme yok.
 * Havuz ilk sorguda kurulur — build sırasında ortam değişkeni aranmaz.
 */
export const sql: SqlFn = async (strings, ...params) => {
  const result = await pool().query(toText(strings), params as unknown[]);
  return result.rows;
};
