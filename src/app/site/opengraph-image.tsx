import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * flowajans.com bağlantılarının WhatsApp / Instagram / Google önizleme görseli.
 * Marka sembolü dosyadan okunup veri adresi olarak gömülüyor (ağ isteği yok).
 * Türkçe karakterler için yazı tipi Google Fonts'tan yalnızca kullanılan
 * harflerle indiriliyor; indirilemezse görsel yine üretiliyor.
 */

export const alt = 'Ajans Flow — Sosyal Medya Ajansı ve Yazılım · İstanbul / 4.Levent';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const METIN = {
  ust: 'Sosyal medya · Prodüksiyon · Reklam · Yazılım',
  ad: 'Ajans Flow',
  slogan: 'Fikirler hareket kazanır.',
  alt: 'İçeriği de yazılımı da aynı ekip yazıyor.',
  adres: 'flowajans.com',
  konum: 'İstanbul / 4.Levent',
};

const HARFLER = Object.values(METIN).join(' ');

async function yaziTipi(agirlik: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${agirlik}&text=${encodeURIComponent(HARFLER)}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!css.ok) return null;
    const kaynak = (await css.text()).match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/)?.[1];
    if (!kaynak) return null;
    const dosya = await fetch(kaynak, { signal: AbortSignal.timeout(5000) });
    return dosya.ok ? await dosya.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Marka sembolü: public klasöründen okunup base64 veri adresine çevriliyor. */
async function sembol(): Promise<string | null> {
  try {
    const svg = await readFile(join(process.cwd(), 'public/site/marka/flow-sembol.svg'));
    return `data:image/svg+xml;base64,${svg.toString('base64')}`;
  } catch {
    return null;
  }
}

export default async function Gorsel() {
  const [kalin, orta, logo] = await Promise.all([yaziTipi(800), yaziTipi(600), sembol()]);
  const aile = kalin || orta ? 'Jakarta' : 'sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#0E0E16',
          backgroundImage:
            'radial-gradient(circle at 88% 10%, rgba(255,107,53,0.55) 0%, rgba(255,107,53,0) 48%),'
            + 'radial-gradient(circle at 6% 100%, rgba(255,174,0,0.22) 0%, rgba(255,174,0,0) 42%)',
          color: '#FFFFFF',
          fontFamily: aile,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={92} height={101} alt="" />
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>{METIN.ad}</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.66)' }}>{METIN.ust}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 86, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>
            {METIN.slogan}
          </div>
          <div style={{ fontSize: 30, color: '#FF8F5E', fontWeight: 600 }}>{METIN.alt}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 24 }}>
          <div
            style={{
              display: 'flex',
              padding: '12px 24px',
              borderRadius: 999,
              backgroundColor: '#E2541F',
              fontWeight: 800,
            }}
          >
            {METIN.adres}
          </div>
          <div style={{ display: 'flex', color: 'rgba(255,255,255,0.66)' }}>{METIN.konum}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(kalin ? [{ name: 'Jakarta', data: kalin, weight: 800 as const, style: 'normal' as const }] : []),
        ...(orta ? [{ name: 'Jakarta', data: orta, weight: 600 as const, style: 'normal' as const }] : []),
      ],
    },
  );
}
