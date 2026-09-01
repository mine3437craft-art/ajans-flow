import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import { POST_STATUS_LABEL, PLATFORMS } from '@/lib/format';
import { createPost, setPostStatus } from './actions';

export const dynamic = 'force-dynamic';

const AY = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GUN = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];

type PostRow = {
  id: number; title: string; platform: string; scheduled_at: string;
  status: string; customer_name: string | null;
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ ay?: string }>;
}) {
  const user = await requireUser();
  const { ay } = await searchParams;
  const isAdmin = user.role === 'admin';

  const now = new Date();
  const period = /^\d{4}-\d{2}$/.test(ay ?? '') ? ay! : now.toISOString().slice(0, 7);
  const [yil, aySayi] = period.split('-').map(Number);
  const periodStart = `${period}-01`;

  const posts = (await sql`
    SELECT p.id, p.title, p.platform, p.scheduled_at, p.status, c.name AS customer_name
    FROM content_posts p
    LEFT JOIN customers c ON c.id = p.customer_id
    WHERE p.scheduled_at >= ${periodStart}::date
      AND p.scheduled_at <  (${periodStart}::date + INTERVAL '1 month')
      AND (${isAdmin}::boolean OR p.assigned_to = ${user.id})
    ORDER BY p.scheduled_at
  `) as PostRow[];

  const customers = (await sql`
    SELECT id, name FROM customers
    WHERE status = 'aktif' AND (${isAdmin}::boolean OR assigned_to = ${user.id})
    ORDER BY name
  `) as Array<{ id: number; name: string }>;

  // Ay ızgarası — pazartesi başlangıçlı
  const ilkGun = new Date(Date.UTC(yil, aySayi - 1, 1));
  const gunSayisi = new Date(Date.UTC(yil, aySayi, 0)).getUTCDate();
  const bosluk = (ilkGun.getUTCDay() + 6) % 7;
  const bugun = now.toISOString().slice(0, 10);

  const gunlukPostlar = new Map<number, PostRow[]>();
  for (const p of posts) {
    const gun = new Date(p.scheduled_at).getDate();
    if (!gunlukPostlar.has(gun)) gunlukPostlar.set(gun, []);
    gunlukPostlar.get(gun)!.push(p);
  }

  const oncekiAy = new Date(Date.UTC(yil, aySayi - 2, 1)).toISOString().slice(0, 7);
  const sonrakiAy = new Date(Date.UTC(yil, aySayi, 1)).toISOString().slice(0, 7);

  return (
    <>
      <PageHeader title="İçerik Takvimi" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>{AY[aySayi - 1]} {yil}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <a className="btn btn-sm btn-secondary" href={`/takvim?ay=${oncekiAy}`}>← Önceki</a>
              <a className="btn btn-sm btn-secondary" href="/takvim">Bu Ay</a>
              <a className="btn btn-sm btn-secondary" href={`/takvim?ay=${sonrakiAy}`}>Sonraki →</a>
            </div>
          </div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Paylaşım Planla
            </summary>
            <form action={createPost} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="title">Başlık *</label>
                  <input id="title" name="title" className="form-control" required maxLength={200} />
                </div>
                <div className="form-group">
                  <label htmlFor="scheduled_at">Tarih & Saat *</label>
                  <input id="scheduled_at" name="scheduled_at" type="datetime-local" className="form-control" required />
                </div>
                <div className="form-group">
                  <label htmlFor="platform">Platform</label>
                  <select id="platform" name="platform" className="form-control">
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customer_id">Müşteri</label>
                  <select id="customer_id" name="customer_id" className="form-control" defaultValue="">
                    <option value="">— Yok —</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="notes">Not</label>
                  <input id="notes" name="notes" className="form-control" maxLength={300} />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Planla</button>
              </div>
            </form>
          </details>

          <div className="cal-grid">
            {GUN.map((g) => <div key={g} className="cal-head">{g}</div>)}
            {Array.from({ length: bosluk }).map((_, i) => (
              <div key={`bos-${i}`} className="cal-cell other" />
            ))}
            {Array.from({ length: gunSayisi }).map((_, i) => {
              const gun = i + 1;
              const tarih = `${period}-${String(gun).padStart(2, '0')}`;
              const gunPostlari = gunlukPostlar.get(gun) ?? [];
              return (
                <div key={gun} className={`cal-cell${tarih === bugun ? ' today' : ''}`}>
                  <div className="cal-day">{gun}</div>
                  {gunPostlari.map((p) => (
                    <span key={p.id} className="cal-post" title={`${p.title} — ${POST_STATUS_LABEL[p.status]}`}>
                      {p.title}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {posts.length > 0 && (
          <div className="card">
            <div className="card-head"><h2>Bu Ayın Paylaşımları</h2></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Başlık</th><th>Müşteri</th><th>Platform</th><th>Tarih</th><th>Durum</th><th style={{ width: 1 }} /></tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td className="cell-title">{p.title}</td>
                      <td>{p.customer_name ?? '—'}</td>
                      <td><span className="badge b-primary">{p.platform}</span></td>
                      <td>{new Date(p.scheduled_at).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><span className="badge b-muted">{POST_STATUS_LABEL[p.status]}</span></td>
                      <td>
                        {p.status !== 'yayinlandi' && (
                          <form action={setPostStatus}>
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="status" value="yayinlandi" />
                            <button className="btn btn-sm btn-success" type="submit">Yayınlandı</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
