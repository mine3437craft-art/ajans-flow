import { requirePageAccess, getPageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import IslemForm from '@/components/IslemForm';
import { money, dateShort, num, bugunTR } from '@/lib/format';
import { ayBasi, hesapSecenekleri } from '@/lib/kasa';
import KasayaBagla from '@/components/KasayaBagla';
import { createTransaction, deleteTransaction, kasayaBagla } from './actions';

export const dynamic = 'force-dynamic';

type TxRow = {
  id: number; type: string; amount: string; category: string;
  description: string | null; occurred_on: string;
  customer_name: string | null; hesap_adi: string | null;
};

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string; ay?: string; hesap?: string }>;
}) {
  const user = await requirePageAccess('finans');
  const { tur, ay, hesap } = await searchParams;
  const { period, periodStart } = ayBasi(ay);
  const hesapId = /^\d+$/.test(hesap ?? '') ? parseInt(hesap!, 10) : null;

  // Kasa bakiyeleri ayri bir yetki; yoksa hesap adlari secilebilir ama
  // paralar gorunmez.
  const kasaYetkisi =
    user.role === 'admin' || (await getPageAccess(user.id)).has('kasa');

  const rows = (await sql`
    SELECT t.id, t.type, t.amount, t.category, t.description, t.occurred_on,
           c.name AS customer_name, a.name AS hesap_adi
    FROM transactions t
    LEFT JOIN customers c     ON c.id = t.customer_id
    LEFT JOIN cash_accounts a ON a.id = t.account_id
    WHERE t.occurred_on >= ${periodStart}::date
      AND t.occurred_on <  (${periodStart}::date + INTERVAL '1 month')
      AND (${tur ?? null}::text IS NULL OR t.type = ${tur ?? null})
      AND (${hesapId}::int IS NULL OR t.account_id = ${hesapId}::int)
    ORDER BY t.occurred_on DESC, t.id DESC
  `) as TxRow[];

  const totals = (await sql`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'gelir'), 0)  AS gelir,
      COALESCE(SUM(amount) FILTER (WHERE type = 'gider'), 0)  AS gider,
      COUNT(*) FILTER (WHERE account_id IS NULL) AS kasasiz_adet
    FROM transactions
    WHERE occurred_on >= ${periodStart}::date
      AND occurred_on <  (${periodStart}::date + INTERVAL '1 month')
  `) as Array<{ gelir: string; gider: string; kasasiz_adet: string }>;

  const gelir = num(totals[0]?.gelir);
  const gider = num(totals[0]?.gider);
  const kasasizAdet = num(totals[0]?.kasasiz_adet);
  const net = gelir - gider;

  const kategoriler = (await sql`
    SELECT type, category, SUM(amount) AS toplam
    FROM transactions
    WHERE occurred_on >= ${periodStart}::date
      AND occurred_on <  (${periodStart}::date + INTERVAL '1 month')
    GROUP BY type, category
    ORDER BY SUM(amount) DESC
  `) as Array<{ type: string; category: string; toplam: string }>;

  const giderKategori = kategoriler.filter((k) => k.type === 'gider');
  const enBuyukGider = giderKategori.length > 0 ? num(giderKategori[0].toplam) : 0;

  const customers = (await sql`
    SELECT id, name FROM customers ORDER BY name
  `) as Array<{ id: number; name: string }>;

  const hesaplar = await hesapSecenekleri();

  return (
    <>
      <PageHeader title="Gelir / Gider" />
      <div className="content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon i-success"><Icon name="money" /></div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{money(gelir)}</div>
            <div className="stat-label">Bu Ay Gelir</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-danger"><Icon name="card" /></div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{money(gider)}</div>
            <div className="stat-label">Bu Ay Gider</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-primary"><Icon name="chart" /></div>
            <div className="stat-value" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {money(net)}
            </div>
            <div className="stat-label">Net Durum</div>
          </div>
        </div>

        {kasaYetkisi && hesaplar.length > 0 && (
          <div className="kasa-serit">
            <span className="kasa-serit-baslik">
              <Icon name="wallet" style={{ width: 15, height: 15 }} /> Kasa
            </span>
            {hesaplar.map((h) => (
              <span className="kasa-serit-oge" key={h.id}>
                <span className="kasa-serit-ad">
                  {h.account_type === 'nakit' ? '💵' : '🏦'} {h.name}
                </span>
                <span className="kasa-serit-tutar"
                      style={num(h.balance) < 0 ? { color: 'var(--danger)' } : undefined}>
                  {money(h.balance)}
                </span>
              </span>
            ))}
            <a href="/kasa" className="kasa-serit-link">Kasayı yönet →</a>
          </div>
        )}

        {kasasizAdet > 0 && hesaplar.length > 0 && (
          <div className="alert alert-warning">
            <Icon name="alert" style={{ width: 17, height: 17, flexShrink: 0 }} />
            <span>
              Bu ay <strong>{kasasizAdet} kayıt</strong> hiçbir kasaya bağlı değil,
              yani bakiyelere yansımadı. Aşağıdaki listede &ldquo;kasa seç&rdquo;
              yazan satırdan hesabı seçersen bakiye anında düzelir.
            </span>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <h2>Yeni Kayıt</h2>
              <span className="card-not">Kasadan düşer / kasaya ekler</span>
            </div>
            <div className="card-body">
              <IslemForm action={createTransaction} hesaplar={hesaplar}
                         musteriler={customers} bugun={bugunTR()} varsayilanTur="gelir" />
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Gider Dağılımı</h2></div>
            <div className="card-body">
              {giderKategori.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  Bu ay gider kaydı yok.
                </p>
              ) : (
                <div className="dagilim">
                  {giderKategori.map((k) => {
                    const t = num(k.toplam);
                    const oran = gider > 0 ? Math.round((t / gider) * 100) : 0;
                    return (
                      <div className="dagilim-satir" key={`${k.type}-${k.category}`}>
                        <div className="dagilim-ust">
                          <span>{k.category}</span>
                          <span><strong>{money(t)}</strong> <em>%{oran}</em></span>
                        </div>
                        <div className="progress">
                          <div className="progress-fill"
                               style={{
                                 width: `${enBuyukGider > 0 ? Math.max(3, (t / enBuyukGider) * 100) : 0}%`,
                                 background: 'var(--danger)',
                               }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>İşlem Geçmişi <span className="badge b-muted">{rows.length}</span></h2>
          </div>

          <form className="filter-bar" method="get">
            <input type="month" name="ay" className="form-control" defaultValue={period} aria-label="Ay" />
            <select name="tur" className="form-control" defaultValue={tur ?? ''} aria-label="Tür">
              <option value="">Tümü</option>
              <option value="gelir">Sadece Gelir</option>
              <option value="gider">Sadece Gider</option>
            </select>
            <select name="hesap" className="form-control" defaultValue={hesap ?? ''} aria-label="Kasa">
              <option value="">Tüm kasalar</option>
              {hesaplar.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" type="submit">Filtrele</button>
          </form>

          {rows.length === 0 ? (
            <EmptyState icon="💰" title="Bu ay işlem kaydı yok"
                        text="Yukarıdan gelir veya gider ekleyerek başlayın." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tarih</th><th>Tür</th><th>Kategori</th><th>Açıklama</th>
                    <th>Müşteri</th><th>Kasa</th><th className="num">Tutar</th>
                    <th style={{ width: 1 }} />
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
                      <td>
                        {r.hesap_adi
                          ? <span className="badge b-muted">{r.hesap_adi}</span>
                          : <KasayaBagla islemId={r.id} hesaplar={hesaplar} action={kasayaBagla} />}
                      </td>
                      <td className="num" style={{
                        fontWeight: 700,
                        color: r.type === 'gelir' ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {r.type === 'gelir' ? '+' : '−'}{money(r.amount)}
                      </td>
                      <td>
                        <form action={deleteTransaction}>
                          <input type="hidden" name="id" value={r.id} />
                          <ConfirmButton
                            soru={`${r.category} — ${money(r.amount)} kaydı silinsin mi?${r.hesap_adi ? ` "${r.hesap_adi}" bakiyesi geri alınır.` : ''} Bu işlem geri alınamaz.`}
                            title="Sil"
                          >
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
