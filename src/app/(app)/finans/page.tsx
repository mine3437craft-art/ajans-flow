import { requirePageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { money, dateShort, num, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/format';
import { createTransaction, deleteTransaction } from './actions';

export const dynamic = 'force-dynamic';

type TxRow = {
  id: number; type: string; amount: string; category: string;
  description: string | null; occurred_on: string; customer_name: string | null;
};

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string; ay?: string }>;
}) {
  await requirePageAccess('finans');
  const { tur, ay } = await searchParams;

  // Varsayılan: içinde bulunulan ay (YYYY-AA)
  const now = new Date();
  const period = /^\d{4}-\d{2}$/.test(ay ?? '') ? ay! : now.toISOString().slice(0, 7);
  const periodStart = `${period}-01`;

  const rows = (await sql`
    SELECT t.id, t.type, t.amount, t.category, t.description, t.occurred_on,
           c.name AS customer_name
    FROM transactions t
    LEFT JOIN customers c ON c.id = t.customer_id
    WHERE t.occurred_on >= ${periodStart}::date
      AND t.occurred_on <  (${periodStart}::date + INTERVAL '1 month')
      AND (${tur ?? null}::text IS NULL OR t.type = ${tur ?? null})
    ORDER BY t.occurred_on DESC, t.id DESC
  `) as TxRow[];

  const totals = (await sql`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'gelir'), 0)  AS gelir,
      COALESCE(SUM(amount) FILTER (WHERE type = 'gider'), 0)  AS gider
    FROM transactions
    WHERE occurred_on >= ${periodStart}::date
      AND occurred_on <  (${periodStart}::date + INTERVAL '1 month')
  `) as Array<{ gelir: string; gider: string }>;

  const gelir = num(totals[0]?.gelir);
  const gider = num(totals[0]?.gider);
  const net = gelir - gider;

  const customers = (await sql`
    SELECT id, name FROM customers ORDER BY name
  `) as Array<{ id: number; name: string }>;

  return (
    <>
      <PageHeader title="Gelir / Gider" />
      <div className="content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon i-success"><Icon name="money" /></div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{money(gelir)}</div>
            <div className="stat-label">Toplam Gelir</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-danger"><Icon name="card" /></div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{money(gider)}</div>
            <div className="stat-label">Toplam Gider</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-primary"><Icon name="chart" /></div>
            <div className="stat-value" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {money(net)}
            </div>
            <div className="stat-label">Net Durum</div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>İşlem Geçmişi</h2>
          </div>

          <form className="filter-bar" method="get">
            <input type="month" name="ay" className="form-control" defaultValue={period} aria-label="Ay" />
            <select name="tur" className="form-control" defaultValue={tur ?? ''} aria-label="Tür">
              <option value="">Tümü</option>
              <option value="gelir">Sadece Gelir</option>
              <option value="gider">Sadece Gider</option>
            </select>
            <button className="btn btn-secondary btn-sm" type="submit">Filtrele</button>
          </form>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni İşlem Ekle
            </summary>
            <form action={createTransaction} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">Tür *</label>
                  <select id="type" name="type" className="form-control" defaultValue="gelir" required>
                    <option value="gelir">Gelir</option>
                    <option value="gider">Gider</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Tutar (₺) *</label>
                  <input id="amount" name="amount" type="number" step="0.01" min="0.01"
                         className="form-control" required />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Kategori</label>
                  <select id="category" name="category" className="form-control">
                    <optgroup label="Gelir">
                      {INCOME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                    <optgroup label="Gider">
                      {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="occurred_on">Tarih *</label>
                  <input id="occurred_on" name="occurred_on" type="date" className="form-control"
                         defaultValue={now.toISOString().slice(0, 10)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="customer_id">Müşteri</label>
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
            <EmptyState icon="💰" title="Bu ay işlem kaydı yok"
                        text="Yukarıdan gelir veya gider ekleyerek başlayın." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tarih</th><th>Tür</th><th>Kategori</th><th>Açıklama</th>
                    <th>Müşteri</th><th className="num">Tutar</th><th style={{ width: 1 }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{dateShort(r.occurred_on)}</td>
                      <td>
                        <span className={`badge ${r.type === 'gelir' ? 'b-success' : 'b-danger'}`}>
                          {r.type === 'gelir' ? 'Gelir' : 'Gider'}
                        </span>
                      </td>
                      <td>{r.category}</td>
                      <td>{r.description ?? '—'}</td>
                      <td>{r.customer_name ?? '—'}</td>
                      <td className="num" style={{
                        fontWeight: 700,
                        color: r.type === 'gelir' ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {r.type === 'gelir' ? '+' : '−'}{money(r.amount)}
                      </td>
                      <td>
                        <form action={deleteTransaction}>
                          <input type="hidden" name="id" value={r.id} />
                          <ConfirmButton soru={`${r.category} — ${r.amount}₺ kaydı silinsin mi? Bu işlem geri alınamaz.`} title="Sil">
                            <Icon name="trash" />
                          </ConfirmButton>
                        </form>
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
