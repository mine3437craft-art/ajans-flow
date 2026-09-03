import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { GUNLER, gunAdlari } from '@/lib/tekrar';
import { PRIORITY_LABEL } from '@/lib/format';
import { createTemplate, toggleTemplate, deleteTemplate } from '../tekrar-actions';

export const dynamic = 'force-dynamic';

type Sablon = {
  id: number; title: string; description: string | null;
  weekdays: number[]; priority: string; is_active: boolean;
  customer_name: string | null; assignee_name: string | null;
};

export default async function TekrarPage() {
  const user = await requireUser();
  const isAdmin = user.role === 'admin';

  const sablonlar = (await sql`
    SELECT s.id, s.title, s.description, s.weekdays, s.priority, s.is_active,
           c.name AS customer_name, u.display_name AS assignee_name
    FROM task_templates s
    LEFT JOIN customers c ON c.id = s.customer_id
    LEFT JOIN users u ON u.id = s.assigned_to
    WHERE ${isAdmin}::boolean OR s.assigned_to = ${user.id} OR s.created_by = ${user.id}
    ORDER BY s.is_active DESC, c.name NULLS LAST, s.title
  `) as Sablon[];

  const customers = (await sql`
    SELECT id, name FROM customers
    WHERE status = 'aktif' AND (${isAdmin}::boolean OR assigned_to = ${user.id})
    ORDER BY name
  `) as Array<{ id: number; name: string }>;

  const staff = isAdmin
    ? ((await sql`SELECT id, display_name FROM users WHERE is_active ORDER BY display_name`) as Array<{
        id: number; display_name: string }>)
    : [];

  return (
    <>
      <PageHeader title="Tekrarlayan Görevler" />
      <div className="content">
        <div className="alert alert-info">
          <Icon name="clock" style={{ width: 17, height: 17, flexShrink: 0 }} />
          <span>
            Buraya eklediğiniz görevler seçtiğiniz günlerde kendiliğinden oluşur —
            iki hafta ileriye kadar önden hazırlanır. Örnek: <strong>Kök Cafe story</strong>,
            her Pazartesi ve Perşembe.
          </span>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Şablonlar <span className="badge b-muted">{sablonlar.length}</span></h2>
            <a href="/gorevler" className="btn btn-sm btn-secondary">← Görevlere dön</a>
          </div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Tekrarlayan Görev
            </summary>
            <form action={createTemplate} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="title">Görev Başlığı *</label>
                  <input id="title" name="title" className="form-control" required maxLength={200}
                         placeholder="örn. Kök Cafe story" />
                </div>

                <div className="form-group full">
                  <label>Hangi günler? *</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                    {GUNLER.map((g) => (
                      <label key={g.no} className="gun-secim">
                        <input type="checkbox" name="gun" value={g.no} />
                        <span>{g.kisa}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="customer_id">Müşteri</label>
                  <select id="customer_id" name="customer_id" className="form-control" defaultValue="">
                    <option value="">— Yok —</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Öncelik</label>
                  <select id="priority" name="priority" className="form-control" defaultValue="normal">
                    <option value="dusuk">Düşük</option>
                    <option value="normal">Normal</option>
                    <option value="yuksek">Yüksek</option>
                  </select>
                </div>

                {isAdmin && (
                  <div className="form-group">
                    <label htmlFor="assigned_to">Kim yapacak?</label>
                    <select id="assigned_to" name="assigned_to" className="form-control" defaultValue={user.id}>
                      <option value="">— Atanmadı —</option>
                      {staff.map((s) => <option key={s.id} value={s.id}>{s.display_name}</option>)}
                    </select>
                  </div>
                )}

                <div className="form-group full">
                  <label htmlFor="description">Açıklama</label>
                  <input id="description" name="description" className="form-control" maxLength={300} />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Kaydet</button>
              </div>
            </form>
          </details>

          {sablonlar.length === 0 ? (
            <EmptyState icon="🔁" title="Tekrarlayan görev yok"
                        text="Yukarıdan ilk şablonunuzu ekleyin." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Görev</th><th>Müşteri</th><th>Günler</th>
                    {isAdmin && <th>Kim</th>}
                    <th>Öncelik</th><th>Durum</th><th style={{ width: 1 }} />
                  </tr>
                </thead>
                <tbody>
                  {sablonlar.map((s) => (
                    <tr key={s.id} style={{ opacity: s.is_active ? 1 : 0.55 }}>
                      <td>
                        <div className="cell-title">{s.title}</div>
                        {s.description && <div className="cell-sub">{s.description}</div>}
                      </td>
                      <td>{s.customer_name ?? '—'}</td>
                      <td><span className="badge b-primary">{gunAdlari(s.weekdays)}</span></td>
                      {isAdmin && <td>{s.assignee_name ?? '—'}</td>}
                      <td>{PRIORITY_LABEL[s.priority]}</td>
                      <td>
                        <span className={`badge ${s.is_active ? 'b-success' : 'b-muted'}`}>
                          {s.is_active ? 'Aktif' : 'Durduruldu'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <form action={toggleTemplate}>
                            <input type="hidden" name="id" value={s.id} />
                            <button className="btn btn-sm btn-secondary" type="submit">
                              {s.is_active ? 'Durdur' : 'Başlat'}
                            </button>
                          </form>
                          {isAdmin && (
                            <form action={deleteTemplate}>
                              <input type="hidden" name="id" value={s.id} />
                              <ConfirmButton
                                soru={`"${s.title}" şablonu silinsin mi? İleri tarihli bekleyen görevleri de silinir.`}
                                title="Sil">
                                <Icon name="trash" />
                              </ConfirmButton>
                            </form>
                          )}
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
