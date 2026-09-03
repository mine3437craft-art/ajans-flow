import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { dateShort } from '@/lib/format';
import { videoDurumu } from '@/lib/video';
import { addVideos, publishVideo, deleteVideo, setHaftalik } from './actions';

export const dynamic = 'force-dynamic';

type VideoRow = {
  id: number; title: string; status: string;
  recorded_on: string | null; published_on: string | null;
  notes: string | null; musteri: string; customer_id: number;
};

const SEVIYE = {
  kritik:       { sinif: 'b-danger',  etiket: 'Çekime gidilmeli' },
  azaliyor:     { sinif: 'b-warning', etiket: 'Azalıyor' },
  yeterli:      { sinif: 'b-success', etiket: 'Yeterli' },
  planlanmamis: { sinif: 'b-muted',   etiket: 'Plan girilmemiş' },
} as const;

export default async function VideolarPage() {
  const user = await requireUser();
  const isAdmin = user.role === 'admin';

  const durumlar = await videoDurumu();

  const videolar = (await sql`
    SELECT v.id, v.title, v.status, v.recorded_on, v.published_on, v.notes,
           v.customer_id, c.name AS musteri
    FROM videos v
    JOIN customers c ON c.id = v.customer_id
    WHERE v.status = 'depoda'
      AND (${isAdmin}::boolean OR c.assigned_to = ${user.id})
    ORDER BY c.name, v.recorded_on NULLS LAST, v.id
  `) as VideoRow[];

  const customers = (await sql`
    SELECT id, name, haftalik_video::int AS haftalik FROM customers
    WHERE status = 'aktif' AND (${isAdmin}::boolean OR assigned_to = ${user.id})
    ORDER BY name
  `) as Array<{ id: number; name: string; haftalik: number }>;

  const gorunur = isAdmin
    ? durumlar
    : durumlar.filter((d) => customers.some((c) => c.id === d.customer_id));

  return (
    <>
      <PageHeader title="Video Deposu" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>Stok Durumu</h2>
          </div>

          {gorunur.length === 0 ? (
            <EmptyState icon="🎬" title="Aktif müşteri yok"
                        text="Önce müşteri ekleyin, sonra haftalık video sayısını girin." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Müşteri</th>
                    <th className="num">Depoda</th>
                    <th className="num">Haftalık</th>
                    <th>Ne kadar yeter</th>
                    <th>Durum</th>
                    {isAdmin && <th style={{ width: 170 }}>Haftalık ayarla</th>}
                  </tr>
                </thead>
                <tbody>
                  {gorunur.map((d) => {
                    const s = SEVIYE[d.seviye];
                    return (
                      <tr key={d.customer_id}>
                        <td className="cell-title">{d.musteri}</td>
                        <td className="num" style={{ fontWeight: 700, fontSize: 15 }}>{d.depoda}</td>
                        <td className="num">{d.haftalik || '—'}</td>
                        <td>
                          {d.haftaKaldi === null ? '—'
                            : d.haftaKaldi < 1
                              ? <strong style={{ color: 'var(--danger)' }}>1 haftadan az</strong>
                              : `${d.haftaKaldi.toFixed(1)} hafta`}
                        </td>
                        <td><span className={`badge ${s.sinif}`}>{s.etiket}</span></td>
                        {isAdmin && (
                          <td>
                            <form action={setHaftalik} style={{ display: 'flex', gap: 6 }}>
                              <input type="hidden" name="customer_id" value={d.customer_id} />
                              <input name="haftalik" type="number" min="0" max="50"
                                     className="form-control" style={{ padding: '6px 9px', width: 78 }}
                                     defaultValue={d.haftalik} aria-label="Haftalık video sayısı" />
                              <button className="btn btn-sm btn-secondary" type="submit">Kaydet</button>
                            </form>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Depodaki Videolar <span className="badge b-muted">{videolar.length}</span></h2>
          </div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Çekilen Video Ekle
            </summary>
            <form action={addVideos} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="customer_id">Müşteri *</label>
                  <select id="customer_id" name="customer_id" className="form-control" required defaultValue="">
                    <option value="" disabled>Seçin…</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="title">Video Adı *</label>
                  <input id="title" name="title" className="form-control" required maxLength={200}
                         placeholder="örn. Menü tanıtım" />
                </div>
                <div className="form-group">
                  <label htmlFor="adet">Kaç adet?</label>
                  <input id="adet" name="adet" type="number" min="1" max="50"
                         className="form-control" defaultValue="1" />
                </div>
                <div className="form-group">
                  <label htmlFor="recorded_on">Çekim Tarihi</label>
                  <input id="recorded_on" name="recorded_on" type="date" className="form-control" />
                </div>
                <div className="form-group full">
                  <label htmlFor="notes">Not</label>
                  <input id="notes" name="notes" className="form-control" maxLength={300} />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Depoya Ekle</button>
              </div>
            </form>
          </details>

          {videolar.length === 0 ? (
            <EmptyState icon="📼" title="Depo boş"
                        text="Çekilen videoları buraya ekleyin, paylaştıkça düşün." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Müşteri</th><th>Video</th><th>Çekim</th><th style={{ width: 1 }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {videolar.map((v) => (
                    <tr key={v.id}>
                      <td>{v.musteri}</td>
                      <td>
                        <div className="cell-title">{v.title}</div>
                        {v.notes && <div className="cell-sub">{v.notes}</div>}
                      </td>
                      <td>{dateShort(v.recorded_on)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <form action={publishVideo}>
                            <input type="hidden" name="id" value={v.id} />
                            <button className="btn btn-sm btn-success" type="submit">Yayınlandı</button>
                          </form>
                          <form action={deleteVideo}>
                            <input type="hidden" name="id" value={v.id} />
                            <ConfirmButton soru={`"${v.title}" depodan silinsin mi?`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        </div>
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
