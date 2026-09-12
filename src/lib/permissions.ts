import type { Role } from './types';

/**
 * Varsayılan olarak yalnızca yöneticiye açık, tek tek devredilebilen
 * sayfalar: para sayfaları ve müşteri adayı listeleri. Yeni anahtar
 * eklemek için burası yeterli — veritabanında kısıt yok (bkz. schema.sql
 * user_page_access yorumu).
 */
export type PageKey = 'kasa' | 'finans' | 'borclar' | 'raporlar' | 'hedefler';
export const PAGE_KEYS: PageKey[] = ['kasa', 'finans', 'borclar', 'raporlar', 'hedefler'];
export const PAGE_LABELS: Record<PageKey, string> = {
  kasa: 'Kasa',
  finans: 'Gelir / Gider',
  borclar: 'Borç & Alacak',
  raporlar: 'Raporlar',
  hedefler: 'Hedefler',
};

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  /** Varsa bu bir "kasa" sayfasıdır — erişim role veya user_page_access ile belirlenir. */
  pageKey?: PageKey;
  /** Menüde üstünde başlık çıkar; ardışık aynı gruplar tek başlık altında toplanır. */
  grup?: string;
};

/**
 * Menü tanımı. `pageKey` olan öğeler hem menüde gizlenir hem de
 * sayfa/aksiyon tarafında requirePageAccess/assertPageAccess ile ayrıca
 * engellenir — menüyü gizlemek tek başına koruma değildir.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/',           label: 'Pano',           icon: 'grid' },
  { href: '/gorevler',   label: 'Görevler',       icon: 'check' },
  { href: '/takvim',     label: 'İçerik Takvimi', icon: 'calendar' },
  { href: '/musteriler', label: 'Müşteriler',     icon: 'users' },
  // Aday listeleri ekibin ortak işi: herkes görür, herkes arar.
  { href: '/musteri-bulma/ajansflow',    label: 'Ajans Flow',    icon: 'target', grup: 'Müşteri Bulma' },
  { href: '/musteri-bulma/minikstarlar', label: 'Minik Starlar', icon: 'target', grup: 'Müşteri Bulma' },
  { href: '/videolar',   label: 'Video Deposu',   icon: 'video' },
  { href: '/notlar',     label: 'Notlar',         icon: 'note' },
  { href: '/kasa',       label: 'Kasa',           icon: 'wallet', pageKey: 'kasa' },
  { href: '/finans',     label: 'Gelir / Gider',  icon: 'money',  pageKey: 'finans' },
  { href: '/borclar',    label: 'Borç & Alacak',  icon: 'card',   pageKey: 'borclar' },
  { href: '/raporlar',   label: 'Raporlar',       icon: 'chart',  pageKey: 'raporlar' },
  { href: '/hedefler',   label: 'Hedefler',       icon: 'target', pageKey: 'hedefler' },
  { href: '/ayarlar',    label: 'Ayarlar',        icon: 'gear' },
];

/**
 * `extraAccess`: personele yönetici tarafından tek tek açılmış kasa
 * sayfaları (user_page_access tablosundan). Yönetici için anlamsızdır,
 * zaten her şeyi görür.
 */
export function navFor(role: Role, extraAccess: ReadonlySet<PageKey> = new Set()): NavItem[] {
  return NAV_ITEMS.filter(
    (item) => !item.pageKey || role === 'admin' || extraAccess.has(item.pageKey),
  );
}
