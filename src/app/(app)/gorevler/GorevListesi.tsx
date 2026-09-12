'use client';

import { useOptimistic } from 'react';
import Icon from '@/components/Icon';
import ConfirmButton from '@/components/ConfirmButton';
import { TASK_STATUS_LABEL } from '@/lib/format';
// tarihEtiketi saf bir fonksiyon (veritabanına dokunmaz), aday listesinden
// tanıdık "Bugün / Gecikti · 3 gün" etiketini burada da kullanıyoruz.
import { tarihEtiketi } from '@/lib/adaylar';

export type GorevSatir = {
  id: number; title: string; description: string | null;
  due_date: string | null; due_time: string | null;
  priority: string; status: string; template_id: number | null;
  customer_name: string | null; assignee_name: string | null; ek_atananlar: string | null;
};

const STATUS_BADGE: Record<string, string> = {
  bekliyor: 'b-warning', devam: 'b-info', tamamlandi: 'b-success', iptal: 'b-muted',
};

type Iyimser = { id: number; tip: 'tamamlandi' | 'silindi' };

/**
 * Görev tablosu. "Yapıldı"ya basıldığı anda satır listeden düşer; sunucu
 * arkadan yetişir. Eskiden tıklamadan sonra sunucu aksiyonu + bütün
 * sayfanın yeniden çizilmesi (5 sorgu) beklendiği için satırın kaybolması
 * saniyeler sürüyordu. useOptimistic ile bekleme kullanıcıya görünmüyor;
 * sunucu hata verirse React iyimser durumu geri alır ve satır geri gelir.
 *
 * Düğmeler gerçek <form> olarak duruyor — onClick'e çevirmek sayfa henüz
 * canlanmadan (hidrasyon bitmeden) tıklamayı ölü bırakırdı. React form
 * aksiyonunu kendiliğinden bir transition içinde çalıştırdığı için iyimser
 * güncelleme burada geçerli; JavaScript hiç çalışmasa bile form yine
 * sunucuya gider.
 */
export default function GorevListesi({
  gorevler, gun, setTaskStatus, deleteTask,
}: {
  gorevler: GorevSatir[];
  /** 'bugun' görünümünde tamamlanan satır listeden düşer. */
  gun: string;
  setTaskStatus: (fd: FormData) => Promise<void>;
  deleteTask: (fd: FormData) => Promise<void>;
}) {
  const [iyimserler, iyimserEkle] = useOptimistic<Iyimser[], Iyimser>(
    [], (durum, yeni) => [...durum, yeni],
  );

  const durumu = (id: number) => iyimserler.find((i) => i.id === id)?.tip ?? null;

  const tamamla = async (fd: FormData) => {
    const id = Number(fd.get('id'));
    if (Number.isInteger(id)) iyimserEkle({ id, tip: 'tamamlandi' });
    await setTaskStatus(fd);
  };

  const sil = async (fd: FormData) => {
    const id = Number(fd.get('id'));
    if (Number.isInteger(id)) iyimserEkle({ id, tip: 'silindi' });
    await deleteTask(fd);
  };

  // Silinen her zaman, tamamlanan yalnızca "Bugünün İşleri"nde listeden düşer.
  const gorunen = gorevler.filter((t) => {
    const d = durumu(t.id);
    if (d === 'silindi') return false;
    if (d === 'tamamlandi' && gun !== 'tumu') return false;
    return true;
  });

  if (gorunen.length === 0) {
    return (
      <div className="empty" style={{ padding: '38px 20px' }}>
        <div className="empty-icon">✅</div>
        <div className="empty-title">Bugünlük bu kadar</div>
        <div className="empty-text">Listedeki işleri bitirdin.</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="gorev-tablo">
        <thead>
          <tr>
            <th>Görev</th>
            <th>Müşteri</th>
            <th>Atanan Kişi(ler)</th>
            <th>Bitiş</th>
            <th>Öncelik</th>
            <th>Durum</th>
            <th style={{ width: 1 }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {gorunen.map((t) => {
            const iyimserDurum = durumu(t.id);
            const bekliyor = iyimserDurum !== null;
            const tarih = tarihEtiketi(t.due_date);
            const siniflar = [
              bekliyor ? 'satir-gidiyor' : '',
              tarih?.sinif === 'tarih-gecikti' ? 'satir-gecikti'
                : tarih?.sinif === 'tarih-bugun' ? 'satir-bugun' : '',
            ].filter(Boolean).join(' ');
            return (
              <tr key={t.id} className={siniflar || undefined}>
                <td data-etiket="Görev">
                  <div className="cell-title">
                    {t.template_id && <span title="Tekrarlayan görev" style={{ marginRight: 5 }}>🔁</span>}
                    {t.title}
                  </div>
                  {t.description && <div className="cell-sub">{t.description}</div>}
                </td>
                {t.customer_name && <td data-etiket="Müşteri">{t.customer_name}</td>}
                <td data-etiket="Atanan">
                  {!t.assignee_name && !t.ek_atananlar ? '—' : (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {t.assignee_name && <span className="badge b-muted">{t.assignee_name}</span>}
                      {t.ek_atananlar?.split(', ').map((ad) => (
                        <span key={ad} className="badge b-muted">{ad}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td data-etiket="Bitiş">
                  {tarih
                    ? <span className={`tarih-etiket ${tarih.sinif}`}>{tarih.metin}</span>
                    : <span className="cell-sub">tarihsiz</span>}
                  {t.due_time && <span className="cell-sub"> {t.due_time.slice(0, 5)}</span>}
                </td>
                {t.priority === 'yuksek' && (
                  <td data-etiket="Öncelik"><span className="badge b-danger">Yüksek</span></td>
                )}
                {(gun === 'tumu' || t.status === 'tamamlandi' || iyimserDurum === 'tamamlandi') && (
                  <td data-etiket="Durum">
                    <span className={`badge ${STATUS_BADGE[iyimserDurum === 'tamamlandi' ? 'tamamlandi' : t.status]}`}>
                      {TASK_STATUS_LABEL[iyimserDurum === 'tamamlandi' ? 'tamamlandi' : t.status]}
                    </span>
                  </td>
                )}
                <td data-etiket="">
                  <div className="satir-eylem">
                    {t.status !== 'tamamlandi' && iyimserDurum !== 'tamamlandi' && (
                      <form action={tamamla}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="status" value="tamamlandi" />
                        <button className="btn btn-sm btn-success" type="submit"
                                title="Yapıldı olarak işaretle">
                          ✓ Yapıldı
                        </button>
                      </form>
                    )}
                    <form action={sil}>
                      <input type="hidden" name="id" value={t.id} />
                      <ConfirmButton
                        soru={`"${t.title}" görevi silinsin mi? Bu işlem geri alınamaz.`}
                        title="Sil"
                      >
                        <Icon name="trash" />
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
