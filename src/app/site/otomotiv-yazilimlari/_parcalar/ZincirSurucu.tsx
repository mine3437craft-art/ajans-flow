'use client';

import { useEffect } from 'react';

/**
 * Zincir şemasının kaydırma sürücüsü. Hiçbir şey basmaz: şemayı id ile
 * bulur, `--af-zincir-oran` (0–1) ve `data-adim` değerlerini yazar.
 *
 * Korumalar:
 *   - `prefers-reduced-motion: reduce` → hiç bağlanmaz, şema tam çizili kalır.
 *   - `saveData` / 2g-3g → aynı şekilde bağlanmaz.
 *   - Ekran dışındaysa hesap yapılmaz (IntersectionObserver).
 *   - Tek rAF, tek pasif dinleyici.
 */
export default function ZincirSurucu({ hedef, durak = 4 }: { hedef: string; durak?: number }) {
  useEffect(() => {
    const el = document.getElementById(hedef);
    if (!el) return;

    const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    type Bagli = { saveData?: boolean; effectiveType?: string };
    const bag = (navigator as Navigator & { connection?: Bagli }).connection;
    const yavas = Boolean(bag?.saveData) || /^(slow-)?2g$/.test(bag?.effectiveType ?? '');
    if (azHareket || yavas) return;

    el.classList.add('is-canli');

    let ekranda = true;
    let bekleyen = 0;
    let sonOran = -1;
    let sonAdim = -1;

    const yaz = () => {
      bekleyen = 0;
      const k = el.getBoundingClientRect();
      const yh = window.innerHeight || 1;
      // Başlangıç: şemanın tepesi ekranın %72'sine geldiğinde
      // Bitiş: şemanın altı ekranın %45'ine geldiğinde
      const yol = Math.max(1, k.height + yh * 0.72 - yh * 0.45);
      const oran = Math.min(1, Math.max(0, (yh * 0.72 - k.top) / yol));

      if (Math.abs(oran - sonOran) > 0.002) {
        sonOran = oran;
        el.style.setProperty('--af-zincir-oran', oran.toFixed(4));
      }
      // Kaçıncı durak geçildi: 0 → hiçbiri, 4 → hepsi
      const adim = oran <= 0 ? 0 : Math.min(durak, Math.ceil(oran * durak));
      if (adim !== sonAdim) {
        sonAdim = adim;
        el.dataset.adim = String(adim);
      }
    };

    const tetikle = () => {
      if (!ekranda || bekleyen) return;
      bekleyen = requestAnimationFrame(yaz);
    };

    const gozcu = new IntersectionObserver(
      ([giris]) => {
        ekranda = giris.isIntersecting;
        if (ekranda) tetikle();
      },
      { rootMargin: '25% 0px 25% 0px' },
    );
    gozcu.observe(el);

    window.addEventListener('scroll', tetikle, { passive: true });
    window.addEventListener('resize', tetikle);
    yaz();

    return () => {
      gozcu.disconnect();
      window.removeEventListener('scroll', tetikle);
      window.removeEventListener('resize', tetikle);
      if (bekleyen) cancelAnimationFrame(bekleyen);
      el.classList.remove('is-canli');
      el.style.removeProperty('--af-zincir-oran');
    };
  }, [hedef, durak]);

  return null;
}
