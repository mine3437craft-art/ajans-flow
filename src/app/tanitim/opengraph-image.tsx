import { ImageResponse } from 'next/og';

/**
 * /tanitim ve /t/[kod] bağlantılarının WhatsApp / Instagram önizleme görseli.
 * Türkçe karakterler (ı İ ş ğ ü ö ç) için yazı tipi Google Fonts'tan yalnızca
 * kullanılan harflerle (&text=) indirilir; indirilemezse görsel yine üretilir.
 */

export const alt = 'Ajans Flow · Sosyal Medya Ajansı · İstanbul / 4.Levent — Fikirler hareket kazanır.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const METIN = {
  ust: 'Sosyal Medya Ajansı · İstanbul / 4.Levent',
  ad: 'Ajans Flow',
  slogan: 'Fikirler hareket kazanır.',
  hizmetler: ['İçerik', 'Reklam', 'Yönetim', 'Prodüksiyon'],
  kullanici: '@ajansflow',
  cta: 'Ücretsiz dijital analiz için DM',
  logoUst: 'AJANS',
  logoAlt: 'FLOW',
  rec: 'REC',
};

async function yaziTipi(agirlik: number, metin: string): Promise<ArrayBuffer | null> {
  try {
    const cssAdresi = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${agirlik}&text=${encodeURIComponent(metin)}`;
    const cssYaniti = await fetch(cssAdresi, { signal: AbortSignal.timeout(5000) });
    if (!cssYaniti.ok) return null;
    const css = await cssYaniti.text();
    const kaynak = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/)?.[1];
    if (!kaynak) return null;
    const dosya = await fetch(kaynak, { signal: AbortSignal.timeout(5000) });
    return dosya.ok ? await dosya.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const TURUNCU = '#FF6B35';
const TURUNCU_2 = '#FF8F5E';
const MUREKKEP = '#14141F';
const GECE = '#0E0E16';

type YaziTipi = { name: string; data: ArrayBuffer; weight: 600 | 800; style: 'normal' };

/** Görselin kendisi (satori: yalnızca flex düzeni). */
function kart(aile: string) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: GECE,
        backgroundImage:
          'radial-gradient(circle at 88% 8%, rgba(255,107,53,0.62) 0%, rgba(255,107,53,0) 46%), radial-gradient(circle at 4% 104%, rgba(255,61,127,0.28) 0%, rgba(255,61,127,0) 38%), radial-gradient(circle at 60% 70%, rgba(122,92,255,0.16) 0%, rgba(122,92,255,0) 40%)',
        color: '#fff',
        fontFamily: aile,
        padding: '64px 72px',
      }}
    >
      {/* Sağdaki halkalar */}
      <div
        style={{
          position: 'absolute',
          right: -160,
          top: 60,
          width: 620,
          height: 620,
          borderRadius: 9999,
          border: '2px solid rgba(255,255,255,0.08)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: 160,
          width: 420,
          height: 420,
          borderRadius: 9999,
          border: '2px solid rgba(255,143,94,0.28)',
          display: 'flex',
        }}
      />

      {/* Sağ: 3x3 profil ızgarası */}
      <div
        style={{
          position: 'absolute',
          right: 72,
          top: 118,
          width: 330,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          transform: 'rotate(6deg)',
        }}
      >
        {[
          { bg: `linear-gradient(135deg, ${TURUNCU}, ${TURUNCU_2})` },
          { bg: MUREKKEP },
          { bg: '#F3EDE4' },
          { bg: '#FFD9C7' },
          { bg: `linear-gradient(135deg, ${TURUNCU_2}, #FFC8A8)` },
          { bg: '#1E1E2C' },
          { bg: '#1E1E2C' },
          { bg: '#F3EDE4' },
          { bg: `linear-gradient(135deg, ${TURUNCU}, ${TURUNCU_2})` },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              width: 104,
              height: 104,
              borderRadius: 14,
              ...(k.bg.startsWith('linear') ? { backgroundImage: k.bg } : { backgroundColor: k.bg }),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
            }}
          >
            {i === 1 && (
              <svg width="38" height="38" viewBox="0 0 24 24">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="#fff" />
              </svg>
            )}
            {i === 4 && (
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 9999,
                  backgroundColor: '#fff',
                  border: `3px solid ${MUREKKEP}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: MUREKKEP,
                  lineHeight: 1,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>{METIN.logoUst}</span>
                <span style={{ fontSize: 19, fontWeight: 800 }}>{METIN.logoAlt}</span>
              </div>
            )}
            {i === 6 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#FF3B30', display: 'flex' }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{METIN.rec}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sol: metin */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 700, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 9999,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: MUREKKEP,
              lineHeight: 1,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.5 }}>{METIN.logoUst}</span>
            <span style={{ fontSize: 24, fontWeight: 800, marginTop: 1 }}>{METIN.logoAlt}</span>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '10px 18px',
              borderRadius: 9999,
              border: '1.5px solid rgba(255,255,255,0.18)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              fontSize: 22,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.86)',
            }}
          >
            {METIN.ust}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 1 }}>{METIN.ad}</div>
          <div
            style={{
              display: 'flex',
              marginTop: 14,
              fontSize: 58,
              fontWeight: 800,
              letterSpacing: -2,
              color: TURUNCU_2,
              lineHeight: 1.05,
            }}
          >
            {METIN.slogan}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
            {METIN.hizmetler.map((h) => (
              <div
                key={h}
                style={{
                  display: 'flex',
                  padding: '8px 16px',
                  borderRadius: 9999,
                  backgroundColor: 'rgba(255,107,53,0.14)',
                  border: '1.5px solid rgba(255,143,94,0.45)',
                  color: '#FFD3BF',
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {h}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
            {METIN.kullanici}
            <svg width="26" height="26" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="#0095F6" />
              <path d="m7.6 12.2 3 3 5.8-6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', width: 6, height: 6, borderRadius: 9999, backgroundColor: TURUNCU }} />
          <div style={{ display: 'flex' }}>{METIN.cta}</div>
        </div>
      </div>

      {/* Alt şerit */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 10,
          display: 'flex',
          backgroundImage: `linear-gradient(90deg, ${TURUNCU}, ${TURUNCU_2})`,
        }}
      />
    </div>
  );
}

export default async function Image() {
  const tumMetin = Array.from(new Set(Object.values(METIN).flat().join('') + '✓•·')).join('');
  const [kalin, orta] = await Promise.all([yaziTipi(800, tumMetin), yaziTipi(600, tumMetin)]);

  const fonts: YaziTipi[] = [];
  if (kalin) fonts.push({ name: 'Jakarta', data: kalin, weight: 800, style: 'normal' });
  if (orta) fonts.push({ name: 'Jakarta', data: orta, weight: 600, style: 'normal' });

  // Önce tamamen çizip belleğe alıyoruz: çizim hatası akış ortasında değil
  // burada yakalanır ve yazı tipsiz yedek görsele düşülür.
  const ciz = (yazilar: YaziTipi[]) =>
    new ImageResponse(kart(yazilar.length ? 'Jakarta' : 'sans-serif'), {
      ...size,
      ...(yazilar.length ? { fonts: yazilar } : {}),
    }).arrayBuffer();

  let png: ArrayBuffer;
  try {
    png = await ciz(fonts);
  } catch {
    png = await ciz([]);
  }
  return new Response(png, { headers: { 'Content-Type': contentType } });
}
