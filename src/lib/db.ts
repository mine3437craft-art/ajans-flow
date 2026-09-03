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
    // Sunucusuz ortamda her istek yeni bir örnek başlatabilir. Örnek başına
    // büyük havuz açmak Supabase'in bağlantı sınırını tüketir ve aralıklı
    // 500'lere yol açar; bu yüzden Vercel'de örnek başına tek bağlantı.
    const sunucusuz = process.env.VERCEL === '1';

    g.__afPool = new Pool({
      ...baglanti(url),
      max: sunucusuz ? 1 : 10,
      // Boşta kalan bağlantı çabuk bırakılsın ki havuz tıkanmasın.
      idleTimeoutMillis: sunucusuz ? 10_000 : 30_000,
      connectionTimeoutMillis: 15_000,
      // Sorgu asla süresiz asılı kalmasın.
      statement_timeout: 20_000,
      query_timeout: 20_000,
      allowExitOnIdle: sunucusuz,
    });

    // Havuzdaki beklenmedik hata süreci düşürmesin (Postgres bağlantıyı
    // kapattığında pg 'error' yayar; yakalanmazsa uygulama çöker).
    g.__afPool.on('error', (err) => {
      console.error('[db] havuz hatası:', err.message);
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
function temizle(ham: string): string {
  return ham
    .trim()
    // Panele "DATABASE_URL=..." biçiminde yapıştırılmışsa anahtar adını at
    .replace(/^DATABASE_URL\s*=\s*/i, '')
    // Baştaki/sondaki tırnaklar (.env dosyasından kopyalarken sık oluyor)
    .replace(/^['"]+|['"]+$/g, '')
    .trim();
}

function baglanti(url: string): { connectionString: string; ssl: false | { rejectUnauthorized: boolean } } {
  const temiz = temizle(url);
  let u: URL;
  try {
    u = new URL(temiz);
  } catch {
    throw new Error(
      'DATABASE_URL geçerli bir adres değil. Beklenen biçim: ' +
      'postgresql://kullanici:parola@host:5432/veritabani?sslmode=require ' +
      '(tırnak işareti olmadan).',
    );
  }
  if (!/^postgres(ql)?:$/.test(u.protocol)) {
    throw new Error(`DATABASE_URL "postgresql://" ile başlamalı, "${u.protocol}//" ile başlıyor.`);
  }
  const mod = u.searchParams.get('sslmode');
  u.searchParams.delete('sslmode');
  u.searchParams.delete('uselibpqcompat');

  // Supabase'in "Session pooler"ı (port 5432) her istemciye kalıcı bir
  // bağlantı ayırır ve toplamda yalnızca 15 eşzamanlı istemciye izin verir.
  // Sunucusuz ortamda (her istek ayrı bir örnek olabilir) bu sınır hızla
  // dolar ve "max clients reached in session mode" hatasıyla HERKES dışarıda
  // kalır — bir kullanıcının şifre değiştirip tekrar giremediği vaka buydu.
  // "Transaction pooler" (port 6543) aynı işi çok daha fazla eşzamanlı
  // istemciyle karşılar; burada biz her sorguyu adsız (unnamed) prepared
  // statement ile çalıştırdığımız için (bağlantılar arası önbelleklenen bir
  // hazırlanmış ifade yok) bu geçiş güvenlidir. Kullanıcının Vercel'de
  // ortam değişkenini değiştirmesine gerek kalmasın diye burada otomatik
  // düzeltiyoruz.
  if (u.hostname.endsWith('.pooler.supabase.com') && u.port === '5432') {
    u.port = '6543';
  }

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
