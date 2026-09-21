'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavBaglanti } from './icerik';
import { IkonInstagram, IkonWhatsApp } from './Ikonlar';

type Props = {
  kokId: string;
  baglantilar: NavBaglanti[];
  instagramDm: string;
  instagramProfil: string;
  instagram: string;
  whatsapp: string | null;
};

/** Mobil hamburger + tam ekran menü. Açıkken sayfa kaydırması kilitlenir. */
export default function MobilMenu({ kokId, baglantilar, instagramDm, instagramProfil, instagram, whatsapp }: Props) {
  const [acik, setAcik] = useState(false);
  const dugmeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const kapat = useCallback((odakGeriDonsun = true) => {
    setAcik(false);
    if (odakGeriDonsun) dugmeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const kok = document.getElementById(kokId);
    kok?.classList.toggle('tn-menu-acik', acik);
    if (!acik) return;

    const eskiTasma = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });

    const tus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        kapat();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current || !dugmeRef.current) return;
      // Odak menü ile kapatma düğmesi arasında dönsün
      const odaklanabilir = [dugmeRef.current, ...Array.from(panelRef.current.querySelectorAll<HTMLElement>('a, button'))];
      const ilk = odaklanabilir[0];
      const son = odaklanabilir[odaklanabilir.length - 1];
      if (e.shiftKey && document.activeElement === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && document.activeElement === son) {
        e.preventDefault();
        ilk.focus();
      }
    };
    const genislik = window.matchMedia('(min-width: 960px)');
    const genisDegisti = () => genislik.matches && kapat(false);
    // Menü açıkken üst bardaki logo gibi sayfa içi bir bağlantıya
    // dokunulursa menü de kapansın (yoksa arkada sayfa kayıp menü açık kalıyordu).
    const capa = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (a && !panelRef.current?.contains(a)) kapat(false);
    };

    document.addEventListener('keydown', tus);
    genislik.addEventListener('change', genisDegisti);
    kok?.addEventListener('click', capa);
    return () => {
      document.body.style.overflow = eskiTasma;
      document.removeEventListener('keydown', tus);
      genislik.removeEventListener('change', genisDegisti);
      kok?.removeEventListener('click', capa);
    };
  }, [acik, kokId, kapat]);

  useEffect(() => () => document.getElementById(kokId)?.classList.remove('tn-menu-acik'), [kokId]);

  return (
    <>
      <button
        ref={dugmeRef}
        type="button"
        className="tn-hamburger"
        aria-expanded={acik}
        aria-controls="tn-mobil-menu"
        aria-label={acik ? 'Menüyü kapat' : 'Menüyü aç'}
        onClick={() => setAcik((a) => !a)}
      >
        <span />
        <span />
      </button>

      <div
        ref={panelRef}
        id="tn-mobil-menu"
        className="tn-mobil-menu"
        data-acik={acik}
        inert={!acik}
        role="dialog"
        aria-modal="true"
        aria-label="Site menüsü"
      >
        <nav aria-label="Mobil menü">
          <ol className="tn-mobil-liste">
            {baglantilar.map((b, i) => (
              <li key={b.href} style={{ '--i': i } as React.CSSProperties}>
                <a href={b.href} onClick={() => kapat(false)}>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  {b.etiket}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="tn-mobil-alt">
          <a className="tn-dugme tn-dugme--birincil tn-dugme--blok" href={instagramDm} target="_blank" rel="noopener noreferrer">
            <IkonInstagram className="tn-dugme-ikon" />
            Instagram’dan DM gönder
          </a>
          {whatsapp && (
            <a className="tn-dugme tn-dugme--wa tn-dugme--blok" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <IkonWhatsApp className="tn-dugme-ikon" />
              WhatsApp’tan yaz
            </a>
          )}
          <a className="tn-mobil-profil" href={instagramProfil} target="_blank" rel="noopener noreferrer">
            @{instagram} · İstanbul / 4.Levent
          </a>
        </div>
      </div>
    </>
  );
}
