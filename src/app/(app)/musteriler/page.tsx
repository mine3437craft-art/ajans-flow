import { Fragment } from 'react';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { money, dateShort, isoDate, CUSTOMER_STATUS_LABEL, PACKAGES } from '@/lib/format';
import CustomerForm from './CustomerForm';
import { createCustomer, updateCustomer, deleteCustomer } from './actions';

export const dynamic = 'force-dynamic';

type CustomerRow = {
  id: number; name: string; company: string | null; phone: string | null;
  email: string | null; package: string; monthly_fee: string; status: string;
  start_date: string | null; next_payment_date: string | null; notes: string | null;
  assigned_to: number | null; assignee_name: string | null;
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
           c.monthly_fee, c.status, c.start_date, c.next_payment_date, c.notes,
           c.assigned_to, u.display_name AS assignee_name
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

  const bugun = new Date().toISOString().slice(0, 10);
  const yakinda = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  // Aktif müşterilerin aylık ücretleri toplamı — potansiyel/sözleşmeli aylık gelir.
  // Gerçekleşen tahsilat değildir; Gelir/Gider'deki kayıtlı işlemlerden farklıdır.
  const aylikToplam = isAdmin
    ? rows.filter((c) => c.status === 'aktif').reduce((s, c) => s + Number(c.monthly_fee), 0)
    : null;

  return (
    <>
      <PageHeader title="Müşteriler" />
      <div className="content">
        {aylikToplam !== null && (
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon i-success"><Icon name="money" /></div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>{money(aylikToplam)}</div>
              <div className="stat-label">Aylık Toplam Gelir (aktif müşteriler)</div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-head">
            <h2>Müşteri Listesi <span className="badge b-muted">{rows.length}</span></h2>
          </div>

          {isAdmin && (
            <details style={{ borderBottom: '1px solid var(--border)' }}>
              <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
                + Yeni Müşteri Ekle
              </summary>
              <div style={{ padding: '0 20px 20px' }}>
                <CustomerForm action={createCustomer} gonderEtiketi="Kaydet" staff={staff} />
              </div>
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
                    <th>Sonraki Ödeme</th><th>Durum</th>
                    {isAdmin && <th style={{ width: 1 }} />}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => {
                    const odemeYakin = c.next_payment_date != null && c.next_payment_date <= yakinda;
                    const odemeGecmis = c.next_payment_date != null && c.next_payment_date < bugun;
                    return (
                    <Fragment key={c.id}>
                      <tr>
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
                        <td>
                          {c.next_payment_date ? (
                            <span className={odemeGecmis ? 'badge b-danger' : odemeYakin ? 'badge b-warning' : undefined}>
                              {dateShort(c.next_payment_date)}
                            </span>
                          ) : '—'}
                        </td>
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
                      {isAdmin && (
                        <tr>
                          <td colSpan={8} style={{ padding: 0, borderBottom: '1px solid var(--border)' }}>
                            <details>
                              <summary style={{ padding: '8px 20px', cursor: 'pointer',
                                                fontSize: 12.5, fontWeight: 600, color: 'var(--primary)' }}>
                                Düzenle
                              </summary>
                              <div style={{ padding: '4px 20px 18px' }}>
                                <CustomerForm action={updateCustomer} gonderEtiketi="Güncelle" musteri={c} staff={staff} />
                              </div>
                            </details>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
