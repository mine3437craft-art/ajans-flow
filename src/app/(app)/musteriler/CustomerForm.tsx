'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { PACKAGES } from '@/lib/format';
import { isoDate } from '@/lib/format';

type Musteri = {
  id: number; name: string; company: string | null; phone: string | null;
  email: string | null; package: string; monthly_fee: string; status: string;
  start_date: string | null; next_payment_date: string | null; notes: string | null;
  assigned_to: number | null;
};

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function CustomerForm({
  action, gonderEtiketi, musteri, staff,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  gonderEtiketi: string;
  musteri?: Musteri;
  staff: Array<{ id: number; display_name: string }>;
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const ok = sonuc === 'ok';
  const k = musteri ? `-${musteri.id}` : '';

  // Yeni müşteri eklerken başarı sonrası form temizlensin; düzenlemede
  // (musteri dolu) alanlar mevcut kayda ait kalsın, temizlenmesin.
  useEffect(() => {
    if (ok && !musteri) formRef.current?.reset();
  }, [ok, musteri]);

  return (
    <form ref={formRef} action={formAction}>
      {musteri && <input type="hidden" name="id" value={musteri.id} />}

      {ok && (
        <div className="alert alert-success">
          {musteri ? 'Değişiklikler kaydedildi.' : 'Müşteri eklendi.'}
        </div>
      )}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`name${k}`}>Ad Soyad *</label>
          <input id={`name${k}`} name="name" className="form-control" required maxLength={150}
                 defaultValue={musteri?.name} />
        </div>
        <div className="form-group">
          <label htmlFor={`company${k}`}>Firma</label>
          <input id={`company${k}`} name="company" className="form-control" maxLength={150}
                 defaultValue={musteri?.company ?? ''} />
        </div>
        <div className="form-group">
          <label htmlFor={`phone${k}`}>Telefon</label>
          <input id={`phone${k}`} name="phone" className="form-control" maxLength={40}
                 defaultValue={musteri?.phone ?? ''} />
        </div>
        <div className="form-group">
          <label htmlFor={`email${k}`}>E-posta</label>
          <input id={`email${k}`} name="email" type="text" inputMode="email" className="form-control" maxLength={150}
                 placeholder="ornek@sirket.com"
                 defaultValue={musteri?.email ?? ''} />
        </div>
        <div className="form-group">
          <label htmlFor={`package${k}`}>Paket</label>
          <select id={`package${k}`} name="package" className="form-control" defaultValue={musteri?.package ?? PACKAGES[0]}>
            {PACKAGES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`monthly_fee${k}`}>Aylık Ücret (₺)</label>
          <input id={`monthly_fee${k}`} name="monthly_fee" type="number" step="0.01" min="0"
                 className="form-control" defaultValue={musteri ? Number(musteri.monthly_fee) : 0} />
        </div>
        <div className="form-group">
          <label htmlFor={`status${k}`}>Durum</label>
          <select id={`status${k}`} name="status" className="form-control" defaultValue={musteri?.status ?? 'aktif'}>
            <option value="aktif">Aktif</option>
            <option value="duraklatildi">Duraklatıldı</option>
            <option value="ayrildi">Ayrıldı</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`assigned_to${k}`}>Sorumlu</label>
          <select id={`assigned_to${k}`} name="assigned_to" className="form-control"
                  defaultValue={musteri?.assigned_to ?? ''}>
            <option value="">— Atanmadı —</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.display_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`start_date${k}`}>Başlangıç Tarihi</label>
          <input id={`start_date${k}`} name="start_date" type="date" className="form-control"
                 defaultValue={isoDate(musteri?.start_date)} />
        </div>
        <div className="form-group">
          <label htmlFor={`next_payment_date${k}`}>Sonraki Ödeme Tarihi</label>
          <input id={`next_payment_date${k}`} name="next_payment_date" type="date" className="form-control"
                 defaultValue={isoDate(musteri?.next_payment_date)} />
        </div>
        <div className="form-group full">
          <label htmlFor={`notes${k}`}>Notlar</label>
          <textarea id={`notes${k}`} name="notes" className="form-control" rows={2}
                    defaultValue={musteri?.notes ?? ''} />
        </div>
      </div>
      <div className="form-actions">
        <Submit label={gonderEtiketi} pendingLabel="Kaydediliyor…" />
      </div>
    </form>
  );
}
