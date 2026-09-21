import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import SablonDuzenleyici from '@/components/aday/SablonDuzenleyici';
import { markaBul } from '@/lib/adaylar';
import { sablonKaydet, sablonSil } from '../actions';

export const dynamic = 'force-dynamic';

export default async function SablonlarPage({ params }: { params: Promise<{ marka: string }> }) {
  const { marka: yol } = await params;
  const marka = markaBul(yol);
  if (!marka) redirect('/');
  const user = await requireUser();

  const [sablonlar, ornek] = await Promise.all([
    sql`
      SELECT t.id, t.title, t.body, t.sets_status, t.created_by, u.display_name AS yazan
      FROM prospect_templates t LEFT JOIN users u ON u.id = t.created_by
      WHERE t.brand = ${marka.anahtar} ORDER BY t.sort_order, t.id
    ` as Promise<Array<{
      id: number; title: string; body: string; sets_status: string | null;
      created_by: number | null; yazan: string | null;
    }>>,
    // Ön izlemede gerçek bir adayla doldurulmuş hâli görünsün.
    sql`
      SELECT name, contact_person FROM prospects
      WHERE brand = ${marka.anahtar} AND contact_person IS NOT NULL
      ORDER BY id DESC LIMIT 1
    ` as Promise<Array<{ name: string; contact_person: string | null }>>,
  ]);

  const ornekAday = ornek[0] ?? { name: 'Örnek Futbol Okulu', contact_person: 'Ahmet Bey' };

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
          </span>
        </div>

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
                marka={{ yol: marka.yol, ad: marka.ad }}
                ornek={ornekAday}
                gonderen={user.display_name}
                silebilir={user.role === 'admin' || s.created_by === user.id}
                kaydet={sablonKaydet}
                sil={sablonSil}
              />
            ))}
            <SablonDuzenleyici
              sablon={null}
              marka={{ yol: marka.yol, ad: marka.ad }}
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
