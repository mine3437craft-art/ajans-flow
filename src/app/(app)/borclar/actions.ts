'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertAdmin, logActivity } from '@/lib/auth';

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

export async function createDebt(formData: FormData) {
  const user = await assertAdmin();

  const direction = String(formData.get('direction') ?? '');
  if (direction !== 'alacak' && direction !== 'borc') throw new Error('Geçersiz kayıt türü.');

  const counterparty = str(formData, 'counterparty');
  if (!counterparty) throw new Error('Kişi / firma adı zorunludur.');

  const amount = parseFloat(String(formData.get('amount') ?? ''));
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Tutar sıfırdan büyük olmalı.');

  const customerRaw = str(formData, 'customer_id');
  const customerId = customerRaw ? parseInt(customerRaw, 10) : null;

  const rows = (await sql`
    INSERT INTO debts (direction, counterparty, customer_id, amount, due_date, description, created_by)
    VALUES (${direction}, ${counterparty}, ${Number.isInteger(customerId) ? customerId : null},
            ${amount}, ${str(formData, 'due_date')}, ${str(formData, 'description')}, ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: direction, entityId: rows[0]?.id,
    detail: `${counterparty} — ${amount}`, isFinancial: true,
  });
  revalidatePath('/borclar');
  revalidatePath('/');
}

/** Tahsilat / ödeme ekler. Toplam tutarı aşan girişleri reddeder. */
export async function addPayment(formData: FormData) {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  const payment = parseFloat(String(formData.get('payment') ?? ''));

  if (!Number.isInteger(id)) throw new Error('Geçersiz kayıt.');
  if (!Number.isFinite(payment) || payment <= 0) throw new Error('Ödeme tutarı sıfırdan büyük olmalı.');

  const updated = (await sql`
    UPDATE debts
    SET paid_amount = paid_amount + ${payment}
    WHERE id = ${id} AND paid_amount + ${payment} <= amount
    RETURNING id
  `) as Array<{ id: number }>;

  if (updated.length === 0) throw new Error('Ödeme kalan tutarı aşıyor.');

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'borç', entityId: id,
    detail: `ödeme ${payment}`, isFinancial: true,
  });
  revalidatePath('/borclar');
  revalidatePath('/');
}

export async function deleteDebt(formData: FormData) {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz kayıt.');

  await sql`DELETE FROM debts WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'borç', entityId: id, isFinancial: true });
  revalidatePath('/borclar');
  revalidatePath('/');
}
