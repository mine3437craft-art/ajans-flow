import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import RehberGorsel from '@/components/RehberGorsel';
import RehberForm from '@/components/RehberForm';
import Vurgu from '@/components/Vurgu';
import AramaKisayolu from '@/components/AramaKisayolu';
import { HashIleAc, HepsiniAcKapa } from '@/components/RehberAcilir';
import { TusGorunumu } from '../kisayollar/ShortcutForm';
import {
  aramaDesenleri, katlanmisKelimeler, vurguDuzenleri, kelimeler, kokOzeti, alinti, BULANIK_ESIK,
} from '@/lib/arama';
import { bolumSirasi } from '@/lib/rehber';
import { createGuide, updateGuide, deleteGuide } from './actions';

export const dynamic = 'force-dynamic';

type Kayit = {
  id: number; slug: string; category: string; section: string; icon: string; title: string;
  summary: string; body: string; steps: string[]; tips: string[]; shortcuts: string[];
  visual: string | null; source_note_ids: number[];
  author_id: number | null; updated_at: string;
  /** 4 başlık, 3 özet, 2 içerik, 1 yakın yazım, 0 arama yok */
  eslesme: number;
};

export default async function RehberPage({
  searchParams,
}: {
  searchParams: Promise<{ ara?: string; bolum?: string }>;
}) {
  const user = await requireUser();
  const { ara, bolum } = await searchParams;
  const arama = (ara ?? '').trim();
  const bolumFiltre = (bolum ?? '').trim();

  // Notlar sayfasıyla aynı arama: kök eşleştirme + yazım hatası payı.
  const desenler = aramaDesenleri(arama);
  const bulanikKelimeler = katlanmisKelimeler(arama);
  const vurgu = vurguDuzenleri(arama);

  const kayitlar = (await sql`
    SELECT id, slug, category, section, icon, title, summary, body, steps, tips, shortcuts,
           visual, source_note_ids, author_id, updated_at,
           CASE
             WHEN cardinality(${desenler}::text[]) = 0 THEN 0
             WHEN tr_fold(title) ~ ALL(${desenler}::text[]) THEN 4
             WHEN tr_fold(title || ' ' || summary) ~ ALL(${desenler}::text[]) THEN 3
             WHEN tr_fold(title || ' ' || summary || ' ' || body || ' '
                          || array_to_string(steps, ' ') || ' ' || array_to_string(tips, ' ')
                          || ' ' || array_to_string(shortcuts, ' '))
                  ~ ALL(${desenler}::text[]) THEN 2
             ELSE 1
           END AS eslesme
    FROM note_guides
    WHERE (${bolumFiltre || null}::text IS NULL OR section = ${bolumFiltre || null})
      AND (
        cardinality(${desenler}::text[]) = 0
        OR tr_fold(title || ' ' || summary || ' ' || body || ' '
                   || array_to_string(steps, ' ') || ' ' || array_to_string(tips, ' ')
                   || ' ' || array_to_string(shortcuts, ' '))
           ~ ALL(${desenler}::text[])
        OR (cardinality(${bulanikKelimeler}::text[]) > 0 AND (
              SELECT bool_and(word_similarity(k, tr_fold(title || ' ' || summary || ' ' || body)) >= ${BULANIK_ESIK})
              FROM unnest(${bulanikKelimeler}::text[]) AS k))
      )
    ORDER BY eslesme DESC, sort_order, id
  `) as Kayit[];

  const bolumler = (await sql`
    SELECT section, COUNT(*)::int AS adet FROM note_guides GROUP BY section
  `) as Array<{ section: string; adet: number }>;
  bolumler.sort((a, b) => bolumSirasi(a.section, b.section));
  const toplam = bolumler.reduce((s, b) => s + b.adet, 0);

  // İçindekiler: bütün başlıklar, bölüm bölüm. Aramadan bağımsız.
  const icindekiler = (await sql`
    SELECT id, section, icon, title FROM note_guides ORDER BY sort_order, id
  `) as Array<{ id: number; section: string; icon: string; title: string }>;
  const tocGruplar = new Map<string, typeof icindekiler>();
  for (const k of icindekiler) {
    if (!tocGruplar.has(k.section)) tocGruplar.set(k.section, []);
    tocGruplar.get(k.section)!.push(k);
  }
  const tocSirali = [...tocGruplar.entries()].sort(([a], [b]) => bolumSirasi(a, b));

  const notSayisi = arama
    ? (((await sql`
        SELECT COUNT(*)::int AS n FROM notes n
        WHERE (n.visibility = 'ekip' OR n.author_id = ${user.id})
          AND tr_fold(n.title || ' ' || n.body) ~ ALL(${desenler}::text[])
      `) as Array<{ n: number }>)[0]?.n ?? 0)
    : 0;

  const yakinEslesme = kayitlar.length > 0 && kayitlar.every((k) => k.eslesme === 1);
  const kokler = kokOzeti(arama);
  const sozcukler = kelimeler(arama);

  // Arama yapılıyor ve az sonuç varsa kartlar açık gelir; çok sonuç varsa
  // kapalı kalır, alıntı satırı hangisine bakılacağını söyler.
  const otomatikAc = arama !== '' && kayitlar.length <= 3;

  // Aramada sıralama alakaya göre; aramasız bölüm bölüm.
  const gruplar: Array<{ bolum: string | null; kayitlar: Kayit[] }> = [];
  if (arama) {
    gruplar.push({ bolum: null, kayitlar });
  } else {
    const m = new Map<string, Kayit[]>();
    for (const k of kayitlar) {
      if (!m.has(k.section)) m.set(k.section, []);
      m.get(k.section)!.push(k);
    }
    for (const [b, ks] of [...m.entries()].sort(([a], [c]) => bolumSirasi(a, c))) {
      gruplar.push({ bolum: b, kayitlar: ks });
    }
  }

  const adres = (degisiklik: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const hepsi: Record<string, string | undefined> = { ara: arama, bolum: bolumFiltre, ...degisiklik };
    for (const [k, v] of Object.entries(hepsi)) if (v) p.set(k, v);
    const q = p.toString();
    return `/notlar/rehber${q ? `?${q}` : ''}`;
  };

  return (
    <>
      <PageHeader title="Düzenlenmiş Notlar" />
      <AramaKisayolu hedefId="ara" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2>Rehber <span className="badge b-muted">{kayitlar.length}{kayitlar.length !== toplam ? ` / ${toplam}` : ''}</span></h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <HepsiniAcKapa />
              <a href="/notlar" className="btn btn-sm btn-secondary">📝 Ham Notlar</a>
              <a href="/notlar/kisayollar" className="btn btn-sm btn-secondary">⌨️ Kısayollar</a>
            </div>
          </div>

          <form className="filter-bar" method="get">
            {bolumFiltre && <input type="hidden" name="bolum" value={bolumFiltre} />}
            <input id="ara" name="ara" className="form-control" defaultValue={arama} autoComplete="off"
                   placeholder="Ne arıyorsun? örn. seçme, maske, fırça büyütme…   ( / tuşuyla buraya gel )"
                   aria-label="Rehberde ara" style={{ flex: '1 1 320px' }} />
            <button className="btn btn-primary btn-sm" type="submit">Ara</button>
            {arama && <a className="btn btn-ghost btn-sm" href={adres({ ara: undefined })}>Temizle</a>}
          </form>

          {arama && (
            <div className="sonuc-ipucu">
              <span>
                <strong>{kayitlar.length}</strong> anlatım bulundu
                {yakinEslesme && ' — tam eşleşme yok, yakın yazımlar gösteriliyor'}
                {!otomatikAc && kayitlar.length > 0 && ' — okumak için satıra tıkla'}
              </span>
              {sozcukler.length > 0 && (
                <span>
                  · aranan kök{sozcukler.length > 1 ? 'ler' : ''}:{' '}
                  {sozcukler.map((sz, i) => <code key={sz}>{sz} → {kokler[i]}…</code>)}
                </span>
              )}
              {notSayisi > 0 && (
                <a href={`/notlar?ara=${encodeURIComponent(arama)}`}>· Ham notlarda {notSayisi} kayıt →</a>
              )}
            </div>
          )}

          <div className="konu-dizini">
            <span className="konu-dizini-baslik">Bölümler</span>
            <a href={adres({ bolum: undefined })} className={`konu ${bolumFiltre === '' ? 'aktif' : ''}`}>
              <span>Tümü</span> <b>{toplam}</b>
            </a>
            {bolumler.map((b) => (
              <a key={b.section} href={adres({ bolum: b.section })}
                 className={`konu ${bolumFiltre === b.section ? 'aktif' : ''}`}>
                <span>{b.section}</span> <b>{b.adet}</b>
              </a>
            ))}
          </div>

          <details style={{ borderTop: '1px solid var(--border)' }}>
            <summary className="acilir-baslik">+ Yeni anlatım ekle</summary>
            <div style={{ padding: '0 20px 20px' }}>
              <RehberForm action={createGuide} etiket="Kaydet" />
            </div>
          </details>
        </div>

        {!arama && !bolumFiltre && icindekiler.length > 0 && (
          <div className="card">
            <div className="card-head">
              <h2>İçindekiler</h2>
              <span className="card-not">Başlığa tıkla, anlatım aşağıda açılır</span>
            </div>
            <div className="icindekiler">
              {tocSirali.map(([b, ks]) => (
                <div className="icindekiler-bolum" key={b}>
                  <h3>{b}</h3>
                  {ks.map((k) => (
                    <a key={k.id} href={`#r-${k.id}`}>
                      <span className="ik" aria-hidden>{k.icon}</span>
                      <span>{k.title}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {kayitlar.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="📚"
              title={arama ? 'Bu aramaya uyan anlatım yok' : 'Henüz anlatım yok'}
              text={arama
                ? 'Kelimenin kökünü ve yakın yazımlarını da denedik. Daha kısa ya da başka bir kelime dene.'
                : 'Yukarıdan ilk anlatımı ekleyebilirsin.'}
            />
          </div>
        ) : (
          gruplar.map((g) => (
            <section key={g.bolum ?? 'arama'}>
              {g.bolum && <h2 className="bolum-baslik">{g.bolum}</h2>}
              {g.kayitlar.map((r) => {
                const yazabilir = user.role === 'admin' || r.author_id === user.id;
                // Başlık/özet zaten eşleşiyorsa alıntıya gerek yok; eşleşme
                // içerideyse hangi cümlede olduğunu satırda göster.
                const alintiMetni = arama && r.eslesme <= 2
                  ? alinti(
                      [r.body, ...r.steps, ...r.tips, ...r.shortcuts].join(' '),
                      vurgu, bulanikKelimeler,
                    )
                  : null;
                return (
                  <details className="rehber-kart" key={r.id} id={`r-${r.id}`} open={otomatikAc || undefined}>
                    <summary className="rehber-ust">
                      <span className="rehber-simge" aria-hidden>{r.icon}</span>
                      <div className="rehber-kimlik">
                        <h2>
                          <Vurgu metin={r.title} desenler={vurgu} kelimeler={bulanikKelimeler} />
                          {r.eslesme === 1 && (
                            <span className="badge b-warning yakin-rozet" style={{ marginLeft: 8 }}>yakın eşleşme</span>
                          )}
                        </h2>
                        {r.summary && (
                          <p className="rehber-ozet">
                            <Vurgu metin={r.summary} desenler={vurgu} kelimeler={bulanikKelimeler} />
                          </p>
                        )}
                        {alintiMetni && (
                          <div className="rehber-alinti">
                            <Vurgu metin={alintiMetni} desenler={vurgu} kelimeler={bulanikKelimeler} />
                          </div>
                        )}
                        <div className="rehber-meta">
                          {r.steps.length > 0 && <span>{r.steps.length} adım</span>}
                          {r.tips.length > 0 && <span>{r.tips.length} ipucu</span>}
                          {r.shortcuts.length > 0 && <span>{r.shortcuts.length} kısayol</span>}
                          {r.visual && <span>görsel anlatım</span>}
                          {arama && <span>{r.section}</span>}
                        </div>
                      </div>
                      <span className="rehber-ok" aria-hidden>▼</span>
                    </summary>

                    <div className="rehber-govde">
                      {r.body.split(/\n{2,}/).filter(Boolean).map((p, i) => (
                        <p key={i}><Vurgu metin={p} desenler={vurgu} kelimeler={bulanikKelimeler} /></p>
                      ))}

                      <RehberGorsel anahtar={r.visual} />

                      {r.steps.length > 0 && (
                        <div className="rehber-blok">
                          <div className="rehber-blok-baslik">Adım adım</div>
                          <ol className="adimlar">
                            {r.steps.map((a, i) => (
                              <li key={i}><Vurgu metin={a} desenler={vurgu} kelimeler={bulanikKelimeler} /></li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {r.tips.length > 0 && (
                        <div className="rehber-blok">
                          <div className="rehber-blok-baslik">İpuçları</div>
                          <ul className="ipuclari">
                            {r.tips.map((t, i) => (
                              <li key={i}><Vurgu metin={t} desenler={vurgu} kelimeler={bulanikKelimeler} /></li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {r.shortcuts.length > 0 && (
                        <div className="rehber-blok">
                          <div className="rehber-blok-baslik" style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                            <span>Kısayollar</span>
                            <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>
                              Mac&apos;te Ctrl → Cmd, Alt → Option
                            </span>
                          </div>
                          <div className="rehber-kisayollar">
                            {r.shortcuts.map((k, i) => {
                              const [tus, ...geri] = k.split('|');
                              const aciklama = geri.join('|').trim();
                              return (
                                <div className="rehber-kisayol" key={i}>
                                  <TusGorunumu keys={tus.trim()} />
                                  {aciklama && (
                                    <span className="shortcut-aciklama">
                                      <Vurgu metin={aciklama} desenler={vurgu} kelimeler={bulanikKelimeler} />
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="rehber-govde-alt">
                        <span className="rehber-kaynak" style={{ margin: 0, padding: 0, border: 0 }}>
                          {r.source_note_ids.length > 0
                            ? <>Kaynak: Beyza&apos;nın {r.source_note_ids.length} ham notu — asılları <a href="/notlar">Notlar</a>&apos;da.</>
                            : <>{r.category} · {r.section}</>}
                        </span>
                        {yazabilir && (
                          <form action={deleteGuide}>
                            <input type="hidden" name="id" value={r.id} />
                            <ConfirmButton soru={`"${r.title}" anlatımı silinsin mi?`} title="Sil">
                              <Icon name="trash" />
                            </ConfirmButton>
                          </form>
                        )}
                      </div>

                      {yazabilir && (
                        <details className="rehber-duzenle">
                          <summary>Bu anlatımı düzenle</summary>
                          <div style={{ marginTop: 12 }}>
                            <RehberForm action={updateGuide} etiket="Güncelle" kayit={r} />
                          </div>
                        </details>
                      )}
                    </div>
                  </details>
                );
              })}
            </section>
          ))
        )}
      </div>
      {/* Sayfa sonunda: <details> ögeleri DOM'a girmiş olsun */}
      <HashIleAc />
    </>
  );
}
