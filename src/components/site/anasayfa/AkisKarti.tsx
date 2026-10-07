'use client';

import { useEffect, useState } from 'react';
import Dugme from '@/components/site/Dugme';
import { IkonTik } from '@/components/site/Ikonlar';
import { akisDinle, akisOku, type Akis, BOS_AKIS } from './akis';

export type KartSektoru = { anahtar: string; ad: string; href: string };
export type KartOnerisi = {
  /** EKSIKLER[].anahtar */
  anahtar: string;
  /** Öneri başlığı (EKSIKLER[].baslik) */
  baslik: string;
  /** İlgili hizmetin adı ve sayfası */
  hizmetAdi: string;
  href: string;
};

type Props = {
  sektorler: readonly KartSektoru[];
  oneriler: readonly KartOnerisi[];
  cagri: { etiket: string; href: string };
  /** Kart başlığı. */
  baslik: string;
  /** Hiçbir şey seçilmemişken görünen yol gösterici metin. */
  bosMetin: string;
  /** Masaüstünde kaydırırken kart ekranda kalsın. */
  yapiskan?: boolean;
};

/**
 * AKIŞ KARTI — ziyaretçinin seçtiği sektör ve işaretlediği eksiklerden
 * oluşan kapsam önerisi. Sayfada iki yerde duruyor (eksik bölümü ve
 * kapanış); ikisi aynı durumu dinler.
 *
 * Kart JS'siz de okunur: boş hâliyle basılır, çağrı düğmesi çalışır.
 */
export default function AkisKarti({
  sektorler,
  oneriler,
  cagri,
  baslik,
  bosMetin,
  yapiskan,
}: Props) {
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
      className={['af-kart', 'af-kart--vurgulu', 'af-as-kart', yapiskan ? 'af-yapiskan' : '']
        .filter(Boolean)
        .join(' ')}
      data-dolu={secili.length > 0 || sektor ? '' : undefined}
      style={
        { ['--af-as-oran' as string]: `${Math.max(oran, sektor ? 8 : 0)}%` } as React.CSSProperties
      }
    >
      <span className="af-as-kart-cizgi" aria-hidden="true" />

      <div className="af-kart-ust">
        <p className="af-mono-etiket af-mono-etiket--vurgu">Akış kartı</p>
        <span className="af-mono af-silik-metin">
          {secili.length} / {oneriler.length}
        </span>
      </div>

      <h3 className="af-kart-baslik">{baslik}</h3>

      <table className="af-veri-tablo">
        <tbody>
          <tr>
            <th scope="row">Sektör</th>
            <td>
              {sektor ? (
                <a className="af-bag" href={sektor.href}>
                  {sektor.ad}
                </a>
              ) : (
                <span className="af-silik-metin">Yukarıdan seçin</span>
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
        <ul className="af-tikli af-as-kart-liste">
          {secili.map((o) => (
            <li key={o.anahtar}>
              <IkonTik />
              <span>
                <a className="af-bag" href={o.href}>
                  {o.baslik}
                </a>
                <span className="af-as-kart-hizmet">{o.hizmetAdi}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="af-kart-metin">{bosMetin}</p>
      )}

      <div className="af-kart-alt">
        <Dugme href={cagri.href} blok>
          {cagri.etiket}
        </Dugme>
      </div>
    </div>
  );
}
