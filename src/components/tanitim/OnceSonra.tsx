'use client';

import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

type Props = {
  once: ReactNode;
  sonra: ReactNode;
  onceEtiket: string;
  sonraEtiket: string;
  etiket: string;
  ipucu: string;
  /** Ekran okuyucular için iki görselin kısa açıklaması */
  srAciklama: string;
};

/**
 * Sürüklenebilir önce/sonra karşılaştırması. Konum React durumu yerine
 * doğrudan CSS değişkeniyle güncellenir (her harekette yeniden çizim yok).
 * Dokunmatikte dikey kaydırma serbest (touch-action: pan-y), yatay
 * sürükleme kaydırıcıyı hareket ettirir.
 */
export default function OnceSonra({ once, sonra, onceEtiket, sonraEtiket, etiket, ipucu, srAciklama }: Props) {
  const kutuRef = useRef<HTMLDivElement>(null);
  const tutamacRef = useRef<HTMLDivElement>(null);
  const konum = useRef(50);
  const surukle = useRef<{ id: number; x: number; y: number; hareketli: boolean } | null>(null);
  const ipucuIptal = useRef<(() => void) | null>(null);

  const ayarla = (deger: number) => {
    const d = Math.min(100, Math.max(0, deger));
    konum.current = d;
    kutuRef.current?.style.setProperty('--tn-konum', `${d}%`);
    const t = tutamacRef.current;
    if (t) {
      t.setAttribute('aria-valuenow', String(Math.round(d)));
      t.setAttribute('aria-valuetext', `Önce %${Math.round(d)}, sonra %${100 - Math.round(d)}`);
    }
  };

  const noktadan = (clientX: number) => {
    const r = kutuRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    ayarla(((clientX - r.left) / r.width) * 100);
  };

  const ipucunuDurdur = () => {
    ipucuIptal.current?.();
    ipucuIptal.current = null;
  };

  // İlk görünüşte kısa bir "sürükleyebilirsin" hareketi
  useEffect(() => {
    const kutu = kutuRef.current;
    if (!kutu || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    const io = new IntersectionObserver(
      ([g]) => {
        if (!g?.isIntersecting) return;
        io.disconnect();
        const bas = performance.now();
        const sure = 1800;
        const adim = (t: number) => {
          const p = Math.min(1, (t - bas) / sure);
          // 50 → 28 → 72 → 50
          const dalga = Math.sin(p * Math.PI * 2) * (1 - p * 0.35);
          ayarla(50 - dalga * 22);
          if (p < 1) id = requestAnimationFrame(adim);
          else ayarla(50);
        };
        const gecikme = window.setTimeout(() => (id = requestAnimationFrame(adim)), 450);
        ipucuIptal.current = () => {
          window.clearTimeout(gecikme);
          cancelAnimationFrame(id);
        };
      },
      { threshold: 0.55 },
    );
    io.observe(kutu);
    return () => {
      io.disconnect();
      ipucuIptal.current?.();
    };
  }, []);

  const bas = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    ipucunuDurdur();
    surukle.current = { id: e.pointerId, x: e.clientX, y: e.clientY, hareketli: false };
    if (e.pointerType === 'mouse') {
      // Farede doğrudan tıklanan noktaya atla
      e.currentTarget.setPointerCapture(e.pointerId);
      surukle.current.hareketli = true;
      noktadan(e.clientX);
      e.preventDefault();
    }
  };

  const hareket = (e: PointerEvent<HTMLDivElement>) => {
    const s = surukle.current;
    if (!s || s.id !== e.pointerId) return;
    if (!s.hareketli) {
      const dx = Math.abs(e.clientX - s.x);
      const dy = Math.abs(e.clientY - s.y);
      if (dx < 6 || dx < dy) return;
      s.hareketli = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      kutuRef.current?.classList.add('is-surukleniyor');
    }
    noktadan(e.clientX);
  };

  const birak = (e: PointerEvent<HTMLDivElement>) => {
    const s = surukle.current;
    if (!s || s.id !== e.pointerId) return;
    // Dokunmatikte kısa dokunuş: o noktaya git
    if (!s.hareketli && e.type === 'pointerup') noktadan(e.clientX);
    surukle.current = null;
    kutuRef.current?.classList.remove('is-surukleniyor');
  };

  const tus = (e: KeyboardEvent<HTMLDivElement>) => {
    const adimlar: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -20,
      PageUp: 20,
    };
    if (e.key in adimlar) ayarla(konum.current + adimlar[e.key]);
    else if (e.key === 'Home') ayarla(0);
    else if (e.key === 'End') ayarla(100);
    else return;
    ipucunuDurdur();
    e.preventDefault();
  };

  return (
    <figure className="tn-os">
      <div
        ref={kutuRef}
        className="tn-os-kutu"
        onPointerDown={bas}
        onPointerMove={hareket}
        onPointerUp={birak}
        onPointerCancel={birak}
      >
        <div className="tn-os-katman tn-os-katman--once" aria-hidden="true">
          {once}
          <span className="tn-os-etiket tn-os-etiket--once">{onceEtiket}</span>
        </div>
        <div className="tn-os-katman tn-os-katman--sonra" aria-hidden="true">
          {sonra}
          <span className="tn-os-etiket tn-os-etiket--sonra">{sonraEtiket}</span>
        </div>
        {/* Ray tüm genişlikte; transform ile kayar (layout tetiklemez) */}
        <div className="tn-os-ray">
          <div
            ref={tutamacRef}
            className="tn-os-tutamac"
            role="slider"
            tabIndex={0}
            aria-label={etiket}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            aria-valuetext="Önce %50, sonra %50"
            aria-orientation="horizontal"
            onKeyDown={tus}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>
      <figcaption className="tn-os-ipucu">
        <span aria-hidden="true">↔</span> {ipucu}
        <span className="tn-sr"> {srAciklama}</span>
      </figcaption>
    </figure>
  );
}
