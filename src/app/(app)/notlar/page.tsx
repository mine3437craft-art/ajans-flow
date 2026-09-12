import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import Vurgu from '@/components/Vurgu';
import AramaKisayolu from '@/components/AramaKisayolu';
import {
  aramaDesenleri, katlanmisKelimeler, vurguDuzenleri, kelimeler, kokOzeti, BULANIK_ESIK, alinti
} from '@/lib/arama';
import { createNote, updateNote, deleteNote, togglePin } from './actions';

export const dynamic = 'force-dynamic';

type NoteRow = {
  id: number; title: string; body: string; visibility: string;
  is_pinned: boolean; author_id: number | null;
  author_name: string | null; updated_at: string;
  eslesme: number;
};

function zaman(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric'
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

  const desenler = aramaDesenleri(arama);
  const bulanikKelimeler = katlanmisKelimeler(arama);
  const vurgu = vurguDuzenleri(arama);

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

  const konular = (await sql`
    SELECT tr_fold(n.title) AS anahtar, MIN(n.title) AS baslik, COUNT(*)::int AS adet
    FROM notes n
    WHERE (n.visibility = 'ekip' OR n.author_id = ${user.id})
    GROUP BY tr_fold(n.title)
    ORDER BY adet DESC, MIN(n.title)
    LIMIT 40
  `) as Array<{ anahtar: string; baslik: string; adet: number }>;

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

  const adres = (degisiklik: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const hepsi: Record<string, string | undefined> = { ara: arama, kim, konu: konuAnahtari, ...degisiklik };
    for (const [k, v] of Object.entries(hepsi)) if (v) p.set(k, v);
    const q = p.toString();
    return q ? `/notlar?${q}` : '/notlar';
  };

  const filtreler = [
    { k: '', l: 'Tümü' },
    { k: 'ekip', l: 'Ekip Notları' },
    { k: 'benim', l: 'Benim Notlarım' },
    { k: 'kisisel', l: 'Sadece Ben' },
  ];

  const aktifKonu = konular.find((k) => k.anahtar === konuAnahtari);
  
  // Ana sayfa (arama yokken)
  const renderAnaSayfa = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '0 20px' }}>
      <h1 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--primary)', marginBottom: '30px', letterSpacing: '-1.5px' }}>
        Notlar
      </h1>
      
      <form method="get" style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 20, top: 20, color: 'var(--text-muted)' }}>
            <Icon name="search" style={{ width: 20, height: 20 }} />
          </div>
          <input
            id="ara" name="ara" className="form-control" defaultValue={arama} autoComplete="off"
            placeholder="Ne arıyorsun? örn. seçme, maske, fırça büyütme…"
            style={{ 
              width: '100%', padding: '18px 24px 18px 54px', fontSize: '16px', 
              borderRadius: '30px', border: '1px solid var(--border)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)', outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button className="btn btn-primary" type="submit" style={{ padding: '10px 24px', borderRadius: '24px' }}>Google'da Ara gibi Ara</button>
          <a href="/notlar/rehber" className="btn btn-secondary" style={{ padding: '10px 24px', borderRadius: '24px' }}>📚 Düzenlenmiş Notlar</a>
        </div>
      </form>

      <div style={{ marginTop: '40px', textAlign: 'center', maxWidth: 640 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Sık Aranan Konular</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {konular.slice(0, 10).map(k => (
            <a key={k.anahtar} href={adres({ konu: k.anahtar })} className="badge b-muted" style={{ padding: '6px 12px', fontSize: 13, borderRadius: 16 }}>
              {k.baslik}
            </a>
          ))}
        </div>
      </div>

      <details style={{ marginTop: '60px', width: '100%', maxWidth: '640px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>
          + Yeni Not Ekle
        </summary>
        <form action={createNote} style={{ padding: '0 20px 20px' }}>
          <div className="form-grid">
            <div className="form-group full">
              <label htmlFor="title">Başlık *</label>
              <input id="title" name="title" className="form-control" required maxLength={200}
                     placeholder="Konu adı — aynı konuya yeni not girerken aynı başlığı kullan" />
            </div>
            <div className="form-group full">
              <label htmlFor="body">Not</label>
              <textarea id="body" name="body" className="form-control" rows={4}
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
  );

  // Arama sonuçları sayfası
  const renderSonuclar = () => (
    <div className="content" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: 20 }}>
      {/* Üst Arama Çubuğu */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 30 }}>
        <h2 style={{ margin: 0, fontSize: 24, color: 'var(--primary)' }}><a href="/notlar" style={{ color: 'inherit', textDecoration: 'none' }}>Notlar</a></h2>
        <form method="get" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          {kim && <input type="hidden" name="kim" value={kim} />}
          {konuAnahtari && <input type="hidden" name="konu" value={konuAnahtari} />}
          <input
            id="ara" name="ara" className="form-control" defaultValue={arama} autoComplete="off"
            style={{ width: '100%', padding: '12px 20px 12px 20px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
          />
          <button type="submit" style={{ position: 'absolute', right: 6, top: 6, bottom: 6, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 20, padding: '0 16px', cursor: 'pointer' }}>Ara</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filtreler.map((f) => (
          <a key={f.k} href={adres({ kim: f.k || undefined })}
             className={`btn btn-sm ${(kim ?? '') === f.k ? 'btn-primary' : 'btn-secondary'}`}
             style={{ borderRadius: 16 }}>
            {f.l}
          </a>
        ))}
      </div>

      <div className="sonuc-ipucu" style={{ marginBottom: 30, paddingBottom: 16, borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
        <span>
          Yaklaşık <strong>{notes.length}</strong> sonuç bulundu ({yakinEslesme ? 'yakın eşleşme' : 'tam eşleşme'})
        </span>
        {sozcukler.length > 0 && (
          <span style={{ marginLeft: 12 }}>
            · kökler: {sozcukler.map((s, i) => (
              <span key={s} style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: 4, marginRight: 4 }}>{s} → {kokler[i]}</span>
            ))}
          </span>
        )}
      </div>

      {/* Rehber Öne Çıkan Sonucu */}
      {rehberSayisi > 0 && (
        <div style={{ padding: '16px 20px', background: 'var(--info-bg)', border: '1px solid var(--info)', borderRadius: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>📚</span>
            <h3 style={{ margin: 0, fontSize: 16, color: 'var(--info)' }}>Düzenlenmiş Not (Rehber) Sonuçları</h3>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
            Aradığınız konuyla ilgili profesyonelce hazırlanmış detaylı bir rehber bulunuyor.
          </p>
          <a href={`/notlar/rehber?ara=${encodeURIComponent(arama)}`} className="btn btn-sm btn-primary" style={{ background: 'var(--info)', borderColor: 'var(--info)' }}>
            Rehbere Git ({rehberSayisi} sonuç) →
          </a>
        </div>
      )}

      {/* Sonuç Listesi */}
      {notes.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Aradığınız kelimeyle ilgili not bulunamadı."
          text="Yazım kurallarını kontrol edin veya daha genel kelimeler arayın."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {notes.map((n) => {
            const benim = n.author_id === user.id;
            const yazabilir = benim || (user.role === 'admin' && n.visibility === 'ekip');
            const rehber = rehberHaritasi.get(n.id);
            
            // Sadece snippet (alıntı) oluştur
            const snippet = arama ? (alinti(n.body, vurgu, bulanikKelimeler, 120) || n.body.slice(0, 200) + '...') : n.body;

            return (
              <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>{n.author_name ?? 'Bilinmiyor'}</span>
                  <span>·</span>
                  <span>{zaman(n.updated_at)}</span>
                  {n.visibility === 'kisisel' && <span className="badge b-warning" style={{ fontSize: 10, padding: '2px 6px' }}>Sadece ben</span>}
                </div>
                
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: 'var(--primary)' }}>
                  <Vurgu metin={n.title} desenler={vurgu} kelimeler={bulanikKelimeler} />
                  {n.eslesme === 1 && <span className="badge b-warning" style={{ marginLeft: 8, fontSize: 11 }}>yakın</span>}
                </h3>
                
                <p style={{ margin: 0, fontSize: 14, lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                  <Vurgu metin={snippet} desenler={vurgu} kelimeler={bulanikKelimeler} />
                </p>

                {rehber && (
                  <div style={{ marginTop: 4 }}>
                    <a href={`/notlar/rehber#r-${rehber.id}`} style={{ fontSize: 13, color: 'var(--info)', textDecoration: 'none', fontWeight: 500 }}>
                      ↳ Düzenlenmiş Hali: {rehber.title}
                    </a>
                  </div>
                )}
                
                {yazabilir && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}>Düzenle / Sil</summary>
                    <div style={{ padding: 12, marginTop: 8, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <form action={updateNote} style={{ marginBottom: 12 }}>
                        <input type="hidden" name="id" value={n.id} />
                        <div className="form-grid">
                          <div className="form-group full">
                            <label>Başlık</label>
                            <input name="title" className="form-control" defaultValue={n.title} required />
                          </div>
                          <div className="form-group full">
                            <label>Not</label>
                            <textarea name="body" className="form-control" rows={4} defaultValue={n.body} />
                          </div>
                        </div>
                        <button className="btn btn-primary btn-sm" type="submit">Güncelle</button>
                      </form>
                      <form action={deleteNote}>
                        <input type="hidden" name="id" value={n.id} />
                        <button className="btn btn-danger btn-sm" type="submit">Sil</button>
                      </form>
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title={!arama ? '' : 'Notlar Arama'} />
      <AramaKisayolu hedefId="ara" />
      {!arama && !konuAnahtari && !kim ? renderAnaSayfa() : renderSonuclar()}
    </>
  );
}
