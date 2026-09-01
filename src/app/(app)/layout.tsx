import { requireSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();

  return (
    <div className="shell">
      <Sidebar user={user} />
      <div className="main">{children}</div>
    </div>
  );
}
