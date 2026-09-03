'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, logActivity } from '@/lib/auth';

const PROGRAMLAR = ['Photoshop', 'Premiere Pro', 'Illustrator', 'After Effects', 'Diğer'];

function metin(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

/** "ctrl+e", " Ctrl + E " gibi girdileri "Ctrl+E" biçimine indirger. */
function tuslariDuzelt(ham: string): string {
  return ham
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const kucuk = p.toLocaleLowerCase('tr-TR');
      const OZEL: Record<string, string> = {
        ctrl: 'Ctrl', control: 'Ctrl', cmd: 'Cmd', command: 'Cmd', 'ö': 'Cmd',
        alt: 'Alt', option: 'Alt', opt: 'Alt', shift: 'Shift',
        enter: 'Enter', return: 'Enter', esc: 'Esc', escape: 'Esc',
        tab: 'Tab', space: 'Space', boşluk: 'Space', del: 'Delete', delete: 'Delete',
      };
      return OZEL[kucuk] ?? (p.length === 1 ? p.toLocaleUpperCase('tr-TR') : p);
    })
    .join('+');
}

export async function createShortcut(formData: FormData) {
  const user = await assertUser();

  const program = metin(formData, 'program');
  const safeProgram = program && PROGRAMLAR.includes(program) ? program : 'Diğer';

  const keysRaw = metin(formData, 'keys');
  if (!keysRaw) throw new Error('Tuş kombinasyonu zorunludur.');
  const keys = tuslariDuzelt(keysRaw);
  if (!keys) throw new Error('Geçerli bir tuş kombinasyonu girin.');

  const aciklama = metin(formData, 'aciklama');
  if (!aciklama) throw new Error('Ne işe yaradığını yazmalısınız.');

  const rows = (await sql`
    INSERT INTO shortcuts (program, keys, aciklama, author_id)
    VALUES (${safeProgram}, ${keys}, ${aciklama}, ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'kısayol',
    entityId: rows[0]?.id, detail: `${safeProgram}: ${keys}`,
  });
  revalidatePath('/notlar/kisayollar');
}

/** Yazan kişi ya da yönetici silebilir. */
export async function deleteShortcut(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz kısayol.');

  const yetkili = user.role === 'admin'
    ? ((await sql`SELECT 1 FROM shortcuts WHERE id = ${id}`) as unknown[])
    : ((await sql`SELECT 1 FROM shortcuts WHERE id = ${id} AND author_id = ${user.id}`) as unknown[]);
  if (yetkili.length === 0) throw new Error('Bu kısayolu silme yetkiniz yok.');

  await sql`DELETE FROM shortcuts WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'kısayol', entityId: id });
  revalidatePath('/notlar/kisayollar');
}
