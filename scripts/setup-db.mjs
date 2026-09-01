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
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import path from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('HATA: DATABASE_URL tanımlı değil.');
  console.error('  .env.local dosyası oluşturup Neon bağlantı adresini yazın.');
  process.exit(1);
}

/**
 * Uygulamadaki src/lib/db.ts ile aynı mantık: pglite:// ile başlayan adres
 * yerel gömülü Postgres'e, diğerleri Neon'a gider.
 */
function toText(strings) {
  return strings.reduce(
    (acc, part, i) => acc + part + (i < strings.length - 1 ? `$${i + 1}` : ''),
    '',
  );
}

let sql;
let raw;

if (process.env.DATABASE_URL.startsWith('pglite:')) {
  const dir = path.resolve(
    process.cwd(),
    process.env.DATABASE_URL.replace(/^pglite:(\/\/)?/, '') || './.pglite',
  );
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite(dir);
  sql = async (strings, ...params) => (await db.query(toText(strings), params)).rows;
  raw = async (text) => { await db.exec(text); };
  console.log(`(yerel PGlite: ${dir})`);
} else {
  const client = neon(process.env.DATABASE_URL);
  sql = (strings, ...params) => client(strings, ...params);
  raw = async (text) => { await client.query(text, []); };
}

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
  console.log('→ Tablolar oluşturuluyor…');
  const schema = readFileSync(join(here, '..', 'db', 'schema.sql'), 'utf8');
  for (const stmt of statements(schema)) {
    await raw(stmt);
  }
  console.log('  tamam.');

  console.log('→ Kullanıcılar hazırlanıyor…');
  for (const k of KULLANICILAR) {
    const varMi = await sql`SELECT 1 FROM users WHERE username = ${k.username}`;
    if (varMi.length > 0) {
      console.log(`  · ${k.display_name.padEnd(6)} zaten var, atlandı`);
      continue;
    }
    // Başlangıç şifresi: kullanıcıadı + 1234  (örn. beyza1234)
    const hash = await bcrypt.hash(`${k.username}1234`, 12);
    await sql`
      INSERT INTO users (username, display_name, password_hash, role, must_change_password)
      VALUES (${k.username}, ${k.display_name}, ${hash}, ${k.role}, TRUE)
    `;
    console.log(`  ✓ ${k.display_name.padEnd(6)} (${k.role.padEnd(5)}) şifre: ${k.username}1234`);
  }

  console.log('\nKurulum tamamlandı.');
  console.log('Herkes ilk girişte kendi şifresini belirleyecek.');
}

main().catch((err) => {
  console.error('\nHATA:', err.message);
  process.exit(1);
});
