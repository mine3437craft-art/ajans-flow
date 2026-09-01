/* eslint-disable @typescript-eslint/no-explicit-any */
import { neon } from '@neondatabase/serverless';
import path from 'node:path';

/**
 * Tek bir `sql` etiketli şablonu, iki sürücünün arkasına saklar:
 *
 *   DATABASE_URL="postgresql://..."   → Neon (üretim / Vercel)
 *   DATABASE_URL="pglite://./.pglite" → PGlite, makinede çalışan gömülü
 *                                        Postgres (yerel geliştirme)
 *
 * Sorgular her iki durumda da parametreli gider; string birleştirme yok.
 */

type Rows = Record<string, any>[];
type SqlFn = (strings: TemplateStringsArray, ...params: unknown[]) => Promise<Rows>;

/** `SELECT ... ${a} ... ${b}` → `SELECT ... $1 ... $2` */
function toText(strings: TemplateStringsArray): string {
  return strings.reduce(
    (acc, part, i) => acc + part + (i < strings.length - 1 ? `$${i + 1}` : ''),
    '',
  );
}

// Hot reload sırasında tek örnek kalsın diye globalThis üzerinde tutulur.
const g = globalThis as unknown as {
  __afPglite?: Promise<any>;
  __afSql?: SqlFn;
};

function pgliteClient(url: string): SqlFn {
  const dir = path.resolve(process.cwd(), url.replace(/^pglite:(\/\/)?/, '') || './.pglite');

  if (!g.__afPglite) {
    g.__afPglite = import('@electric-sql/pglite').then(({ PGlite }) => new PGlite(dir));
  }

  return async (strings, ...params) => {
    const db = await g.__afPglite!;
    const result = await db.query(toText(strings), params);
    return result.rows as Rows;
  };
}

function makeClient(): SqlFn {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL tanımlı değil. Yerelde .env.local, Vercel’de ortam değişkenlerini kontrol edin.',
    );
  }
  if (url.startsWith('pglite:')) return pgliteClient(url);

  const n = neon(url);
  return (strings, ...params) => n(strings, ...params) as Promise<Rows>;
}

/**
 *   const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 *
 * Bağlantı ilk sorguda kurulur — build sırasında ortam değişkeni aranmaz.
 */
export const sql: SqlFn = (strings, ...params) => {
  if (!g.__afSql) g.__afSql = makeClient();
  return g.__afSql(strings, ...params);
};
