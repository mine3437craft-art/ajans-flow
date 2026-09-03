'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertPageAccess, logActivity } from '@/lib/auth';

function metin(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
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
  revalidatePath('/kasa');
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
  revalidatePath('/kasa');
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
  revalidatePath('/kasa');
}
