'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, assertAdmin, logActivity } from '@/lib/auth';
import { gorevleriUret } from '@/lib/tekrar';

function metin(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}

/** Formdaki "gun" kutularından ISO gün numaralarını toplar. */
function gunler(fd: FormData): number[] {
  return fd.getAll('gun')
    .map((g) => parseInt(String(g), 10))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
}

/**
 * Ortak alan ayrıştırma. `useActionState` ile çağrılır: hata durumunda
 * `throw` yerine metin döner, kullanıcı çökme ekranı yerine formun
 * üstünde uyarı görür.
 */
async function alanlar(formData: FormData): Promise<
  | { hata: string }
  | {
      title: string; description: string | null; customerId: number | null;
      assignedTo: number | null; weekdays: number[]; priority: string;
    }
> {
  const user = await assertUser();

  const title = metin(formData, 'title');
  if (!title) return { hata: 'Görev başlığı zorunludur.' };

  const secilen = gunler(formData);
  if (secilen.length === 0) return { hata: 'En az bir gün seçmelisiniz.' };

  const priority = String(formData.get('priority') ?? 'normal');
  const safePriority = ['dusuk', 'normal', 'yuksek'].includes(priority) ? priority : 'normal';

  const musteriRaw = metin(formData, 'customer_id');
  const customerId = musteriRaw ? parseInt(musteriRaw, 10) : null;

  // Personel şablonu yalnızca kendine atayabilir — formda da bu alanı görmez.
  const istenen = metin(formData, 'assigned_to');
  const assignedTo = user.role === 'admin' && istenen ? parseInt(istenen, 10) : user.id;

  return {
    title,
    description: metin(formData, 'description'),
    customerId: Number.isInteger(customerId) ? customerId : null,
    assignedTo: Number.isInteger(assignedTo) ? assignedTo : null,
    weekdays: secilen,
    priority: safePriority,
  };
}

export async function createTemplate(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertUser();
  const a = await alanlar(formData);
  if ('hata' in a) return a.hata;

  const rows = (await sql`
    INSERT INTO task_templates (title, description, customer_id, assigned_to,
                                weekdays, priority, created_by)
    VALUES (${a.title}, ${a.description}, ${a.customerId}, ${a.assignedTo},
            ${a.weekdays}, ${a.priority}, ${user.id})
    RETURNING id
  `) as Array<{ id: number }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'tekrarlayan görev',
    entityId: rows[0]?.id, detail: a.title,
  });

  // Yeni şablonun görevleri hemen görünsün.
  await gorevleriUret();
  revalidatePath('/gorevler');
  revalidatePath('/gorevler/tekrar');
  return 'ok';
}

/**
 * Şablonu günceller — başlık, gün, öncelik, müşteri ve ATANAN KİŞİ dahil.
 * Bu şablondan üretilmiş ama henüz tamamlanmamış, bugün ve ileri tarihli
 * görevler de yeni bilgilerle senkronize edilir; aksi halde "atanan kişiyi
 * değiştirdim ama görev hâlâ eski kişide görünüyor" durumu oluşurdu. Geçmiş
 * (tamamlanmış ya da tarihi geçmiş) kayıtlara dokunulmaz.
 */
export async function updateTemplate(_prev: string | null, formData: FormData): Promise<string | null> {
  const user = await assertUser();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) return 'Geçersiz şablon.';

  const yetkili = user.role === 'admin'
    ? ((await sql`SELECT 1 FROM task_templates WHERE id = ${id}`) as unknown[])
    : ((await sql`SELECT 1 FROM task_templates WHERE id = ${id} AND (assigned_to = ${user.id} OR created_by = ${user.id})`) as unknown[]);
  if (yetkili.length === 0) return 'Bu şablonu düzenleme yetkiniz yok.';

  const a = await alanlar(formData);
  if ('hata' in a) return a.hata;

  await sql`
    UPDATE task_templates
    SET title = ${a.title}, description = ${a.description}, customer_id = ${a.customerId},
        assigned_to = ${a.assignedTo}, weekdays = ${a.weekdays}, priority = ${a.priority}
    WHERE id = ${id}
  `;

  await sql`
    UPDATE tasks
    SET title = ${a.title}, customer_id = ${a.customerId},
        assigned_to = ${a.assignedTo}, priority = ${a.priority}
    WHERE template_id = ${id} AND status IN ('bekliyor', 'devam') AND due_date >= CURRENT_DATE
  `;

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'tekrarlayan görev',
    entityId: id, detail: a.title,
  });

  // Gün seçimi değişmiş olabilir; eksik günleri tamamla.
  await gorevleriUret();
  revalidatePath('/gorevler');
  revalidatePath('/gorevler/tekrar');
  return 'ok';
}

/** Şablonu durdurur/başlatır. Durdurulan şablon yeni görev üretmez. */
export async function toggleTemplate(formData: FormData) {
  const user = await assertUser();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz şablon.');

  const yetkili = user.role === 'admin'
    ? ((await sql`SELECT 1 FROM task_templates WHERE id = ${id}`) as unknown[])
    : ((await sql`SELECT 1 FROM task_templates WHERE id = ${id} AND (assigned_to = ${user.id} OR created_by = ${user.id})`) as unknown[]);
  if (yetkili.length === 0) throw new Error('Bu şablonu değiştirme yetkiniz yok.');

  const rows = (await sql`
    UPDATE task_templates SET is_active = NOT is_active WHERE id = ${id}
    RETURNING title, is_active
  `) as Array<{ title: string; is_active: boolean }>;

  // Durdurulduysa henüz tamamlanmamış ileri tarihli görevleri temizle.
  if (rows[0] && !rows[0].is_active) {
    await sql`
      DELETE FROM tasks
      WHERE template_id = ${id} AND status = 'bekliyor' AND due_date > CURRENT_DATE
    `;
  } else {
    await gorevleriUret();
  }

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'tekrarlayan görev', entityId: id,
    detail: `${rows[0]?.title} ${rows[0]?.is_active ? 'başlatıldı' : 'durduruldu'}`,
  });
  revalidatePath('/gorevler');
  revalidatePath('/gorevler/tekrar');
}

export async function deleteTemplate(formData: FormData) {
  const user = await assertAdmin();
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!Number.isInteger(id)) throw new Error('Geçersiz şablon.');

  // Geçmiş kayıtlar kalsın; yalnızca ileri tarihli bekleyenler silinsin.
  await sql`
    DELETE FROM tasks
    WHERE template_id = ${id} AND status = 'bekliyor' AND due_date > CURRENT_DATE
  `;
  await sql`DELETE FROM task_templates WHERE id = ${id}`;

  await logActivity({ userId: user.id, action: 'sil', entity: 'tekrarlayan görev', entityId: id });
  revalidatePath('/gorevler');
  revalidatePath('/gorevler/tekrar');
}
