import type { ReactNode } from 'react';

export type SssOgesi = { soru: string; cevap: ReactNode };

type Props = {
  sorular: readonly SssOgesi[];
  /** Aynı anda tek cevap açık kalsın (<details name> ile, JS'siz çalışır). */
  tekli?: boolean;
  /** Tarayıcı grubu adı — aynı sayfada iki SSS varsa farklı verin. */
  grup?: string;
  /** İlk soru açık başlasın. */
  ilkAcik?: boolean;
  /** Soruların başlık düzeyi (sayfa başlık sırasını bozmamak için). */
  soruEtiketi?: 'h3' | 'h4';
  sinif?: string;
};

/**
 * `<details>` tabanlı SSS akordeonu — JavaScript olmadan da çalışır.
 * Google FAQPage şeması KULLANILMAZ (Google kaldırdı, SITE-TASARIM.md §9).
 *
 *   <SSS sorular={hizmet.sss} />
 */
export default function SSS({
  sorular,
  tekli = true,
  grup = 'af-sss',
  ilkAcik = false,
  soruEtiketi: Soru = 'h3',
  sinif,
}: Props) {
  if (!sorular.length) return null;
  return (
    <div className={['af-sss', sinif ?? ''].filter(Boolean).join(' ')}>
      {sorular.map((s, i) => (
        <details
          key={s.soru}
          className="af-sss-oge"
          name={tekli ? grup : undefined}
          open={ilkAcik && i === 0}
          data-belir
          style={{ ['--i' as string]: i } as React.CSSProperties}
        >
          <summary className="af-sss-soru">
            <Soru className="af-sss-soru-yazi">{s.soru}</Soru>
            <span className="af-sss-isaret" aria-hidden="true" />
          </summary>
          <div className="af-sss-cevap">
            {typeof s.cevap === 'string' ? <p>{s.cevap}</p> : s.cevap}
          </div>
        </details>
      ))}
    </div>
  );
}
