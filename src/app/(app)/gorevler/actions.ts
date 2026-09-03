'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, logActivity } from '@/lib/auth';

const STATUSES = ['bekliyor', 'devam', 'tamamlandi', 'iptal'] as const;
const PRIORITIES = ['dusuk', 'normal', 'yuksek'] as const;

function str(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? '').trim();
  return v === '' ? null : v;
}
function int(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  const n = v === null ? NaN : parseInt(v, 10);
  return Number.isInteger(n) ? n : null;
}

/**
 * Personel yalnızca kendisiyle ilgili göreve dokunabilir (birincil atanan,
 * oluşturan ya da ek atananlardan biri); yönetici hepsine.
 * Kayıt yoksa da false döner, böylece "var mı yok mu" bilgisi sızmaz.
 */
async function canEditTask(taskId: number, user: { id: number; role: string }): Promise<boolean> {
  if (user.role === 'admin') return true;
  const rows = (await sql`
    SELECT 1 FROM tasks t
    WHERE t.id = ${taskId}
      AND (t.assigned_to = ${user.id} OR t.created_by = ${user.id}
           OR EXISTS (SELECT 1 FROM task_assignees ta WHERE ta.task_id = t.id AND ta.user_id = ${user.id}))
  `) as unknown[];
  return rows.length > 0;
}

/** Formdan seçilen kişileri toplar; ilk eleman "birincil" (tasks.assigned_to) olur. */
function secilenKisiler(formData: FormData, user: { id: number; role: string }): number[] {
  if (user.role !== 'admin') return [user.id];
  const secim = formData.getAll('assigned_to')
    .map((v) => parseInt(String(v), 10))
    .filter((n) => Number.isInteger(n));
  return secim.length > 0 ? secim : [];
}

export async function createTask(formData: FormData) {
  const user = await assertUser();

  const title = str(formData, 'title');
  if (!title) throw new Error('Görev başlığı zorunludur.');

  const priority = String(formData.get('priority') ?? 'normal');
  const safePriority = (PRIORITIES as readonly string[]).includes(priority) ? priority : 'normal';

  // Personel görevi yalnızca kendine atayabilir; yönetici birden fazla kişi seçebilir.
  const kisiler = secilenKisiler(formData, user);
  const [birincil, ...digerleri] = kisiler;

  const rows = (await sql`
    INSERT INTO tasks (title, description, customer_id, assigned_to, created_by,
                       due_date, due_time, priority, status)
    VALUES (${title}, ${str(formData, 'description')}, ${int(formData, 'customer_id')},
            ${birincil ?? null}, ${user.id}, ${str(formData, 'due_date')},
            ${str(formData, 'due_time')}, ${safePriority}, 'bekliyor')
    RETURNING id
  `) as Array<{ id: number }>;

  const taskId = rows[0]?.id;
  for (const uid of digerleri) {
    await sql`
      INSERT INTO task_assignees (task_id, user_id) VALUES (${taskId}, ${uid})
      ON CONFLICT DO NOTHING
    `;
  }

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'görev',
    entityId: taskId, detail: title,
  });
  revalidatePath('/gorevler');
  revalidatePath('/');
}

export async function setTaskStatus(formData: FormData) {
  const user = await assertUser();
  const id = int(formData, 'id');
  const status = String(formData.get('status') ?? '');

  if (id === null) throw new Error('Geçersiz görev.');
  if (!(STATUSES as readonly string[]).includes(status)) throw new Error('Geçersiz durum.');
  if (!(await canEditTask(id, user))) throw new Error('Bu görevi değiştirme yetkiniz yok.');

  await sql`
    UPDATE tasks
    SET status = ${status},
        completed_at = ${status === 'tamamlandi' ? new Date().toISOString() : null}
    WHERE id = ${id}
  `;

  await logActivity({ userId: user.id, action: 'güncelle', entity: 'görev', entityId: id, detail: status });
  revalidatePath('/gorevler');
  revalidatePath('/');
}

export async function deleteTask(formData: FormData) {
  const user = await assertUser();
  const id = int(formData, 'id');
  if (id === null) throw new Error('Geçersiz görev.');
  if (!(await canEditTask(id, user))) throw new Error('Bu görevi silme yetkiniz yok.');

  // task_assignees kayıtları ON DELETE CASCADE ile birlikte silinir.
  await sql`DELETE FROM tasks WHERE id = ${id}`;
  await logActivity({ userId: user.id, action: 'sil', entity: 'görev', entityId: id });
  revalidatePath('/gorevler');
  revalidatePath('/');
}
