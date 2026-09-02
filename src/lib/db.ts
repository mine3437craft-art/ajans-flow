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
      connectionString: url,
      ssl: sslAyari(url),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return g.__afPool;
}

/**
 * TLS ayarını bağlantı adresinden çıkarır — Postgres'in kendi `sslmode`
 * anlamlarına uyar:
 *
 *   localhost                → TLS yok
 *   sslmode=require (varsayılan bulut) → şifreli, sertifika doğrulanmaz
 *   sslmode=verify-full|verify-ca      → şifreli, sertifika doğrulanır
 *
 * Supabase kendi sertifika otoritesini kullandığı için `verify-full`
 * ancak CA sertifikası elde tutulursa çalışır; Neon herkese açık bir CA
 * kullandığından orada doğrulama açılabilir.
 */
function sslAyari(url: string): false | { rejectUnauthorized: boolean } {
  if (/@(localhost|127\.0\.0\.1)[:/]/.test(url)) return false;
  const mod = /[?&]sslmode=([a-z-]+)/.exec(url)?.[1];
  if (mod === 'disable') return false;
  if (mod === 'verify-full' || mod === 'verify-ca') return { rejectUnauthorized: true };
  return { rejectUnauthorized: false };
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
