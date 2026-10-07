/**
 * Hizmet sayfalarının medya yardımcısı.
 *
 * `public/site/medya/kunye.json` medya ajanının dosyası; burada YALNIZCA
 * okunur: dosya gerçekten var mı, ölçüsü ne, alt metni için açıklaması ne?
 * Künyede olmayan dosyaya atıf yapılmaz — o durumda hiç görsel basılmaz.
 */

import kunyeHam from '../../../../public/site/medya/kunye.json';

type KunyeKaydi = {
  dosya: string;
  tur?: string;
  marka?: string;
  baslik?: string;
  aciklama?: string;
  genislik?: number | null;
  yukseklik?: number | null;
};

const KUNYE = new Map((kunyeHam as KunyeKaydi[]).map((k) => [k.dosya, k]));

/** Hizmetin görselini nasıl basacağımız. */
export type HizmetMedyasi =
  | { tur: 'video'; dosya: string; oran: 'yatay' | 'dikey' | 'kare'; baslik: string }
  | { tur: 'telefon'; dosya: string; alt: string; altyazi: string; genislik: number; yukseklik: number }
  | { tur: 'gorsel'; dosya: string; alt: string; altyazi: string; oran: string; genislik: number; yukseklik: number }
  | { tur: 'logo'; dosya: string; alt: string; altyazi: string; genislik: number; yukseklik: number };

/** Künye kaydından alt metin: açıklama varsa o, yoksa başlık + marka. */
function altMetni(k: KunyeKaydi): string {
  if (k.aciklama) return k.aciklama;
  if (k.baslik && k.marka) return `${k.marka} — ${k.baslik}`;
  return k.baslik ?? k.marka ?? '';
}

/** Künye satırını mono altyazıya çevirir: "KULE İSTANBUL CAFE · QR MENÜ…" */
function altyaziMetni(k: KunyeKaydi): string {
  return [k.marka, k.baslik].filter(Boolean).join(' · ');
}

/**
 * `hizmet.medya` alanını basılabilir bir tarife çevirir. Dosya künyede
 * yoksa `undefined` döner ve sayfa görsel bölümünü hiç basmaz.
 */
export function hizmetMedyasi(dosya: string | undefined): HizmetMedyasi | undefined {
  if (!dosya) return undefined;
  const k = KUNYE.get(dosya);
  if (!k) return undefined;

  const g = k.genislik ?? 0;
  const y = k.yukseklik ?? 0;
  const alt = altMetni(k);
  const altyazi = altyaziMetni(k);

  if (dosya.startsWith('video/')) {
    const oran = g && y ? (y > g * 1.2 ? 'dikey' : y > g * 0.95 ? 'kare' : 'yatay') : 'yatay';
    return { tur: 'video', dosya, oran, baslik: altyazi || alt };
  }

  if (dosya.startsWith('logo/')) {
    return { tur: 'logo', dosya, alt, altyazi, genislik: g || 200, yukseklik: y || 120 };
  }

  // 9/16'ya yakın dikey kareler telefon çerçevesinde en doğru duruyor.
  if (g && y && g / y <= 0.62) {
    return { tur: 'telefon', dosya, alt, altyazi, genislik: g, yukseklik: y };
  }

  return {
    tur: 'gorsel',
    dosya,
    alt,
    altyazi,
    oran: g && y ? `${g} / ${y}` : '4 / 3',
    genislik: g || 1200,
    yukseklik: y || 900,
  };
}

/** Vaka kartlarında kullanılacak ilk geçerli fotoğraf. */
export function ilkFotograf(
  fotolar: readonly string[] | undefined,
): { dosya: string; alt: string; genislik: number; yukseklik: number } | undefined {
  if (!fotolar) return undefined;
  for (const f of fotolar) {
    const k = KUNYE.get(f);
    if (k) {
      return {
        dosya: f,
        alt: altMetni(k),
        genislik: k.genislik ?? 1200,
        yukseklik: k.yukseklik ?? 900,
      };
    }
  }
  return undefined;
}
