import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { dateShort, TASK_STATUS_LABEL, PRIORITY_LABEL } from '@/lib/format';
import { gorevleriUret } from '@/lib/tekrar';
import { createTask, setTaskStatus, deleteTask } from './actions';

export const dynamic = 'force-dynamic';

type TaskRow = {
  id: number; title: string; description: string | null;
  due_date: string | null; due_time: string | null;
  priority: string; status: string; template_id: number | null;
  customer_name: string | null; assignee_name: string | null;
};

/** Filtre bağlantısı kurar; seçili diğer filtreleri korur. */
function baglanti(p: { durum?: string; kisi?: string; gun?: string }): string {
  const q = new URLSearchParams();
  if (p.durum) q.set('durum', p.durum);
  if (p.kisi) q.set('kisi', p.kisi);
  if (p.gun && p.gun !== 'bugun') q.set('gun', p.gun);
  const s = q.toString();
  return s ? `/gorevler?${s}` : '/gorevler';
}

const STATUS_BADGE: Record<string, string> = {
  bekliyor: 'b-muted', devam: 'b-info', tamamlandi: 'b-success', iptal: 'b-danger',
};
const PRIORITY_BADGE: Record<string, string> = {
  dusuk: 'b-muted', normal: 'b-info', yuksek: 'b-danger',
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; kisi?: string; gun?: string }>;
}) {
  const user = await requireUser();
  const { durum, kisi, gun: gunParam } = await searchParams;
  // Varsayılan görünüm: bugüne kadar olan (geciken dahil) + tarihsiz görevler.
  // 'tumu' seçilirse gelecekteki tekrarlayan görevler de dahil tüm liste görünür.
  const gun = gunParam === 'tumu' ? 'tumu' : 'bugun';
  const isAdmin = user.role === 'admin';

  // Tekrarlayan görev şablonlarından eksik günleri tamamla (tekrar çalıştırmak güvenli).
  await gorevleriUret();

  // Personel yalnızca kendine atanmış ya da kendi oluşturduğu görevleri görür.
  // kisi='ben' → yalnızca bana atananlar; sayı → o kullanıcı (yalnızca yönetici)
  const kisiId = kisi === 'ben' ? user.id
    : (isAdmin && kisi && /^\d+$/.test(kisi)) ? parseInt(kisi, 10)
    : null;

  const tasks = (await sql`
    SELECT t.id, t.title, t.description, t.due_date, t.due_time, t.priority, t.status,
           t.template_id, c.name AS customer_name, u.display_name AS assignee_name
    FROM tasks t
    LEFT JOIN customers c ON c.id = t.customer_id
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE (${isAdmin}::boolean OR t.assigned_to = ${user.id} OR t.created_by = ${user.id})
      AND (${durum ?? null}::text IS NULL OR t.status = ${durum ?? null})
      AND (${kisiId}::int IS NULL OR t.assigned_to = ${kisiId})
      -- İleri tarihli tekrarlayan görevler henüz gelmediyse "Bugün" görünümünde gizlenir.
      AND (${gun}::text = 'tumu' OR t.due_date IS NULL OR t.due_date <= CURRENT_DATE)
      -- "Bugün" görünümünde, kullanıcı ayrıca bir durum seçmediyse tamamlanan/iptal
      -- görevler listeden düşer — tamamlanınca "azalması" istenen davranış budur.
      AND (${gun}::text = 'tumu' OR ${durum ?? null}::text IS NOT NULL
           OR t.status IN ('bekliyor', 'devam'))
    ORDER BY
      CASE t.status WHEN 'devam' THEN 0 WHEN 'bekliyor' THEN 1 ELSE 2 END,
      t.due_date NULLS LAST,
      CASE t.priority WHEN 'yuksek' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END
  `) as TaskRow[];

  const customers = (await sql`
    SELECT id, name FROM customers
    WHERE status = 'aktif' AND (${isAdmin}::boolean OR assigned_to = ${user.id})
    ORDER BY name
  `) as Array<{ id: number; name: string }>;

  const staff = isAdmin
    ? ((await sql`SELECT id, display_name FROM users WHERE is_active ORDER BY display_name`) as Array<{
        id: number; display_name: string;
      }>)
    : [];

  const counts = {
    hepsi: tasks.length,
    bekliyor: tasks.filter((t) => t.status === 'bekliyor').length,
    devam: tasks.filter((t) => t.status === 'devam').length,
  };

  return (
    <>
      <PageHeader title="Görevler" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>
              Görev Listesi{' '}
              <span className="badge b-muted">{counts.hepsi}</span>
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { k: '', l: 'Tümü' },
                { k: 'bekliyor', l: `Bekleyen (${counts.bekliyor})` },
                { k: 'devam', l: `Devam (${counts.devam})` },
                { k: 'tamamlandi', l: 'Tamamlanan' },
              ].map((f) => (
                <a
                  key={f.k}
                  href={baglanti({ durum: f.k || undefined, kisi, gun })}
                  className={`btn btn-sm ${(durum ?? '') === f.k ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {f.l}
                </a>
              ))}
              <a href="/gorevler/tekrar" className="btn btn-sm btn-secondary">🔁 Tekrarlayanlar</a>
            </div>
          </div>

          <div className="filter-bar" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px',
                           textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Görünüm
            </span>
            <a href={baglanti({ durum, kisi, gun: 'bugun' })}
               className={`btn btn-sm ${gun === 'bugun' ? 'btn-primary' : 'btn-secondary'}`}>
              Bugünün İşleri
            </a>
            <a href={baglanti({ durum, kisi, gun: 'tumu' })}
               className={`btn btn-sm ${gun === 'tumu' ? 'btn-primary' : 'btn-secondary'}`}>
              Tüm Takvim
            </a>
            {gun === 'bugun' && (
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)', marginLeft: 4 }}>
                İleri tarihli tekrarlayan görevler kendi gününde burada belirir —
                bugün tamamlarsan yarınki otomatik olarak yerini alır.
              </span>
            )}
          </div>

          <div className="filter-bar" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px',
                           textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Kime ait
            </span>
            <a href={baglanti({ durum, kisi: undefined, gun })}
               className={`btn btn-sm ${!kisi ? 'btn-primary' : 'btn-secondary'}`}>Herkes</a>
            <a href={baglanti({ durum, kisi: 'ben', gun })}
               className={`btn btn-sm ${kisi === 'ben' ? 'btn-primary' : 'btn-secondary'}`}>Bana ait</a>
            {isAdmin && staff.map((s2) => (
              <a key={s2.id} href={baglanti({ durum, kisi: String(s2.id), gun })}
                 className={`btn btn-sm ${kisi === String(s2.id) ? 'btn-primary' : 'btn-secondary'}`}>
                {s2.display_name}
              </a>
            ))}
          </div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Görev Ekle
            </summary>
            <form action={createTask} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="title">Görev Başlığı *</label>
                  <input id="title" name="title" className="form-control" required maxLength={200} />
                </div>
                <div className="form-group full">
                  <label htmlFor="description">Açıklama</label>
                  <textarea id="description" name="description" className="form-control" rows={2} />
                </div>
                <div className="form-group">
                  <label htmlFor="due_date">Bitiş Tarihi</label>
                  <input id="due_date" name="due_date" type="date" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="due_time">Saat</label>
                  <input id="due_time" name="due_time" type="time" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Öncelik</label>
                  <select id="priority" name="priority" className="form-control" defaultValue="normal">
                    <option value="dusuk">Düşük</option>
                    <option value="normal">Normal</option>
                    <option value="yuksek">Yüksek</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customer_id">Müşteri</label>
                  <select id="customer_id" name="customer_id" className="form-control" defaultValue="">
                    <option value="">— Yok —</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {isAdmin && (
                  <div className="form-group">
                    <label htmlFor="assigned_to">Atanan Kişi</label>
                    <select id="assigned_to" name="assigned_to" className="form-control" defaultValue={user.id}>
                      <option value="">— Atanmadı —</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>{s.display_name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Icon name="plus" style={{ width: 15, height: 15 }} /> Görevi Kaydet
                </button>
              </div>
            </form>
          </details>

          {tasks.length === 0 ? (
            <EmptyState
              icon="✅"
              title={gun === 'bugun' && !durum ? 'Bugün için görev yok' : 'Görev bulunamadı'}
              text={
                durum ? 'Bu filtreye uyan görev yok.'
                : gun === 'bugun' ? 'Yukarıdan "Tüm Takvim" ile ileri tarihli görevleri görebilirsiniz.'
                : 'Yukarıdan ilk görevinizi ekleyin.'
              }
            />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Görev</th>
                    <th>Müşteri</th>
                    {isAdmin && <th>Atanan</th>}
                    <th>Bitiş</th>
                    <th>Öncelik</th>
                    <th>Durum</th>
                    <th style={{ width: 1 }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="cell-title">
                          {t.template_id && (
                            <span title="Tekrarlayan görev" style={{ marginRight: 5 }}>🔁</span>
                          )}
                          {t.title}
                        </div>
                        {t.description && <div className="cell-sub">{t.description}</div>}
                      </td>
                      <td>{t.customer_name ?? '—'}</td>
                      {isAdmin && <td>{t.assignee_name ?? '—'}</td>}
                      <td>
                        {dateShort(t.due_date)}
                        {t.due_time && <span className="cell-sub"> {t.due_time.slice(0, 5)}</span>}
                      </td>
                      <td>
                        <span className={`badge ${PRIORITY_BADGE[t.priority]}`}>
                          {PRIORITY_LABEL[t.priority]}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[t.status]}`}>
                          {TASK_STATUS_LABEL[t.status]}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {t.status !== 'tamamlandi' && (
                            <form action={setTaskStatus}>
                              <input type="hidden" name="id" value={t.id} />
                              <input type="hidden" name="status" value={t.status === 'bekliyor' ? 'devam' : 'tamamlandi'} />
                              <button className="btn btn-sm btn-secondary" type="submit">
                                {t.status === 'bekliyor' ? 'Başlat' : 'Bitir'}
                              </button>
                            </form>
                          )}
                          <form action={deleteTask}>
                            <input type="hidden" name="id" value={t.id} />
                            <ConfirmButton soru={`"${t.title}" görevi silinsin mi? Bu işlem geri alınamaz.`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
