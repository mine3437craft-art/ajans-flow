import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import RehberGorsel from '@/components/RehberGorsel';
import RehberForm from '@/components/RehberForm';
import { createGuide, updateGuide, deleteGuide } from './actions';

export const dynamic = 'force-dynamic';

type Kayit = {
  id: number; slug: string; category: string; icon: string; title: string;
  summary: string; body: string; steps: string[]; tips: string[];
  visual: string | null; source_note_ids: number[];
  author_id: number | null; updated_at: string;
};

export default async function RehberPage({
  searchParams,
}: {
  searchParams: Promise<{ ara?: string; kategori?: string }>;
}) {
  const user = await requireUser();
  const { ara, kategori } = await searchParams;
  const arama = (ara ?? '').trim();
  const kat = (kategori ?? '').trim();

  // Arama tr_fold ile: büyük harfli metinlerde ILIKE Türkçe İ/I yüzünden
  // eşleşmiyordu. Adımların ve ipuçlarının içinde de arıyoruz.
  const kayitlar = (await sql`
    SELECT id, slug, category, icon, title, summary, body, steps, tips,
           visual, source_note_ids, author_id, updated_at
    FROM note_guides
    WHERE (${arama || null}::text IS NULL
           OR tr_fold(title)   LIKE tr_fold(${'%' + arama + '%'})
           OR tr_fold(summary) LIKE tr_fold(${'%' + arama + '%'})
           OR tr_fold(body)    LIKE tr_fold(${'%' + arama + '%'})
           OR tr_fold(array_to_string(steps, ' ')) LIKE tr_fold(${'%' + arama + '%'})
           OR tr_fold(array_to_string(tips,  ' ')) LIKE tr_fold(${'%' + arama + '%'}))
      AND (${kat || null}::text IS NULL OR category = ${kat || null})
    ORDER BY sort_order, id
  `) as Kayit[];

  const kategoriler = (await sql`
    SELECT category, COUNT(*)::int AS adet FROM note_guides GROUP BY category ORDER BY category
  `) as Array<{ category: string; adet: number }>;

  const toplam = kategoriler.reduce((s, k) => s + k.adet, 0);

  return (
    <>
      <PageHeader title="Düzenlenmiş Notlar" />
      <div className="content">
        <div className="alert alert-info">
          <Icon name="note" style={{ width: 17, height: 17, flexShrink: 0 }} />
          <span>
            Ekibin <a href="/notlar" style={{ fontWeight: 600 }}>Notlar</a>&apos;daki ham
            kayıtları olduğu gibi duruyor — buraya dokunulmadı. Burası aynı bilginin
            düzenlenmiş, uzun anlatımlı ve doğruluğu kontrol edilmiş hâli.
          </span>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Rehber <span className="badge b-muted">{kayitlar.length}</span></h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={`/notlar/rehber${arama ? `?ara=${encodeURIComponent(arama)}` : ''}`}
                 className={`btn btn-sm ${kat === '' ? 'btn-primary' : 'btn-secondary'}`}>
                Tümü {toplam > 0 && `(${toplam})`}
              </a>
              {kategoriler.map((c) => (
                <a key={c.category}
                   href={`/notlar/rehber?${new URLSearchParams({
                     kategori: c.category, ...(arama ? { ara: arama } : {}),
                   })}`}
                   className={`btn btn-sm ${kat === c.category ? 'btn-primary' : 'btn-secondary'}`}>
                  {c.category} ({c.adet})
                </a>
              ))}
            </div>
          </div>

          <form className="filter-bar" method="get">
            {kat && <input type="hidden" name="kategori" value={kat} />}
            <input name="ara" className="form-control" defaultValue={arama}
                   placeholder="Rehberde ara — örn. maske, çözünürlük, katman…"
                   aria-label="Rehberde ara" style={{ flex: '1 1 240px' }} />
            <button className="btn btn-secondary btn-sm" type="submit">Ara</button>
            {arama && (
              <a className="btn btn-ghost btn-sm"
                 href={`/notlar/rehber${kat ? `?kategori=${encodeURIComponent(kat)}` : ''}`}>
                Temizle
              </a>
            )}
          </form>

          <details style={{ borderTop: '1px solid var(--border)' }}>
            <summary className="acilir-baslik">+ Yeni anlatım ekle</summary>
            <div style={{ padding: '0 20px 20px' }}>
              <RehberForm action={createGuide} etiket="Kaydet" />
            </div>
          </details>
        </div>

        {kayitlar.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="📚"
              title={arama ? 'Aramaya uyan anlatım yok' : 'Henüz anlatım yok'}
              text={arama ? 'Başka bir kelime dene.' : 'Yukarıdan ilk anlatımı ekleyebilirsin.'}
            />
          </div>
        ) : (
          kayitlar.map((r) => {
            const yazabilir = user.role === 'admin' || r.author_id === user.id;
            return (
              <article className="rehber-kart" key={r.id}>
                <header className="rehber-ust">
                  <span className="rehber-simge" aria-hidden>{r.icon}</span>
                  <div className="rehber-kimlik">
                    <h2>{r.title}</h2>
                    {r.summary && <p className="rehber-ozet">{r.summary}</p>}
                  </div>
                  <span className="badge b-primary">{r.category}</span>
                  {yazabilir && (
                    <form action={deleteGuide}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmButton soru={`"${r.title}" anlatımı silinsin mi?`} title="Sil">
                        <Icon name="trash" />
                      </ConfirmButton>
                    </form>
                  )}
                </header>

                <div className="rehber-govde">
                  {r.body.split(/\n{2,}/).filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}

                  <RehberGorsel anahtar={r.visual} />

                  {r.steps.length > 0 && (
                    <div className="rehber-blok">
                      <div className="rehber-blok-baslik">Adım adım</div>
                      <ol className="adimlar">
                        {r.steps.map((a, i) => <li key={i}>{a}</li>)}
                      </ol>
                    </div>
                  )}

                  {r.tips.length > 0 && (
                    <div className="rehber-blok">
                      <div className="rehber-blok-baslik">İpuçları</div>
                      <ul className="ipuclari">
                        {r.tips.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}

                  {r.source_note_ids.length > 0 && (
                    <p className="rehber-kaynak">
                      Kaynak: Beyza&apos;nın {r.source_note_ids.length} ham notu — asılları
                      {' '}<a href="/notlar">Notlar</a>&apos;da duruyor.
                    </p>
                  )}

                  {yazabilir && (
                    <details className="rehber-duzenle">
                      <summary>Bu anlatımı düzenle</summary>
                      <div style={{ marginTop: 12 }}>
                        <RehberForm action={updateGuide} etiket="Güncelle" kayit={r} />
                      </div>
                    </details>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
