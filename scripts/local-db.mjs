#!/usr/bin/env node
/**
 * Makinede çalışan gerçek bir Postgres sunucusu başlatır.
 * Yönetici şifresi gerekmez; veriler ./.pgdata içinde tutulur.
 *
 *   npm run db:local
 *
 * Bu süreç açık kaldığı sürece veritabanı ayaktadır. Ctrl+C ile
 * kapatıldığında Postgres düzgün şekilde kapanır.
 */
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(process.cwd(), '.pgdata');
const PORT = 54329;
const USER = 'ajansflow';
const DB = 'ajansflow';

const pg = new EmbeddedPostgres({
  databaseDir: DIR,
  user: USER,
  password: USER,
  port: PORT,
  persistent: true,
  // Kodlama açıkça UTF-8 olmalı; varsayılan SQL_ASCII, Türkçe metinde
  // ILIKE ve büyük/küçük harf eşleştirmesini bozar. Yerel ayar üretimdeki
  // bulut varsayılanıyla aynı tutuluyor ki iki ortam aynı davransın.
  initdbFlags: ['--encoding=UTF8', '--locale=en_US.UTF-8'],
});

const ilkKurulum = !existsSync(path.join(DIR, 'PG_VERSION'));

if (ilkKurulum) {
  console.log('→ Veri dizini oluşturuluyor (ilk çalıştırma)…');
  await pg.initialise();
}

console.log('→ Postgres başlatılıyor…');
await pg.start();

if (ilkKurulum) {
  await pg.createDatabase(DB);
  console.log(`→ "${DB}" veritabanı oluşturuldu`);
}

console.log(`\nPostgres hazır: postgresql://${USER}:${USER}@localhost:${PORT}/${DB}`);
console.log('Durdurmak için Ctrl+C\n');

let kapaniyor = false;
async function kapat() {
  if (kapaniyor) return;
  kapaniyor = true;
  console.log('\n→ Postgres kapatılıyor…');
  try {
    await pg.stop();
  } catch { /* zaten kapanmış olabilir */ }
  process.exit(0);
}
process.on('SIGINT', kapat);
process.on('SIGTERM', kapat);

// Süreci açık tut
setInterval(() => {}, 1 << 30);
