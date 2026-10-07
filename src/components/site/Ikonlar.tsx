/**
 * Satır içi SVG ikon seti. Hiçbir ikon kütüphanesi yok, hepsi `currentColor`
 * kullanır ve boyutu CSS'ten (`width`/`height` ya da `.af-dugme svg`) alır.
 *
 * Kullanım:
 *   <IkonWhatsApp />                       // tek ikon
 *   <Ikon ad="qr" />                       // veriden gelen ad ile
 *
 * Yeni ikon eklerken: 24x24 kutu, 1.6 kalınlık, yuvarlak uç, `fill="none"`.
 */

export type IkonAdi =
  | 'whatsapp'
  | 'instagram'
  | 'telefon'
  | 'eposta'
  | 'konum'
  | 'ok'
  | 'ok-sag-ust'
  | 'ok-asagi'
  | 'tik'
  | 'arti'
  | 'qr'
  | 'kamera'
  | 'drone'
  | 'grafik'
  | 'kod'
  | 'menu'
  | 'kapat'
  | 'oynat'
  | 'arama'
  | 'kalkan'
  | 'kalem'
  | 'megafon'
  | 'kutu'
  | 'yildiz';

type Props = {
  className?: string;
  /** Süsleme ikonlarında true (varsayılan); anlamlı ikonda başlık ver. */
  baslik?: string;
};

function Kutu({ children, className, baslik }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={baslik ? undefined : true}
      role={baslik ? 'img' : undefined}
      focusable="false"
    >
      {baslik ? <title>{baslik}</title> : null}
      {children}
    </svg>
  );
}

/** Dolgu (stroke yok) ikonlar için kutu — marka logoları. */
function DoluKutu({ children, className, baslik }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden={baslik ? undefined : true}
      role={baslik ? 'img' : undefined}
      focusable="false"
    >
      {baslik ? <title>{baslik}</title> : null}
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* İletişim                                                            */
/* ------------------------------------------------------------------ */

export const IkonWhatsApp = (p: Props) => (
  <DoluKutu {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.69-8.23 8.23-8.23 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.23 8.24Zm4.52-6.17c-.25-.12-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.25-.67.84-.82 1.01-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.12-.12.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.37-.77-1.87-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.09s.9 2.43 1.02 2.6c.12.17 1.74 2.79 4.23 3.81.59.25 1.05.4 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.52-.62 1.73-1.23.21-.6.21-1.12.15-1.23-.06-.11-.23-.18-.48-.3Z" />
  </DoluKutu>
);

export const IkonInstagram = (p: Props) => (
  <Kutu {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </Kutu>
);

export const IkonTelefon = (p: Props) => (
  <Kutu {...p}>
    <path d="M6.6 3.5h-.9A2.2 2.2 0 0 0 3.5 5.9c.3 3.5 1.9 6.8 4.4 9.3 2.5 2.5 5.8 4.1 9.3 4.4a2.2 2.2 0 0 0 2.4-2.2v-1.6a1.5 1.5 0 0 0-1.2-1.5l-2.6-.5a1.5 1.5 0 0 0-1.5.6l-.6.8a12.4 12.4 0 0 1-4.5-4.5l.8-.6a1.5 1.5 0 0 0 .6-1.5L9.6 4.7a1.5 1.5 0 0 0-1.5-1.2h-1.5Z" />
  </Kutu>
);

export const IkonEposta = (p: Props) => (
  <Kutu {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.6 7 12 13l8.4-6" />
  </Kutu>
);

export const IkonKonum = (p: Props) => (
  <Kutu {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Kutu>
);

/* ------------------------------------------------------------------ */
/* Gezinme ve durum                                                    */
/* ------------------------------------------------------------------ */

export const IkonOk = (p: Props) => (
  <Kutu {...p}>
    <path d="M4.5 12h15" />
    <path d="M13.5 6l6 6-6 6" />
  </Kutu>
);

export const IkonOkSagUst = (p: Props) => (
  <Kutu {...p}>
    <path d="M7 17 17 7" />
    <path d="M8.5 7H17v8.5" />
  </Kutu>
);

export const IkonOkAsagi = (p: Props) => (
  <Kutu {...p}>
    <path d="M12 4.5v15" />
    <path d="M6 13.5l6 6 6-6" />
  </Kutu>
);

export const IkonTik = (p: Props) => (
  <Kutu {...p}>
    <path d="M4.5 12.8 9.3 17.5 19.5 7" />
  </Kutu>
);

export const IkonArti = (p: Props) => (
  <Kutu {...p}>
    <path d="M12 5v14M5 12h14" />
  </Kutu>
);

export const IkonMenu = (p: Props) => (
  <Kutu {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Kutu>
);

export const IkonKapat = (p: Props) => (
  <Kutu {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Kutu>
);

export const IkonArama = (p: Props) => (
  <Kutu {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Kutu>
);

export const IkonOynat = (p: Props) => (
  <DoluKutu {...p}>
    <path d="M8 5.6v12.8c0 .8.9 1.3 1.6.9l9.9-6.4c.6-.4.6-1.4 0-1.8L9.6 4.7A1.1 1.1 0 0 0 8 5.6Z" />
  </DoluKutu>
);

export const IkonYildiz = (p: Props) => (
  <Kutu {...p}>
    <path d="M12 3.8l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8L12 3.8Z" />
  </Kutu>
);

/* ------------------------------------------------------------------ */
/* Hizmet / ürün ikonları                                              */
/* ------------------------------------------------------------------ */

export const IkonQr = (p: Props) => (
  <Kutu {...p}>
    <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9" />
    <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9" />
    <path d="M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15" />
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15" />
    <rect x="7.6" y="7.6" width="3.4" height="3.4" rx="0.6" />
    <path d="M13 7.6h3.4M13 11h1.6M16.4 11v2.4M7.6 13h2.4M7.6 16.4h3.4M13.6 16.4h2.8M11.8 13.8h1.2" />
  </Kutu>
);

export const IkonKamera = (p: Props) => (
  <Kutu {...p}>
    <path d="M3 8.5A2 2 0 0 1 5 6.5h6.6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7Z" />
    <path d="M13.6 11.6 19 8.6a.8.8 0 0 1 1.2.7v5.4a.8.8 0 0 1-1.2.7l-5.4-3v-1.8Z" />
  </Kutu>
);

export const IkonDrone = (p: Props) => (
  <Kutu {...p}>
    <rect x="9" y="9.6" width="6" height="4.8" rx="1.4" />
    <path d="M9.4 9.8 6.2 6.6M14.6 9.8l3.2-3.2M9.4 14.2l-3.2 3.2M14.6 14.2l3.2 3.2" />
    <path d="M3.6 6.6h5.2M15.2 6.6h5.2M3.6 17.4h5.2M15.2 17.4h5.2" />
  </Kutu>
);

export const IkonGrafik = (p: Props) => (
  <Kutu {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 20v-5.5M12.6 20V9M17.2 20v-8" />
  </Kutu>
);

export const IkonKod = (p: Props) => (
  <Kutu {...p}>
    <path d="M9 7.5 4.5 12 9 16.5" />
    <path d="M15 7.5 19.5 12 15 16.5" />
    <path d="M13.2 5.4 10.8 18.6" />
  </Kutu>
);

export const IkonMegafon = (p: Props) => (
  <Kutu {...p}>
    <path d="M4 10.4v3.2a1.4 1.4 0 0 0 1.4 1.4h2L13 19V5l-5.6 4h-2A1.4 1.4 0 0 0 4 10.4Z" />
    <path d="M16.6 9.2a4 4 0 0 1 0 5.6M19 6.8a7.4 7.4 0 0 1 0 10.4" />
  </Kutu>
);

export const IkonKalkan = (p: Props) => (
  <Kutu {...p}>
    <path d="M12 3.5 5 6v5.4c0 4.1 2.8 7.8 7 9.1 4.2-1.3 7-5 7-9.1V6l-7-2.5Z" />
    <path d="M9 12.2l2.2 2.2 4-4" />
  </Kutu>
);

export const IkonKalem = (p: Props) => (
  <Kutu {...p}>
    <path d="M16.4 4.6a2 2 0 0 1 2.8 2.8L8.6 18H5v-3.6L16.4 4.6Z" />
    <path d="M14.4 6.6 17 9.2" />
  </Kutu>
);

export const IkonKutu = (p: Props) => (
  <Kutu {...p}>
    <path d="M12 3.6 20 7.4v9.2L12 20.4 4 16.6V7.4l8-3.8Z" />
    <path d="M4 7.4 12 11.2l8-3.8M12 11.2v9.2" />
  </Kutu>
);

/* ------------------------------------------------------------------ */
/* Ada göre dağıtıcı — içerik verisinden ikon seçmek için              */
/* ------------------------------------------------------------------ */

export const IKONLAR: Record<IkonAdi, (p: Props) => React.JSX.Element> = {
  whatsapp: IkonWhatsApp,
  instagram: IkonInstagram,
  telefon: IkonTelefon,
  eposta: IkonEposta,
  konum: IkonKonum,
  ok: IkonOk,
  'ok-sag-ust': IkonOkSagUst,
  'ok-asagi': IkonOkAsagi,
  tik: IkonTik,
  arti: IkonArti,
  qr: IkonQr,
  kamera: IkonKamera,
  drone: IkonDrone,
  grafik: IkonGrafik,
  kod: IkonKod,
  menu: IkonMenu,
  kapat: IkonKapat,
  oynat: IkonOynat,
  arama: IkonArama,
  kalkan: IkonKalkan,
  kalem: IkonKalem,
  megafon: IkonMegafon,
  kutu: IkonKutu,
  yildiz: IkonYildiz,
};

export function Ikon({ ad, ...p }: Props & { ad: IkonAdi }) {
  const Bilesen = IKONLAR[ad] ?? IkonKutu;
  return <Bilesen {...p} />;
}

/* ------------------------------------------------------------------ */
/* AJANS FLOW MARKA SEMBOLÜ                                            */
/*                                                                     */
/* Kaynak dosya: public/site/marka/flow-sembol.svg (marka sahibinden). */
/* SITE-TASARIM.md §3 "Marka sembolü": germe/çarpıtma, renk değiştirme */
/* ve gölge YOK; koyu ve açık zeminde olduğu gibi durur.               */
/*                                                                     */
/* Gradyanlı sürüm <img> ile basılır: gradyan id'leri sayfa içinde     */
/* çakışmaz, dosya önbelleğe alınır ve sunucu bileşeninde çalışır.     */
/* ------------------------------------------------------------------ */

export const SEMBOL_YOLU = '/site/marka/flow-sembol.svg';

/** Gradyanlı sembol (asıl marka işareti). */
export function FlowSembol({ className, boyut = 32 }: Props & { boyut?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SEMBOL_YOLU}
      alt=""
      width={boyut}
      height={Math.round((boyut * 880) / 800)}
      className={className}
      aria-hidden="true"
      decoding="async"
    />
  );
}

/**
 * Tek renk (currentColor) sembol — filigran, koyu bantta dev arka plan,
 * yükleme göstergesi. Gradyan yok, bu yüzden id çakışması da yok.
 */
export const FlowSembolTek = (p: Props) => (
  <svg
    viewBox="270 190 800 880"
    className={p.className}
    fill="currentColor"
    aria-hidden={p.baslik ? undefined : true}
    role={p.baslik ? 'img' : undefined}
    focusable="false"
  >
    {p.baslik ? <title>{p.baslik}</title> : null}
    <path d="M383 817 L383 507 C383 380 480 280 604 280 L823 280 C899 280 961 267 1010 237 C974 386 890 473 744 473 L704 473 C556 473 470 575 383 817 Z" />
    <path d="M315 1022 C377 824 445 665 549 592 C600 556 649 540 710 540 L786 540 C837 540 877 537 906 527 C875 634 814 697 711 697 L646 697 C605 697 590 718 584 762 C575 849 541 901 451 945 C397 971 350 996 315 1022 Z" />
  </svg>
);

/**
 * Üst bar ve alt bilgi kilidi: sembol + "AJANS FLOW" kelime-işareti.
 * Dar ekranda yalnız sembol kalır (`.af-logo-yazi` gizlenir).
 */
export function MarkaLogosu({
  boyut = 30,
  yaziGizle,
  className,
}: {
  boyut?: number;
  /** Kelime-işareti hiç basma (yalnız sembol). */
  yaziGizle?: boolean;
  className?: string;
}) {
  return (
    <span className={['af-logo-kilit', className ?? ''].filter(Boolean).join(' ')}>
      <FlowSembol className="af-logo-sembol" boyut={boyut} />
      {yaziGizle ? null : (
        <span className="af-logo-yazi" aria-hidden="true">
          <span>AJANS</span>
          <span>FLOW</span>
        </span>
      )}
    </span>
  );
}
