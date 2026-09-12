import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import { money, dateShort, num, TASK_STATUS_LABEL } from '@/lib/format';
import { videoUyarilari } from '@/lib/video';
import { MARKALAR, ACIK_DURUMLAR, bugun, tarihEtiketi } from '@/lib/adaylar';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser();
  await searchParams;
  const isAdmin = user.role === 'admin';
  const monthStart = new Date().toISOString().slice(0, 7) + '-01';

  // Panodaki bütün sorgular birbirinden bağımsız: sırayla beklemek 10 tur
  // (~570 ms) demekti. Yöneticiye özel olanlar da aynı dalgada, personelde
  // hiç çalışmayacak şekilde (Promise.resolve) duruyor.
  // Görevler ekibin ortak panosu: kişiye göre süzülmez.
  const [
    taskStats, myTasks, upcomingPosts, tumUyarilar, benimMusterilerSatir,
    adaySayilari, yaklasanOdemelerSonuc, txSonuc, dpSonuc, csSonuc,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE status IN ('bekliyor','devam'))                        AS acik,
        COUNT(*) FILTER (WHERE status = 'tamamlandi' AND completed_at >= ${monthStart}::date) AS bu_ay_biten,
        COUNT(*) FILTER (WHERE status IN ('bekliyor','devam') AND due_date < CURRENT_DATE) AS geciken
      FROM tasks
    ` as Promise<Array<{ acik: string; bu_ay_biten: string; geciken: string }>>,
    sql`
      SELECT t.id, t.title, t.due_date, t.status, c.name AS customer_name,
             u.display_name AS assignee_name
      FROM tasks t
      LEFT JOIN customers c ON c.id = t.customer_id
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE t.status IN ('bekliyor','devam')
      ORDER BY t.due_date NULLS LAST LIMIT 8
    ` as Promise<Array<{
      id: number; title: string; due_date: string | null; status: string;
      customer_name: string | null; assignee_name: string | null;
    }>>,
    sql`
      SELECT p.id, p.title, p.platform, p.scheduled_at, c.name AS customer_name
      FROM content_posts p
      LEFT JOIN customers c ON c.id = p.customer_id
      WHERE p.scheduled_at >= NOW() AND p.status <> 'iptal'
        AND (${isAdmin}::boolean OR p.assigned_to = ${user.id})
      ORDER BY p.scheduled_at LIMIT 6
    ` as Promise<Array<{
      id: number; title: string; platform: string; scheduled_at: string; customer_name: string | null;
    }>>,
    videoUyarilari(),
    isAdmin
      ? Promise.resolve([] as Array<{ id: number }>)
      : sql`SELECT id FROM customers WHERE assigned_to = ${user.id}` as Promise<Array<{ id: number }>>,
    sql`
      SELECT brand,
             -- Sayı, bağlantının açtığı "Bugün Aranacak" görünümüyle birebir
             -- aynı olsun diye kişiye göre süzülmüyor.
             COUNT(*) FILTER (WHERE status = ANY(${ACIK_DURUMLAR}::text[])
               AND (next_call_on <= ${bugun()}::date OR status = 'aranmadi'))::int AS benim,
             COUNT(*) FILTER (WHERE status = ANY(${ACIK_DURUMLAR}::text[])
               AND next_call_on < ${bugun()}::date)::int AS gecikmis,
             COUNT(*) FILTER (WHERE status = 'olumlu')::int AS olumlu
      FROM prospects
      GROUP BY brand
    ` as Promise<Array<{ brand: string; benim: number; gecikmis: number; olumlu: number }>>,
    // --- Yalnızca yöneticiye: personelde sorgu hiç çalışmaz, veri istemciye ulaşmaz
    isAdmin
      ? sql`
          SELECT id, name, monthly_fee, next_payment_date
          FROM customers
          WHERE status = 'aktif' AND next_payment_date IS NOT NULL
            AND next_payment_date <= CURRENT_DATE + INTERVAL '7 days'
          ORDER BY next_payment_date
        ` as Promise<Array<{ id: number; name: string; monthly_fee: string; next_payment_date: string }>>
      : Promise.resolve([] as Array<{ id: number; name: string; monthly_fee: string; next_payment_date: string }>),
    isAdmin
      ? sql`
          SELECT
            COALESCE(SUM(amount) FILTER (WHERE type='gelir'), 0) AS gelir,
            COALESCE(SUM(amount) FILTER (WHERE type='gider'), 0) AS gider
          FROM transactions
          WHERE occurred_on >= ${monthStart}::date
            AND occurred_on < (${monthStart}::date + INTERVAL '1 month')
        ` as Promise<Array<{ gelir: string; gider: string }>>
      : Promise.resolve([] as Array<{ gelir: string; gider: string }>),
    isAdmin
      ? sql`
          SELECT COALESCE(SUM(amount - paid_amount), 0) AS alacak
          FROM debts WHERE direction = 'alacak' AND paid_amount < amount
        ` as Promise<Array<{ alacak: string }>>
      : Promise.resolve([] as Array<{ alacak: string }>),
    isAdmin
      ? sql`SELECT COUNT(*) AS n FROM customers WHERE status = 'aktif'` as Promise<Array<{ n: string }>>
      : Promise.resolve([] as Array<{ n: string }>),
  ]);

  // Video stoğu: personel yalnızca kendisine atanmış müşterilerin uyarısını görür.
  const benimMusteriler = isAdmin ? null : new Set(benimMusterilerSatir.map((c) => c.id));
  const videoUyari = benimMusteriler
    ? tumUyarilar.filter((v) => benimMusteriler.has(v.customer_id))
    : tumUyarilar;

  // Müşteri bulma listeleri herkese açık.
  const adayListeleri = MARKALAR;
  const adayHarita = new Map(adaySayilari.map((a) => [a.brand, a]));
  const stats = taskStats[0];

  const yaklasanOdemeler = yaklasanOdemelerSonuc;
  const finans = isAdmin
    ? {
        gelir: num(txSonuc[0]?.gelir), gider: num(txSonuc[0]?.gider),
        alacak: num(dpSonuc[0]?.alacak), musteri: parseInt(csSonuc[0]?.n ?? '0', 10),
      }
    : null;

  return (
    <>
      <PageHeader title="Pano" />
      <div className="content">

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

        {adayListeleri.length > 0 && (
          <div className="card">
            <div className="card-head">
              <h2>📞 Bugün aranacak adaylar</h2>
              <span className="card-not">yeni müşteri bulma</span>
            </div>
            <div className="card-body">
              <div className="aday-pano">
                {adayListeleri.map((m) => {
                  const a = adayHarita.get(m.anahtar);
                  return (
                    <a key={m.anahtar} href={`/musteri-bulma/${m.yol}?gorunum=bugun`} className="aday-pano-satir">
                      <span className="aday-pano-ad">{m.ad}</span>
                      <span className="aday-pano-sayi">{a?.benim ?? 0}</span>
                      <span className="cell-sub">
                        {(a?.gecikmis ?? 0) > 0 && (
                          <span style={{ color: 'var(--danger)', fontWeight: 650 }}>
                            {a!.gecikmis} gecikmiş ·{' '}
                          </span>
                        )}
                        {a?.olumlu ?? 0} olumlu
                      </span>
                    </a>
                  );
                })}
              </div>
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
          <a href="/gorevler" className="stat-card aday-tile">
            <div className="stat-icon i-primary"><Icon name="check" /></div>
            <div className="stat-value">{stats?.acik ?? 0}</div>
            <div className="stat-label">Açık Görev</div>
          </a>
          <a href="/gorevler" className="stat-card aday-tile">
            <div className="stat-icon i-danger"><Icon name="alert" /></div>
            <div className="stat-value" style={{ color: num(stats?.geciken) > 0 ? 'var(--danger)' : undefined }}>
              {stats?.geciken ?? 0}
            </div>
            <div className="stat-label">Geciken Görev</div>
          </a>
          <a href="/gorevler?durum=tamamlandi&amp;gun=tumu" className="stat-card aday-tile">
            <div className="stat-icon i-success"><Icon name="chart" /></div>
            <div className="stat-value">{stats?.bu_ay_biten ?? 0}</div>
            <div className="stat-label">Bu Ay Tamamlanan</div>
          </a>

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
            <div className="card-head">
              <h2>Bugün ve geciken işler</h2>
              <a href="/gorevler" className="btn btn-sm btn-secondary">Görevler →</a>
            </div>
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
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {(() => {
                            const e = tarihEtiketi(t.due_date);
                            return e
                              ? <span className={`tarih-etiket ${e.sinif}`}>{e.metin}</span>
                              : <span className="cell-sub">tarihsiz</span>;
                          })()}
                        </td>
                        <td>
                          {t.assignee_name
                            ? <span className="badge b-muted">{t.assignee_name}</span>
                            : <span className="cell-sub">atanmamış</span>}
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
