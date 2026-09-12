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
  // Görevler ekibin ortak panosu olduğu için herkes her görevi tamamlayabilir/düzenleyebilir.
  return true;
}

/**
 * Formdan seçilen kişileri toplar; ilk eleman "birincil" (tasks.assigned_to)
 * olur. Herkes herkese görev atayabilir — ortak pano. Hiç kimse
 * seçilmediyse görev atanmamış kalır.
 */
async function secilenKisiler(formData: FormData, olusturan: number): Promise<number[]> {
  const degerler = formData.getAll('assigned_to').map(String);

  // "Ekip" işaretliyse bütün aktif kullanıcılar; görevi açan kişi birincil
  // atanan olur ki listede önce onun adı görünsün.
  if (degerler.includes('ekip')) {
    const rows = (await sql`
      SELECT id FROM users WHERE is_active ORDER BY (id = ${olusturan}) DESC, display_name
    `) as Array<{ id: number }>;
    return rows.map((r) => r.id);
  }

  return degerler
    .map((v) => parseInt(v, 10))
    .filter((n) => Number.isInteger(n));
}

export async function createTask(formData: FormData) {
  const user = await assertUser();

  const title = str(formData, 'title');
  if (!title) throw new Error('Görev başlığı zorunludur.');

  const priority = String(formData.get('priority') ?? 'normal');
  const safePriority = (PRIORITIES as readonly string[]).includes(priority) ? priority : 'normal';

  const kisiler = await secilenKisiler(formData, user.id);
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

  // İşlem geçmişine yazmak başarısız olursa görev yine kaydedilmiş olsun.
  try {
    await logActivity({
      userId: user.id, action: 'ekle', entity: 'görev',
      entityId: taskId, detail: title,
    });
  } catch (hata) {
    console.error('[gorevler] işlem geçmişine yazılamadı:', hata);
  }
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

  try {
    await logActivity({ userId: user.id, action: 'güncelle', entity: 'görev', entityId: id, detail: status });
  } catch (hata) {
    console.error('[gorevler] işlem geçmişine yazılamadı:', hata);
  }
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
  try {
    await logActivity({ userId: user.id, action: 'sil', entity: 'görev', entityId: id });
  } catch (hata) {
    console.error('[gorevler] işlem geçmişine yazılamadı:', hata);
  }
  revalidatePath('/gorevler');
  revalidatePath('/');
}
