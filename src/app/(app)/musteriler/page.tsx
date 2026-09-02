import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { money, dateShort, CUSTOMER_STATUS_LABEL, PACKAGES } from '@/lib/format';
import { createCustomer, deleteCustomer } from './actions';

export const dynamic = 'force-dynamic';

type CustomerRow = {
  id: number; name: string; company: string | null; phone: string | null;
  email: string | null; package: string; monthly_fee: string; status: string;
  contract_end: string | null; assignee_name: string | null;
};

const STATUS_BADGE: Record<string, string> = {
  aktif: 'b-success', duraklatildi: 'b-warning', ayrildi: 'b-muted',
};

export default async function CustomersPage() {
  const user = await requireUser();
  const isAdmin = user.role === 'admin';

  // Personel yalnızca kendisine atanmış müşterileri görür.
  const rows = (await sql`
    SELECT c.id, c.name, c.company, c.phone, c.email, c.package,
           c.monthly_fee, c.status, c.contract_end, u.display_name AS assignee_name
    FROM customers c
    LEFT JOIN users u ON u.id = c.assigned_to
    WHERE ${isAdmin}::boolean OR c.assigned_to = ${user.id}
    ORDER BY (c.status <> 'aktif'), c.name
  `) as CustomerRow[];

  const staff = isAdmin
    ? ((await sql`SELECT id, display_name FROM users WHERE is_active ORDER BY display_name`) as Array<{
        id: number; display_name: string;
      }>)
    : [];

  return (
    <>
      <PageHeader title="Müşteriler" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>Müşteri Listesi <span className="badge b-muted">{rows.length}</span></h2>
          </div>

          {isAdmin && (
            <details style={{ borderBottom: '1px solid var(--border)' }}>
              <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
                + Yeni Müşteri Ekle
              </summary>
              <form action={createCustomer} style={{ padding: '0 20px 20px' }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Ad Soyad *</label>
                    <input id="name" name="name" className="form-control" required maxLength={150} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Firma</label>
                    <input id="company" name="company" className="form-control" maxLength={150} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telefon</label>
                    <input id="phone" name="phone" className="form-control" maxLength={40} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-posta</label>
                    <input id="email" name="email" type="email" className="form-control" maxLength={150} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="package">Paket</label>
                    <select id="package" name="package" className="form-control">
                      {PACKAGES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="monthly_fee">Aylık Ücret (₺)</label>
                    <input id="monthly_fee" name="monthly_fee" type="number" step="0.01" min="0"
                           className="form-control" defaultValue="0" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Durum</label>
                    <select id="status" name="status" className="form-control" defaultValue="aktif">
                      <option value="aktif">Aktif</option>
                      <option value="duraklatildi">Duraklatıldı</option>
                      <option value="ayrildi">Ayrıldı</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="assigned_to">Sorumlu</label>
                    <select id="assigned_to" name="assigned_to" className="form-control" defaultValue="">
                      <option value="">— Atanmadı —</option>
                      {staff.map((s) => <option key={s.id} value={s.id}>{s.display_name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contract_start">Sözleşme Başlangıcı</label>
                    <input id="contract_start" name="contract_start" type="date" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contract_end">Sözleşme Bitişi</label>
                    <input id="contract_end" name="contract_end" type="date" className="form-control" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="notes">Notlar</label>
                    <textarea id="notes" name="notes" className="form-control" rows={2} />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit">Kaydet</button>
                </div>
              </form>
            </details>
          )}

          {rows.length === 0 ? (
            <EmptyState icon="👥" title="Müşteri bulunamadı"
                        text={isAdmin ? 'Yukarıdan ilk müşterinizi ekleyin.' : 'Size henüz müşteri atanmamış.'} />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Müşteri</th><th>Paket</th>
                    {isAdmin && <th className="num">Aylık Ücret</th>}
                    <th>İletişim</th>
                    {isAdmin && <th>Sorumlu</th>}
                    <th>Sözleşme Bitişi</th><th>Durum</th>
                    {isAdmin && <th style={{ width: 1 }} />}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="cell-title">{c.name}</div>
                        {c.company && <div className="cell-sub">{c.company}</div>}
                      </td>
                      <td><span className="badge b-primary">{c.package}</span></td>
                      {isAdmin && <td className="num" style={{ fontWeight: 600 }}>{money(c.monthly_fee)}</td>}
                      <td>
                        {c.phone ?? '—'}
                        {c.email && <div className="cell-sub">{c.email}</div>}
                      </td>
                      {isAdmin && <td>{c.assignee_name ?? '—'}</td>}
                      <td>{dateShort(c.contract_end)}</td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[c.status]}`}>
                          {CUSTOMER_STATUS_LABEL[c.status]}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <form action={deleteCustomer}>
                            <input type="hidden" name="id" value={c.id} />
                            <ConfirmButton soru={`"${c.name}" müşterisi silinsin mi? Bağlı görev ve kayıtlar da etkilenir. Bu işlem geri alınamaz.`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        </td>
                      )}
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
