import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import { money, dateShort, num, TASK_STATUS_LABEL } from '@/lib/format';
import { videoUyarilari } from '@/lib/video';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ yetkisiz?: string }>;
}) {
  const user = await requireUser();
  const { yetkisiz } = await searchParams;
  const isAdmin = user.role === 'admin';
  const monthStart = new Date().toISOString().slice(0, 7) + '-01';

  // --- Herkesin görebildiği veriler ---
  const taskStats = (await sql`
    SELECT
      COUNT(*) FILTER (WHERE status IN ('bekliyor','devam'))                        AS acik,
      COUNT(*) FILTER (WHERE status = 'tamamlandi' AND completed_at >= ${monthStart}::date) AS bu_ay_biten,
      COUNT(*) FILTER (WHERE status IN ('bekliyor','devam') AND due_date < CURRENT_DATE) AS geciken
    FROM tasks
    WHERE ${isAdmin}::boolean OR assigned_to = ${user.id} OR created_by = ${user.id}
  `) as Array<{ acik: string; bu_ay_biten: string; geciken: string }>;

  const myTasks = (await sql`
    SELECT t.id, t.title, t.due_date, t.status, c.name AS customer_name
    FROM tasks t
    LEFT JOIN customers c ON c.id = t.customer_id
    WHERE t.status IN ('bekliyor','devam')
      AND (${isAdmin}::boolean OR t.assigned_to = ${user.id} OR t.created_by = ${user.id})
    ORDER BY t.due_date NULLS LAST LIMIT 8
  `) as Array<{ id: number; title: string; due_date: string | null; status: string; customer_name: string | null }>;

  const upcomingPosts = (await sql`
    SELECT p.id, p.title, p.platform, p.scheduled_at, c.name AS customer_name
    FROM content_posts p
    LEFT JOIN customers c ON c.id = p.customer_id
    WHERE p.scheduled_at >= NOW() AND p.status <> 'iptal'
      AND (${isAdmin}::boolean OR p.assigned_to = ${user.id})
    ORDER BY p.scheduled_at LIMIT 6
  `) as Array<{ id: number; title: string; platform: string; scheduled_at: string; customer_name: string | null }>;

  // Video stoğu azalan müşteriler. Personel yalnızca kendisine atanmış
  // müşterilerin uyarısını görür.
  const tumUyarilar = await videoUyarilari();
  const benimMusteriler = isAdmin
    ? null
    : new Set(((await sql`
        SELECT id FROM customers WHERE assigned_to = ${user.id}
      `) as Array<{ id: number }>).map((c) => c.id));
  const videoUyari = benimMusteriler
    ? tumUyarilar.filter((v) => benimMusteriler.has(v.customer_id))
    : tumUyarilar;

  const stats = taskStats[0];

  // --- Yalnızca yöneticiye gönderilen finans verileri ---
  // Personel için sorgu hiç çalışmaz; veri istemciye ulaşmaz.
  let finans: { gelir: number; gider: number; alacak: number; musteri: number } | null = null;
  let yaklasanOdemeler: Array<{ id: number; name: string; monthly_fee: string; next_payment_date: string }> = [];
  if (isAdmin) {
    yaklasanOdemeler = (await sql`
      SELECT id, name, monthly_fee, next_payment_date
      FROM customers
      WHERE status = 'aktif' AND next_payment_date IS NOT NULL
        AND next_payment_date <= CURRENT_DATE + INTERVAL '7 days'
      ORDER BY next_payment_date
    `) as Array<{ id: number; name: string; monthly_fee: string; next_payment_date: string }>;

    const [tx] = (await sql`
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE type='gelir'), 0) AS gelir,
        COALESCE(SUM(amount) FILTER (WHERE type='gider'), 0) AS gider
      FROM transactions
      WHERE occurred_on >= ${monthStart}::date
        AND occurred_on < (${monthStart}::date + INTERVAL '1 month')
    `) as Array<{ gelir: string; gider: string }>;

    const [dp] = (await sql`
      SELECT COALESCE(SUM(amount - paid_amount), 0) AS alacak
      FROM debts WHERE direction = 'alacak' AND paid_amount < amount
    `) as Array<{ alacak: string }>;

    const [cs] = (await sql`
      SELECT COUNT(*) AS n FROM customers WHERE status = 'aktif'
    `) as Array<{ n: string }>;

    finans = {
      gelir: num(tx?.gelir), gider: num(tx?.gider),
      alacak: num(dp?.alacak), musteri: parseInt(cs?.n ?? '0', 10),
    };
  }

  return (
    <>
      <PageHeader title="Pano" />
      <div className="content">
        {yetkisiz === '1' && (
          <div className="alert alert-danger">
            <Icon name="alert" style={{ width: 17, height: 17, flexShrink: 0 }} />
            <span>Bu sayfayı görüntüleme yetkiniz yok.</span>
          </div>
        )}

        <p style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>
          Hoş geldin, <strong>{user.display_name}</strong>.
        </p>

        {yaklasanOdemeler.length > 0 && (
          <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
            <div className="card-head">
              <h2>💳 Yaklaşan Ödemeler</h2>
              <a href="/musteriler" className="btn btn-sm btn-secondary">Müşteriler →</a>
            </div>
            <div className="table-wrap">
              <table>
                <tbody>
                  {yaklasanOdemeler.map((o) => {
                    const gecmis = o.next_payment_date < new Date().toISOString().slice(0, 10);
                    return (
                      <tr key={o.id}>
                        <td className="cell-title">{o.name}</td>
                        <td className="num">{money(o.monthly_fee)}</td>
                        <td>
                          <span className={`badge ${gecmis ? 'b-danger' : 'b-warning'}`}>
                            {gecmis ? 'Vadesi geçti' : dateShort(o.next_payment_date)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {videoUyari.length > 0 && (
          <div className="card" style={{ borderLeft: '3px solid var(--danger)' }}>
            <div className="card-head">
              <h2>🎬 Video stoğu azalan müşteriler</h2>
              <a href="/videolar" className="btn btn-sm btn-secondary">Video Deposu →</a>
            </div>
            <div className="table-wrap">
              <table>
                <tbody>
                  {videoUyari.map((v) => (
                    <tr key={v.customer_id}>
                      <td className="cell-title">{v.musteri}</td>
                      <td className="num">
                        depoda <strong>{v.depoda}</strong> video
                        <span className="cell-sub"> · haftada {v.haftalik} paylaşım</span>
                      </td>
                      <td>
                        {v.seviye === 'kritik' ? (
                          <span className="badge b-danger">Çekime gidilmeli</span>
                        ) : (
                          <span className="badge b-warning">
                            {v.haftaKaldi?.toFixed(1)} haftaya yeter
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon i-primary"><Icon name="check" /></div>
            <div className="stat-value">{stats?.acik ?? 0}</div>
            <div className="stat-label">{isAdmin ? 'Açık Görev' : 'Açık Görevim'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-danger"><Icon name="alert" /></div>
            <div className="stat-value" style={{ color: num(stats?.geciken) > 0 ? 'var(--danger)' : undefined }}>
              {stats?.geciken ?? 0}
            </div>
            <div className="stat-label">Geciken Görev</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon i-success"><Icon name="chart" /></div>
            <div className="stat-value">{stats?.bu_ay_biten ?? 0}</div>
            <div className="stat-label">Bu Ay Tamamlanan</div>
          </div>

          {finans && (
            <>
              <div className="stat-card">
                <div className="stat-icon i-success"><Icon name="money" /></div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>{money(finans.gelir)}</div>
                <div className="stat-label">Bu Ay Gelir</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon i-danger"><Icon name="card" /></div>
                <div className="stat-value" style={{ color: 'var(--danger)' }}>{money(finans.gider)}</div>
                <div className="stat-label">Bu Ay Gider</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon i-warning"><Icon name="clock" /></div>
                <div className="stat-value">{money(finans.alacak)}</div>
                <div className="stat-label">Bekleyen Alacak</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon i-info"><Icon name="users" /></div>
                <div className="stat-value">{finans.musteri}</div>
                <div className="stat-label">Aktif Müşteri</div>
              </div>
            </>
          )}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-head"><h2>Yaklaşan Görevler</h2></div>
            {myTasks.length === 0 ? (
              <EmptyState icon="✅" title="Açık görev yok" text="Şu an bekleyen bir işiniz görünmüyor." />
            ) : (
              <div className="table-wrap">
                <table>
                  <tbody>
                    {myTasks.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="cell-title">{t.title}</div>
                          {t.customer_name && <div className="cell-sub">{t.customer_name}</div>}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>{dateShort(t.due_date)}</td>
                        <td>
                          <span className={`badge ${t.status === 'devam' ? 'b-info' : 'b-muted'}`}>
                            {TASK_STATUS_LABEL[t.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h2>Yaklaşan Paylaşımlar</h2></div>
            {upcomingPosts.length === 0 ? (
              <EmptyState icon="📅" title="Planlanmış paylaşım yok" text="İçerik takviminden ekleyebilirsiniz." />
            ) : (
              <div className="table-wrap">
                <table>
                  <tbody>
                    {upcomingPosts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="cell-title">{p.title}</div>
                          {p.customer_name && <div className="cell-sub">{p.customer_name}</div>}
                        </td>
                        <td><span className="badge b-primary">{p.platform}</span></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{dateShort(p.scheduled_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
