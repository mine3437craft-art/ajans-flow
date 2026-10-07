'use client';

import { useEffect, useState } from 'react';
import { akisDinle, akisOku, akisYaz } from './akis';

export type EksikSecenegi = {
  anahtar: string;
  ad: string;
};

type Props = {
  eksikler: readonly EksikSecenegi[];
  etiketId: string;
};

/**
 * "Neyin eksik?" — ziyaretçi işaretler, Akış Kartı dolar.
 *
 * Anahtarlar `EKSIKLER[].anahtar` ile birebir aynıdır; iletişim formu
 * aynı anahtarları gizli alanlara koyup panele aday olarak düşürür.
 *
 * JS yüklenmezse kutular yine işaretlenebilir (tasarım sistemindeki
 * `.af-secenek:has(input:checked)` kuralı görünümü halleder); yalnız kart
 * güncellenmez.
 */
export default function EksikSecici({ eksikler, etiketId }: Props) {
  const [secili, setSecili] = useState<string[]>([]);

  useEffect(() => {
    const durum = akisOku();
    const gecerli = durum.eksikler.filter((e) => eksikler.some((x) => x.anahtar === e));
    setSecili(gecerli);
    if (gecerli.length !== durum.eksikler.length) akisYaz({ ...durum, eksikler: gecerli });
    return akisDinle((yeni) => setSecili(yeni.eksikler));
  }, [eksikler]);

  const degistir = (anahtar: string) => {
    const durum = akisOku();
    const acik = durum.eksikler.includes(anahtar);
    const yeni = acik ? durum.eksikler.filter((e) => e !== anahtar) : [...durum.eksikler, anahtar];
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
            checked={secili.includes(e.anahtar)}
            onChange={() => degistir(e.anahtar)}
          />
          {e.ad}
        </label>
      ))}
    </div>
  );
}
