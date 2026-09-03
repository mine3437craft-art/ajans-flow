import { requireSession, getPageAccess } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();
  // Yönetici için anlamsız (zaten her şeyi görür); personel için tek tek
  // açılmış kasa sayfalarının listesi.
  const extraAccess = user.role === 'admin' ? new Set<never>() : await getPageAccess(user.id);

  return (
    <div className="shell">
      <Sidebar user={user} extraAccess={[...extraAccess]} />
      <div className="main">{children}</div>
    </div>
  );
}
