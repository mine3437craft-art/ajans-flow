'use client';

import { useId, useState } from 'react';
import { IkonArti } from './Ikonlar';

/**
 * Sık sorulan sorular akordeonu. Aynı anda tek cevap açık.
 * JS yoksa CSS tüm cevapları açık gösterir (.tn-js kapısı).
 */
export default function Sss({ sorular }: { sorular: { soru: string; cevap: string }[] }) {
  const [acik, setAcik] = useState<number | null>(0);
  const kok = useId();

  return (
    <div className="tn-sss-liste">
      {sorular.map((s, i) => {
        const acikMi = acik === i;
        const soruId = `${kok}-s${i}`;
        const cevapId = `${kok}-c${i}`;
        return (
          <div className="tn-sss-oge" data-acik={acikMi} key={s.soru}>
            <h3 className="tn-sss-soru">
              <button
                type="button"
                id={soruId}
                aria-expanded={acikMi}
                aria-controls={cevapId}
                onClick={() => setAcik(acikMi ? null : i)}
              >
                <span>{s.soru}</span>
                <span className="tn-sss-arti" aria-hidden="true">
                  <IkonArti />
                </span>
              </button>
            </h3>
            <div className="tn-sss-cevap" id={cevapId} role="region" aria-labelledby={soruId}>
              <div>
                <p>{s.cevap}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
