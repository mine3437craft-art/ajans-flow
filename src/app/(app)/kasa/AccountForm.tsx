'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

type Account = {
  id: number; name: string; account_type: string; balance: string; notes: string | null;
};

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function AccountForm({
  action, gonderEtiketi, hesap,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  gonderEtiketi: string;
  hesap?: Account;
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const ok = sonuc === 'ok';
  const formRef = useRef<HTMLFormElement>(null);
  const k = hesap ? `-${hesap.id}` : '';

  useEffect(() => {
    if (ok && !hesap) formRef.current?.reset();
  }, [ok, hesap]);

  return (
    <form ref={formRef} action={formAction}>
      {hesap && <input type="hidden" name="id" value={hesap.id} />}

      {ok && (
        <div className="alert alert-success">
          {hesap ? 'Hesap güncellendi.' : 'Hesap eklendi.'}
        </div>
      )}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`ca-name${k}`}>Hesap Adı *</label>
          <input id={`ca-name${k}`} name="name" className="form-control" required maxLength={100}
                 placeholder="örn. Garanti Bankası, Annemin Garanti Hesabı"
                 defaultValue={hesap?.name} />
        </div>
        <div className="form-group">
          <label htmlFor={`ca-type${k}`}>Tür</label>
          <select id={`ca-type${k}`} name="account_type" className="form-control"
                  defaultValue={hesap?.account_type ?? 'banka'}>
            <option value="nakit">Nakit</option>
            <option value="banka">Banka Hesabı</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`ca-bal${k}`}>
            {hesap ? 'Bakiye Düzeltme (₺)' : 'Başlangıç Bakiyesi (₺)'}
          </label>
          <input id={`ca-bal${k}`} name="balance" type="number" step="0.01" className="form-control"
                 defaultValue={hesap ? Number(hesap.balance) : 0} />
          <small className="alan-ipucu">
            {hesap
              ? 'Gelir/gider girdikçe kendi kendine değişir. Buradaki rakamı yalnızca banka ekstresiyle uyuşmuyorsa düzelt.'
              : 'Hesapta şu an ne kadar varsa onu yaz. Sonrası otomatik işlenir.'}
          </small>
        </div>
        <div className="form-group full">
          <label htmlFor={`ca-notes${k}`}>Not</label>
          <input id={`ca-notes${k}`} name="notes" className="form-control" maxLength={300}
                 defaultValue={hesap?.notes ?? ''} />
        </div>
      </div>
      <div className="form-actions">
        <Submit label={gonderEtiketi} pendingLabel="Kaydediliyor…" />
      </div>
    </form>
  );
}
