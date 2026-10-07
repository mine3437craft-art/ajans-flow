import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Çerçevenin altında mono alt yazı (ör. "iPhone 14 · Kule İstanbul menüsü") */
  altyazi?: string;
  sinif?: string;
};

/**
 * Telefon çerçevesi — saf CSS (1px kenar, iç içe radius, tek iç gölge).
 * İçine ne konursa ekranı kaplar: <img>, <Video>, canlı demo, iframe.
 *
 *   <CerceveTelefon altyazi="QR menü — mobil">
 *     <img src={medyaYolu('foto/kule-istanbul-qr-menu-mobil.jpg')} alt="…" />
 *   </CerceveTelefon>
 */
export function CerceveTelefon({ children, altyazi, sinif, boy }: Props & { boy?: 'kucuk' | 'buyuk' }) {
  return (
    <div className={sinif}>
      <div className={['af-cerceve-telefon', boy ? `af-cerceve-telefon--${boy}` : ''].filter(Boolean).join(' ')}>
        <div className="af-cerceve-ekran">{children}</div>
      </div>
      {altyazi ? <p className="af-cerceve-altyazi">{altyazi}</p> : null}
    </div>
  );
}

/**
 * Dizüstü çerçevesi — 16/10 ekran + taban. Ürün/panel ekran görüntüleri için.
 */
export function CerceveDizustu({ children, altyazi, sinif }: Props) {
  return (
    <div className={['af-cerceve-dizustu', sinif ?? ''].filter(Boolean).join(' ')}>
      <div className="af-cerceve-dizustu-kapak">
        <div className="af-cerceve-ekran">{children}</div>
      </div>
      <div className="af-cerceve-dizustu-taban" aria-hidden="true" />
      {altyazi ? <p className="af-cerceve-altyazi">{altyazi}</p> : null}
    </div>
  );
}
