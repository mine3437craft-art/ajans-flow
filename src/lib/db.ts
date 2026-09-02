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
    const yerel = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    g.__afPool = new Pool({
      connectionString: url,
      // Yerel sunucuda TLS yok; bulut sağlayıcılarda zorunlu.
      ssl: yerel ? false : { rejectUnauthorized: true },
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return g.__afPool;
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
