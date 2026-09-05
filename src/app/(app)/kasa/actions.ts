'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertPageAccess, logActivity } from '@/lib/auth';

function metin(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

function sayi(fd: FormData, key: string): number | null {
  const raw = metin(fd, key);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isInteger(n) ? n : null;
}

/** Kasa, Gelir/Gider ve Pano ayni rakamlari gostersin. */
function tazele() {
  revalidatePath('/kasa');
  revalidatePath('/finans');
  revalidatePath('/');
}

/**
 * `useActionState` ile çağrılır: hata durumunda throw yerine metin döner,
 * kullanıcı çökme ekranı yerine formun üstünde uyarı görür.
 */
export async function createAccount(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertPageAccess('kasa');

  const name = metin(formData, 'name');
  if (!name) return 'Hesap adı zorunludur (örn. Nakit, Garanti Bankası).';

  const type = String(formData.get('account_type') ?? 'banka');
  const safeType = type === 'nakit' ? 'nakit' : 'banka';

  const balance = parseFloat(String(formData.get('balance') ?? '0'));
  if (!Number.isFinite(balance)) return 'Bakiye geçerli bir sayı olmalı.';

  const rows = (await sql`
    INSERT INTO cash_accounts (name, account_type, balance, notes, created_by)
    VALUES (${name}, ${safeType}, ${balance}, ${metin(formData, 'notes')}, ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'kasa hesabı',
    entityId: rows[0]?.id, detail: `${name} — ${balance}`, isFinancial: true,
  });
  tazele();
  return 'ok';
}

export async function updateAccount(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertPageAccess('kasa');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) return 'Geçersiz hesap.';

  const name = metin(formData, 'name');
  if (!name) return 'Hesap adı zorunludur.';

  const type = String(formData.get('account_type') ?? 'banka');
  const safeType = type === 'nakit' ? 'nakit' : 'banka';

  const balance = parseFloat(String(formData.get('balance') ?? '0'));
  if (!Number.isFinite(balance)) return 'Bakiye geçerli bir sayı olmalı.';

  const rows = (await sql`
    UPDATE cash_accounts
    SET name = ${name}, account_type = ${safeType}, balance = ${balance},
        notes = ${metin(formData, 'notes')}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `) as Array<{ id: number }>;
  if (rows.length === 0) return 'Hesap bulunamadı.';

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'kasa hesabı',
    entityId: id, detail: `${name} — ${balance}`, isFinancial: true,
  });
  tazele();
  return 'ok';
}

export async function deleteAccount(formData: FormData) {
  const user = await assertPageAccess('kasa');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz hesap.');

  await sql`DELETE FROM cash_accounts WHERE id = ${id}`;
  await logActivity({
    userId: user.id, action: 'sil', entity: 'kasa hesabı', entityId: id, isFinancial: true,
  });
  tazele();
}

/**
 * Hesaplar arasi aktarim ("Garanti'den nakit cektim"). Gelir/gider degildir:
 * toplam varlik degismez, para yalnizca yer degistirir. Kayit ve iki bakiye
 * guncellemesi tek SQL ifadesinde yapilir; yarim kalan transfer olusamaz.
 */
export async function createTransfer(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const user = await assertPageAccess('kasa');

  const from = sayi(formData, 'from_account_id');
  const to = sayi(formData, 'to_account_id');
  if (!from || !to) return 'Çıkış ve giriş hesabını seç.';
  if (from === to) return 'Aynı hesaba transfer yapılamaz.';

  const amount = parseFloat(String(formData.get('amount') ?? '').replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) return 'Tutar sıfırdan büyük olmalı.';

  const occurredOn = metin(formData, 'occurred_on');
  if (!occurredOn) return 'Tarih zorunludur.';

  const rows = (await sql`
    WITH t AS (
      INSERT INTO cash_transfers
        (from_account_id, to_account_id, amount, occurred_on, description, created_by)
      VALUES (${from}, ${to}, ${amount}, ${occurredOn}, ${metin(formData, 'description')}, ${user.id})
      RETURNING id, from_account_id, to_account_id, amount
    ),
    cikis AS (
      UPDATE cash_accounts a SET balance = a.balance - t.amount, updated_at = NOW()
      FROM t WHERE a.id = t.from_account_id
      RETURNING a.name
    ),
    giris AS (
      UPDATE cash_accounts a SET balance = a.balance + t.amount, updated_at = NOW()
      FROM t WHERE a.id = t.to_account_id
      RETURNING a.name
    )
    SELECT t.id, cikis.name AS cikis_ad, giris.name AS giris_ad
    FROM t LEFT JOIN cikis ON TRUE LEFT JOIN giris ON TRUE
  `) as Array<{ id: number; cikis_ad: string | null; giris_ad: string | null }>;

  const kayit = rows[0];
  await logActivity({
    userId: user.id, action: 'ekle', entity: 'transfer', entityId: kayit?.id,
    detail: `${kayit?.cikis_ad} → ${kayit?.giris_ad} — ${amount}`, isFinancial: true,
  });
  tazele();
  return `ok|${kayit?.id ?? 0}|${kayit?.cikis_ad} → ${kayit?.giris_ad}`;
}

/** Transferi siler ve iki hesaptaki etkisini geri alir. */
export async function deleteTransfer(formData: FormData) {
  const user = await assertPageAccess('kasa');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz transfer.');

  await sql`
    WITH s AS (
      DELETE FROM cash_transfers WHERE id = ${id}
      RETURNING id, from_account_id, to_account_id, amount
    ),
    geri_cikis AS (
      UPDATE cash_accounts a SET balance = a.balance + s.amount, updated_at = NOW()
      FROM s WHERE a.id = s.from_account_id
      RETURNING a.id
    ),
    geri_giris AS (
      UPDATE cash_accounts a SET balance = a.balance - s.amount, updated_at = NOW()
      FROM s WHERE a.id = s.to_account_id
      RETURNING a.id
    )
    SELECT id FROM s
  `;

  await logActivity({
    userId: user.id, action: 'sil', entity: 'transfer', entityId: id, isFinancial: true,
  });
  tazele();
}
