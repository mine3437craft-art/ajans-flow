import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import SablonDuzenleyici from '@/components/aday/SablonDuzenleyici';
import TanitimAyarlari from '@/components/aday/TanitimAyarlari';
import { markaBul } from '@/lib/adaylar';
import { TANITIM_WHATSAPP_ANAHTARI } from '@/lib/tanitim';
import { sablonKaydet, sablonSil, tanitimAyarKaydet } from '../actions';

export const dynamic = 'force-dynamic';

export default async function SablonlarPage({ params }: { params: Promise<{ marka: string }> }) {
  const { marka: yol } = await params;
  const marka = markaBul(yol);
  if (!marka) redirect('/');
  const user = await requireUser();
  if (user.role === 'caller' && marka.anahtar !== 'minikstarlar') redirect('/musteri-bulma/minikstarlar');

  const [sablonlar, ornek, tanitimWa] = await Promise.all([
    sql`
      SELECT t.id, t.title, t.body, t.sets_status, t.created_by, u.display_name AS yazan
      FROM prospect_templates t LEFT JOIN users u ON u.id = t.created_by
      WHERE t.brand = ${marka.anahtar} ORDER BY t.sort_order, t.id
    ` as Promise<Array<{
      id: number; title: string; body: string; sets_status: string | null;
      created_by: number | null; yazan: string | null;
    }>>,
    // Ön izlemede gerçek bir adayla doldurulmuş hâli görünsün: tercihen
    // yetkilisi ve eksikleri girilmiş biri.
    sql`
      SELECT name, contact_person, gaps, has_website, share_code FROM prospects
      WHERE brand = ${marka.anahtar}
      ORDER BY (contact_person IS NOT NULL)::int + (cardinality(gaps) > 0)::int DESC, id DESC
      LIMIT 1
    ` as Promise<Array<{
      name: string; contact_person: string | null; gaps: string[];
      has_website: 'bilinmiyor' | 'var' | 'yok'; share_code: string | null;
    }>>,
    marka.analiz
      ? (sql`SELECT deger FROM app_config WHERE anahtar = ${TANITIM_WHATSAPP_ANAHTARI}` as
          Promise<Array<{ deger: string }>>)
      : Promise.resolve([] as Array<{ deger: string }>),
  ]);

  const ornekAday = ornek[0] ?? {
    name: marka.analiz ? 'Örnek Kafe' : 'Örnek Futbol Okulu', contact_person: 'Ahmet Bey',
    gaps: marka.analiz ? ['qr_menu', 'reels_yok'] : [], has_website: 'yok' as const, share_code: null,
  };

  return (
    <>
      <PageHeader title={`${marka.ad} — Mesaj Şablonları`} />
      <div className="content">
        <div className="alert alert-info">
          <Icon name="note" style={{ width: 17, height: 17, flexShrink: 0 }} />
          <span>
            Listede bir adayın yanındaki <strong>WA</strong> düğmesine basıp bir şablon seçince
            WhatsApp mesaj yazılmış hâlde açılır — <strong>Gönder</strong>&apos;e basman yeterli.
            Metinde <code>{'{ad}'}</code> firma adıyla, <code>{'{yetkili}'}</code> yetkili kişiyle,
            {' '}<code>{'{gonderen}'}</code> senin adınla, <code>{'{marka}'}</code> &ldquo;{marka.ad}&rdquo;
            ile değiştirilir. <strong>[köşeli parantez]</strong> içindeki yerleri kendi teklifinle doldur.
            {marka.analiz && (
              <>
                {' '}<code>{'{eksikler}'}</code> adayda işaretlediğin eksiklere (&ldquo;QR menü, web sitesi ve
                Reels video içerikleri&rdquo;), <code>{'{site}'}</code> adayın kişisel sunum linkine dönüşür.
                Aynı şablonlar <strong>IG</strong> düğmesinde de çıkar: mesaj kopyalanır, Instagram sohbeti açılır.
              </>
            )}
          </span>
        </div>

        {marka.analiz && (
          <TanitimAyarlari whatsapp={tanitimWa[0]?.deger ?? null} yonetici={user.role === 'admin'}
                           kaydet={tanitimAyarKaydet} />
        )}

        <div className="card">
          <div className="card-head">
            <h2>Şablonlar <span className="badge b-muted">{sablonlar.length}</span></h2>
            <a href={`/musteri-bulma/${marka.yol}`} className="btn btn-sm btn-secondary">
              ← {marka.ad} listesine dön
            </a>
          </div>
          <div className="card-body sablon-liste">
            {sablonlar.map((s) => (
              <SablonDuzenleyici
                key={s.id}
                sablon={s}
                marka={{ yol: marka.yol, ad: marka.ad, analiz: marka.analiz }}
                ornek={ornekAday}
                gonderen={user.display_name}
                silebilir={user.role === 'admin' || s.created_by === user.id}
                kaydet={sablonKaydet}
                sil={sablonSil}
              />
            ))}
            <SablonDuzenleyici
              sablon={null}
              marka={{ yol: marka.yol, ad: marka.ad, analiz: marka.analiz }}
              ornek={ornekAday}
              gonderen={user.display_name}
              silebilir={false}
              kaydet={sablonKaydet}
              sil={sablonSil}
            />
          </div>
        </div>
      </div>
    </>
  );
}
