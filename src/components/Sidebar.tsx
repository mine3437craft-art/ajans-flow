'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import { navFor } from '@/lib/permissions';
import { logout } from '@/app/login/actions';
import type { SessionUser } from '@/lib/types';

export default function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const items = navFor(user.role);

  const initials = user.display_name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase('tr-TR');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-mark">AF</div>
          <div className="logo-text">AJANS<span>flow</span></div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const active = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-item${active ? ' active' : ''}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{user.display_name}</span>
            <span className="user-role">{user.role === 'admin' ? 'Yönetici' : 'Personel'}</span>
          </div>
          <form action={logout} style={{ marginLeft: 'auto' }}>
            <button type="submit" className="btn-icon" title="Çıkış yap" aria-label="Çıkış yap">
              <Icon name="logout" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
