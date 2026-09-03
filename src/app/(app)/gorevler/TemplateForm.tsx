'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { GUNLER } from '@/lib/gunler';
import { PRIORITY_LABEL } from '@/lib/format';

type Sablon = {
  id: number; title: string; description: string | null;
  weekdays: number[]; priority: string; customer_id: number | null;
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

export default function TemplateForm({
  action, gonderEtiketi, sablon, isAdmin, currentUserId, customers, staff,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  gonderEtiketi: string;
  sablon?: Sablon;
  isAdmin: boolean;
  currentUserId: number;
  customers: Array<{ id: number; name: string }>;
  staff: Array<{ id: number; display_name: string }>;
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const ok = sonuc === 'ok';
  const formRef = useRef<HTMLFormElement>(null);
  const k = sablon ? `-${sablon.id}` : '';

  // Yeni şablon eklerken başarı sonrası form temizlensin; düzenlemede
  // (sablon dolu) alanlar mevcut kayda ait kalsın.
  useEffect(() => {
    if (ok && !sablon) formRef.current?.reset();
  }, [ok, sablon]);

  return (
    <form ref={formRef} action={formAction}>
      {sablon && <input type="hidden" name="id" value={sablon.id} />}

      {ok && (
        <div className="alert alert-success">
          {sablon ? 'Değişiklikler kaydedildi.' : 'Tekrarlayan görev eklendi.'}
        </div>
      )}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor={`title${k}`}>Görev Başlığı *</label>
          <input id={`title${k}`} name="title" className="form-control" required maxLength={200}
                 placeholder="örn. Kök Cafe story" defaultValue={sablon?.title} />
        </div>

        <div className="form-group full">
          <label>Hangi günler? *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            {GUNLER.map((g) => (
              <label key={g.no} className="gun-secim">
                <input type="checkbox" name="gun" value={g.no}
                       defaultChecked={sablon?.weekdays.includes(g.no) ?? false} />
                <span>{g.kisa}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={`customer_id${k}`}>Müşteri</label>
          <select id={`customer_id${k}`} name="customer_id" className="form-control"
                  defaultValue={sablon?.customer_id ?? ''}>
            <option value="">— Yok —</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`priority${k}`}>Öncelik</label>
          <select id={`priority${k}`} name="priority" className="form-control"
                  defaultValue={sablon?.priority ?? 'normal'}>
            <option value="dusuk">{PRIORITY_LABEL.dusuk}</option>
            <option value="normal">{PRIORITY_LABEL.normal}</option>
            <option value="yuksek">{PRIORITY_LABEL.yuksek}</option>
          </select>
        </div>

        {isAdmin && (
          <div className="form-group">
            <label htmlFor={`assigned_to${k}`}>Kim yapacak?</label>
            <select id={`assigned_to${k}`} name="assigned_to" className="form-control"
                    defaultValue={sablon?.assigned_to ?? currentUserId}>
              <option value="">— Atanmadı —</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.display_name}</option>)}
            </select>
          </div>
        )}

        <div className="form-group full">
          <label htmlFor={`description${k}`}>Açıklama</label>
          <input id={`description${k}`} name="description" className="form-control" maxLength={300}
                 defaultValue={sablon?.description ?? ''} />
        </div>
      </div>
      <div className="form-actions">
        <Submit label={gonderEtiketi} pendingLabel="Kaydediliyor…" />
      </div>
    </form>
  );
}
