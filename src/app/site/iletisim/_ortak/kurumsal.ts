/**
 * Kurumsal sayfaların (hakkımızda, iletişim, teşekkürler, KVKK, gizlilik,
 * analiz) ortak yardımcıları. Metin yoktur; yalnız yapı.
 *
 * Bu klasör bir rota DEĞİLDİR: Next.js alt çizgiyle başlayan klasörleri
 * yönlendirmeye almaz.
 */

import type { CSSProperties } from 'react';

const TR_HARFLER: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  â: 'a',
  î: 'i',
  û: 'u',
};

/** Başlıktan kalıcı bir çapa kimliği üretir: "Veri sorumlusu" → "veri-sorumlusu". */
export function basligaId(metin: string): string {
  return metin
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşüâîû]/g, (h) => TR_HARFLER[h] ?? h)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type IzOgesi = {
  ad: string;
  /** Site içi yol ("/iletisim"). Son öge de yolunu verir; bağlantı basılmaz. */
  yol: string;
};

/** BreadcrumbList yapısal verisi. Yollar tam adrese çevrilir. */
export function izYapisalVerisi(kok: string, ogeler: readonly IzOgesi[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: ogeler.map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: o.ad,
      item: `${kok}${o.yol === '/' ? '' : o.yol}`,
    })),
  };
}

/** `data-belir` kardeşlerinde kademe sırası. */
export function kademe(i: number): CSSProperties {
  return { ['--i' as string]: i } as CSSProperties;
}
