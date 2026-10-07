import { Fragment } from 'react';
import { siteYolu } from '@/lib/site';
import type { IzOgesi } from './kurumsal';
import './kurumsal.css';

/**
 * Site izi (breadcrumb). Son öge bağlantı değildir ve `aria-current` taşır.
 * Yapısal verisi için `izYapisalVerisi()` ile aynı listeyi kullanın.
 */
export default function Iz({ ogeler }: { ogeler: readonly IzOgesi[] }) {
  return (
    <nav className="af-kr-iz" aria-label="Site izi">
      {ogeler.map((o, i) => {
        const sonuncu = i === ogeler.length - 1;
        return (
          <Fragment key={o.yol}>
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {sonuncu ? (
              <span aria-current="page">{o.ad}</span>
            ) : (
              <a href={siteYolu(o.yol)}>{o.ad}</a>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
