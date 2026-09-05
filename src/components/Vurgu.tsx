import { Fragment } from 'react';
import { trFold, ucluBenzerlik } from '@/lib/arama';

/**
 * Metindeki eşleşen kelimeleri <mark> ile işaretler. Kök desenleri
 * (kelime bu kökle başlıyor mu) ve bulanık benzerlik (yazım hatası)
 * birlikte denenir — sonuç listesiyle vurgulama birbirini tutsun.
 */
export default function Vurgu({
  metin, desenler, kelimeler = [],
}: {
  metin: string;
  desenler: RegExp[];
  /** Bulanık eşleşme için katlanmış arama kelimeleri. */
  kelimeler?: string[];
}) {
  if (!metin || desenler.length === 0) return <>{metin}</>;

  const parcalar = metin.split(/([\p{L}\p{N}]+)/u);
  return (
    <>
      {parcalar.map((p, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
        const k = trFold(p);
        const eslesti =
          desenler.some((d) => d.test(k))
          || kelimeler.some((q) => ucluBenzerlik(q, k) >= 0.4);
        return eslesti ? <mark key={i}>{p}</mark> : <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
