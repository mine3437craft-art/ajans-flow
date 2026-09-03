import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { createNote, updateNote, deleteNote, togglePin } from './actions';

export const dynamic = 'force-dynamic';

type NoteRow = {
  id: number; title: string; body: string; visibility: string;
  is_pinned: boolean; author_id: number | null;
  author_name: string | null; updated_at: string;
};

function zaman(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('tr-TR', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ ara?: string; kim?: string }>;
}) {
  const user = await requireUser();
  const { ara, kim } = await searchParams;
  const arama = (ara ?? '').trim();

  // Görünürlük kuralı tek yerde: ekip notları herkese açık,
  // kişisel notları yalnızca yazan görür (yönetici dahil kimse göremez).
  const notes = (await sql`
    SELECT n.id, n.title, n.body, n.visibility, n.is_pinned, n.author_id,
           u.display_name AS author_name, n.updated_at
    FROM notes n
    LEFT JOIN users u ON u.id = n.author_id
    WHERE (n.visibility = 'ekip' OR n.author_id = ${user.id})
      AND (${arama || null}::text IS NULL
           OR n.title ILIKE ${'%' + arama + '%'}
           OR n.body  ILIKE ${'%' + arama + '%'})
      AND (${kim ?? null}::text IS NULL
           OR (${kim ?? null} = 'benim' AND n.author_id = ${user.id})
           OR (${kim ?? null} = 'kisisel' AND n.visibility = 'kisisel' AND n.author_id = ${user.id})
           OR (${kim ?? null} = 'ekip' AND n.visibility = 'ekip'))
    ORDER BY n.is_pinned DESC, n.updated_at DESC
  `) as NoteRow[];

  const filtreler = [
    { k: '', l: 'Tümü' },
    { k: 'ekip', l: 'Ekip Notları' },
    { k: 'benim', l: 'Benim Notlarım' },
    { k: 'kisisel', l: 'Sadece Ben' },
  ];

  return (
    <>
      <PageHeader title="Notlar" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>Not Defteri <span className="badge b-muted">{notes.length}</span></h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {filtreler.map((f) => (
                <a
                  key={f.k}
                  href={f.k ? `/notlar?kim=${f.k}` : '/notlar'}
                  className={`btn btn-sm ${(kim ?? '') === f.k ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {f.l}
                </a>
              ))}
              <a href="/notlar/kisayollar" className="btn btn-sm btn-secondary">⌨️ Kısayollar</a>
            </div>
          </div>

          <form className="filter-bar" method="get">
            <input
              name="ara" className="form-control" defaultValue={arama}
              placeholder="Notlarda ara…" aria-label="Notlarda ara"
              style={{ flex: '1 1 240px' }}
            />
            <button className="btn btn-secondary btn-sm" type="submit">Ara</button>
            {arama && <a className="btn btn-ghost btn-sm" href="/notlar">Temizle</a>}
          </form>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Not
            </summary>
            <form action={createNote} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="title">Başlık *</label>
                  <input id="title" name="title" className="form-control" required maxLength={200} />
                </div>
                <div className="form-group full">
                  <label htmlFor="body">Not</label>
                  <textarea id="body" name="body" className="form-control" rows={6}
                            placeholder="Buraya yaz…" />
                </div>
                <div className="form-group">
                  <label htmlFor="visibility">Kimler görsün?</label>
                  <select id="visibility" name="visibility" className="form-control" defaultValue="ekip">
                    <option value="ekip">Ekip — herkes görebilir</option>
                    <option value="kisisel">Sadece ben</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Notu Kaydet</button>
              </div>
            </form>
          </details>
        </div>

        {notes.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="📝"
              title={arama ? 'Aramaya uyan not yok' : 'Henüz not yok'}
              text={arama ? 'Başka bir kelime deneyin.' : 'Yukarıdaki “Yeni Not” ile başlayın.'}
            />
          </div>
        ) : (
          <div className="grid-2">
            {notes.map((n) => {
              const benim = n.author_id === user.id;
              const yazabilir = benim || (user.role === 'admin' && n.visibility === 'ekip');
              return (
                <div className="card" key={n.id}>
                  <div className="card-head">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      {n.is_pinned && <Icon name="pin" style={{ width: 14, height: 14, color: 'var(--primary)' }} />}
                      {n.title}
                    </h2>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span className={`badge ${n.visibility === 'kisisel' ? 'b-warning' : 'b-info'}`}>
                        {n.visibility === 'kisisel' ? 'Sadece ben' : 'Ekip'}
                      </span>
                      {yazabilir && (
                        <>
                          <form action={togglePin}>
                            <input type="hidden" name="id" value={n.id} />
                            <button className="btn-icon" type="submit"
                                    title={n.is_pinned ? 'Sabitlemeyi kaldır' : 'Üste sabitle'}
                                    aria-label={n.is_pinned ? 'Sabitlemeyi kaldır' : 'Üste sabitle'}>
                              <Icon name="pin" />
                            </button>
                          </form>
                          <form action={deleteNote}>
                            <input type="hidden" name="id" value={n.id} />
                            <ConfirmButton soru={`"${n.title}" notu silinsin mi? Bu işlem geri alınamaz.`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    {n.body ? (
                      <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{n.body}</p>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>(boş)</p>
                    )}

                    <div style={{
                      marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)',
                      fontSize: 12, color: 'var(--text-muted)',
                      display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
                    }}>
                      <span>{benim ? 'Sen' : (n.author_name ?? 'Bilinmiyor')}</span>
                      <span>{zaman(n.updated_at)}</span>
                    </div>

                    {yazabilir && (
                      <details style={{ marginTop: 12 }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--primary)', fontSize: 13 }}>
                          Düzenle
                        </summary>
                        <form action={updateNote} style={{ marginTop: 12 }}>
                          <input type="hidden" name="id" value={n.id} />
                          <div className="form-grid">
                            <div className="form-group full">
                              <label htmlFor={`t-${n.id}`}>Başlık</label>
                              <input id={`t-${n.id}`} name="title" className="form-control"
                                     defaultValue={n.title} required maxLength={200} />
                            </div>
                            <div className="form-group full">
                              <label htmlFor={`b-${n.id}`}>Not</label>
                              <textarea id={`b-${n.id}`} name="body" className="form-control"
                                        rows={6} defaultValue={n.body} />
                            </div>
                            <div className="form-group full">
                              <label htmlFor={`v-${n.id}`}>Kimler görsün?</label>
                              <select id={`v-${n.id}`} name="visibility" className="form-control"
                                      defaultValue={n.visibility}>
                                <option value="ekip">Ekip — herkes görebilir</option>
                                <option value="kisisel">Sadece ben</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-actions">
                            <button className="btn btn-primary btn-sm" type="submit">Güncelle</button>
                          </div>
                        </form>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
