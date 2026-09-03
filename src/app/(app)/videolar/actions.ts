'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, assertAdmin, logActivity } from '@/lib/auth';

function metin(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

/** Depoya yeni çekilmiş video ekler. Tek seferde birden fazla eklenebilir. */
export async function addVideos(formData: FormData) {
  const user = await assertUser();

  const customerId = parseInt(String(formData.get('customer_id') ?? ''), 10);
  if (!Number.isInteger(customerId)) throw new Error('Müşteri seçmelisiniz.');

  const title = metin(formData, 'title');
  if (!title) throw new Error('Video adı zorunludur.');

  const adet = parseInt(String(formData.get('adet') ?? '1'), 10);
  const safeAdet = Number.isInteger(adet) && adet >= 1 && adet <= 50 ? adet : 1;

  const recordedOn = metin(formData, 'recorded_on');
  const notes = metin(formData, 'notes');

  for (let i = 1; i <= safeAdet; i++) {
    const ad = safeAdet === 1 ? title : `${title} (${i})`;
    await sql`
      INSERT INTO videos (customer_id, title, status, recorded_on, notes, created_by)
      VALUES (${customerId}, ${ad}, 'depoda', ${recordedOn}, ${notes}, ${user.id})
    `;
  }

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'video',
    detail: `${title} × ${safeAdet}`,
  });
  revalidatePath('/videolar');
  revalidatePath('/');
}

/** Videoyu yayınlandı olarak işaretler — stoktan düşer. */
export async function publishVideo(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz video.');

  const rows = (await sql`
    UPDATE videos
    SET status = 'yayinlandi', published_on = CURRENT_DATE
    WHERE id = ${id} AND status = 'depoda'
    RETURNING title
  `) as Array<{ title: string }>;

  if (rows.length === 0) throw new Error('Video bulunamadı veya zaten yayınlanmış.');

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'video', entityId: id,
    detail: `${rows[0].title} yayınlandı`,
  });
  revalidatePath('/videolar');
  revalidatePath('/');
}

export async function deleteVideo(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz video.');

  await sql`DELETE FROM videos WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'video', entityId: id });
  revalidatePath('/videolar');
  revalidatePath('/');
}

/** Müşterinin haftada kaç video paylaştığı — uyarı eşiği buna göre hesaplanır. */
export async function setHaftalik(formData: FormData) {
  const user = await assertAdmin();
  const customerId = parseInt(String(formData.get('customer_id') ?? ''), 10);
  const adet = parseInt(String(formData.get('haftalik') ?? ''), 10);

  if (!Number.isInteger(customerId)) throw new Error('Geçersiz müşteri.');
  if (!Number.isInteger(adet) || adet < 0 || adet > 50) {
    throw new Error('Haftalık video sayısı 0 ile 50 arasında olmalı.');
  }

  await sql`UPDATE customers SET haftalik_video = ${adet} WHERE id = ${customerId}`;
  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'müşteri', entityId: customerId,
    detail: `haftalık video: ${adet}`,
  });
  revalidatePath('/videolar');
  revalidatePath('/');
}
