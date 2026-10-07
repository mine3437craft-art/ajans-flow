'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Dugme from '@/components/site/Dugme';
import { IkonTik } from '@/components/site/Ikonlar';
import { akisDinle, akisOku, BOS_AKIS, type Akis } from '../iletisim/akis-durumu';

export type OzetSektoru = { anahtar: string; ad: string; yol?: string };
export type OzetOnerisi = {
  /** EKSIKLER[].anahtar */
  anahtar: string;
  /** EKSIKLER[].baslik — ziyaretçiye gösterilen öneri adı */
  baslik: string;
  /** EKSIKLER[].hizmet — hangi hizmet başlığına bakıyor */
  hizmet: string;
};

type Props = {
  sektorler: readonly OzetSektoru[];
  oneriler: readonly OzetOnerisi[];
  cagri: { etiket: string; href: string };
  yapiskan?: boolean;
};

/**
 * AKIŞ KARTI — seçilen sektör ve işaretlenen eksiklerden oluşan kapsam
 * önerisi. Sunucuda boş hâliyle basılır; JavaScript gelince dolar, yani
 * JS olmadan da okunur ve çağrı düğmesi çalışır.
 */
export default function AkisOzeti({ sektorler, oneriler, cagri, yapiskan }: Props) {
  const [durum, setDurum] = useState<Akis>(BOS_AKIS);

  useEffect(() => {
    setDurum(akisOku());
    return akisDinle(setDurum);
  }, []);

  const sektor = sektorler.find((s) => s.anahtar === durum.sektor) ?? null;
  const secili = oneriler.filter((o) => durum.eksikler.includes(o.anahtar));
  const oran = oneriler.length ? Math.round((secili.length / oneriler.length) * 100) : 0;

  return (
    <div
      className={['af-kart', 'af-kart--vurgulu', 'af-an-kart', yapiskan ? 'af-yapiskan' : '']
        .filter(Boolean)
        .join(' ')}
      style={{ ['--af-an-oran' as string]: `${Math.max(oran, sektor ? 6 : 0)}%` } as CSSProperties}
    >
      <span className="af-an-kart-cizgi" aria-hidden="true" />

      <div className="af-kart-ust">
        <p className="af-mono-etiket af-mono-etiket--vurgu">Akış kartı</p>
        <span className="af-mono af-silik-metin">
          {secili.length} / {oneriler.length}
        </span>
      </div>

      <h3 className="af-kart-baslik">Analiz talebinizin taslağı</h3>

      <table className="af-veri-tablo">
        <tbody>
          <tr>
            <th scope="row">Sektör</th>
            <td>
              {sektor ? (
                sektor.yol ? (
                  <a className="af-bag" href={sektor.yol}>
                    {sektor.ad}
                  </a>
                ) : (
                  sektor.ad
                )
              ) : (
                <span className="af-silik-metin">1. adımdan seçin</span>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Eksik</th>
            <td>
              {secili.length ? (
                `${secili.length} madde işaretlendi`
              ) : (
                <span className="af-silik-metin">Henüz işaretlenmedi</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {secili.length ? (
        <ul className="af-tikli af-an-liste">
          {secili.map((o) => (
            <li key={o.anahtar}>
              <IkonTik />
              <span>
                <strong>{o.baslik}</strong>
                <span className="af-an-liste-hizmet">{o.hizmet}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="af-kart-metin">
          Yukarıdaki adımları işaretledikçe bu kart doluyor. Hiçbir şey seçmeden de
          gönderebilirsiniz; o zaman analizde her başlığa bakıyoruz.
        </p>
      )}

      <div className="af-kart-alt">
        <Dugme href={cagri.href} blok>
          {cagri.etiket}
        </Dugme>
      </div>
    </div>
  );
}
