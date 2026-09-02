import type { Role } from './types';

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  adminOnly: boolean;
};

/**
 * Menü tanımı. adminOnly olanlar personelde hem gizlenir hem de
 * sayfa/aksiyon tarafında requireAdmin ile ayrıca engellenir.
 * Menüyü gizlemek tek başına koruma değildir.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/',           label: 'Pano',           icon: 'grid',     adminOnly: false },
  { href: '/gorevler',   label: 'Görevler',       icon: 'check',    adminOnly: false },
  { href: '/takvim',     label: 'İçerik Takvimi', icon: 'calendar', adminOnly: false },
  { href: '/musteriler', label: 'Müşteriler',     icon: 'users',    adminOnly: false },
  { href: '/notlar',     label: 'Notlar',         icon: 'note',     adminOnly: false },
  { href: '/finans',     label: 'Gelir / Gider',  icon: 'money',    adminOnly: true  },
  { href: '/borclar',    label: 'Borç & Alacak',  icon: 'card',     adminOnly: true  },
  { href: '/raporlar',   label: 'Raporlar',       icon: 'chart',    adminOnly: true  },
  { href: '/hedefler',   label: 'Hedefler',       icon: 'target',   adminOnly: true  },
  { href: '/ayarlar',    label: 'Ayarlar',        icon: 'gear',     adminOnly: false },
];

export function navFor(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => role === 'admin' || !item.adminOnly);
}

/** Yalnızca yöneticinin girebileceği yollar. */
export const ADMIN_PATHS = NAV_ITEMS.filter((n) => n.adminOnly).map((n) => n.href);

export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
