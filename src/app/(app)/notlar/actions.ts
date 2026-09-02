'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, logActivity } from '@/lib/auth';

const VISIBILITIES = ['ekip', 'kisisel'] as const;

function text(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

/**
 * Not üzerinde yazma yetkisi:
 *  - kendi notu ise her zaman
 *  - yönetici, EKİP notlarını da düzenleyip silebilir
 *  - kişisel notlara sahibinden başkası dokunamaz (yönetici dahil)
 */
async function canWrite(noteId: number, user: { id: number; role: string }): Promise<boolean> {
  const rows = (await sql`
    SELECT author_id, visibility FROM notes WHERE id = ${noteId}
  `) as Array<{ author_id: number | null; visibility: string }>;

  const note = rows[0];
  if (!note) return false;
  if (note.author_id === user.id) return true;
  return user.role === 'admin' && note.visibility === 'ekip';
}

export async function createNote(formData: FormData) {
  const user = await assertUser();

  const title = text(formData, 'title');
  if (!title) throw new Error('Not başlığı zorunludur.');

  const visibility = text(formData, 'visibility');
  const safeVisibility = (VISIBILITIES as readonly string[]).includes(visibility) ? visibility : 'ekip';

  const rows = (await sql`
    INSERT INTO notes (title, body, visibility, author_id)
    VALUES (${title}, ${text(formData, 'body')}, ${safeVisibility}, ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({ userId: user.id, action: 'ekle', entity: 'not', entityId: rows[0]?.id, detail: title });
  revalidatePath('/notlar');
}

export async function updateNote(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(text(formData, 'id'), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz not.');
  if (!(await canWrite(id, user))) throw new Error('Bu notu düzenleme yetkiniz yok.');

  const title = text(formData, 'title');
  if (!title) throw new Error('Not başlığı zorunludur.');

  const visibility = text(formData, 'visibility');
  const safeVisibility = (VISIBILITIES as readonly string[]).includes(visibility) ? visibility : 'ekip';

  await sql`
    UPDATE notes
    SET title = ${title}, body = ${text(formData, 'body')},
        visibility = ${safeVisibility}, updated_at = NOW()
    WHERE id = ${id}
  `;

  await logActivity({ userId: user.id, action: 'güncelle', entity: 'not', entityId: id, detail: title });
  revalidatePath('/notlar');
}

export async function deleteNote(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(text(formData, 'id'), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz not.');
  if (!(await canWrite(id, user))) throw new Error('Bu notu silme yetkiniz yok.');

  await sql`DELETE FROM notes WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'not', entityId: id });
  revalidatePath('/notlar');
}

export async function togglePin(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(text(formData, 'id'), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz not.');
  if (!(await canWrite(id, user))) throw new Error('Bu notu sabitleme yetkiniz yok.');

  await sql`UPDATE notes SET is_pinned = NOT is_pinned WHERE id = ${id}`;
  revalidatePath('/notlar');
}
