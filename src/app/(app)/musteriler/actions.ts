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
  const pkg = str(formData, 'package') ?? PACKAGES[0];
  const safePkg = PACKAGES.includes(pkg) ? pkg : PACKAGES[0];

  const fee = parseFloat(String(formData.get('monthly_fee') ?? '0'));
  const status = String(formData.get('status') ?? 'aktif');
  const safeStatus = ['aktif', 'duraklatildi', 'ayrildi'].includes(status) ? status : 'aktif';

  const assignedRaw = str(formData, 'assigned_to');
  const assignedTo = assignedRaw ? parseInt(assignedRaw, 10) : null;

  const email = str(formData, 'email');

  return {
    name,
    company: str(formData, 'company'),
    phone: str(formData, 'phone'),
    email,
    package: safePkg,
    monthlyFee: Number.isFinite(fee) && fee >= 0 ? fee : 0,
    status: safeStatus,
    startDate: str(formData, 'start_date'),
    nextPaymentDate: str(formData, 'next_payment_date'),
    assignedTo: Number.isInteger(assignedTo) ? assignedTo : null,
    notes: str(formData, 'notes'),
  };
}

/**
 * Bu iki action `useActionState` ile çağrılır: hata durumunda `throw` yerine
 * bir metin döner. Böylece kullanıcı bir şey yanlış girdiğinde çökme ekranı
 * yerine formun üstünde kırmızı bir uyarı görür — başarıda da yeşil bir
 * "kaydedildi" mesajı, aksi halde tıklamanın işe yarayıp yaramadığı belirsiz
 * kalıyordu.
 */
export async function createCustomer(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertAdmin();
  const a = alanlar(formData);
  if (!a.name) return 'Müşteri adı zorunludur.';
  if (a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) return 'E-posta adresi geçersiz görünüyor.';

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
  return 'ok';
}

export async function updateCustomer(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) return 'Geçersiz müşteri.';

  const a = alanlar(formData);
  if (!a.name) return 'Müşteri adı zorunludur.';
  if (a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) return 'E-posta adresi geçersiz görünüyor.';

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
  return 'ok';
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
