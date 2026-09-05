'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, logActivity } from '@/lib/auth';

function metin(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

/** Textarea'daki her satir bir madde; bos satirlar atilir. */
function satirlar(fd: FormData, key: string): string[] {
  return metin(fd, key)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
}

/**
 * Yazma yetkisi: kaydi ekleyen kisi ya da yonetici. Tohumlanan kayitlarda
 * author_id NULL oldugu icin onlara yalnizca yonetici dokunabilir.
 */
async function yazabilir(id: number, user: { id: number; role: string }): Promise<boolean> {
  const rows = (await sql`SELECT author_id FROM note_guides WHERE id = ${id}`) as
    Array<{ author_id: number | null }>;
  if (rows.length === 0) return false;
  return user.role === 'admin' || rows[0].author_id === user.id;
}

/** Baslik + zaman damgasindan cakismayan bir slug uretir. */
function slugUret(baslik: string): string {
  const govde = baslik
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (c) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'kayit';
  return `${govde}-${Date.now().toString(36)}`;
}

export async function createGuide(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const user = await assertUser();

  const title = metin(formData, 'title');
  if (!title) return 'Başlık zorunludur.';

  const rows = (await sql`
    INSERT INTO note_guides
      (slug, category, icon, title, summary, body, steps, tips, visual, sort_order, author_id)
    VALUES (${slugUret(title)},
            ${metin(formData, 'category') || 'Photoshop'},
            ${metin(formData, 'icon') || '📘'},
            ${title},
            ${metin(formData, 'summary')},
            ${metin(formData, 'body')},
            ${satirlar(formData, 'steps')}::text[],
            ${satirlar(formData, 'tips')}::text[],
            ${metin(formData, 'visual') || null},
            ${900},
            ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'rehber',
    entityId: rows[0]?.id, detail: title,
  });
  revalidatePath('/notlar/rehber');
  return `ok|${rows[0]?.id ?? 0}|`;
}

export async function updateGuide(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const user = await assertUser();
  const id = parseInt(metin(formData, 'id'), 10);
  if (!Number.isInteger(id)) return 'Geçersiz kayıt.';
  if (!(await yazabilir(id, user))) return 'Bu kaydı düzenleme yetkiniz yok.';

  const title = metin(formData, 'title');
  if (!title) return 'Başlık zorunludur.';

  await sql`
    UPDATE note_guides
    SET category = ${metin(formData, 'category') || 'Photoshop'},
        icon     = ${metin(formData, 'icon') || '📘'},
        title    = ${title},
        summary  = ${metin(formData, 'summary')},
        body     = ${metin(formData, 'body')},
        steps    = ${satirlar(formData, 'steps')}::text[],
        tips     = ${satirlar(formData, 'tips')}::text[],
        visual   = ${metin(formData, 'visual') || null},
        updated_at = NOW()
    WHERE id = ${id}
  `;

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'rehber', entityId: id, detail: title,
  });
  revalidatePath('/notlar/rehber');
  return `ok|${id}|${Date.now()}`;
}

export async function deleteGuide(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(metin(formData, 'id'), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz kayıt.');
  if (!(await yazabilir(id, user))) throw new Error('Bu kaydı silme yetkiniz yok.');

  await sql`DELETE FROM note_guides WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'rehber', entityId: id });
  revalidatePath('/notlar/rehber');
}
