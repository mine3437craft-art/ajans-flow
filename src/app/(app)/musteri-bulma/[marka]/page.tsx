import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import AdayEkleBar from '@/components/AdayEkleBar';
import AdayListesi, { type AdayRow } from '@/components/AdayListesi';
import AramaKisayolu from '@/components/AramaKisayolu';
import { aramaDesenleri, katlanmisKelimeler } from '@/lib/arama';
import { trFold } from '@/lib/arama';
import {
  MARKALAR, markaBul, digerMarka, DURUMLAR, DURUM_HARITA, ACIK_DURUMLAR,
  EK_ALANLAR, gecerliDurum, bugun,
} from '@/lib/adaylar';
import { adayEkle, alanGuncelle, sonucKaydet, notEkle, adaySil, adayGuncelle, geriAl } from './actions';

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
  // Bilinmeyen liste adresi: notFound() burada 404 gövdesini 200 durumuyla
  // döndürüyordu (sayfa akış hâlinde başlıyor), o yüzden panoya yolluyoruz.
  if (!marka) redirect('/');

  const user = await requireUser();
  const isAdmin = user.role === 'admin';
  const sp = await searchParams;

  const arama = (sp.ara ?? '').trim();
  const durumFiltre = sp.durum ?? 'acik';
  const gorunum = sp.gorunum ?? '';
  const sorumluFiltre = sp.sorumlu ?? '';
  const webFiltre = sp.web ?? '';
  const ajansFiltre = sp.ajans ?? '';
  const sirala = sp.sirala ?? 'sira';
  const acikSatir = /^\d+$/.test(sp.ac ?? '') ? parseInt(sp.ac!, 10) : null;
  // Panodan / bugün listesinden doğrudan "sonucu gir" bağlantısı verilebilsin.
  const sonucSatir = /^\d+$/.test(sp.sonuc ?? '') ? parseInt(sp.sonuc!, 10) : null;
  const limit = Math.min(400, Math.max(50, parseInt(sp.adet ?? '100', 10) || 100));

  const desenler = aramaDesenleri(arama);
  // Aramada 3+ rakam varsa numara olarak da denenir: "532 123" da bulur.
  const rakamlar = arama.replace(/\D/g, '').replace(/^0+/, '').replace(/^90/, '');
  const numaraArama = rakamlar.length >= 3 ? rakamlar : null;

  const b = bugun();
  const tekDurum = gecerliDurum(durumFiltre) ? durumFiltre : null;
  const sadeceAcik = durumFiltre === 'acik';
  const sorumluId = /^\d+$/.test(sorumluFiltre) ? parseInt(sorumluFiltre, 10) : null;

  const satirlar = (await sql`
    SELECT p.id::int AS id, p.name, p.contact_person, p.phone_raw, p.phone_norm, p.phone_kind,
           p.city, p.source, p.link, p.status, p.next_call_on, p.assigned_to,
           p.call_count, p.unreached_streak, p.last_call_at, p.last_note,
           p.has_website, p.worked_with_agency, p.created_at,
           s.display_name AS sorumlu_ad,
           a.display_name AS son_arayan,
           son.id::int AS son_olay_id,
           son.kind AS son_olay_tur,
           o.display_name AS son_olay_kisi,
           (son.user_id = ${user.id} AND son.prev IS NOT NULL
            AND son.created_at > NOW() - INTERVAL '15 minutes') AS geri_alinabilir,
           (son.kind = 'arama' AND son.user_id <> ${user.id}
            AND son.created_at > NOW() - INTERVAL '30 minutes') AS baskasi_aradi,
           EXISTS (SELECT 1 FROM prospects d
                   WHERE d.phone_norm = p.phone_norm AND d.brand <> p.brand
                     AND p.phone_norm IS NOT NULL) AS diger_listede
    FROM prospects p
    LEFT JOIN users s ON s.id = p.assigned_to
    LEFT JOIN users a ON a.id = p.last_call_by
    LEFT JOIN LATERAL (
      SELECT e.id, e.kind, e.user_id, e.prev, e.created_at
      FROM prospect_events e WHERE e.prospect_id = p.id
      ORDER BY e.id DESC LIMIT 1
    ) son ON TRUE
    LEFT JOIN users o ON o.id = son.user_id
    WHERE p.brand = ${marka.anahtar}
      AND (${sadeceAcik}::boolean = FALSE OR p.status = ANY(${ACIK_DURUMLAR}::text[]))
      AND (${tekDurum}::text IS NULL OR p.status = ${tekDurum}::text)
      AND (${gorunum}::text <> 'bugun' OR (
            p.status = ANY(${ACIK_DURUMLAR}::text[])
            AND (p.next_call_on <= ${b}::date OR p.status = 'aranmadi')))
      AND (${sorumluFiltre}::text = '' OR
           (${sorumluFiltre} = 'ben' AND p.assigned_to = ${user.id}) OR
           (${sorumluFiltre} = 'atanmamis' AND p.assigned_to IS NULL) OR
           (${sorumluId}::int IS NOT NULL AND p.assigned_to = ${sorumluId}::int))
      AND (${webFiltre}::text = '' OR p.has_website = ${webFiltre}::text)
      AND (${ajansFiltre}::text = '' OR p.worked_with_agency = ${ajansFiltre}::text)
      AND (
        cardinality(${desenler}::text[]) = 0
        OR tr_fold(p.name || ' ' || COALESCE(p.contact_person, '') || ' '
                   || COALESCE(p.city, '') || ' ' || COALESCE(p.source, '') || ' '
                   || COALESCE(p.last_note, '')) ~ ALL(${desenler}::text[])
        OR (${numaraArama}::text IS NOT NULL AND p.phone_norm LIKE ${'%' + (numaraArama ?? '') + '%'})
      )
    ORDER BY
      CASE ${sirala}::text
        WHEN 'yeni' THEN 0 WHEN 'son' THEN 1 WHEN 'ad' THEN 2 ELSE 3 END,
      -- 'yeni'
      CASE WHEN ${sirala}::text = 'yeni' THEN p.created_at END DESC NULLS LAST,
      -- 'son' (en son aranan)
      CASE WHEN ${sirala}::text = 'son' THEN p.last_call_at END DESC NULLS LAST,
      -- 'ad'
      CASE WHEN ${sirala}::text = 'ad' THEN tr_fold(p.name) END ASC NULLS LAST,
      -- varsayılan: önce gecikenler ve bugün, sonra hiç aranmayanlar
      CASE
        WHEN p.next_call_on IS NOT NULL AND p.next_call_on <= ${b}::date THEN 0
        WHEN p.next_call_on IS NOT NULL THEN 1
        WHEN p.status = 'aranmadi' THEN 2
        ELSE 3
      END,
      p.next_call_on NULLS LAST,
      p.created_at
    LIMIT ${limit}
  `) as AdayRow[];

  const [sayimlar, ozet, personel, kaynaklar, hafta] = await Promise.all([
    sql`SELECT status, COUNT(*)::int AS adet FROM prospects WHERE brand = ${marka.anahtar} GROUP BY status` as Promise<Sayim[]>,
    sql`
      SELECT COUNT(*)::int AS toplam,
             COUNT(*) FILTER (WHERE status = ANY(${ACIK_DURUMLAR}::text[])
                              AND (next_call_on <= ${b}::date OR status = 'aranmadi'))::int AS bugun,
             COUNT(*) FILTER (WHERE status = ANY(${ACIK_DURUMLAR}::text[])
                              AND next_call_on < ${b}::date)::int AS gecikmis,
             COUNT(*) FILTER (WHERE has_website = 'yok')::int AS websiz
      FROM prospects WHERE brand = ${marka.anahtar}
    ` as Promise<Array<{ toplam: number; bugun: number; gecikmis: number; websiz: number }>>,
    // Listeler herkese açık: bütün aktif kullanıcılar sorumlu olabilir.
    sql`
      SELECT id, display_name FROM users WHERE is_active ORDER BY display_name
    ` as Promise<Array<{ id: number; display_name: string }>>,
    sql`
      SELECT DISTINCT source FROM prospects
      WHERE brand = ${marka.anahtar} AND source IS NOT NULL ORDER BY source LIMIT 50
    ` as Promise<Array<{ source: string }>>,
    sql`
      SELECT u.display_name, COUNT(*)::int AS adet
      FROM prospect_events e JOIN users u ON u.id = e.user_id
      WHERE e.brand = ${marka.anahtar} AND e.kind = 'arama'
        AND e.created_at >= ((${b}::date - INTERVAL '6 days') AT TIME ZONE 'Europe/Istanbul')
      GROUP BY u.display_name ORDER BY adet DESC
    ` as Promise<Array<{ display_name: string; adet: number }>>,
  ]);

  const sayimHarita = new Map(sayimlar.map((s) => [s.status, s.adet]));
  const o = ozet[0] ?? { toplam: 0, bugun: 0, gecikmis: 0, websiz: 0 };
  const haftaToplam = hafta.reduce((t, h) => t + h.adet, 0);

  const gecmis = acikSatir
    ? ((await sql`
        SELECT e.id::int AS id, e.kind, e.channel, e.status_before, e.status_after, e.next_call_on,
               e.note, e.created_at, u.display_name AS kisi
        FROM prospect_events e LEFT JOIN users u ON u.id = e.user_id
        WHERE e.prospect_id = ${acikSatir}
          AND EXISTS (SELECT 1 FROM prospects p WHERE p.id = ${acikSatir} AND p.brand = ${marka.anahtar})
        ORDER BY e.id DESC LIMIT 50
      `) as Array<{
        id: number; kind: string; channel: string | null; status_before: string | null;
        status_after: string | null; next_call_on: string | null; note: string | null;
        created_at: string; kisi: string | null;
      }>)
    : [];

  const adres = (degisiklik: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const hepsi: Record<string, string | undefined> = {
      ara: arama || undefined, durum: durumFiltre === 'acik' ? undefined : durumFiltre,
      gorunum: gorunum || undefined, sorumlu: sorumluFiltre || undefined,
      web: webFiltre || undefined, ajans: ajansFiltre || undefined,
      sirala: sirala === 'sira' ? undefined : sirala,
      ...degisiklik,
    };
    for (const [k, v] of Object.entries(hepsi)) if (v) p.set(k, v);
    const q = p.toString();
    return `/musteri-bulma/${marka.yol}${q ? `?${q}` : ''}`;
  };

  const cip = (aktif: boolean) => `btn btn-sm ${aktif ? 'btn-primary' : 'btn-secondary'}`;
  const filtreVar = Boolean(arama || gorunum || sorumluFiltre || webFiltre || ajansFiltre
    || durumFiltre !== 'acik');

  return (
    <>
      <PageHeader title={`${marka.ad} — Müşteri Bulma`} />
      <AramaKisayolu hedefId="ara" />
      <div className="content">

        <div className="stat-grid aday-stat">
          <a href={adres({ gorunum: gorunum === 'bugun' ? undefined : 'bugun', durum: undefined })}
             className="stat-card aday-tile">
            <div className="stat-icon i-primary"><Icon name="clock" /></div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{o.bugun}</div>
            <div className="stat-label">
              Bugün Aranacak
              {o.gecikmis > 0 && <span style={{ color: 'var(--danger)' }}> · {o.gecikmis} gecikmiş</span>}
            </div>
          </a>
          {(['aranmadi', 'dusunuyor', 'olumlu', 'musteri_oldu'] as const).map((d) => (
            <a key={d} href={adres({ durum: durumFiltre === d ? undefined : d, gorunum: undefined })}
               className="stat-card aday-tile">
              <div className={`stat-icon ${d === 'musteri_oldu' ? 'i-success' : d === 'olumlu' ? 'i-success' : d === 'dusunuyor' ? 'i-info' : 'i-warning'}`}>
                <Icon name={d === 'musteri_oldu' ? 'check' : d === 'aranmadi' ? 'users' : 'target'} />
              </div>
              <div className="stat-value">{sayimHarita.get(d) ?? 0}</div>
              <div className="stat-label">{DURUM_HARITA[d].ad}</div>
            </a>
          ))}
        </div>

        <div className="card">
          <div className="card-head">
            <h2>
              {marka.ad} Adayları <span className="badge b-muted">{satirlar.length}{satirlar.length !== o.toplam ? ` / ${o.toplam}` : ''}</span>
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {MARKALAR.filter((m) => m.anahtar !== marka.anahtar).map((m) => (
                <a key={m.anahtar} href={`/musteri-bulma/${m.yol}`} className="btn btn-sm btn-secondary">
                  {m.ad} listesi →
                </a>
              ))}
              <a href={`/musteri-bulma/${marka.yol}/ice-aktar`} className="btn btn-sm btn-secondary">
                📋 Excel&apos;den yapıştır
              </a>
              {isAdmin && (
                <a href={`/musteri-bulma/${marka.yol}/disa-aktar${adres({}).replace(/^[^?]*/, '')}`}
                   className="btn btn-sm btn-secondary"
                   title="Ekranda görünen filtreyle indirir">⬇ Excel&apos;e aktar</a>
              )}
            </div>
          </div>

          {haftaToplam > 0 && (
            <div className="sonuc-ipucu">
              <span>Son 7 gün: <strong>{haftaToplam} arama</strong></span>
              {isAdmin && hafta.length > 0 && (
                <span>· {hafta.map((h) => `${h.display_name} ${h.adet}`).join(' · ')}</span>
              )}
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
          />

          <form className="filter-bar" method="get">
            {durumFiltre !== 'acik' && <input type="hidden" name="durum" value={durumFiltre} />}
            {gorunum && <input type="hidden" name="gorunum" value={gorunum} />}
            {sorumluFiltre && <input type="hidden" name="sorumlu" value={sorumluFiltre} />}
            {webFiltre && <input type="hidden" name="web" value={webFiltre} />}
            {ajansFiltre && <input type="hidden" name="ajans" value={ajansFiltre} />}
            {sirala !== 'sira' && <input type="hidden" name="sirala" value={sirala} />}
            <input id="ara" name="ara" className="form-control" defaultValue={arama} autoComplete="off"
                   placeholder="İsim, telefon veya notta ara…   ( / tuşuyla buraya gel )"
                   aria-label="Adaylarda ara" style={{ flex: '1 1 280px' }} />
            <button className="btn btn-primary btn-sm" type="submit">Ara</button>
            {arama && <a className="btn btn-ghost btn-sm" href={adres({ ara: undefined })}>Temizle</a>}
          </form>

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
            {marka.ekAlanlar.map((ek) => {
              const alan = EK_ALANLAR[ek];
              const secili = ek === 'web' ? webFiltre : ajansFiltre;
              return (
                <span key={ek} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                  <span className="konu-dizini-baslik" style={{ flexBasis: 'auto', margin: 0 }}>
                    {alan.simge} {alan.baslik}
                  </span>
                  {(['var', 'yok'] as const).map((v) => (
                    <a key={v}
                       href={adres({ [ek]: secili === v ? undefined : v })}
                       className={cip(secili === v)}>
                      {alan.etiket[v].kisa}
                    </a>
                  ))}
                </span>
              );
            })}
          </div>

          {satirlar.length === 0 ? (
            <EmptyState
              icon="📞"
              title={filtreVar ? 'Bu filtreye uyan aday yok' : 'Henüz aday yok'}
              text={filtreVar
                ? 'Filtreleri temizleyip tekrar dene.'
                : 'Yukarıdan tek tek ekle ya da Excel listeni yapıştır.'}
            />
          ) : (
            <AdayListesi
              satirlar={satirlar}
              marka={{ yol: marka.yol, ad: marka.ad, ekAlanlar: marka.ekAlanlar }}
              personel={personel}
              kullaniciId={user.id}
              isAdmin={isAdmin}
              arama={arama}
              bugunTarih={b}
              acikSatir={acikSatir}
              baslangicSonuc={sonucSatir}
              gecmis={gecmis}
              adres={adres({})}
              alanGuncelle={alanGuncelle}
              sonucKaydet={sonucKaydet}
              notEkle={notEkle}
              adaySil={adaySil}
              adayGuncelle={adayGuncelle}
              geriAl={geriAl}
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
      </div>
    </>
  );
}
