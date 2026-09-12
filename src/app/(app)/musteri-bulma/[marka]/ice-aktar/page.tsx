import { redirect } from 'next/navigation';
import { requirePageAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import IceAktarForm from '@/components/IceAktarForm';
import { markaBul } from '@/lib/adaylar';
import { iceAktar, partiGeriAl } from '../actions';

export const dynamic = 'force-dynamic';

export default async function IceAktarPage({ params }: { params: Promise<{ marka: string }> }) {
  const { marka: yol } = await params;
  const marka = markaBul(yol);
  if (!marka) redirect('/');
  await requirePageAccess(marka.izin);

  const personel = (await sql`
    SELECT u.id, u.display_name FROM users u
    WHERE u.is_active AND (u.role = 'admin' OR EXISTS (
      SELECT 1 FROM user_page_access pa WHERE pa.user_id = u.id AND pa.page_key = ${marka.izin}
    ))
    ORDER BY u.display_name
  `) as Array<{ id: number; display_name: string }>;

  return (
    <>
      <PageHeader title={`${marka.ad} — Excel'den Yapıştır`} />
      <div className="content">
        <div className="alert alert-info">
          <Icon name="note" style={{ width: 17, height: 17, flexShrink: 0 }} />
          <span>
            Excel ya da Google Sheets&apos;te satırları seç, <strong>Ctrl+C</strong> ile kopyala,
            aşağıdaki kutuya <strong>Ctrl+V</strong> ile yapıştır. Hangi sütunun ne olduğunu
            kendisi tahmin eder; yanlış tahmini önizlemede düzeltebilirsin. Eklenen herkes
            &ldquo;Aranmadı&rdquo; durumuyla başlar.
          </span>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Liste yapıştır</h2>
            <a href={`/musteri-bulma/${marka.yol}`} className="btn btn-sm btn-secondary">
              ← {marka.ad} listesine dön
            </a>
          </div>
          <div className="card-body">
            <IceAktarForm
              action={iceAktar}
              geriAlAction={partiGeriAl}
              marka={marka.yol}
              markaAd={marka.ad}
              personel={personel}
            />
          </div>
        </div>
      </div>
    </>
  );
}
