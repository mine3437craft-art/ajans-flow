import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { createShortcut, deleteShortcut } from './actions';

export const dynamic = 'force-dynamic';

const PROGRAMLAR = ['Photoshop', 'Premiere Pro', 'Illustrator', 'After Effects', 'Diğer'];

const PROGRAM_RENK: Record<string, string> = {
  'Photoshop': 'b-info',
  'Premiere Pro': 'b-primary',
  'Illustrator': 'b-warning',
  'After Effects': 'b-danger',
  'Diğer': 'b-muted',
};

type ShortcutRow = {
  id: number; program: string; keys: string; aciklama: string;
  author_id: number | null; author_name: string | null;
};

export default async function ShortcutsPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; ara?: string }>;
}) {
  const user = await requireUser();
  const { program, ara } = await searchParams;
  const arama = (ara ?? '').trim();

  const kisayollar = (await sql`
    SELECT s.id, s.program, s.keys, s.aciklama, s.author_id, u.display_name AS author_name
    FROM shortcuts s
    LEFT JOIN users u ON u.id = s.author_id
    WHERE (${program ?? null}::text IS NULL OR s.program = ${program ?? null})
      AND (${arama || null}::text IS NULL
           OR s.keys ILIKE ${'%' + arama + '%'}
           OR s.aciklama ILIKE ${'%' + arama + '%'})
    ORDER BY s.program, s.aciklama
  `) as ShortcutRow[];

  return (
    <>
      <PageHeader title="Kısayollar" />
      <div className="content">
        <div className="alert alert-info">
          <Icon name="note" style={{ width: 17, height: 17, flexShrink: 0 }} />
          <span>
            Photoshop, Premiere gibi programlarda öğrendiğiniz kısayolları buraya ekleyin —
            ekip ortak listeden faydalanır. Örnek: <kbd className="key">Ctrl</kbd>+<kbd className="key">E</kbd> → katmanları birleştir.
          </span>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Ekip Kısayol Listesi <span className="badge b-muted">{kisayollar.length}</span></h2>
            <a href="/notlar" className="btn btn-sm btn-secondary">← Notlara dön</a>
          </div>

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary style={{ padding: '13px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
              + Yeni Kısayol Ekle
            </summary>
            <form action={createShortcut} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="program">Program</label>
                  <select id="program" name="program" className="form-control" defaultValue="Photoshop">
                    {PROGRAMLAR.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="keys">Tuş Kombinasyonu *</label>
                  <input id="keys" name="keys" className="form-control" required maxLength={60}
                         placeholder="örn. Ctrl+E" />
                </div>
                <div className="form-group full">
                  <label htmlFor="aciklama">Ne İşe Yarar? *</label>
                  <input id="aciklama" name="aciklama" className="form-control" required maxLength={200}
                         placeholder="örn. Görünür katmanları birleştir" />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Kısayolu Ekle</button>
              </div>
            </form>
          </details>

          <form className="filter-bar" method="get">
            <select name="program" className="form-control" defaultValue={program ?? ''} aria-label="Program">
              <option value="">Tüm Programlar</option>
              {PROGRAMLAR.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input name="ara" className="form-control" defaultValue={arama}
                   placeholder="Tuş veya açıklamada ara…" aria-label="Ara" style={{ flex: '1 1 200px' }} />
            <button className="btn btn-secondary btn-sm" type="submit">Filtrele</button>
            {(program || arama) && <a className="btn btn-ghost btn-sm" href="/notlar/kisayollar">Temizle</a>}
          </form>

          {kisayollar.length === 0 ? (
            <EmptyState icon="⌨️" title="Kısayol bulunamadı"
                        text={program || arama ? 'Bu filtreye uyan kısayol yok.' : 'Yukarıdan ilk kısayolu ekleyin.'} />
          ) : (
            <div className="card-body" style={{ display: 'grid', gap: 10 }}>
              {kisayollar.map((k) => {
                const benim = k.author_id === user.id;
                const silebilir = benim || user.role === 'admin';
                return (
                  <div key={k.id} className="shortcut-row">
                    <span className={`badge ${PROGRAM_RENK[k.program] ?? 'b-muted'}`} style={{ minWidth: 88, justifyContent: 'center' }}>
                      {k.program}
                    </span>

                    <div className="key-combo">
                      {k.keys.split('+').map((tus, i, arr) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <kbd className="key">{tus}</kbd>
                          {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>+</span>}
                        </span>
                      ))}
                    </div>

                    <span className="shortcut-aciklama">{k.aciklama}</span>

                    <span className="cell-sub" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                      {benim ? 'Sen' : (k.author_name ?? 'Bilinmiyor')}
                    </span>

                    {silebilir && (
                      <form action={deleteShortcut}>
                        <input type="hidden" name="id" value={k.id} />
                        <ConfirmButton soru={`"${k.keys}" kısayolu silinsin mi?`} title="Sil">
                          <Icon name="trash" />
                        </ConfirmButton>
                      </form>
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
