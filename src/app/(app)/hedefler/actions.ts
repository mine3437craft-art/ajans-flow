'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertAdmin, logActivity } from '@/lib/auth';

export async function setGoal(formData: FormData) {
  const user = await assertAdmin();

  const period = String(formData.get('period') ?? '');
  if (!/^\d{4}-\d{2}$/.test(period)) throw new Error('Geçersiz dönem.');

  const metric = String(formData.get('metric') ?? '');
  if (!['gelir', 'musteri', 'gorev'].includes(metric)) throw new Error('Geçersiz hedef türü.');

  const target = parseFloat(String(formData.get('target') ?? ''));
  if (!Number.isFinite(target) || target <= 0) throw new Error('Hedef sıfırdan büyük olmalı.');

  await sql`
    INSERT INTO goals (period, metric, target)
    VALUES (${`${period}-01`}::date, ${metric}, ${target})
    ON CONFLICT (period, metric) DO UPDATE SET target = EXCLUDED.target
  `;

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'hedef',
    detail: `${period} ${metric} = ${target}`, isFinancial: true,
  });
  revalidatePath('/hedefler');
}

export async function deleteGoal(formData: FormData) {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz hedef.');

  await sql`DELETE FROM goals WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'hedef', entityId: id, isFinancial: true });
  revalidatePath('/hedefler');
}
