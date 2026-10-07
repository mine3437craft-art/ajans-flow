'use client';

import { useEffect } from 'react';

/**
 * Akış Kartı sözleşmesi (ajanlar arası): ziyaretçinin sektörü ve işaretlediği
 * eksikler `sessionStorage` içinde `af-akis` anahtarında JSON olarak durur:
 *   { "sektor": "oto-galeri", "eksikler": ["web_yok"] }
 *
 * Sektör anahtarı SAYFA sözlüğünden gelir (`site-icerik.ts` → SEKTORLER[].anahtar);
 * iletişim formu göndermeden önce panel sözlüğüne kendisi çeviriyor.
 *
 * Bu sayfa ağacı baştan sona otomotiv olduğu için sektörü yazar; ziyaretçinin
 * başka sayfada işaretlediği EKSİKLERE DOKUNMAZ. Sektör ayrıca
 * `document.documentElement.dataset.sektor` değerine yazılır; sayfalar CSS ile
 * buna tepki verebiliyor.
 *
 * Hiçbir şey basmaz, hiçbir istek atmaz; gizli kipte depolama kapalıysa sessizce
 * geçer.
 */
export default function AkisKaydi({ sektor }: { sektor: string }) {
  useEffect(() => {
    document.documentElement.dataset.sektor = sektor;
    try {
      const ham = window.sessionStorage.getItem('af-akis');
      const onceki = ham ? (JSON.parse(ham) as { eksikler?: unknown }) : null;
      const eksikler = Array.isArray(onceki?.eksikler)
        ? onceki.eksikler.filter((e): e is string => typeof e === 'string')
        : [];
      window.sessionStorage.setItem('af-akis', JSON.stringify({ sektor, eksikler }));
    } catch {
      /* gizli kip / depolama kapalı: sektör yine dataset'te duruyor */
    }
  }, [sektor]);

  return null;
}
