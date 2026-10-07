'use client';

import { useEffect } from 'react';

/**
 * Paylaşılan sözleşme (SITE-TASARIM.md — Akış Kartı):
 * ziyaretçinin sektörü `sessionStorage` içinde `af-akis` anahtarında
 * `{ sektor, eksikler }` olarak durur ve `<html data-sektor="…">` değerine
 * yazılır. Sektör sayfasını açmak da bir sektör seçimidir; işaretli eksikler
 * korunur, yalnız sektör güncellenir. İletişim formu bu veriyi okuyup
 * gizli alanlara koyuyor.
 *
 * Hiçbir şey çizmez; JavaScript kapalıyken sayfa aynen çalışır (çağrı
 * bağlantıları sektörü `?sektor=` ile zaten taşıyor).
 */
export default function SektorIsaretle({ anahtar }: { anahtar: string }) {
  useEffect(() => {
    document.documentElement.dataset.sektor = anahtar;
    try {
      const ham = sessionStorage.getItem('af-akis');
      const onceki = ham ? (JSON.parse(ham) as { eksikler?: unknown }) : null;
      const eksikler = Array.isArray(onceki?.eksikler)
        ? onceki.eksikler.filter((e): e is string => typeof e === 'string')
        : [];
      sessionStorage.setItem('af-akis', JSON.stringify({ sektor: anahtar, eksikler }));
    } catch {
      /* Gizli sekmede sessionStorage kapalı olabilir — sayfa yine çalışır. */
    }
  }, [anahtar]);

  return null;
}
