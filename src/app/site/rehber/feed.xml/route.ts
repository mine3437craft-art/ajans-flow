import { MARKA, siteAdresi } from '@/lib/site';
import { REHBER_SAYFASI, rehberSirali, sonTarih } from '@/icerik/rehber';

/**
 * /rehber/feed.xml — RSS 2.0 akışı.
 *
 * Alan adında proxy bu yolu /site/rehber/feed.xml'e yazıyor; ziyaretçi
 * flowajans.com/rehber/feed.xml adresini görüyor.
 */

/** XML'de anlam taşıyan beş karakter kaçırılır. */
function kacir(metin: string): string {
  return metin
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** '2026-10-06' → RFC 822 (RSS'in beklediği biçim). */
function rssTarihi(iso: string): string {
  const tarih = new Date(`${iso}T09:00:00+03:00`);
  return Number.isNaN(tarih.getTime()) ? '' : tarih.toUTCString();
}

export async function GET(): Promise<Response> {
  const kok = siteAdresi();
  const kanalAdresi = `${kok}/rehber`;
  const yazilar = rehberSirali();
  const sonGuncelleme = yazilar.length ? rssTarihi(sonTarih(yazilar[0])) : '';

  const ogeler = yazilar
    .map((y) => {
      const adres = `${kanalAdresi}/${y.slug}`;
      return [
        '    <item>',
        `      <title>${kacir(y.baslik)}</title>`,
        `      <link>${kacir(adres)}</link>`,
        `      <guid isPermaLink="true">${kacir(adres)}</guid>`,
        `      <description>${kacir(y.ozet)}</description>`,
        `      <pubDate>${rssTarihi(y.tarih)}</pubDate>`,
        ...y.etiketler.map((e) => `      <category>${kacir(e)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${kacir(`${MARKA.ad} — Rehber`)}</title>`,
    `    <link>${kacir(kanalAdresi)}</link>`,
    `    <description>${kacir(REHBER_SAYFASI.metaAciklama)}</description>`,
    '    <language>tr-TR</language>',
    `    <atom:link href="${kacir(`${kanalAdresi}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...(sonGuncelleme ? [`    <lastBuildDate>${sonGuncelleme}</lastBuildDate>`] : []),
    ...(ogeler ? [ogeler] : []),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
