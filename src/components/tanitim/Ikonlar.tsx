import type { JSX, ReactNode } from 'react';
import type { HizmetIkonu } from './icerik';

/**
 * Tanıtım sitesinin satır içi SVG ikonları. Hepsi dekoratif (aria-hidden);
 * anlamı yanındaki metin ya da ebeveynin aria-label'ı taşır.
 * İstemci bileşenleri yalnızca ihtiyaç duyduğu adlandırılmış dışa aktarımı
 * içe aktarır; kalan ikonlar istemci paketine girmez.
 */

type Props = { className?: string };

function Cizgi({ className, children, kalinlik = 1.75 }: Props & { children: ReactNode; kalinlik?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={kalinlik}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ---------------- Genel ---------------- */

export const IkonOk = (p: Props) => (
  <Cizgi {...p} kalinlik={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Cizgi>
);

export const IkonOkSagUst = (p: Props) => (
  <Cizgi {...p} kalinlik={2}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Cizgi>
);

export const IkonTik = (p: Props) => (
  <Cizgi {...p} kalinlik={2.25}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Cizgi>
);

export const IkonArti = (p: Props) => (
  <Cizgi {...p} kalinlik={2}>
    <path d="M12 5v14M5 12h14" />
  </Cizgi>
);

export const IkonArama = (p: Props) => (
  <Cizgi {...p} kalinlik={2}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Cizgi>
);

export const IkonOynat = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" />
  </svg>
);

export const IkonKalp = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 20.5 10.6 19.2C5.4 14.5 2 11.4 2 7.6 2 4.5 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.5 22 7.6c0 3.8-3.4 6.9-8.6 11.6z"
      fill="currentColor"
    />
  </svg>
);

export const IkonYildiz = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 1.5c.6 5.4 3.1 8 8.5 8.5v4c-5.4.5-7.9 3.1-8.5 8.5h-.1c-.6-5.4-3.1-8-8.4-8.5V10c5.3-.5 7.8-3.1 8.4-8.5z" fill="currentColor" />
  </svg>
);

export const IkonKonum = (p: Props) => (
  <Cizgi {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Cizgi>
);

export const IkonInstagram = (p: Props) => (
  <Cizgi {...p} kalinlik={2}>
    <rect x="3" y="3" width="18" height="18" rx="5.2" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
  </Cizgi>
);

export const IkonWhatsApp = (p: Props) => (
  <Cizgi {...p} kalinlik={1.9}>
    <path d="M3.5 20.5 4.8 16.3A8.5 8.5 0 1 1 8 19.4z" />
    <path
      d="M9.2 7.8c-.4 0-.9.4-.9 1.3 0 2.9 3.6 6.6 6.6 6.6.9 0 1.3-.5 1.3-.9v-.9c0-.2-.1-.3-.3-.4l-1.6-.7c-.2-.1-.4 0-.5.1l-.6.7c-1.3-.5-2.4-1.6-2.9-2.9l.7-.6c.1-.1.2-.3.1-.5l-.7-1.6c-.1-.2-.2-.3-.4-.3z"
      fill="currentColor"
      stroke="none"
    />
  </Cizgi>
);

/** Instagram'ın mavi "onaylı hesap" rozeti (dalgalı daire + tik). */
const ROZET_YOLU = (() => {
  const noktalar: string[] = [];
  const adet = 64;
  for (let i = 0; i < adet; i++) {
    const a = (i / adet) * Math.PI * 2;
    const r = 10.2 + Math.cos(8 * a);
    noktalar.push(`${(12 + r * Math.cos(a)).toFixed(1)} ${(12 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${noktalar.join('L')}Z`;
})();

export const IkonOnayli = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={ROZET_YOLU} fill="#0095F6" />
    <path d="m7.6 12.2 3 3 5.8-6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------------- Hizmetler ---------------- */

const HIZMET: Record<HizmetIkonu, ReactNode> = {
  sosyal: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M12 16s-3.5-2.1-3.5-4.6A1.9 1.9 0 0 1 12 10.3a1.9 1.9 0 0 1 3.5 1.1C15.5 13.9 12 16 12 16z" />
    </>
  ),
  strateji: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  fotograf: (
    <>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2L9 4h6l1.5 2h2A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.8" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="m10 9.2 5 2.8-5 2.8z" />
    </>
  ),
  drone: (
    <>
      <rect x="9.5" y="10" width="5" height="4" rx="1.2" />
      <path d="M9.5 10.5 6.5 7.5M14.5 10.5l3-3M9.5 13.5l-3 3M14.5 13.5l3 3" />
      <ellipse cx="5.5" cy="6.5" rx="3" ry="1" />
      <ellipse cx="18.5" cy="6.5" rx="3" ry="1" />
      <ellipse cx="5.5" cy="17.5" rx="3" ry="1" />
      <ellipse cx="18.5" cy="17.5" rx="3" ry="1" />
    </>
  ),
  reklam: (
    <>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  buyume: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M19 15V6M16 9l3-3 3 3" />
    </>
  ),
  analiz: (
    <>
      <path d="M3 21h18" />
      <rect x="5" y="11" width="3" height="7" rx="1" />
      <rect x="10.5" y="7" width="3" height="11" rx="1" />
      <rect x="16" y="3" width="3" height="15" rx="1" />
    </>
  ),
  web: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M2.5 8.5h19" />
      <path d="m10 12-2.5 2.5L10 17M14 12l2.5 2.5L14 17" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20.5v.5M20.5 14h.5" />
    </>
  ),
  tasarim: (
    <>
      <path d="m12 19 7-7 3 3-7 7z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z" />
      <path d="m2 2 7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </>
  ),
  google: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <path d="m12 6.6 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" />
    </>
  ),
};

export function HizmetIkonu({ ad, className }: { ad: HizmetIkonu; className?: string }): JSX.Element {
  return <Cizgi className={className}>{HIZMET[ad]}</Cizgi>;
}

/* ---------------- Neden Ajans Flow ---------------- */

export const IkonKatman = (p: Props) => (
  <Cizgi {...p}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
  </Cizgi>
);

export const IkonKamera = (p: Props) => <Cizgi {...p}>{HIZMET.fotograf}</Cizgi>;

export const IkonGrafik = (p: Props) => (
  <Cizgi {...p}>
    <path d="M3 3v18h18" />
    <path d="m7 15 4-4 3 3 6-6" />
  </Cizgi>
);

export const IkonSohbet = (p: Props) => (
  <Cizgi {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
  </Cizgi>
);
