import { neon } from '@neondatabase/serverless';

type Sql = ReturnType<typeof neon>;

let cached: Sql | null = null;

function client(): Sql {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL tanımlı değil. Yerelde .env.local, Vercel’de ortam değişkenlerini kontrol edin.',
      );
    }
    cached = neon(url);
  }
  return cached;
}

/**
 * Etiketli şablon olarak kullanılır; parametreler her zaman bağlantı değeri
 * olarak gönderilir, string birleştirme yapılmaz (SQL enjeksiyonuna kapalı).
 *
 *   const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 *
 * Bağlantı ilk sorguda kurulur — build sırasında ortam değişkeni aranmaz.
 */
export const sql = ((strings: TemplateStringsArray, ...params: unknown[]) =>
  client()(strings, ...params)) as unknown as Sql;
