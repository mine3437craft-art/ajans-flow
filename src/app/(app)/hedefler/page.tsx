import { requireAdmin } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { money, num } from '@/lib/format';
import { setGoal, deleteGoal } from './actions';

export const dynamic = 'force-dynamic';

const METRIC_LABEL: Record<string, string> = {
  gelir: 'Aylık Gelir', musteri: 'Aktif Müşteri Sayısı', gorev: 'Tamamlanan Görev',
};

export default async function GoalsPage() {
  await requireAdmin();

  const monthStart = new Date().toISOString().slice(0, 7) + '-01';
  const period = monthStart.slice(0, 7);

  const goals = (await sql`
    SELECT id, to_char(period, 'YYYY-MM') AS donem, metric, target
    FROM goals ORDER BY period DESC, metric
  `) as Array<{ id: number; donem: string; metric: string; target: string }>;

  const [gerceklesen] = (await sql`
    SELECT
      (SELECT COALESCE(SUM(amount), 0) FROM transactions
        WHERE type = 'gelir' AND occurred_on >= ${monthStart}::date
          AND occurred_on < (${monthStart}::date + INTERVAL '1 month'))          AS gelir,
      (SELECT COUNT(*) FROM customers WHERE status = 'aktif')                    AS musteri,
      (SELECT COUNT(*) FROM tasks WHERE status = 'tamamlandi'
         AND completed_at >= ${monthStart}::date)                                AS gorev
  `) as Array<{ gelir: string; musteri: string; gorev: string }>;

  const actual = (metric: string): number =>
    metric === 'gelir' ? num(gerceklesen?.gelir)
    : metric === 'musteri' ? num(gerceklesen?.musteri)
    : num(gerceklesen?.gorev);

  return (
    <>
      <PageHeader title="Hedefler" />
      <div className="content">
        <div className="card">
          <div className="card-head"><h2>Hedef Belirle</h2></div>
          <form action={setGoal} className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="period">Dönem</label>
                <input id="period" name="period" type="month" className="form-control"
                       defaultValue={period} required />
              </div>
              <div className="form-group">
                <label htmlFor="metric">Hedef Türü</label>
                <select id="metric" name="metric" className="form-control" defaultValue="gelir">
                  <option value="gelir">Aylık Gelir (₺)</option>
                  <option value="musteri">Aktif Müşteri Sayısı</option>
                  <option value="gorev">Tamamlanan Görev</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="target">Hedef Değer</label>
                <input id="target" name="target" type="number" step="1" min="1" className="form-control" required />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">Kaydet</button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-head"><h2>Hedefler ve Gerçekleşme</h2></div>
          {goals.length === 0 ? (
            <EmptyState icon="🎯" title="Hedef belirlenmemiş" text="Yukarıdan ilk hedefinizi ekleyin." />
          ) : (
            <div className="card-body" style={{ display: 'grid', gap: 18 }}>
              {goals.map((g) => {
                const hedef = num(g.target);
                const buAy = g.donem === period;
                const gercek = buAy ? actual(g.metric) : 0;
                const oran = Math.min(100, (gercek / hedef) * 100);
                return (
                  <div key={g.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div>
                        <strong>{METRIC_LABEL[g.metric]}</strong>{' '}
                        <span className="badge b-muted">{g.donem}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13 }}>
                          {buAy
                            ? <>{g.metric === 'gelir' ? money(gercek) : gercek} / {g.metric === 'gelir' ? money(hedef) : hedef}</>
                            : <>Hedef: {g.metric === 'gelir' ? money(hedef) : hedef}</>}
                        </span>
                        <form action={deleteGoal}>
                          <input type="hidden" name="id" value={g.id} />
                          <ConfirmButton soru="Bu hedef silinsin mi?" title="Sil">
                            <Icon name="trash" />
                          </ConfirmButton>
                        </form>
                      </div>
                    </div>
                    {buAy && (
                      <>
                        <div className="progress"><div className="progress-fill" style={{ width: `${oran}%` }} /></div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                          %{oran.toFixed(0)} tamamlandı
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
