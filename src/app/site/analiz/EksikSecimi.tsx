'use client';

import { useEffect, useState } from 'react';
import { akisDinle, akisOku, akisYaz } from '../iletisim/akis-durumu';

export type EksikSecenegi = { anahtar: string; ad: string };

type Props = {
  eksikler: readonly EksikSecenegi[];
  etiketId: string;
  /** Aşağıdaki formun kimliği — kutular `form=` ile ona bağlanır. */
  formId: string;
};

/**
 * ADIM 2 — ziyaretçi eksiklerini işaretler.
 *
 * Kutular formun DIŞINDA duruyor ama `form="…"` niteliğiyle ona bağlı:
 * JavaScript olmasa da işaretlenen eksikler talebe eklenir. Anahtarlar
 * `adaylar.ts` içindeki `EKSIKLER[].anahtar` ile birebir aynıdır.
 */
export default function EksikSecimi({ eksikler, etiketId, formId }: Props) {
  const [secili, setSecili] = useState<string[]>([]);

  useEffect(() => {
    const durum = akisOku();
    setSecili(durum.eksikler.filter((e) => eksikler.some((x) => x.anahtar === e)));
    return akisDinle((yeni) => setSecili(yeni.eksikler));
  }, [eksikler]);

  const degistir = (anahtar: string) => {
    const durum = akisOku();
    const acik = durum.eksikler.includes(anahtar);
    const yeni = acik
      ? durum.eksikler.filter((e) => e !== anahtar)
      : [...durum.eksikler, anahtar];
    setSecili(yeni);
    akisYaz({ ...durum, eksikler: yeni });
  };

  return (
    <div className="af-cipler" role="group" aria-labelledby={etiketId}>
      {eksikler.map((e) => (
        <label className="af-secenek" key={e.anahtar}>
          <input
            type="checkbox"
            name="eksik"
            value={e.anahtar}
            form={formId}
            checked={secili.includes(e.anahtar)}
            onChange={() => degistir(e.anahtar)}
          />
          {e.ad}
        </label>
      ))}
    </div>
  );
}
