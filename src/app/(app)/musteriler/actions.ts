'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertAdmin, logActivity } from '@/lib/auth';
import { PACKAGES } from '@/lib/format';

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

function alanlar(formData: FormData) {
  const name = str(formData, 'name');
  if (!name) throw new Error('Müşteri adı zorunludur.');

  const pkg = str(formData, 'package') ?? PACKAGES[0];
  const safePkg = PACKAGES.includes(pkg) ? pkg : PACKAGES[0];

  const fee = parseFloat(String(formData.get('monthly_fee') ?? '0'));
  const status = String(formData.get('status') ?? 'aktif');
  const safeStatus = ['aktif', 'duraklatildi', 'ayrildi'].includes(status) ? status : 'aktif';

  const assignedRaw = str(formData, 'assigned_to');
  const assignedTo = assignedRaw ? parseInt(assignedRaw, 10) : null;

  return {
    name,
    company: str(formData, 'company'),
    phone: str(formData, 'phone'),
    email: str(formData, 'email'),
    package: safePkg,
    monthlyFee: Number.isFinite(fee) && fee >= 0 ? fee : 0,
    status: safeStatus,
    startDate: str(formData, 'start_date'),
    nextPaymentDate: str(formData, 'next_payment_date'),
    assignedTo: Number.isInteger(assignedTo) ? assignedTo : null,
    notes: str(formData, 'notes'),
  };
}

/** Müşteri ekleme/düzenleme/silme yalnızca yöneticide — aylık ücret finansal veridir. */
export async function createCustomer(formData: FormData) {
  const user = await assertAdmin();
  const a = alanlar(formData);

  const rows = (await sql`
    INSERT INTO customers (name, company, phone, email, package, monthly_fee, status,
                           start_date, next_payment_date, assigned_to, notes)
    VALUES (${a.name}, ${a.company}, ${a.phone}, ${a.email}, ${a.package},
            ${a.monthlyFee}, ${a.status}, ${a.startDate}, ${a.nextPaymentDate},
            ${a.assignedTo}, ${a.notes})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({ userId: user.id, action: 'ekle', entity: 'müşteri', entityId: rows[0]?.id, detail: a.name });
  revalidatePath('/musteriler');
  revalidatePath('/');
}

export async function updateCustomer(formData: FormData) {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz müşteri.');
  const a = alanlar(formData);

  await sql`
    UPDATE customers
    SET name = ${a.name}, company = ${a.company}, phone = ${a.phone}, email = ${a.email},
        package = ${a.package}, monthly_fee = ${a.monthlyFee}, status = ${a.status},
        start_date = ${a.startDate}, next_payment_date = ${a.nextPaymentDate},
        assigned_to = ${a.assignedTo}, notes = ${a.notes}
    WHERE id = ${id}
  `;

  await logActivity({ userId: user.id, action: 'güncelle', entity: 'müşteri', entityId: id, detail: a.name });
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
