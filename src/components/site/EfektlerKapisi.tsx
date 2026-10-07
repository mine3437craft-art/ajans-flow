'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * EFEKTLER KAPISI — GSAP yığınını LCP yolundan çıkarır.
 *
 * NEDEN: `Efektler.tsx` gsap-core + ScrollTrigger + SplitText + Lenis
 * getiriyor (≈54 KB gz, bu repodan ölçüldü). Daha önce `layout.tsx`'te
 * STATİK import ediliyordu, yani her `/site` sayfasının ilk paketinde
 * duruyordu ve 3G'de LCP'yi yiyordu. Bu kapı onu ayrı bir parçaya alıp
 * İLK BOYAMADAN SONRA indiriyor.
 *
 * KAPI: `requestIdleCallback` (900 ms tavanla) VEYA ilk kullanıcı
 * etkileşimi — hangisi önce olursa. Tavan bilinçli olarak kısa:
 * `layout.tsx`'teki 4 saniye kuralı, `af-hazir` gelmezse `js-var`'ı
 * kaldırıp her şeyi açıyor. Kapı 4 saniyeye yaklaşırsa belirme
 * animasyonları sessizce iptal olur; 900 ms + parça indirme bu sınırın
 * çok altında kalır.
 *
 * `ssr: false` ZORUNLU: Efektler yalnız tarayıcıda anlamlı (Lenis,
 * ScrollTrigger, IntersectionObserver) ve sunucuda hiç çalışmamalı.
 * `next/dynamic` bunu ancak bir istemci bileşeninin içinde kabul ettiği
 * için bu sarmalayıcı var — `layout.tsx` sunucu bileşeni olarak kalıyor.
 *
 * Bu bileşen hiçbir şey çizmez; Efektler de `null` döndürür.
 */

const Efektler = dynamic(() => import('./Efektler'), { ssr: false });

const OLAYLAR = ['pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;

export default function EfektlerKapisi({ kokId = 'af-kok' }: { kokId?: string }) {
  const [yukle, setYukle] = useState(false);

  useEffect(() => {
    let kapandi = false;
    let zaman: number | undefined;
    const bostaVar = typeof window.requestIdleCallback === 'function';

    const kapat = () => {
      OLAYLAR.forEach((o) => window.removeEventListener(o, basla));
      if (zaman === undefined) return;
      if (bostaVar && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(zaman);
      } else {
        window.clearTimeout(zaman);
      }
      zaman = undefined;
    };

    function basla() {
      if (kapandi) return;
      kapandi = true;
      kapat();
      setYukle(true);
    }

    OLAYLAR.forEach((o) => window.addEventListener(o, basla, { passive: true, once: true }));
    zaman = bostaVar
      ? window.requestIdleCallback(basla, { timeout: 900 })
      : window.setTimeout(basla, 500);

    return () => {
      kapandi = true;
      kapat();
    };
  }, []);

  return yukle ? <Efektler kokId={kokId} /> : null;
}
