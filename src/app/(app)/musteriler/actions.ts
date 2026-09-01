'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertAdmin, logActivity } from '@/lib/auth';
import { PACKAGES } from '@/lib/format';

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

/** Müşteri ekleme/silme yalnızca yöneticide — aylık ücret finansal veridir. */
export async function createCustomer(formData: FormData) {
  const user = await assertAdmin();

  const name = str(formData, 'name');
  if (!name) throw new Error('Müşteri adı zorunludur.');

  const pkg = str(formData, 'package') ?? PACKAGES[0];
  const safePkg = PACKAGES.includes(pkg) ? pkg : PACKAGES[0];

  const fee = parseFloat(String(formData.get('monthly_fee') ?? '0'));
  const status = String(formData.get('status') ?? 'aktif');
  const safeStatus = ['aktif', 'duraklatildi', 'ayrildi'].includes(status) ? status : 'aktif';

  const assignedRaw = str(formData, 'assigned_to');
  const assignedTo = assignedRaw ? parseInt(assignedRaw, 10) : null;

  const rows = (await sql`
    INSERT INTO customers (name, company, phone, email, package, monthly_fee, status,
                           start_date, contract_start, contract_end, assigned_to, notes)
    VALUES (${name}, ${str(formData, 'company')}, ${str(formData, 'phone')},
            ${str(formData, 'email')}, ${safePkg},
            ${Number.isFinite(fee) && fee >= 0 ? fee : 0}, ${safeStatus},
            ${str(formData, 'start_date')}, ${str(formData, 'contract_start')},
            ${str(formData, 'contract_end')},
            ${Number.isInteger(assignedTo) ? assignedTo : null}, ${str(formData, 'notes')})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({ userId: user.id, action: 'ekle', entity: 'müşteri', entityId: rows[0]?.id, detail: name });
  revalidatePath('/musteriler');
  revalidatePath('/');
}

export async function deleteCustomer(formData: FormData) {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz müşteri.');

  await sql`DELETE FROM customers WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'müşteri', entityId: id });
  revalidatePath('/musteriler');
  revalidatePath('/');
}
