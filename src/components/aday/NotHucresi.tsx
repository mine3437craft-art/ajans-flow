'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import Vurgu from '@/components/Vurgu';
import { formVerisi, type Eylem } from './tipler';

/**
 * Tablodaki "Not" hücresi, yerinde düzenlenebilir. Ekip notları sonradan
 * düzeltemiyordu. Kaydedince yeni metin hemen görünür (sunucuyu
 * beklemeden); sunucu yetişince aynı metinle yeniden çizilir.
 * Enter kaydeder, Shift+Enter yeni satır, Esc vazgeçer. Boş bırakılırsa not silinir.
 */
export default function NotHucresi({
  adayId, not, desenler, kelimeler, kaydet,
}: {
  adayId: number;
  not: string | null;
  desenler: RegExp[];
  kelimeler: string[];
  kaydet: Eylem;
}) {
  const [duzenle, setDuzenle] = useState(false);
  // Kaydederken gösterilen iyimser metin. undefined = sunucudan gelen notu
  // göster. Sunucu cevap verince bırakılır: kaydetme reddedildiyse (ör.
  // personel başkasının notunu silemez) gerçek not geri görünür.
  const [yerel, setYerel] = useState<string | null | undefined>(undefined);
  const [taslak, setTaslak] = useState(not ?? '');
  const alan = useRef<HTMLTextAreaElement>(null);
  const gosterilen = yerel !== undefined ? yerel : not;
  useEffect(() => {
    if (duzenle) {
      alan.current?.focus();
      alan.current?.setSelectionRange(alan.current.value.length, alan.current.value.length);
    }
  }, [duzenle]);

  const ac = () => { setTaslak(gosterilen ?? ''); setDuzenle(true); };
  const vazgec = () => setDuzenle(false);
  const kaydetVeKapat = () => {
    const yeni = taslak.trim();
    setDuzenle(false);
    if (yeni === (gosterilen ?? '').trim()) return;
    setYerel(yeni || null);
    startTransition(async () => {
      try { await kaydet(formVerisi({ id: adayId, note: yeni })); } finally { setYerel(undefined); }
    });
  };

  if (duzenle) {
    return (
      <div className="not-duzenle">
        <textarea
          ref={alan}
          className="form-control"
          rows={3}
          maxLength={1000}
          value={taslak}
          onChange={(e) => setTaslak(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); vazgec(); }
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); kaydetVeKapat(); }
          }}
          aria-label="Notu düzenle"
        />
        <div className="not-duzenle-eylem">
          <button type="button" className="btn btn-sm btn-primary" onClick={kaydetVeKapat}>Kaydet</button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={vazgec}>Vazgeç</button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="not-hucre" onClick={ac} title="Notu düzenlemek için dokun">
      {gosterilen
        ? <Vurgu metin={gosterilen} desenler={desenler} kelimeler={kelimeler} />
        : <span className="not-bos">+ not ekle</span>}
      <span className="not-kalem" aria-hidden>✎</span>
    </button>
  );
}
