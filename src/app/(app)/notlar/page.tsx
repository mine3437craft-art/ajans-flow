import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import Vurgu from '@/components/Vurgu';
import AramaKisayolu from '@/components/AramaKisayolu';
import {
  aramaDesenleri, katlanmisKelimeler, vurguDuzenleri, kelimeler, kokOzeti, BULANIK_ESIK,
} from '@/lib/arama';
import { createNote, updateNote, deleteNote, togglePin } from './actions';

export const dynamic = 'force-dynamic';

type NoteRow = {
  id: number; title: string; body: string; visibility: string;
  is_pinned: boolean; author_id: number | null;
  author_name: string | null; updated_at: string;
  /** 3 başlıkta, 2 içerikte, 1 bulanık (yazım hatası), 0 arama yok */
  eslesme: number;
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
  searchParams: Promise<{ ara?: string; kim?: string; konu?: string }>;
}) {
  const user = await requireUser();
  const { ara, kim, konu } = await searchParams;
  const arama = (ara ?? '').trim();
  const konuAnahtari = (konu ?? '').trim();

  // Google mantığı: her kelime köküne indirilir ve "bu kökle başlayan
  // kelime" aranır ("seçme" → seçim, seçili, seçenek). Hiçbir şey çıkmazsa
  // yazım hatası payıyla (pg_trgm) yakın kelimeler denenir. Başlıkta
  // eşleşen önce, içerikte eşleşen sonra, yakın eşleşme en sonda.
  const desenler = aramaDesenleri(arama);
  const bulanikKelimeler = katlanmisKelimeler(arama);
  const vurgu = vurguDuzenleri(arama);

  // Görünürlük kuralı tek yerde: ekip notları herkese açık,
  // kişisel notları yalnızca yazan görür (yönetici dahil kimse göremez).
  const notes = (await sql`
    SELECT n.id, n.title, n.body, n.visibility, n.is_pinned, n.author_id,
           u.display_name AS author_name, n.updated_at,
           CASE
             WHEN cardinality(${desenler}::text[]) = 0 THEN 0
             WHEN tr_fold(n.title) ~ ALL(${desenler}::text[]) THEN 3
             WHEN tr_fold(n.title || ' ' || n.body) ~ ALL(${desenler}::text[]) THEN 2
             ELSE 1
           END AS eslesme
    FROM notes n
    LEFT JOIN users u ON u.id = n.author_id
    WHERE (n.visibility = 'ekip' OR n.author_id = ${user.id})
      AND (${konuAnahtari || null}::text IS NULL OR tr_fold(n.title) = ${konuAnahtari || null})
      AND (${kim ?? null}::text IS NULL
           OR (${kim ?? null} = 'benim' AND n.author_id = ${user.id})
           OR (${kim ?? null} = 'kisisel' AND n.visibility = 'kisisel' AND n.author_id = ${user.id})
           OR (${kim ?? null} = 'ekip' AND n.visibility = 'ekip'))
      AND (
        cardinality(${desenler}::text[]) = 0
        OR tr_fold(n.title || ' ' || n.body) ~ ALL(${desenler}::text[])
        OR (cardinality(${bulanikKelimeler}::text[]) > 0 AND (
              SELECT bool_and(word_similarity(k, tr_fold(n.title || ' ' || n.body)) >= ${BULANIK_ESIK})
              FROM unnest(${bulanikKelimeler}::text[]) AS k))
      )
    ORDER BY eslesme DESC, n.is_pinned DESC, n.updated_at DESC
  `) as NoteRow[];

  // Konu dizini: aynı başlıkla girilen notlar tek çatı altında (LAYER ×6).
  const konular = (await sql`
    SELECT tr_fold(n.title) AS anahtar, MIN(n.title) AS baslik, COUNT(*)::int AS adet
    FROM notes n
    WHERE (n.visibility = 'ekip' OR n.author_id = ${user.id})
    GROUP BY tr_fold(n.title)
    ORDER BY adet DESC, MIN(n.title)
    LIMIT 40
  `) as Array<{ anahtar: string; baslik: string; adet: number }>;

  // Ham not → düzenlenmiş anlatım köprüsü.
  const rehberler = (await sql`
    SELECT id, title, source_note_ids FROM note_guides WHERE cardinality(source_note_ids) > 0
  `) as Array<{ id: number; title: string; source_note_ids: number[] }>;
  const rehberHaritasi = new Map<number, { id: number; title: string }>();
  for (const r of rehberler) {
    for (const nid of r.source_note_ids) {
      if (!rehberHaritasi.has(nid)) rehberHaritasi.set(nid, { id: r.id, title: r.title });
    }
  }

  const rehberSayisi = arama
    ? (((await sql`
        SELECT COUNT(*)::int AS n FROM note_guides
        WHERE tr_fold(title || ' ' || summary || ' ' || body || ' '
                      || array_to_string(steps, ' ') || ' ' || array_to_string(tips, ' '))
              ~ ALL(${desenler}::text[])
      `) as Array<{ n: number }>)[0]?.n ?? 0)
    : 0;

  const yakinEslesme = notes.length > 0 && notes.every((n) => n.eslesme === 1);
  const kokler = kokOzeti(arama);
  const sozcukler = kelimeler(arama);

  /** Mevcut parametreleri koruyarak yeni adres üretir; boş değer parametreyi düşürür. */
  const adres = (degisiklik: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const hepsi: Record<string, string | undefined> = { ara: arama, kim, konu: konuAnahtari, ...degisiklik };
    for (const [k, v] of Object.entries(hepsi)) if (v) p.set(k, v);
    const q = p.toString();
    return `/notlar${q ? `?${q}` : ''}`;
  };

  const filtreler = [
    { k: '', l: 'Tümü' },
    { k: 'ekip', l: 'Ekip Notları' },
    { k: 'benim', l: 'Benim Notlarım' },
    { k: 'kisisel', l: 'Sadece Ben' },
  ];

  const aktifKonu = konular.find((k) => k.anahtar === konuAnahtari);

  return (
    <>
      <PageHeader title="Notlar" />
      <AramaKisayolu hedefId="ara" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>Not Defteri <span className="badge b-muted">{notes.length}</span></h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {filtreler.map((f) => (
                <a key={f.k} href={adres({ kim: f.k || undefined })}
                   className={`btn btn-sm ${(kim ?? '') === f.k ? 'btn-primary' : 'btn-secondary'}`}>
                  {f.l}
                </a>
              ))}
              <a href="/notlar/rehber" className="btn btn-sm btn-secondary">📚 Düzenlenmiş Notlar</a>
              <a href="/notlar/kisayollar" className="btn btn-sm btn-secondary">⌨️ Kısayollar</a>
            </div>
          </div>

          <form className="filter-bar" method="get">
            {kim && <input type="hidden" name="kim" value={kim} />}
            {konuAnahtari && <input type="hidden" name="konu" value={konuAnahtari} />}
            <input
              id="ara" name="ara" className="form-control" defaultValue={arama} autoComplete="off"
              placeholder="Ne arıyorsun? örn. seçme, maske, fırça büyütme…   ( / tuşuyla buraya gel )"
              aria-label="Notlarda ara" style={{ flex: '1 1 320px' }}
            />
            <button className="btn btn-primary btn-sm" type="submit">Ara</button>
            {arama && <a className="btn btn-ghost btn-sm" href={adres({ ara: undefined })}>Temizle</a>}
          </form>

          {arama && (
            <div className="sonuc-ipucu">
              <span>
                <strong>{notes.length}</strong> not bulundu
                {yakinEslesme && ' — tam eşleşme yok, yakın yazımlar gösteriliyor'}
              </span>
              {sozcukler.length > 0 && (
                <span>
                  · aranan kök{sozcukler.length > 1 ? 'ler' : ''}:{' '}
                  {sozcukler.map((s, i) => (
                    <code key={s}>{s} → {kokler[i]}…</code>
                  ))}
                </span>
              )}
              {rehberSayisi > 0 && (
                <a href={`/notlar/rehber?ara=${encodeURIComponent(arama)}`}>
                  · Düzenlenmiş Notlar&apos;da {rehberSayisi} anlatım →
                </a>
              )}
            </div>
          )}

          {konular.length > 1 && (() => {
            // En çok not girilen 10 konu her zaman görünür; gerisi katlanır.
            // Beyza her nota ayrı başlık attığı için liste hızla uzuyor.
            const digerleri = konular.filter((k) => k.anahtar !== konuAnahtari);
            const one = digerleri.slice(0, 10);
            const geri = digerleri.slice(10);
            const cip = (k: { anahtar: string; baslik: string; adet: number }) => (
              <a key={k.anahtar} href={adres({ konu: k.anahtar })} className="konu" title={k.baslik}>
                <span>{k.baslik}</span> <b>{k.adet}</b>
              </a>
            );
            return (
              <div className="konu-dizini">
                <span className="konu-dizini-baslik">Konular · {konular.length}</span>
                {aktifKonu && (
                  <a href={adres({ konu: undefined })} className="konu aktif" title="Konu filtresini kaldır">
                    <span>{aktifKonu.baslik}</span> <b>×</b>
                  </a>
                )}
                {one.map(cip)}
                {geri.length > 0 && (
                  <details className="konu-daha">
                    <summary className="konu">+{geri.length} konu daha</summary>
                    <div className="konu-daha-liste">{geri.map(cip)}</div>
                  </details>
                )}
              </div>
            );
          })()}

          <details style={{ borderBottom: '1px solid var(--border)' }}>
            <summary className="acilir-baslik">+ Yeni Not</summary>
            <form action={createNote} style={{ padding: '0 20px 20px' }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="title">Başlık *</label>
                  <input id="title" name="title" className="form-control" required maxLength={200}
                         placeholder="Konu adı — aynı konuya yeni not girerken aynı başlığı kullan" />
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
              icon="🔍"
              title={arama ? 'Bu aramaya uyan not yok' : 'Henüz not yok'}
              text={arama
                ? 'Kelimenin kökünü ve yakın yazımlarını da denedik. Daha kısa ya da başka bir kelime dene.'
                : 'Yukarıdaki “Yeni Not” ile başlayın.'}
            />
          </div>
        ) : (
          <div className="grid-2">
            {notes.map((n) => {
              const benim = n.author_id === user.id;
              const yazabilir = benim || (user.role === 'admin' && n.visibility === 'ekip');
              const rehber = rehberHaritasi.get(n.id);
              return (
                <div className="card" key={n.id}>
                  <div className="card-head">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      {n.is_pinned && <Icon name="pin" style={{ width: 14, height: 14, color: 'var(--primary)' }} />}
                      <Vurgu metin={n.title} desenler={vurgu} kelimeler={bulanikKelimeler} />
                      {n.eslesme === 1 && <span className="badge b-warning yakin-rozet">yakın eşleşme</span>}
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
                      <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                        <Vurgu metin={n.body} desenler={vurgu} kelimeler={bulanikKelimeler} />
                      </p>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>(boş)</p>
                    )}

                    {rehber && (
                      <a className="not-rehber-baglanti" href={`/notlar/rehber#r-${rehber.id}`}
                         title="Bu notun düzenlenmiş, uzun anlatımlı hâli">
                        📚 Düzenlenmiş hâli: {rehber.title}
                      </a>
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
