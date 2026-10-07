/**
 * Ana sayfanın yapısal eşlemeleri — METİN DEĞİL, bağlantı kurgusu.
 *
 * Bütün metinler `src/lib/site-icerik.ts` ve `src/lib/adaylar.ts` içinde
 * duruyor. Burada yalnız "hangi hizmet hangi grupta", "hangi eksik hangi
 * hizmete bakar", "hangi sektörde hangi hizmetler öne çıkar" eşlemeleri
 * var; hepsi gerçek anahtarlarla çalışır ve yoksa sessizce atlanır.
 */

import type { IkonAdi } from '@/components/site/Ikonlar';

/** Hizmet ızgarasının dört grubu (SITE-BRIEF §3: A, B, C, D). */
export const HIZMET_GRUPLARI: readonly {
  ad: string;
  /** Grubun mono alt etiketi. */
  not: string;
  /** HIZMETLER[].anahtar değerleri, görünecek sırayla. */
  anahtarlar: readonly string[];
}[] = [
  {
    ad: 'Sosyal medya ve prodüksiyon',
    not: 'Stüdyo kanadı',
    anahtarlar: ['sosyal-medya', 'tiktok', 'icerik-stratejisi', 'fotograf', 'video', 'kurgu-edit', 'drone', 'buyume'],
  },
  {
    ad: 'Reklam ve ölçüm',
    not: 'Bütçenin gittiği yer',
    anahtarlar: ['meta-reklam', 'google-ads', 'google-isletme', 'veri-analizi'],
  },
  {
    ad: 'Web ve tasarım',
    not: 'Görünen yüz',
    anahtarlar: ['web-sitesi', 'kurumsal-kimlik'],
  },
  {
    ad: 'Yazılım tarafı',
    not: 'Kendi yazdığımız işler',
    anahtarlar: ['qr-menu'],
  },
];

/** Hizmet anahtarı → ikon adı. */
export const HIZMET_IKONU: Record<string, IkonAdi> = {
  'sosyal-medya': 'instagram',
  'icerik-stratejisi': 'menu',
  fotograf: 'kamera',
  video: 'oynat',
  tiktok: 'oynat',
  'kurgu-edit': 'kamera',
  drone: 'drone',
  buyume: 'yildiz',
  'meta-reklam': 'megafon',
  'google-ads': 'arama',
  'google-isletme': 'konum',
  'veri-analizi': 'grafik',
  'web-sitesi': 'kod',
  'kurumsal-kimlik': 'kalem',
  'qr-menu': 'qr',
};

/** EKSIKLER[].anahtar → HIZMETLER[].anahtar (Akış Kartı önerisi). */
export const EKSIK_HIZMETI: Record<string, string> = {
  qr_menu: 'qr-menu',
  web_yok: 'web-sitesi',
  web_eski: 'web-sitesi',
  instagram_zayif: 'sosyal-medya',
  duzensiz: 'icerik-stratejisi',
  reels_yok: 'video',
  cekim_yok: 'fotograf',
  google_zayif: 'google-isletme',
  reklam_yok: 'meta-reklam',
  kimlik_zayif: 'kurumsal-kimlik',
  menu_katalog: 'kurumsal-kimlik',
};

/**
 * SEKTORLER[].anahtar → o işte en çok işe yarayan hizmetler.
 * Sektör kapısında seçim yapılınca bu hizmetler ızgarada başa alınır ve
 * "önerilen" etiketi görünür (CSS seçicisiyle, JS DOM kurmadan).
 */
export const SEKTOR_ONERILERI: Record<string, readonly string[]> = {
  'go-kart': ['web-sitesi', 'video', 'drone'],
  'oto-galeri': ['web-sitesi', 'google-ads', 'video'],
  'kafe-restoran': ['qr-menu', 'fotograf', 'google-isletme'],
  'avukat-hukuk': ['web-sitesi', 'google-ads', 'icerik-stratejisi'],
  mimar: ['fotograf', 'sosyal-medya', 'kurumsal-kimlik'],
  saglik: ['web-sitesi', 'google-isletme', 'icerik-stratejisi'],
  spor: ['web-sitesi', 'sosyal-medya', 'video'],
  anaokulu: ['web-sitesi', 'fotograf', 'google-isletme'],
  guzellik: ['sosyal-medya', 'fotograf', 'google-isletme'],
  otel: ['web-sitesi', 'fotograf', 'drone'],
  emlak: ['web-sitesi', 'fotograf', 'google-ads'],
  magaza: ['web-sitesi', 'meta-reklam', 'fotograf'],
};

/** Bir hizmetin önerildiği sektörlerin anahtar listesi (boşluklu dizge). */
export function hizmetinSektorleri(hizmetAnahtari: string): string {
  return Object.entries(SEKTOR_ONERILERI)
    .filter(([, hizmetler]) => hizmetler.includes(hizmetAnahtari))
    .map(([sektor]) => sektor)
    .join(' ');
}
