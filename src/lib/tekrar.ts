import 'server-only';
import { sql } from './db';

export { GUNLER, gunAdlari } from './gunler';

/** Kaç gün ileriye kadar görev üretilsin. */
const UFUK_GUN = 13;

/**
 * Aktif şablonlardan bugünden itibaren iki haftalık görevleri üretir.
 *
 * Tek sorguda çalışır ve tekrar çalıştırmak güvenlidir: (template_id, due_date)
 * üzerindeki tekil indeks sayesinde aynı gün için ikinci görev oluşmaz.
 * Kullanıcı üretilen bir görevi silerse tekrar üretilmez — silme kasıtlıdır.
 */
export async function gorevleriUret(): Promise<number> {
  const rows = (await sql`
    INSERT INTO tasks (title, description, customer_id, assigned_to, created_by,
                       due_date, priority, status, template_id)
    SELECT t.title, t.description, t.customer_id, t.assigned_to, t.created_by,
           d::date, t.priority, 'bekliyor', t.id
    FROM task_templates t
    CROSS JOIN generate_series(
      CURRENT_DATE,
      CURRENT_DATE + (${UFUK_GUN} || ' days')::interval,
      INTERVAL '1 day'
    ) AS d
    WHERE t.is_active
      AND EXTRACT(ISODOW FROM d)::smallint = ANY(t.weekdays)
    ON CONFLICT (template_id, due_date) WHERE template_id IS NOT NULL DO NOTHING
    RETURNING id
  `) as Array<{ id: number }>;

  return rows.length;
}
