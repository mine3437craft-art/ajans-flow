'use client';

import { useEffect, useState } from 'react';
import { akisDinle, akisOku, BOS_AKIS, type Akis } from '../iletisim/akis-durumu';

export type RayAdimi = {
  /** Çapa kimliği — "adim-1" */
  id: string;
  no: string;
  ad: string;
};

type Props = {
  adimlar: readonly RayAdimi[];
  /** Toplam eksik seçeneği sayısı — "3 / 9" künyesi için. */
  eksikSayisi: number;
};

/**
 * ADIM RAYI — analiz sayfasını bir ARAÇ gibi gösteren yapışkan şerit.
 *
 * Üst barın altına yapışır ve üç durağı mono olarak dizer. İki iş yapar:
 *   1. Gezinme: her durak gerçek bir çapa bağlantısı (JS'siz çalışır,
 *      SSR'da basılı, klavyeyle gezilir).
 *   2. İlerleme: Akış Kartı sözleşmesini (`sessionStorage['af-akis']`)
 *      dinleyip tamamlanan durakları işaretler. Bu bir YÜKSELTMEDİR —
 *      JS gelmezse ray yine gezinilebilir bir şerittir, yalnız tik yoktur.
 *
 * Hangi durakta olduğunuzu `:target` ile CSS söyler (bkz. sayfa.css):
 * tıklanan adım turuncuya döner. Kaydırmaya bağlı "aktif adım" takibi
 * BİLİNÇLİ OLARAK yapılmıyor — her kare bölüm konumu okumak bu sayfadaki
 * tek yapışkan şeridi pahalı hâle getirirdi.
 */
export default function AdimRayi({ adimlar, eksikSayisi }: Props) {
  const [durum, setDurum] = useState<Akis>(BOS_AKIS);

  useEffect(() => {
    setDurum(akisOku());
    return akisDinle(setDurum);
  }, []);

  const secili = durum.eksikler.length;
  const bitti: Record<string, boolean> = {
    'adim-1': Boolean(durum.sektor),
    'adim-2': secili > 0,
    'adim-3': false,
  };

  return (
    <nav className="af-an-ray" aria-label="Analiz adımları">
      <ol className="af-an-ray-liste">
        {adimlar.map((a) => (
          <li key={a.id}>
            <a href={`#${a.id}`} data-bitti={bitti[a.id] ? '' : undefined}>
              <span className="af-an-ray-no" aria-hidden="true">
                {a.no}
              </span>
              <span className="af-an-ray-ad">{a.ad}</span>
              {bitti[a.id] ? <span className="af-gizli-metin">(tamamlandı)</span> : null}
            </a>
          </li>
        ))}
      </ol>
      {/* `aria-live` KULLANILMIYOR: kutuların kendisi işaretlendiğini
          zaten söylüyor ve Akış Kartı aynı sayıyı taşıyor; üçüncü bir
          duyuru tekrar olurdu. */}
      <p className="af-an-ray-sayac">
        <span className="af-gizli-metin">İşaretlenen eksik: </span>
        {secili} / {eksikSayisi}
      </p>
    </nav>
  );
}
