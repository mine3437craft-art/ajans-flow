import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type DugmeTuru = 'birincil' | 'ikincil' | 'hayalet';

type OrtakProps = {
  /** birincil = dolu turuncu · ikincil = çerçeveli · hayalet = çerçevesiz */
  tur?: DugmeTuru;
  buyuk?: boolean;
  /** Tam genişlik (mobil blok düğme) */
  blok?: boolean;
  /** WhatsApp yeşili ikon rengi */
  whatsapp?: boolean;
  /** Mıknatıs efekti (yalnız ince imleçte çalışır). Varsayılan: birincil + buyuk */
  miknatis?: boolean;
  sinif?: string;
  children: ReactNode;
};

type BagProps = OrtakProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'children'
  >;
type DugmeProps = OrtakProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >;

export type Props = BagProps | DugmeProps;

function sinifla({ tur = 'birincil', buyuk, blok, whatsapp, sinif }: Omit<OrtakProps, 'children'>): string {
  return [
    'af-dugme',
    `af-dugme--${tur}`,
    buyuk ? 'af-dugme--buyuk' : '',
    blok ? 'af-dugme--blok' : '',
    whatsapp ? 'af-dugme--wa' : '',
    sinif ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** Dış bağlantı mı? (http/mailto/tel/wa.me — yeni sekme + rel) */
function disBaglanti(href: string): boolean {
  return /^(https?:)?\/\//.test(href);
}

/**
 * Tek düğme bileşeni. `href` verilirse <a>, verilmezse <button type="button">
 * basılır — yanlış öğe seçilmesi mümkün değil.
 *
 *   <Dugme href={siteYolu('/iletisim')}>Ücretsiz analiz</Dugme>
 *   <Dugme tur="ikincil" href={whatsappBaglantisi('…')} whatsapp>WhatsApp</Dugme>
 *   <Dugme tur="hayalet" onClick={fn}>Temizle</Dugme>   // istemci bileşeninde
 */
export default function Dugme(props: Props) {
  const { tur = 'birincil', buyuk, blok, whatsapp, miknatis, sinif, children, ...kalan } = props;
  const className = sinifla({ tur, buyuk, blok, whatsapp, sinif });
  const miknatisli = miknatis ?? (tur === 'birincil' && Boolean(buyuk));
  const miknatisAttr = miknatisli ? { 'data-miknatis': '' } : {};

  if (typeof kalan.href === 'string') {
    const { href, target, rel, ...bag } = kalan as BagProps;
    const dis = disBaglanti(href);
    return (
      <a
        className={className}
        href={href}
        target={target ?? (dis ? '_blank' : undefined)}
        rel={rel ?? (dis ? 'noopener noreferrer' : undefined)}
        {...miknatisAttr}
        {...bag}
      >
        {children}
      </a>
    );
  }

  const { type, ...dugme } = kalan as DugmeProps;
  return (
    <button className={className} type={type ?? 'button'} {...miknatisAttr} {...dugme}>
      {children}
    </button>
  );
}
