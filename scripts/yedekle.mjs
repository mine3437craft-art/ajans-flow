#!/usr/bin/env node
/**
 * Buluttaki (Supabase) tüm verileri bu bilgisayara indirir.
 *
 *   npm run yedek
 *
 * Her çalıştırmada iki dosya üretir:
 *   ~/AjansFlow-Yedek/ajansflow-YYYY-AA-GG_SSDD.json   → eksiksiz, geri yüklenebilir
 *   ~/AjansFlow-Yedek/csv/YYYY-AA-GG_SSDD/*.csv        → Excel'de açılabilir
 *
 * 30 günden eski yedekler kendiliğinden silinir.
 * Şifre özetleri ve oturum anahtarı yedeğe DAHİL EDİLMEZ.
 */
import { mkdirSync, writeFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import pg from 'pg';

const KOK = path.join(homedir(), 'AjansFlow-Yedek');
const SAKLAMA_GUN = 30;

// Yedeklenen tablolar. users'tan parola özeti çıkarılır.
const TABLOLAR = [
  { ad: 'users', secim: 'id, username, display_name, role, is_active, must_change_password, last_login_at, created_at' },
  { ad: 'customers' },
  { ad: 'tasks' },
  { ad: 'task_templates' },
  { ad: 'content_posts' },
  { ad: 'videos' },
  { ad: 'notes' },
  { ad: 'note_guides' },
  { ad: 'transactions' },
  { ad: 'cash_accounts' },
  { ad: 'cash_transfers' },
  { ad: 'debts' },
  { ad: 'goals' },
  { ad: 'shortcuts' },
  { ad: 'task_assignees' },
  { ad: 'user_page_access' },
  { ad: 'activity_log' },
];

if (!process.env.DATABASE_URL) {
  console.error('HATA: DATABASE_URL tanımlı değil. .env.local dosyasını kontrol edin.');
  process.exit(1);
}

function baglanti(url) {
  const u = new URL(url.trim().replace(/^DATABASE_URL\s*=\s*/i, '').replace(/^['"]+|['"]+$/g, ''));
  const mod = u.searchParams.get('sslmode');
  u.searchParams.delete('sslmode');
  u.searchParams.delete('uselibpqcompat');
  const yerel = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  const ssl = yerel || mod === 'disable' ? false
    : mod === 'verify-full' || mod === 'verify-ca' ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false };
  return { connectionString: u.toString(), ssl };
}

/** Excel'in sorunsuz açacağı CSV: noktalı virgül ayraç + BOM. */
function csv(rows) {
  if (rows.length === 0) return '';
  const basliklar = Object.keys(rows[0]);
  const hucre = (v) => {
    if (v === null || v === undefined) return '';
    const s = v instanceof Date ? v.toISOString() : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + [
    basliklar.join(';'),
    ...rows.map((r) => basliklar.map((b) => hucre(r[b])).join(';')),
  ].join('\n');
}

function damga() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}

/** Saklama süresini geçmiş yedekleri siler. */
function eskileriTemizle() {
  const sinir = Date.now() - SAKLAMA_GUN * 24 * 60 * 60 * 1000;
  let silinen = 0;
  for (const yer of [KOK, path.join(KOK, 'csv')]) {
    let girdiler;
    try { girdiler = readdirSync(yer); } catch { continue; }
    for (const ad of girdiler) {
      if (ad === 'csv') continue;
      const tam = path.join(yer, ad);
      try {
        if (statSync(tam).mtimeMs < sinir) { rmSync(tam, { recursive: true, force: true }); silinen++; }
      } catch { /* yoksay */ }
    }
  }
  return silinen;
}

async function main() {
  const client = new pg.Client(baglanti(process.env.DATABASE_URL));
  await client.connect();

  const zaman = damga();
  const csvDizin = path.join(KOK, 'csv', zaman);
  mkdirSync(csvDizin, { recursive: true });

  const yedek = { alindi: new Date().toISOString(), surum: 1, tablolar: {} };
  let toplam = 0;

  for (const t of TABLOLAR) {
    const { rows } = await client.query(`SELECT ${t.secim ?? '*'} FROM ${t.ad}`);
    yedek.tablolar[t.ad] = rows;
    toplam += rows.length;
    if (rows.length > 0) {
      writeFileSync(path.join(csvDizin, `${t.ad}.csv`), csv(rows), 'utf8');
    }
    console.log(`  ${String(rows.length).padStart(5)} kayıt  ${t.ad}`);
  }

  const jsonYol = path.join(KOK, `ajansflow-${zaman}.json`);
  writeFileSync(jsonYol, JSON.stringify(yedek, null, 2), 'utf8');
  await client.end();

  const silinen = eskileriTemizle();
  console.log(`\n✓ ${toplam} kayıt yedeklendi`);
  console.log(`  JSON : ${jsonYol}`);
  console.log(`  CSV  : ${csvDizin}`);
  if (silinen > 0) console.log(`  ${silinen} eski yedek temizlendi (${SAKLAMA_GUN} günden eski)`);
}

main().catch((err) => {
  console.error('\nYEDEKLEME HATASI:', err.message);
  process.exit(1);
});
