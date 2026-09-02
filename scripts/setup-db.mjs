#!/usr/bin/env node
/**
 * Veritabanını kurar ve ilk kullanıcıları oluşturur.
 *
 *   npm run db:setup
 *
 * Tekrar çalıştırmak güvenlidir: tablolar IF NOT EXISTS ile oluşur,
 * var olan kullanıcılara dokunulmaz (şifreleri sıfırlanmaz).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const here = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('HATA: DATABASE_URL tanımlı değil.');
  console.error('  .env.local dosyasını kontrol edin.');
  process.exit(1);
}

const url = process.env.DATABASE_URL;
const yerel = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const client = new pg.Client({
  connectionString: url,
  ssl: yerel ? false : { rejectUnauthorized: true },
});

/** Yorumları temizler, sonra ifadeleri ayırır. Yorum içindeki ';' sorun çıkarmasın diye. */
function statements(text) {
  return text
    .replace(/--[^\n]*/g, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

const KULLANICILAR = [
  { username: 'eren',  display_name: 'Eren',  role: 'admin' },
  { username: 'beyza', display_name: 'Beyza', role: 'staff' },
  { username: 'umit',  display_name: 'Ümit',  role: 'staff' },
  { username: 'elif',  display_name: 'Elif',  role: 'staff' },
];

async function main() {
  await client.connect();

  console.log('→ Tablolar oluşturuluyor…');
  const schema = readFileSync(join(here, '..', 'db', 'schema.sql'), 'utf8');
  for (const stmt of statements(schema)) {
    await client.query(stmt);
  }

  // Şemanın gerçekten uygulandığını doğrula
  const { rows: tablolar } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `);
  console.log(`  ${tablolar.length} tablo: ${tablolar.map((t) => t.table_name).join(', ')}`);

  console.log('→ Kullanıcılar hazırlanıyor…');
  for (const k of KULLANICILAR) {
    const { rows } = await client.query('SELECT 1 FROM users WHERE username = $1', [k.username]);
    if (rows.length > 0) {
      console.log(`  · ${k.display_name.padEnd(6)} zaten var, atlandı`);
      continue;
    }
    // Başlangıç şifresi: kullanıcıadı + 1234  (örn. beyza1234)
    const hash = await bcrypt.hash(`${k.username}1234`, 12);
    await client.query(
      `INSERT INTO users (username, display_name, password_hash, role, must_change_password)
       VALUES ($1, $2, $3, $4, TRUE)`,
      [k.username, k.display_name, hash, k.role],
    );
    console.log(`  ✓ ${k.display_name.padEnd(6)} (${k.role.padEnd(5)}) şifre: ${k.username}1234`);
  }

  console.log('\nKurulum tamamlandı.');
  console.log('Herkes ilk girişte kendi şifresini belirleyecek.');
  await client.end();
}

main().catch(async (err) => {
  console.error('\nHATA:', err.message);
  try { await client.end(); } catch { /* yoksay */ }
  process.exit(1);
});
