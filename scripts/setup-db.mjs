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

const here = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('HATA: DATABASE_URL tanımlı değil.');
  console.error('  .env.local dosyası oluşturup Neon bağlantı adresini yazın.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

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
    await sql.query(stmt, []);
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
