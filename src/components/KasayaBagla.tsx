'use client';

import { useRef } from 'react';
import type { HesapSecenek } from './IslemForm';

/**
 * Kasasi secilmemis eski kayitlar icin satir ici hesap secici.
 * Secim yapilir yapilmaz gonderilir; ayrica bir "kaydet" adimi yok.
 */
export default function KasayaBagla({
  islemId, hesaplar, action,
}: {
  islemId: number;
  hesaplar: HesapSecenek[];
  action: (fd: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  if (hesaplar.length === 0) {
    return <span className="badge b-warning">kasaya işlenmedi</span>;
  }

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={islemId} />
      <select
        name="account_id"
        className="mini-secim"
        defaultValue=""
        aria-label="Kasa seç"
        onChange={(e) => { if (e.target.value) formRef.current?.requestSubmit(); }}
      >
        <option value="">kasa seç…</option>
        {hesaplar.map((h) => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>
    </form>
  );
}
