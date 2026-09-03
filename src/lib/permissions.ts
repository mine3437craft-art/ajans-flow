import type { Role } from './types';

/** "Kasa" sayfaları — varsayılan yalnızca yöneticiye açık, tek tek devredilebilir. */
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
