/**
 * Kurumsal web sitesinin (src/app/site) ortak ayarları.
 *
 * Site, yönetim paneliyle aynı Next.js uygulamasında yaşıyor:
 *   - panel adresi   : ajans-flow.vercel.app (oturum ister)
 *   - site adresi    : kendi alan adı → proxy her isteği /site/... altına yazar
 *   - alan adı yokken: ajans-flow.vercel.app/site üzerinden de açılır
 *
 * Alan adı bağlanınca Vercel ortam değişkeni verilmesi yeterli:
 *   SITE_HOSTS="ajansflow.com,www.ajansflow.com"
 */

/** Sitenin kök yolu. Alan adı bağlıyken proxy bu ön eki ekler. */
export const SITE_KOK = '/site';

/** Sitenin kendi alan adı. Vercel'de SITE_HOSTS ile değiştirilebilir. */
const VARSAYILAN_ALAN = 'flowajans.com,www.flowajans.com';

/** Alan adı(ları): virgülle ayrılmış. */
export function siteSunuculari(): string[] {
  return (process.env.SITE_HOSTS ?? VARSAYILAN_ALAN)
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

/** İstekteki host sitenin kendi alan adı mı (panel değil)? */
export function siteSunucusuMu(host: string | null | undefined): boolean {
  if (!host) return false;
  const temiz = host.split(':')[0].toLowerCase();
  return siteSunuculari().includes(temiz);
}

/**
 * Paylaşım kartları, sitemap ve yapısal veri için tam adres.
 * Alan adı tanımlıysa o, değilse Vercel adresi kullanılır.
 */
export function siteAdresi(): string {
  // Alan adı Vercel'e BAĞLANDIĞINDA ortam değişkeni verilir:
  //   SITE_ADRES="https://flowajans.com"
  // O güne kadar canonical/sitemap Vercel adresini gösterir; aksi hâlde
  // Google çözülmeyen bir alan adına canonical görür ve hiçbir sayfa indekslenmez.
  const elle = (process.env.SITE_ADRES ?? '').trim().replace(/\/$/, '');
  if (elle) return elle;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}${SITE_KOK}` : `http://localhost:3000${SITE_KOK}`;
}

/** Site içi bağlantı: alan adında kök, panel adresinde /site altında. */
export function siteYolu(yol: string): string {
  const temiz = yol === '/' ? '' : yol.startsWith('/') ? yol : `/${yol}`;
  return `${SITE_KOK}${temiz}`;
}

/* ------------------------------------------------------------------ */
/* İletişim bilgileri                                                   */
/* ------------------------------------------------------------------ */
/**
 * Sahibi kesinleştirene kadar yalnızca doğrulanmış olanlar dolu.
 * Boş alanlar sitede hiç gösterilmez (uydurma bilgi yazılmaz).
 */
export const ILETISIM = {
  instagram: 'ajansflow',
  instagramDm: 'https://ig.me/m/ajansflow',
  instagramProfil: 'https://www.instagram.com/ajansflow/',
  /** Ekranda görünen hâli */
  telefonGorunum: '0532 479 63 37',
  telefonBaglanti: 'tel:+905324796337',
  /** wa.me için rakamlar */
  whatsapp: '905324796337',
  eposta: 'ajansflow@gmail.com',
  adres: 'İstanbul / 4.Levent',
  sehir: 'İstanbul',
  /** Sahibi istemedi: sitede çalışma saati yazılmıyor. */
  calismaSaatleri: '',
} as const;

/** WhatsApp bağlantısı; metin hazır gelir. */
export function whatsappBaglantisi(metin: string): string {
  return `https://wa.me/${ILETISIM.whatsapp}?text=${encodeURIComponent(metin)}`;
}

export const MARKA = {
  ad: 'Ajans Flow',
  tamAd: 'Ajans Flow | Sosyal Medya Ajansı',
  slogan: 'Fikirler hareket kazanır.',
  kurulus: 'İstanbul',
  renk: '#FF6B35',
} as const;
