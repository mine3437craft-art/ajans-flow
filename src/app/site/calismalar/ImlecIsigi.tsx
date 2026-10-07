'use client';

import { useEffect } from 'react';

/**
 * İMLEÇ IŞIĞI — vitrin kartlarında imlecin peşinden gelen tek ışık havuzu.
 *
 * Neden ayrı ve küçük bir istemci bileşeni:
 *   - Kart başına dinleyici YOK: belgede TEK `pointermove` (passive).
 *   - Yazdığı tek şey iki CSS değişkeni (`--vk-ix` / `--vk-iy`); boyama
 *     maliyeti kartın kendi `radial-gradient`inde kalır, düzen okunmaz.
 *   - rAF ile kareye bir yazım; kendi döngüsü yok.
 *   - Ek paket YOK (GSAP'e de dokunmaz).
 *
 * KAPILAR (hepsi birlikte): ince imleç + hover destekli cihaz, az
 * hareket isteği yok, veri tasarrufu yok. Mobilde hiç çalışmaz; ışık
 * CSS'te de `@media (hover: hover)` altında tanımlı, yani JS gelmese ya
 * da bu bileşen hiç çalışmasa kartlar bozulmaz.
 */
export default function ImlecIsigi() {
  useEffect(() => {
    const ince = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!ince.matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ag = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (ag?.saveData) return;

    let hedef: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let bekler = false;

    const yaz = () => {
      bekler = false;
      if (!hedef) return;
      hedef.style.setProperty('--vk-ix', `${x}px`);
      hedef.style.setProperty('--vk-iy', `${y}px`);
    };

    const birak = () => {
      if (!hedef) return;
      hedef.removeAttribute('data-vk-isik-acik');
      hedef.style.removeProperty('--vk-ix');
      hedef.style.removeProperty('--vk-iy');
      hedef = null;
    };

    const hareket = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const kart = el?.closest?.('[data-vk-isik]') as HTMLElement | null;
      if (kart !== hedef) {
        birak();
        hedef = kart;
        hedef?.setAttribute('data-vk-isik-acik', '');
      }
      if (!hedef) return;
      const k = hedef.getBoundingClientRect();
      x = e.clientX - k.left;
      y = e.clientY - k.top;
      if (!bekler) {
        bekler = true;
        requestAnimationFrame(yaz);
      }
    };

    document.addEventListener('pointermove', hareket, { passive: true });
    document.addEventListener('pointerleave', birak);
    return () => {
      document.removeEventListener('pointermove', hareket);
      document.removeEventListener('pointerleave', birak);
      birak();
    };
  }, []);

  return null;
}
