'use client';

import { useEffect, useState } from 'react';
import { akisDinle, akisOku, akisYaz } from '../iletisim/akis-durumu';

export type SektorSecenegi = { anahtar: string; ad: string };

type Props = {
  sektorler: readonly SektorSecenegi[];
  etiketId: string;
};

/**
 * ADIM 1 — ziyaretçi işini seçer. Seçim Akış Kartı sözleşmesine yazılır
 * (`sessionStorage['af-akis']` + `<html data-sektor>`), böylece aynı seçim
 * ana sayfada ve sektör sayfalarında da geçerli olur.
 *
 * JS yüklenmeden çipler okunur ve odaklanabilir; seçim yapılamaz, form da
 * sektörü boş gönderir — sunucu bunu kabul ediyor.
 */
export default function SektorSecimi({ sektorler, etiketId }: Props) {
  const [secili, setSecili] = useState<string | null>(null);

  useEffect(() => {
    const durum = akisOku();
    const gecerli = sektorler.some((s) => s.anahtar === durum.sektor) ? durum.sektor : null;
    setSecili(gecerli);
    if (gecerli) document.documentElement.dataset.sektor = gecerli;
    return akisDinle((yeni) => setSecili(yeni.sektor));
  }, [sektorler]);

  const sec = (anahtar: string) => {
    const durum = akisOku();
    const yeni = durum.sektor === anahtar ? null : anahtar;
    setSecili(yeni);
    akisYaz({ ...durum, sektor: yeni });
  };

  const seciliAd = sektorler.find((s) => s.anahtar === secili)?.ad ?? null;

  return (
    <div>
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

      <p className="af-dugme-not af-an-not af-ust-16">
        {seciliAd ? (
          <>
            <span>
              Seçiminiz: <strong>{seciliAd}</strong> — forma hazır gelecek.
            </span>
            <button
              type="button"
              className="af-dugme af-dugme--hayalet"
              onClick={() => secili && sec(secili)}
            >
              Seçimi kaldır
            </button>
          </>
        ) : (
          <span>İşiniz listede yoksa “Başka bir iş”i seçin; sonraki adımda devam edebilirsiniz.</span>
        )}
      </p>
    </div>
  );
}
