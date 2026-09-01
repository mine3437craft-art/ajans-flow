'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, logActivity } from '@/lib/auth';
import { PLATFORMS } from '@/lib/format';

export async function createPost(formData: FormData) {
  const user = await assertUser();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Başlık zorunludur.');

  const scheduledAt = String(formData.get('scheduled_at') ?? '').trim();
  if (!scheduledAt) throw new Error('Tarih ve saat zorunludur.');

  const platform = String(formData.get('platform') ?? '');
  const safePlatform = PLATFORMS.includes(platform) ? platform : PLATFORMS[0];

  const customerRaw = String(formData.get('customer_id') ?? '').trim();
  const customerId = customerRaw ? parseInt(customerRaw, 10) : null;

  // Personel paylaşımı yalnızca kendine atayabilir.
  const requested = String(formData.get('assigned_to') ?? '').trim();
  const assignedTo = user.role === 'admin' && requested ? parseInt(requested, 10) : user.id;

  const rows = (await sql`
    INSERT INTO content_posts (customer_id, title, platform, scheduled_at, assigned_to, notes)
    VALUES (${Number.isInteger(customerId) ? customerId : null}, ${title}, ${safePlatform},
            ${scheduledAt}, ${Number.isInteger(assignedTo) ? assignedTo : null},
            ${String(formData.get('notes') ?? '').trim() || null})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({ userId: user.id, action: 'ekle', entity: 'paylaşım', entityId: rows[0]?.id, detail: title });
  revalidatePath('/takvim');
  revalidatePath('/');
}

export async function setPostStatus(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  const status = String(formData.get('status') ?? '');

  if (!Number.isInteger(id)) throw new Error('Geçersiz paylaşım.');
  if (!['planlandi', 'hazir', 'yayinlandi', 'iptal'].includes(status)) throw new Error('Geçersiz durum.');

  const allowed = user.role === 'admin'
    ? ((await sql`SELECT 1 FROM content_posts WHERE id = ${id}`) as unknown[])
    : ((await sql`SELECT 1 FROM content_posts WHERE id = ${id} AND assigned_to = ${user.id}`) as unknown[]);
  if (allowed.length === 0) throw new Error('Bu paylaşımı değiştirme yetkiniz yok.');

  await sql`UPDATE content_posts SET status = ${status} WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'güncelle', entity: 'paylaşım', entityId: id, detail: status });
  revalidatePath('/takvim');
}
