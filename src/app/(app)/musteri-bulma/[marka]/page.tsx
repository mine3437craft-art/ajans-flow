import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import AdayEkleBar from '@/components/AdayEkleBar';
import AdayListesi, { type AdayRow, type Sablon } from '@/components/AdayListesi';
import AramaKisayolu from '@/components/AramaKisayolu';
import { aramaDesenleri } from '@/lib/arama';
import {
  MARKALAR, markaBul, DURUMLAR, DURUM_HARITA, ACIK_DURUMLAR, HEMEN_ARANACAK,
  EK_ALANLAR, EKSIKLER, eksikBul, saklanirEksik, SEKTORLER, gecerliDurum, gecerliUcDurum, gecerliSektor,
  bugun, type EkAlanAnahtari,
} from '@/lib/adaylar';
import {
  adayEkle, alanGuncelle, sonucKaydet, notEkle, adaySil, adayGuncelle, geriAl,
  sonNotDuzenle, notDuzenle, notSil, tekrarAranacak, topluGuncelle, topluSil, mesajKaydet,
} from './actions';

export const dynamic = 'force-dynamic';

type Sayim = { status: string; adet: number };

export default async function MusteriBulmaPage({
  params, searchParams,
}: {
  params: Promise<{ marka: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { marka: markaYolu } = await params;
  const marka = markaBul(markaYolu);
  // Bilinmeyen liste adresi: sayfa akış hâlinde başladığı için gerçek
  // yönlendirme proxy'de; burası yedek.
  if (!marka) redirect('/');

  const user = await requireUser();
  if (user.role === 'caller' && markaYolu !== 'minikstarlar') {
    redirect('/musteri-bulma/minikstarlar');
  }
  const isAdmin = user.role === 'admin';
  const sp = await searchParams;

  const arama = (sp.ara ?? '').trim();
  const durumFiltre = sp.durum ?? 'acik';
  const gorunum = sp.gorunum ?? '';
  const sorumluFiltre = sp.sorumlu ?? '';
  const sirala = sp.sirala ?? 'sira';
  const acikSatir = /^\d+$/.test(sp.ac ?? '') ? parseInt(sp.ac!, 10) : null;
  // Panodan doğrudan "sonucu gir" bağlantısı verilebilsin.
  const sonucSatir = /^\d+$/.test(sp.sonuc ?? '') ? parseInt(sp.sonuc!, 10) : null;
  const limit = Math.min(400, Math.max(50, parseInt(sp.adet ?? '100', 10) || 100));

  // Ek alan filtreleri (web / ajans / sosyal): yalnızca bu listede
  // kullanılan alanlar dikkate alınır. SQL'de sütun adı parametre
  // olamadığı için üçü ayrı değişkende.
  const ekFiltre = (ek: EkAlanAnahtari) => {
    const v = sp[ek] ?? '';
    return marka.ekAlanlar.includes(ek) && gecerliUcDurum(v) ? v : '';
  };
  const webFiltre = ekFiltre('web');
  const ajansFiltre = ekFiltre('ajans');
  const sosyalFiltre = ekFiltre('sosyal');
  // Analiz filtreleri (Ajans Flow): tek eksik ve sektör. "Web sitesi yok"
  // eksiği has_website sütunundan okunur (bkz. EKSIKLER sanal).
  const eksikFiltre = marka.analiz && eksikBul(sp.eksik) ? sp.eksik! : '';
  const eksikDiziFiltre = saklanirEksik(eksikFiltre) ? eksikFiltre : '';
  const eksikWebFiltre = eksikFiltre === 'web_yok';
  const sektorFiltre = marka.analiz && gecerliSektor(sp.sektor) ? sp.sektor! : '';

  const desenler = aramaDesenleri(arama);
  // Aramada 3+ rakam varsa numara olarak da denenir: "532 123" da bulur.
  const rakamlar = arama.replace(/\D/g, '').replace(/^0+/, '').replace(/^90/, '');
  const numaraArama = rakamlar.length >= 3 ? rakamlar : null;

  const b = bugun();
  const tekDurum = gecerliDurum(durumFiltre) ? durumFiltre : null;
  const sadeceAcik = durumFiltre === 'acik';
  const sorumluId = /^\d+$/.test(sorumluFiltre) ? parseInt(sorumluFiltre, 10) : null;

  const [satirlar, sayimlar, ozet, personel, kaynaklar, hafta, sablonlar, analizSayim] = await Promise.all([
    sql`
      SELECT p.id::int AS id, p.name, p.contact_person, p.phone_raw, p.phone_norm, p.phone_kind,
             p.city, p.source, p.link, p.status, p.next_call_on, p.assigned_to,
             p.call_count, p.unreached_streak, p.last_call_at, p.last_note,
             p.has_website, p.worked_with_agency, p.social_active, p.created_at,
             p.instagram, p.ig_followers, p.sector, p.gaps, p.share_code,
             p.site_views, p.site_last_view_at,
             s.display_name AS sorumlu_ad,
             son.id::int AS son_olay_id,
             son.kind AS son_olay_tur,
             son.channel AS son_olay_kanal,
             son.created_at AS son_olay_zaman,
             son.status_after AS son_olay_durum,
             o.display_name AS son_olay_kisi,
             (son.user_id = ${user.id} AND son.prev IS NOT NULL
              AND son.created_at > NOW() - INTERVAL '15 minutes') AS geri_alinabilir,
             (son.kind IN ('arama', 'mesaj') AND son.user_id <> ${user.id}
              AND son.created_at > NOW() - INTERVAL '30 minutes') AS baskasi_aradi,
             EXISTS (SELECT 1 FROM prospects d
                     WHERE d.phone_norm = p.phone_norm AND d.brand <> p.brand
                       AND p.phone_norm IS NOT NULL) AS diger_listede
      FROM prospects p
      LEFT JOIN users s ON s.id = p.assigned_to
      LEFT JOIN LATERAL (
        SELECT e.id, e.kind, e.channel, e.user_id, e.prev, e.created_at, e.status_after
        FROM prospect_events e WHERE e.prospect_id = p.id
        ORDER BY e.id DESC LIMIT 1
      ) son ON TRUE
      LEFT JOIN users o ON o.id = son.user_id
      WHERE p.brand = ${marka.anahtar}
        AND (${sadeceAcik}::boolean = FALSE OR p.status = ANY(${ACIK_DURUMLAR}::text[]))
        AND (${tekDurum}::text IS NULL OR p.status = ${tekDurum}::text)
        AND (${gorunum}::text <> 'bugun' OR (
              p.status = ANY(${ACIK_DURUMLAR}::text[])
              AND (p.status = ANY(${HEMEN_ARANACAK}::text[]) OR p.next_call_on <= ${b}::date)))
        AND (${sorumluFiltre}::text = '' OR
             (${sorumluFiltre} = 'ben' AND p.assigned_to = ${user.id}) OR
             (${sorumluFiltre} = 'atanmamis' AND p.assigned_to IS NULL) OR
             (${sorumluId}::int IS NOT NULL AND p.assigned_to = ${sorumluId}::int))
        AND (${webFiltre}::text = '' OR p.has_website = ${webFiltre}::text)
        AND (${ajansFiltre}::text = '' OR p.worked_with_agency = ${ajansFiltre}::text)
        AND (${sosyalFiltre}::text = '' OR p.social_active = ${sosyalFiltre}::text)
        AND (${eksikDiziFiltre}::text = '' OR ${eksikDiziFiltre}::text = ANY(p.gaps))
        AND (${eksikWebFiltre}::boolean = FALSE OR p.has_website = 'yok')
        AND (${sektorFiltre}::text = '' OR p.sector = ${sektorFiltre}::text)
        AND (
          cardinality(${desenler}::text[]) = 0
          OR tr_fold(p.name || ' ' || COALESCE(p.contact_person, '') || ' '
                     || COALESCE(p.city, '') || ' ' || COALESCE(p.source, '') || ' '
                     || COALESCE(p.instagram, '') || ' '
                     || COALESCE(p.last_note, '')) ~ ALL(${desenler}::text[])
          OR (${numaraArama}::text IS NOT NULL AND p.phone_norm LIKE ${'%' + (numaraArama ?? '') + '%'})
        )
      ORDER BY
        CASE ${sirala}::text WHEN 'yeni' THEN 0 WHEN 'son' THEN 1 WHEN 'ad' THEN 2
                             WHEN 'firsat' THEN 4 WHEN 'ilgi' THEN 5 ELSE 3 END,
        -- Fırsat: en çok eksiği olan (web sitesi yokluğu dahil) önce
        CASE WHEN ${sirala}::text = 'firsat'
             THEN cardinality(p.gaps) + (p.has_website = 'yok')::int END DESC NULLS LAST,
        -- İlgi: kişisel sunumu en son açan önce
        CASE WHEN ${sirala}::text = 'ilgi' THEN p.site_last_view_at END DESC NULLS LAST,
        CASE WHEN ${sirala}::text = 'yeni' THEN p.created_at END DESC NULLS LAST,
        CASE WHEN ${sirala}::text = 'son' THEN son.created_at END DESC NULLS LAST,
        CASE WHEN ${sirala}::text = 'ad' THEN tr_fold(p.name) END ASC NULLS LAST,
        -- varsayılan: elle kuyruğa alınanlar ve tarihi gelenler önce,
        -- sonra hiç aranmayanlar, sonra ileri tarihliler
        CASE
          WHEN p.next_call_on IS NOT NULL AND p.next_call_on <= ${b}::date THEN 0
          WHEN p.status = 'aranmadi' THEN 1
          WHEN p.next_call_on IS NOT NULL THEN 2
          ELSE 3
        END,
        p.next_call_on NULLS LAST,
        p.created_at
      LIMIT ${limit}
    ` as Promise<AdayRow[]>,
    sql`SELECT status, COUNT(*)::int AS adet FROM prospects WHERE brand = ${marka.anahtar} GROUP BY status` as Promise<Sayim[]>,
    sql`
      SELECT COUNT(*)::int AS toplam,
             COUNT(*) FILTER (WHERE status = ANY(${ACIK_DURUMLAR}::text[])
                              AND (status = ANY(${HEMEN_ARANACAK}::text[]) OR next_call_on <= ${b}::date))::int AS bugun,
             COUNT(*) FILTER (WHERE status = ANY(${ACIK_DURUMLAR}::text[])
                              AND next_call_on < ${b}::date)::int AS gecikmis,
             COUNT(*) FILTER (WHERE has_website = 'yok')::int AS websiz
      FROM prospects WHERE brand = ${marka.anahtar}
    ` as Promise<Array<{ toplam: number; bugun: number; gecikmis: number; websiz: number }>>,
    sql`SELECT id, display_name FROM users WHERE is_active ORDER BY display_name` as
      Promise<Array<{ id: number; display_name: string }>>,
    sql`
      SELECT DISTINCT source FROM prospects
      WHERE brand = ${marka.anahtar} AND source IS NOT NULL ORDER BY source LIMIT 50
    ` as Promise<Array<{ source: string }>>,
    sql`
      SELECT u.display_name, COUNT(*)::int AS adet
      FROM prospect_events e JOIN users u ON u.id = e.user_id
      WHERE e.brand = ${marka.anahtar} AND e.kind IN ('arama', 'mesaj')
        AND e.created_at >= ((${b}::date - INTERVAL '6 days') AT TIME ZONE 'Europe/Istanbul')
      GROUP BY u.display_name ORDER BY adet DESC
    ` as Promise<Array<{ display_name: string; adet: number }>>,
    sql`
      SELECT id, title, body, sets_status FROM prospect_templates
      WHERE brand = ${marka.anahtar} ORDER BY sort_order, id
    ` as Promise<Sablon[]>,
    // Filtre çiplerindeki sayılar: eksik başına ve sektör başına aday.
    marka.analiz
      ? (sql`
          SELECT 'eksik' AS tur, g AS anahtar, COUNT(*)::int AS adet
          FROM prospects, unnest(gaps) AS g WHERE brand = ${marka.anahtar} GROUP BY g
          UNION ALL
          SELECT 'sektor', sector, COUNT(*)::int FROM prospects
          WHERE brand = ${marka.anahtar} AND sector IS NOT NULL GROUP BY sector
          UNION ALL
          SELECT 'izlendi', 'sunum', COUNT(*)::int FROM prospects
          WHERE brand = ${marka.anahtar} AND site_views > 0
        ` as Promise<Array<{ tur: string; anahtar: string; adet: number }>>)
      : Promise.resolve([] as Array<{ tur: string; anahtar: string; adet: number }>),
  ]);

  const sayimHarita = new Map(sayimlar.map((s) => [s.status, s.adet]));
  const analizHarita = new Map(analizSayim.map((a) => [`${a.tur}:${a.anahtar}`, a.adet]));
  const o = ozet[0] ?? { toplam: 0, bugun: 0, gecikmis: 0, websiz: 0 };
  const haftaToplam = hafta.reduce((t, h) => t + h.adet, 0);

  const gecmis = acikSatir
    ? ((await sql`
        SELECT e.id::int AS id, e.kind, e.channel, e.status_before, e.status_after, e.next_call_on,
               e.note, e.created_at, e.user_id, e.edited_at,
               u.display_name AS kisi, ed.display_name AS duzenleyen
        FROM prospect_events e
        LEFT JOIN users u ON u.id = e.user_id
        LEFT JOIN users ed ON ed.id = e.edited_by
        WHERE e.prospect_id = ${acikSatir}
          AND EXISTS (SELECT 1 FROM prospects p WHERE p.id = ${acikSatir} AND p.brand = ${marka.anahtar})
        ORDER BY e.id DESC LIMIT 60
      `) as Array<{
        id: number; kind: string; channel: string | null; status_before: string | null;
        status_after: string | null; next_call_on: string | null; note: string | null;
        created_at: string; user_id: number | null; edited_at: string | null;
        kisi: string | null; duzenleyen: string | null;
      }>)
    : [];

  const adres = (degisiklik: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const hepsi: Record<string, string | undefined> = {
      ara: arama || undefined, durum: durumFiltre === 'acik' ? undefined : durumFiltre,
      gorunum: gorunum || undefined, sorumlu: sorumluFiltre || undefined,
      web: webFiltre || undefined, ajans: ajansFiltre || undefined, sosyal: sosyalFiltre || undefined,
      eksik: eksikFiltre || undefined, sektor: sektorFiltre || undefined,
      sirala: sirala === 'sira' ? undefined : sirala,
      ...degisiklik,
    };
    for (const [k, v] of Object.entries(hepsi)) if (v) p.set(k, v);
    const q = p.toString();
    return `/musteri-bulma/${marka.yol}${q ? `?${q}` : ''}`;
  };

  const cip = (aktif: boolean) => `btn btn-sm ${aktif ? 'btn-primary' : 'btn-secondary'}`;
  const filtreVar = Boolean(arama || gorunum || sorumluFiltre || webFiltre || ajansFiltre
    || sosyalFiltre || eksikFiltre || sektorFiltre || durumFiltre !== 'acik');

  // Huni: açık aşamalar soldan sağa, sonra sonuçlar. Genişlik adaya oranlı.
  const huni = DURUMLAR.map((d) => ({ ...d, adet: sayimHarita.get(d.anahtar) ?? 0 }));
  const huniToplam = Math.max(1, huni.reduce((t, h) => t + h.adet, 0));

  return (
    <>
      <PageHeader title={`${marka.ad} — Müşteri Bulma`} />
      <AramaKisayolu hedefId="ara" />
      <div className="content">
        <div className="aday-ust">
          <a href={adres({ gorunum: gorunum === 'bugun' ? undefined : 'bugun', durum: undefined })}
             className={`aday-bugun${gorunum === 'bugun' ? ' secili' : ''}`}>
            <span className="aday-bugun-sayi">{o.bugun}</span>
            <span className="aday-bugun-etiket">
              bugün aranacak
              {o.gecikmis > 0 && <em> · {o.gecikmis} gecikmiş</em>}
            </span>
          </a>

          <div className="huni" aria-label="Aday hunisi">
            <div className="huni-serit">
              {huni.filter((h) => h.adet > 0).map((h) => (
                <a key={h.anahtar} href={adres({ durum: durumFiltre === h.anahtar ? undefined : h.anahtar, gorunum: undefined })}
                   className={`huni-dilim d-${h.anahtar}${durumFiltre === h.anahtar ? ' secili' : ''}`}
                   style={{ flexGrow: h.adet / huniToplam }}
                   title={`${h.ad}: ${h.adet}`} />
              ))}
            </div>
            <div className="huni-etiketler">
              {huni.map((h) => (
                <a key={h.anahtar}
                   href={adres({ durum: durumFiltre === h.anahtar ? undefined : h.anahtar, gorunum: undefined })}
                   className={`huni-etiket${durumFiltre === h.anahtar ? ' secili' : ''}${h.adet === 0 ? ' bos' : ''}`}
                   title={h.aciklama}>
                  <i className={`huni-nokta d-${h.anahtar}`} aria-hidden />
                  {h.ad} <b>{h.adet}</b>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>
              {marka.ad} Adayları <span className="badge b-muted">{satirlar.length}{satirlar.length !== o.toplam ? ` / ${o.toplam}` : ''}</span>
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={`/musteri-bulma/${marka.yol}/sablonlar`} className="btn btn-sm btn-secondary">
                💬 Mesaj şablonları <b style={{ opacity: .6 }}>{sablonlar.length}</b>
              </a>
              {marka.analiz && (
                <a href="/tanitim" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary"
                   title="Müşterilere gönderilen tanıtım sitesi">
                  🌐 Tanıtım sitesi
                </a>
              )}
              <a href={`/musteri-bulma/${marka.yol}/ice-aktar`} className="btn btn-sm btn-secondary">
                📋 Excel&apos;den yapıştır
              </a>
              {isAdmin && (
                <a href={`/musteri-bulma/${marka.yol}/disa-aktar${adres({}).replace(/^[^?]*/, '')}`}
                   className="btn btn-sm btn-secondary" title="Ekranda görünen filtreyle indirir">
                  ⬇ Excel&apos;e aktar
                </a>
              )}
              {MARKALAR.filter((m) => m.anahtar !== marka.anahtar).map((m) => (
                <a key={m.anahtar} href={`/musteri-bulma/${m.yol}`} className="btn btn-sm btn-ghost">
                  {m.ad} →
                </a>
              ))}
            </div>
          </div>

          {haftaToplam > 0 && (
            <div className="sonuc-ipucu">
              <span>Son 7 gün: <strong>{haftaToplam} arama / mesaj</strong></span>
              {/* Kişi bazlı sayılar ekip arkadaşının performansı: yalnızca yöneticide */}
              {isAdmin && hafta.length > 0 && <span>· {hafta.map((h) => `${h.display_name} ${h.adet}`).join(' · ')}</span>}
              {o.websiz > 0 && marka.ekAlanlar.includes('web') && (
                <a href={adres({ web: webFiltre === 'yok' ? undefined : 'yok' })}>
                  · Web sitesi olmayan {o.websiz} aday →
                </a>
              )}
            </div>
          )}

          <AdayEkleBar
            action={adayEkle}
            marka={marka.yol}
            kaynaklar={kaynaklar.map((k) => k.source)}
            personel={personel}
            ekAlanlar={marka.ekAlanlar}
            analiz={marka.analiz}
            bastaAcik={o.toplam === 0}
          />

          <form className="filter-bar" method="get">
            {durumFiltre !== 'acik' && <input type="hidden" name="durum" value={durumFiltre} />}
            {gorunum && <input type="hidden" name="gorunum" value={gorunum} />}
            {sorumluFiltre && <input type="hidden" name="sorumlu" value={sorumluFiltre} />}
            {webFiltre && <input type="hidden" name="web" value={webFiltre} />}
            {ajansFiltre && <input type="hidden" name="ajans" value={ajansFiltre} />}
            {sosyalFiltre && <input type="hidden" name="sosyal" value={sosyalFiltre} />}
            {eksikFiltre && <input type="hidden" name="eksik" value={eksikFiltre} />}
            {sektorFiltre && <input type="hidden" name="sektor" value={sektorFiltre} />}
            {sirala !== 'sira' && <input type="hidden" name="sirala" value={sirala} />}
            <input id="ara" name="ara" className="form-control" defaultValue={arama} autoComplete="off"
                   placeholder="İsim, telefon, Instagram veya notta ara…   ( / tuşuyla buraya gel )"
                   aria-label="Adaylarda ara" style={{ flex: '1 1 280px' }} />
            <button className="btn btn-primary btn-sm" type="submit">Ara</button>
            {arama && <a className="btn btn-ghost btn-sm" href={adres({ ara: undefined })}>Temizle</a>}
          </form>

          {/* Filtre uygulanmışsa açık, temiz listede kapalı gelir. */}
          <details open={filtreVar} className="filtre-katlanir">
            <summary className="acilir-baslik">Filtreler{filtreVar ? ' · açık' : ''}</summary>
            <div className="konu-dizini">
              <span className="konu-dizini-baslik">Durum</span>
              <a href={adres({ durum: undefined, gorunum: undefined })} className={cip(durumFiltre === 'acik' && !gorunum)}>
                Açık olanlar
              </a>
              <a href={adres({ durum: 'tumu', gorunum: undefined })} className={cip(durumFiltre === 'tumu')}>
                Tümü <b>{o.toplam}</b>
              </a>
              {DURUMLAR.map((d) => (
                <a key={d.anahtar} href={adres({ durum: d.anahtar, gorunum: undefined })}
                   className={cip(durumFiltre === d.anahtar)} title={d.aciklama}>
                  {d.ad} <b>{sayimHarita.get(d.anahtar) ?? 0}</b>
                </a>
              ))}
            </div>
            <div className="konu-dizini">
              <span className="konu-dizini-baslik">Kime ait</span>
              <a href={adres({ sorumlu: undefined })} className={cip(!sorumluFiltre)}>Herkes</a>
              <a href={adres({ sorumlu: 'ben' })} className={cip(sorumluFiltre === 'ben')}>Bana ait</a>
              <a href={adres({ sorumlu: 'atanmamis' })} className={cip(sorumluFiltre === 'atanmamis')}>Atanmamış</a>
              {personel.filter((p) => p.id !== user.id).map((p) => (
                <a key={p.id} href={adres({ sorumlu: String(p.id) })} className={cip(sorumluFiltre === String(p.id))}>
                  {p.display_name}
                </a>
              ))}
            </div>
            {marka.ekAlanlar.length > 0 && (
              <div className="konu-dizini">
                {marka.ekAlanlar.map((ek) => {
                  const alan = EK_ALANLAR[ek];
                  const secili = ekFiltre(ek);
                  return (
                    <span key={ek} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginRight: 10 }}>
                      <span className="konu-dizini-baslik" style={{ flexBasis: 'auto', margin: 0 }}>
                        {alan.simge} {alan.baslik}
                      </span>
                      {(['var', 'yok'] as const).map((v) => (
                        <a key={v} href={adres({ [ek]: secili === v ? undefined : v })} className={cip(secili === v)}>
                          {alan.etiket[v].kisa}
                        </a>
                      ))}
                    </span>
                  );
                })}
              </div>
            )}
            {marka.analiz && (
              <>
                <div className="konu-dizini">
                  <span className="konu-dizini-baslik">Eksiği olanlar</span>
                  {EKSIKLER.map((e) => {
                    const adet = e.sanal === 'web' ? o.websiz : analizHarita.get(`eksik:${e.anahtar}`) ?? 0;
                    if (adet === 0 && eksikFiltre !== e.anahtar) return null;
                    return (
                      <a key={e.anahtar} href={adres({ eksik: eksikFiltre === e.anahtar ? undefined : e.anahtar })}
                         className={cip(eksikFiltre === e.anahtar)}>
                        {e.simge} {e.ad} <b>{adet}</b>
                      </a>
                    );
                  })}
                  {EKSIKLER.every((e) => (e.sanal === 'web' ? o.websiz : analizHarita.get(`eksik:${e.anahtar}`) ?? 0) === 0) && (
                    <span className="cell-sub">Henüz eksik işaretlenmedi — tablodaki &ldquo;Analiz et&rdquo;e dokun.</span>
                  )}
                </div>
                {SEKTORLER.some((x) => analizHarita.has(`sektor:${x.anahtar}`)) && (
                  <div className="konu-dizini">
                    <span className="konu-dizini-baslik">Sektör</span>
                    {SEKTORLER.filter((x) => analizHarita.has(`sektor:${x.anahtar}`) || sektorFiltre === x.anahtar).map((x) => (
                      <a key={x.anahtar} href={adres({ sektor: sektorFiltre === x.anahtar ? undefined : x.anahtar })}
                         className={cip(sektorFiltre === x.anahtar)}>
                        {x.simge} {x.ad} <b>{analizHarita.get(`sektor:${x.anahtar}`) ?? 0}</b>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="konu-dizini">
              <span className="konu-dizini-baslik">Sırala</span>
              {[
                { k: 'sira', l: 'Aranacak sırası' }, { k: 'son', l: 'Son işlem' },
                { k: 'yeni', l: 'En yeni eklenen' }, { k: 'ad', l: 'Ada göre' },
                ...(marka.analiz ? [
                  { k: 'firsat', l: 'En çok eksiği olan' },
                  { k: 'ilgi', l: `Sunuma bakanlar${analizHarita.get('izlendi:sunum') ? ` (${analizHarita.get('izlendi:sunum')})` : ''}` },
                ] : []),
              ].map((x) => (
                <a key={x.k} href={adres({ sirala: x.k === 'sira' ? undefined : x.k })} className={cip(sirala === x.k)}>
                  {x.l}
                </a>
              ))}
            </div>
          </details>

          {satirlar.length === 0 ? (
            <EmptyState
              icon="📞"
              title={filtreVar ? 'Bu filtreye uyan aday yok' : 'Henüz aday yok'}
              text={filtreVar ? 'Filtreleri temizleyip tekrar dene.' : 'Yukarıdan tek tek ekle ya da Excel listeni yapıştır.'}
            />
          ) : (
            <AdayListesi
              satirlar={satirlar}
              marka={{ yol: marka.yol, ad: marka.ad, ekAlanlar: marka.ekAlanlar, analiz: marka.analiz }}
              personel={personel}
              kullanici={{ id: user.id, ad: user.display_name, yonetici: isAdmin }}
              sablonlar={sablonlar}
              arama={arama}
              bugunTarih={b}
              acikSatir={acikSatir}
              baslangicSonuc={sonucSatir}
              gecmis={gecmis}
              adres={adres({})}
              eylemler={{
                alanGuncelle, sonucKaydet, notEkle, adaySil, adayGuncelle, geriAl,
                sonNotDuzenle, notDuzenle, notSil, tekrarAranacak, topluGuncelle, topluSil, mesajKaydet,
              }}
            />
          )}

          {satirlar.length >= limit && limit < 400 && (
            <div style={{ padding: '14px 20px', textAlign: 'center' }}>
              <a className="btn btn-secondary btn-sm" href={adres({ adet: String(limit + 100) })}>
                100 tane daha göster
              </a>
            </div>
          )}
        </div>

        {!isAdmin && (
          <p className="cell-sub" style={{ marginTop: 8 }}>
            <Icon name="lock" style={{ width: 12, height: 12, verticalAlign: '-1px' }} />{' '}
            Kalıcı silme ve Excel&apos;e aktarma yöneticide.
          </p>
        )}
      </div>
    </>
  );
}
