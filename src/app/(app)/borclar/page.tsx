import { requireAdmin } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { money, dateShort, num } from '@/lib/format';
import { createDebt, addPayment, deleteDebt } from './actions';

export const dynamic = 'force-dynamic';

type DebtRow = {
  id: number; direction: string; counterparty: string;
  amount: string; paid_amount: string; due_date: string | null;
  description: string | null; customer_name: string | null;
};

export default async function DebtsPage() {
  await requireAdmin();

  const rows = (await sql`
    SELECT d.id, d.direction, d.counterparty, d.amount, d.paid_amount,
           d.due_date, d.description, c.name AS customer_name
    FROM debts d
    LEFT JOIN customers c ON c.id = d.customer_id
    ORDER BY (d.paid_amount >= d.amount), d.due_date NULLS LAST, d.id DESC
  `) as DebtRow[];

  const customers = (await sql`SELECT id, name FROM customers ORDER BY name`) as Array<{
    id: number; name: string;
  }>;

  const bekleyenAlacak = rows
    .filter((r) => r.direction === 'alacak')
    .reduce((s, r) => s + (num(r.amount) - num(r.paid_amount)), 0);
  const bekleyenBorc = rows
    .filter((r) => r.direction === 'borc')
    .reduce((s, r) => s + (num(r.amount) - num(r.paid_amount)), 0);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title="Borç & Alacak" />
      <div className="content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon i-success"><Icon name="money" /></div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{money(bekleyenAlacak)}</div>
            <div className="stat-label">Bekleyen Alacak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-danger"><Icon name="card" /></div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{money(bekleyenBorc)}</div>
            <div className="stat-label">Bekleyen Borç</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-primary"><Icon name="chart" /></div>
            <div className="stat-value">{money(bekleyenAlacak - bekleyenBorc)}</div>
            <div className="stat-label">Net Pozisyon</div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h2>Kayıtlar</h2></div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Borç / Alacak Ekle
            </summary>
            <form action={createDebt} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="direction">Tür *</label>
                  <select id="direction" name="direction" className="form-control" defaultValue="alacak" required>
                    <option value="alacak">Alacak (bize borçlu)</option>
                    <option value="borc">Borç (biz borçluyuz)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="counterparty">Kişi / Firma *</label>
                  <input id="counterparty" name="counterparty" className="form-control" required maxLength={150} />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Tutar (₺) *</label>
                  <input id="amount" name="amount" type="number" step="0.01" min="0.01" className="form-control" required />
                </div>
                <div className="form-group">
                  <label htmlFor="due_date">Vade Tarihi</label>
                  <input id="due_date" name="due_date" type="date" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="customer_id">İlgili Müşteri</label>
                  <select id="customer_id" name="customer_id" className="form-control" defaultValue="">
                    <option value="">— Yok —</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
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

          {rows.length === 0 ? (
            <EmptyState icon="💳" title="Borç veya alacak kaydı yok"
                        text="Yukarıdan ilk kaydınızı ekleyin." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tür</th><th>Kişi / Firma</th><th>Vade</th>
                    <th className="num">Tutar</th><th className="num">Kalan</th>
                    <th style={{ width: 190 }}>Ödeme</th><th style={{ width: 1 }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const kalan = num(r.amount) - num(r.paid_amount);
                    const kapandi = kalan <= 0;
                    const gecikmis = !kapandi && r.due_date != null && r.due_date < today;
                    return (
                      <tr key={r.id}>
                        <td>
                          <span className={`badge ${r.direction === 'alacak' ? 'b-success' : 'b-danger'}`}>
                            {r.direction === 'alacak' ? 'Alacak' : 'Borç'}
                          </span>
                        </td>
                        <td>
                          <div className="cell-title">{r.counterparty}</div>
                          {r.customer_name && <div className="cell-sub">{r.customer_name}</div>}
                          {r.description && <div className="cell-sub">{r.description}</div>}
                        </td>
                        <td>
                          {dateShort(r.due_date)}
                          {gecikmis && <div><span className="badge b-danger">Gecikmiş</span></div>}
                        </td>
                        <td className="num">{money(r.amount)}</td>
                        <td className="num" style={{ fontWeight: 700 }}>
                          {kapandi
                            ? <span className="badge b-success">Kapandı</span>
                            : money(kalan)}
                        </td>
                        <td>
                          {!kapandi && (
                            <form action={addPayment} style={{ display: 'flex', gap: 6 }}>
                              <input type="hidden" name="id" value={r.id} />
                              <input name="payment" type="number" step="0.01" min="0.01" max={kalan}
                                     className="form-control" style={{ padding: '6px 9px' }}
                                     placeholder="Tutar" aria-label="Ödeme tutarı" required />
                              <button className="btn btn-sm btn-success" type="submit">Ekle</button>
                            </form>
                          )}
                        </td>
                        <td>
                          <form action={deleteDebt}>
                            <input type="hidden" name="id" value={r.id} />
                            <ConfirmButton soru={`${r.counterparty} kaydı silinsin mi? Bu işlem geri alınamaz.`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        </td>
                      </tr>
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
