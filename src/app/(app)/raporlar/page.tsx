import { requirePageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { money, num } from '@/lib/format';

export const dynamic = 'force-dynamic';

const AY = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

export default async function ReportsPage() {
  await requirePageAccess('raporlar');

  // Son 6 ayın gelir/gider özeti
  const aylik = (await sql`
    SELECT to_char(date_trunc('month', occurred_on), 'YYYY-MM') AS ay,
           COALESCE(SUM(amount) FILTER (WHERE type='gelir'), 0) AS gelir,
           COALESCE(SUM(amount) FILTER (WHERE type='gider'), 0) AS gider
    FROM transactions
    WHERE occurred_on >= (date_trunc('month', CURRENT_DATE) - INTERVAL '5 months')
    GROUP BY 1 ORDER BY 1
  `) as Array<{ ay: string; gelir: string; gider: string }>;

  const kategoriler = (await sql`
    SELECT type, category, SUM(amount) AS toplam
    FROM transactions
    WHERE occurred_on >= date_trunc('month', CURRENT_DATE)
    GROUP BY type, category ORDER BY SUM(amount) DESC
  `) as Array<{ type: string; category: string; toplam: string }>;

  const personel = (await sql`
    SELECT u.display_name,
           COUNT(*) FILTER (WHERE t.status = 'tamamlandi') AS biten,
           COUNT(*) FILTER (WHERE t.status IN ('bekliyor','devam')) AS acik
    FROM users u LEFT JOIN tasks t ON t.assigned_to = u.id
    WHERE u.is_active
    GROUP BY u.id, u.display_name ORDER BY biten DESC
  `) as Array<{ display_name: string; biten: string; acik: string }>;

  const enIyiMusteriler = (await sql`
    SELECT c.name, COALESCE(SUM(t.amount), 0) AS toplam
    FROM customers c
    JOIN transactions t ON t.customer_id = c.id AND t.type = 'gelir'
    GROUP BY c.id, c.name ORDER BY 2 DESC LIMIT 5
  `) as Array<{ name: string; toplam: string }>;

  const enYuksek = Math.max(1, ...aylik.map((a) => Math.max(num(a.gelir), num(a.gider))));

  return (
    <>
      <PageHeader title="Raporlar" />
      <div className="content">
        <div className="card">
          <div className="card-head"><h2>Son 6 Ay — Gelir / Gider</h2></div>
          {aylik.length === 0 ? (
            <EmptyState icon="📊" title="Henüz veri yok" text="Gelir/gider girdikçe burası dolacak." />
          ) : (
            <div className="card-body" style={{ display: 'grid', gap: 16 }}>
              {aylik.map((a) => {
                const gelir = num(a.gelir), gider = num(a.gider);
                const [, m] = a.ay.split('-');
                return (
                  <div key={a.ay}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <strong>{AY[parseInt(m, 10) - 1]}</strong>
                      <span>
                        <span style={{ color: 'var(--success)' }}>{money(gelir)}</span>
                        {' / '}
                        <span style={{ color: 'var(--danger)' }}>{money(gider)}</span>
                        {' → '}
                        <strong style={{ color: gelir - gider >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {money(gelir - gider)}
                        </strong>
                      </span>
                    </div>
                    <div className="progress" style={{ marginBottom: 4 }}>
                      <div className="progress-fill" style={{
                        width: `${(gelir / enYuksek) * 100}%`,
                        background: 'var(--success)',
                      }} />
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{
                        width: `${(gider / enYuksek) * 100}%`,
                        background: 'var(--danger)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-head"><h2>Bu Ay — Kategori Dağılımı</h2></div>
            {kategoriler.length === 0 ? (
              <EmptyState icon="🧾" title="Bu ay işlem yok" />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Tür</th><th>Kategori</th><th className="num">Toplam</th></tr></thead>
                  <tbody>
                    {kategoriler.map((k) => (
                      <tr key={`${k.type}-${k.category}`}>
                        <td>
                          <span className={`badge ${k.type === 'gelir' ? 'b-success' : 'b-danger'}`}>
                            {k.type === 'gelir' ? 'Gelir' : 'Gider'}
                          </span>
                        </td>
                        <td>{k.category}</td>
                        <td className="num" style={{ fontWeight: 600 }}>{money(k.toplam)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h2>Personel Performansı</h2></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Kişi</th><th className="num">Tamamlanan</th><th className="num">Açık</th></tr></thead>
                <tbody>
                  {personel.map((p) => (
                    <tr key={p.display_name}>
                      <td className="cell-title">{p.display_name}</td>
                      <td className="num">{p.biten}</td>
                      <td className="num">{p.acik}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h2>En Çok Gelir Getiren Müşteriler</h2></div>
          {enIyiMusteriler.length === 0 ? (
            <EmptyState icon="🏆" title="Henüz müşteri geliri yok"
                        text="Gelir kaydederken müşteri seçerseniz burada listelenir." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Müşteri</th><th className="num">Toplam Gelir</th></tr></thead>
                <tbody>
                  {enIyiMusteriler.map((m) => (
                    <tr key={m.name}>
                      <td className="cell-title">{m.name}</td>
                      <td className="num" style={{ fontWeight: 700, color: 'var(--success)' }}>{money(m.toplam)}</td>
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
