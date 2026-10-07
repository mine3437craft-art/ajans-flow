'use client';

import { useEffect } from 'react';

type Baglanti = { saveData?: boolean; effectiveType?: string };

/**
 * İMLEÇ IŞIĞI — `[data-isik]` taşıyan kartlarda ışık havuzu imleci izler.
 *
 * Kütüphane yok, GSAP yok, bileşen başına dinleyici yok: belgede TEK
 * `pointermove` dinleyicisi var ve yazma işi `requestAnimationFrame` ile
 * kareye bir kez indirgeniyor. Yazdığı tek şey iki CSS değişkeni
 * (`--kr-ix` / `--kr-iy`); düzen okunmaz, sınıf eklenmez.
 *
 * Bir YÜKSELTMEDİR, bilginin yolu değil: bu bileşen hiç gelmezse CSS
 * havuzu kartın üst kenarından açar (`plaka.css` §5) ve hover hissi
 * aynen durur.
 *
 * Kapılar: kaba imleç (dokunmatik) → hiç kurulmaz · `saveData` /
 * 2g-slow-2g → hiç kurulmaz · fare dışı pointer olayları atlanır.
 * `prefers-reduced-motion` burada kapatılmaz çünkü hareket eden bir şey
 * yok: havuz yalnız imlecin ZATEN bulunduğu yere konumlanıyor ve
 * opaklık geçişini site.css'teki genel kural 0,001 ms'ye çekiyor.
 */
export default function Isik() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const baglanti = (navigator as Navigator & { connection?: Baglanti }).connection;
    if (
      baglanti?.saveData === true ||
      /(^|-)(2g|slow-2g)$/.test(baglanti?.effectiveType ?? '')
    ) {
      return;
    }

    let kare = 0;
    let hedef: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const birak = (el: HTMLElement | null) => {
      el?.style.removeProperty('--kr-ix');
      el?.style.removeProperty('--kr-iy');
    };

    const yaz = () => {
      kare = 0;
      if (!hedef) return;
      const kutu = hedef.getBoundingClientRect();
      if (!kutu.width || !kutu.height) return;
      hedef.style.setProperty('--kr-ix', `${((x - kutu.left) / kutu.width) * 100}%`);
      hedef.style.setProperty('--kr-iy', `${((y - kutu.top) / kutu.height) * 100}%`);
    };

    const hareket = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const hedefOge = e.target as Element | null;
      const yeni = hedefOge?.closest?.('[data-isik]') as HTMLElement | null;
      if (yeni !== hedef) {
        birak(hedef);
        hedef = yeni;
      }
      if (!hedef) return;
      x = e.clientX;
      y = e.clientY;
      if (!kare) kare = window.requestAnimationFrame(yaz);
    };

    document.addEventListener('pointermove', hareket, { passive: true });
    return () => {
      document.removeEventListener('pointermove', hareket);
      if (kare) window.cancelAnimationFrame(kare);
      birak(hedef);
      hedef = null;
    };
  }, []);

  return null;
}
