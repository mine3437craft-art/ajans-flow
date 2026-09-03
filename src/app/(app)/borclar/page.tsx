import { Fragment } from 'react';
import { requireAdmin } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { money, dateShort, num, isoDate } from '@/lib/format';
import { createDebt, addPayment, deleteDebt, updateDebt, undoPayment } from './actions';

export const dynamic = 'force-dynamic';

type DebtRow = {
  id: number; direction: string; counterparty: string;
  amount: string; paid_amount: string; due_date: string | null;
  description: string | null; customer_id: number | null; customer_name: string | null;
};

export default async function DebtsPage() {
  await requireAdmin();

  const rows = (await sql`
    SELECT d.id, d.direction, d.counterparty, d.amount, d.paid_amount,
           d.due_date, d.description, d.customer_id, c.name AS customer_name
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
                      <Fragment key={r.id}>
                      <tr>
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
                      <tr>
                        <td colSpan={7} style={{ padding: 0, borderBottom: '1px solid var(--border)' }}>
                          <details>
                            <summary style={{ padding: '8px 20px', cursor: 'pointer',
                                              fontSize: 12.5, fontWeight: 600, color: 'var(--primary)' }}>
                              Düzenle
                            </summary>
                            <form action={updateDebt} style={{ padding: '4px 20px 18px' }}>
                              <input type="hidden" name="id" value={r.id} />
                              <div className="form-grid">
                                <div className="form-group">
                                  <label htmlFor={`d-dir-${r.id}`}>Tür</label>
                                  <select id={`d-dir-${r.id}`} name="direction" className="form-control"
                                          defaultValue={r.direction}>
                                    <option value="alacak">Alacak (bize borçlu)</option>
                                    <option value="borc">Borç (biz borçluyuz)</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor={`d-kf-${r.id}`}>Kişi / Firma</label>
                                  <input id={`d-kf-${r.id}`} name="counterparty" className="form-control"
                                         defaultValue={r.counterparty} required maxLength={150} />
                                </div>
                                <div className="form-group">
                                  <label htmlFor={`d-tut-${r.id}`}>Tutar (₺)</label>
                                  <input id={`d-tut-${r.id}`} name="amount" type="number" step="0.01"
                                         min={num(r.paid_amount) || 0.01} className="form-control"
                                         defaultValue={num(r.amount)} required />
                                </div>
                                <div className="form-group">
                                  <label htmlFor={`d-vade-${r.id}`}>Vade</label>
                                  <input id={`d-vade-${r.id}`} name="due_date" type="date"
                                         className="form-control" defaultValue={isoDate(r.due_date)} />
                                </div>
                                <div className="form-group">
                                  <label htmlFor={`d-mus-${r.id}`}>İlgili Müşteri</label>
                                  <select id={`d-mus-${r.id}`} name="customer_id" className="form-control"
                                          defaultValue={r.customer_id ?? ''}>
                                    <option value="">— Yok —</option>
                                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                                </div>
                                <div className="form-group full">
                                  <label htmlFor={`d-ack-${r.id}`}>Açıklama</label>
                                  <input id={`d-ack-${r.id}`} name="description" className="form-control"
                                         defaultValue={r.description ?? ''} maxLength={300} />
                                </div>
                              </div>
                              <div className="form-actions">
                                {num(r.paid_amount) > 0 && (
                                  <span style={{ marginRight: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>
                                    Şimdiye kadar ödenen: {money(r.paid_amount)}
                                  </span>
                                )}
                                <button className="btn btn-sm btn-primary" type="submit">Güncelle</button>
                              </div>
                            </form>
                            {num(r.paid_amount) > 0 && (
                              <form action={undoPayment} style={{ padding: '0 20px 16px' }}>
                                <input type="hidden" name="id" value={r.id} />
                                <ConfirmButton
                                  soru={`${r.counterparty} kaydındaki ${money(r.paid_amount)} tutarındaki ödeme geçmişi sıfırlansın mı?`}
                                  className="btn btn-sm btn-secondary">
                                  Ödemeleri sıfırla
                                </ConfirmButton>
                              </form>
                            )}
                          </details>
                        </td>
                      </tr>
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
