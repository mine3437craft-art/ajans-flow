'use client';

import { useEffect, useState } from 'react';
import { akisDinle, akisOku, akisYaz } from './akis';

export type SektorSecenegi = {
  anahtar: string;
  ad: string;
};

type Props = {
  sektorler: readonly SektorSecenegi[];
  /** Çipleri anlatan görünür etiket (başlık bloğunda duruyor). */
  etiketId: string;
};

/**
 * SEKTÖR KAPISI — ziyaretçi işini seçer.
 *
 * Seçim iki yere yazılır: `sessionStorage['af-akis']` (iletişim formu okur)
 * ve `<html data-sektor>` (hero alt metni ile öne çıkan hizmetler CSS
 * seçicisiyle değişir; JS DOM kurmaz).
 *
 * JS yüklenmeden de çipler okunur ve odaklanabilir; seçim yapılamaz,
 * bu yüzden JS'siz durumda hero'nun genel metni görünür kalır.
 */
export default function SektorKapisi({ sektorler, etiketId }: Props) {
  const [secili, setSecili] = useState<string | null>(null);

  // Geri gelindiğinde seçim geri yüklenir (depoda duruyor).
  useEffect(() => {
    const durum = akisOku();
    const gecerli = sektorler.some((s) => s.anahtar === durum.sektor) ? durum.sektor : null;
    setSecili(gecerli);
    if (gecerli !== durum.sektor) akisYaz({ ...durum, sektor: gecerli });
    else if (gecerli) document.documentElement.dataset.sektor = gecerli;
    return akisDinle((yeni) => setSecili(yeni.sektor));
  }, [sektorler]);

  const sec = (anahtar: string) => {
    const durum = akisOku();
    const yeni = durum.sektor === anahtar ? null : anahtar;
    setSecili(yeni);
    akisYaz({ ...durum, sektor: yeni });
  };

  return (
    <div className="af-as-kapi">
      <div className="af-cipler" role="group" aria-labelledby={etiketId}>
        {sektorler.map((s) => (
          <button
            key={s.anahtar}
            type="button"
            className="af-cip"
            aria-pressed={secili === s.anahtar}
            onClick={() => sec(s.anahtar)}
          >
            {s.ad}
          </button>
        ))}
      </div>
      {secili ? (
        <p className="af-dugme-not af-as-kapi-not">
          Seçiminiz bu sayfada kalır ve iletişim formuna hazır gelir.{' '}
          <button type="button" className="af-dugme af-dugme--hayalet" onClick={() => sec(secili)}>
            Seçimi kaldır
          </button>
        </p>
      ) : null}
    </div>
  );
}
