'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, logActivity } from '@/lib/auth';

const PROGRAMLAR = ['Photoshop', 'Premiere Pro', 'Illustrator', 'After Effects', 'Diğer'];

function metin(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

/**
 * "ctrl+e", " Ctrl + E " gibi girdileri "Ctrl+E" biçimine indirger.
 * Form artık değiştirici tuşları hazır düğmelerden seçtirip burada
 * "Ctrl+Shift+E" gibi birleştirilmiş halde gönderiyor; bu fonksiyon yine de
 * bir güvence katmanı olarak kalıyor.
 */
function tuslariDuzelt(ham: string): string {
  return ham
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const kucuk = p.toLocaleLowerCase('tr-TR');
      const OZEL: Record<string, string> = {
        ctrl: 'Ctrl', control: 'Ctrl', cmd: 'Cmd', command: 'Cmd', win: 'Win', windows: 'Win',
        alt: 'Alt', option: 'Alt', opt: 'Alt', shift: 'Shift',
        enter: 'Enter', return: 'Enter', esc: 'Esc', escape: 'Esc',
        tab: 'Tab', space: 'Space', boşluk: 'Space', del: 'Delete', delete: 'Delete',
        backspace: 'Backspace', up: '↑', down: '↓', left: '←', right: '→',
      };
      return OZEL[kucuk] ?? (p.length === 1 ? p.toLocaleUpperCase('tr-TR') : p);
    })
    .join('+');
}

/**
 * `useActionState` ile çağrılır: hata durumunda `throw` yerine metin döner,
 * böylece kullanıcı çökme ekranı yerine formun üstünde uyarı görür.
 */
export async function createShortcut(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertUser();

  const program = metin(formData, 'program');
  const safeProgram = program && PROGRAMLAR.includes(program) ? program : 'Diğer';

  const keysRaw = metin(formData, 'keys');
  if (!keysRaw) return 'Bir ana tuş seçmeli ya da yazmalısınız.';
  const keys = tuslariDuzelt(keysRaw);
  if (!keys) return 'Geçerli bir tuş kombinasyonu girin.';

  const aciklama = metin(formData, 'aciklama');
  if (!aciklama) return 'Ne işe yaradığını yazmalısınız.';

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
  return 'ok';
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
