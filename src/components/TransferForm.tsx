'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { money } from '@/lib/format';
import type { HesapSecenek } from './IslemForm';

function Gonder() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Aktarılıyor…' : 'Aktar'}
    </button>
  );
}

/**
 * Hesaplar arasi para aktarimi. Gelir/gider defterine yazilmaz -- toplam
 * varlik degismedigi icin raporlardaki gelir/gider toplamlarini sismez.
 */
export default function TransferForm({
  action, hesaplar, bugun,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  hesaplar: HesapSecenek[];
  bugun: string;
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const [from, setFrom] = useState<string>(String(hesaplar[0]?.id ?? ''));
  const [to, setTo] = useState<string>(String(hesaplar[1]?.id ?? ''));
  const formRef = useRef<HTMLFormElement>(null);

  const ok = sonuc?.startsWith('ok|') ?? false;
  const detay = ok ? (sonuc!.split('|')[2] || null) : null;

  useEffect(() => { if (ok) formRef.current?.reset(); }, [ok, sonuc]);

  if (hesaplar.length < 2) {
    return (
      <div className="alert alert-info" style={{ margin: 0 }}>
        Transfer için en az iki hesap gerekiyor (örn. Nakit ve Garanti).
      </div>
    );
  }

  const cikis = hesaplar.find((h) => String(h.id) === from);

  return (
    <form ref={formRef} action={formAction}>
      {ok && <div className="alert alert-success">Transfer tamam. {detay}</div>}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="transfer-satiri">
        <div className="form-group">
          <label htmlFor="tr-from">Çıkan hesap</label>
          <select id="tr-from" name="from_account_id" className="form-control"
                  value={from} onChange={(e) => setFrom(e.target.value)}>
            {hesaplar.map((h) => (
              <option key={h.id} value={h.id}>{h.name} — {money(h.balance)}</option>
            ))}
          </select>
        </div>
        <div className="transfer-ok" aria-hidden>→</div>
        <div className="form-group">
          <label htmlFor="tr-to">Giren hesap</label>
          <select id="tr-to" name="to_account_id" className="form-control"
                  value={to} onChange={(e) => setTo(e.target.value)}>
            {hesaplar.map((h) => (
              <option key={h.id} value={h.id} disabled={String(h.id) === from}>
                {h.name} — {money(h.balance)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid" style={{ marginTop: 14 }}>
        <div className="form-group">
          <label htmlFor="tr-amount">Tutar (₺) *</label>
          <input id="tr-amount" name="amount" inputMode="decimal" className="form-control" required
                 placeholder={cikis ? `en fazla ${money(cikis.balance)}` : '0'} />
        </div>
        <div className="form-group">
          <label htmlFor="tr-date">Tarih *</label>
          <input id="tr-date" name="occurred_on" type="date" className="form-control"
                 defaultValue={bugun} required />
        </div>
        <div className="form-group full">
          <label htmlFor="tr-desc">Açıklama</label>
          <input id="tr-desc" name="description" className="form-control" maxLength={300}
                 placeholder="örn. ATM'den nakit çekimi" />
        </div>
      </div>

      <div className="form-actions"><Gonder /></div>
    </form>
  );
}
