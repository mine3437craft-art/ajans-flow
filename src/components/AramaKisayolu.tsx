'use client';

import { useEffect } from 'react';

/** "/" tuşu arama kutusuna odaklanır — bir yazı alanındayken devreye girmez. */
export default function AramaKisayolu({ hedefId }: { hedefId: string }) {
  useEffect(() => {
    const dinle = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const aktif = document.activeElement?.tagName;
      if (aktif === 'INPUT' || aktif === 'TEXTAREA' || aktif === 'SELECT') return;
      const kutu = document.getElementById(hedefId) as HTMLInputElement | null;
      if (!kutu) return;
      e.preventDefault();
      kutu.focus();
      kutu.select();
    };
    window.addEventListener('keydown', dinle);
    return () => window.removeEventListener('keydown', dinle);
  }, [hedefId]);
  return null;
}
