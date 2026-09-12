'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { EK_ALANLAR, UC_DURUMLAR, type EkAlanAnahtari } from '@/lib/adaylar';

function Gonder() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Ekleniyor…' : 'Ekle'}
    </button>
  );
}

/**
 * Hızlı aday ekleme: Instagram'da ya da Google'da bir numara görünce üç
 * alanla kaydedip devam edilebilsin. Kalan alanlar "Daha fazla alan"
 * altında. Kaydettikten sonra imleç yine Ad kutusuna döner ki liste
 * arka arkaya girilebilsin.
 */
export default function AdayEkleBar({
  action, marka, kaynaklar, personel, ekAlanlar, bastaAcik = false,
}: {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  marka: string;
  kaynaklar: string[];
  personel: Array<{ id: number; display_name: string }>;
  ekAlanlar: EkAlanAnahtari[];
  /** Liste boşken açık gelir; doluyken tek satıra katlanır. */
  bastaAcik?: boolean;
}) {
  const [sonuc, formAction] = useActionState(action, null);
  const [genis, setGenis] = useState(false);
  const [acik, setAcik] = useState(bastaAcik);
  const formRef = useRef<HTMLFormElement>(null);
  const adRef = useRef<HTMLInputElement>(null);

  const ok = sonuc?.startsWith('ok|') ?? false;
  const uyari = ok ? (sonuc!.split('|').slice(2).join('|').trim() || null) : null;

  // Arka arkaya aday girilirken Kaynak / Şehir / Kime ait aynı kalsın;
  // yalnızca kişiye özel üç alan temizlenir.
  useEffect(() => {
    if (!ok) return;
    setAcik(true);
    const f = formRef.current;
    if (f) {
      for (const ad of ['name', 'phone', 'note'] as const) {
        const alan = f.elements.namedItem(ad);
        if (alan instanceof HTMLInputElement) alan.value = '';
      }
    }
    adRef.current?.focus();
  }, [ok, sonuc]);

  if (!acik) {
    return (
      <button type="button" className="acilir-baslik aday-ekle-kapali"
              onClick={() => setAcik(true)}>
        + Yeni aday ekle
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="aday-ekle">
      <input type="hidden" name="marka" value={marka} />

      {ok && (
        <div className={`alert ${uyari ? 'alert-warning' : 'alert-success'}`}>
          <span><strong>Eklendi.</strong>{uyari ? ` ${uyari}` : ''}</span>
        </div>
      )}
      {sonuc && !ok && <div className="alert alert-danger">{sonuc}</div>}

      <div className="aday-ekle-satir">
        <input ref={adRef} name="name" className="form-control" required maxLength={150}
               placeholder="Ad / firma *" aria-label="Ad / firma" />
        <input name="phone" className="form-control" inputMode="tel" autoComplete="off"
               placeholder="Telefon" aria-label="Telefon" />
        <input name="note" className="form-control" maxLength={500}
               placeholder="Not (isteğe bağlı)" aria-label="Not" />
        <Gonder />
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setGenis((v) => !v)}>
          {genis ? 'Alanları gizle' : 'Daha fazla alan'}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setAcik(false)}
                title="Ekleme alanını kapat">Kapat</button>
      </div>

      {genis && (
        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="form-group">
            <label htmlFor="ae-yetkili">Yetkili kişi</label>
            <input id="ae-yetkili" name="contact_person" className="form-control" maxLength={120} />
          </div>
          <div className="form-group">
            <label htmlFor="ae-sehir">Şehir / ilçe</label>
            <input id="ae-sehir" name="city" className="form-control" maxLength={80} />
          </div>
          <div className="form-group">
            <label htmlFor="ae-kaynak">Nereden buldum</label>
            <input id="ae-kaynak" name="source" className="form-control" maxLength={120}
                   list="aday-kaynaklar" placeholder="örn. Google Haritalar — Kadıköy" />
            <datalist id="aday-kaynaklar">
              {kaynaklar.map((k) => <option key={k} value={k} />)}
            </datalist>
          </div>
          <div className="form-group">
            <label htmlFor="ae-link">Instagram / web</label>
            <input id="ae-link" name="link" className="form-control" maxLength={300} />
          </div>
          <div className="form-group">
            <label htmlFor="ae-sorumlu">Kime ait</label>
            <select id="ae-sorumlu" name="assigned_to" className="form-control" defaultValue="">
              <option value="">— Atanmamış —</option>
              {personel.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
            </select>
          </div>
          {ekAlanlar.map((ek) => {
            const alan = EK_ALANLAR[ek];
            return (
              <div className="form-group" key={ek}>
                <label htmlFor={`ae-${ek}`}>{alan.simge} {alan.soru}</label>
                <select id={`ae-${ek}`} name={alan.sutun} className="form-control" defaultValue="bilinmiyor">
                  {UC_DURUMLAR.map((v) => (
                    <option key={v} value={v}>{alan.etiket[v].uzun}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
}
