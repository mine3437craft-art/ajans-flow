'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertPageAccess, logActivity } from '@/lib/auth';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/format';

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

export async function createTransaction(formData: FormData) {
  // Finansal veri — her çağrıda yönetici kontrolü. Menüyü gizlemek yetmez.
  const user = await assertPageAccess('finans');

  const type = String(formData.get('type') ?? '');
  if (type !== 'gelir' && type !== 'gider') throw new Error('Geçersiz işlem türü.');

  const amount = parseFloat(String(formData.get('amount') ?? ''));
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Tutar sıfırdan büyük olmalı.');

  const category = str(formData, 'category') ?? 'Diğer';
  const allowed = type === 'gelir' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const safeCategory = allowed.includes(category) ? category : 'Diğer';

  const occurredOn = str(formData, 'occurred_on');
  if (!occurredOn) throw new Error('Tarih zorunludur.');

  const customerRaw = str(formData, 'customer_id');
  const customerId = customerRaw ? parseInt(customerRaw, 10) : null;

  const rows = (await sql`
    INSERT INTO transactions (type, amount, category, description, occurred_on, customer_id, created_by)
    VALUES (${type}, ${amount}, ${safeCategory}, ${str(formData, 'description')},
            ${occurredOn}, ${Number.isInteger(customerId) ? customerId : null}, ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: type, entityId: rows[0]?.id,
    detail: `${safeCategory} — ${amount}`, isFinancial: true,
  });
  revalidatePath('/finans');
  revalidatePath('/');
  revalidatePath('/raporlar');
}

export async function deleteTransaction(formData: FormData) {
  const user = await assertPageAccess('finans');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz kayıt.');

  await sql`DELETE FROM transactions WHERE id = ${id}`;
  await logActivity({
    userId: user.id, action: 'sil', entity: 'işlem', entityId: id, isFinancial: true,
  });
  revalidatePath('/finans');
  revalidatePath('/');
  revalidatePath('/raporlar');
}
