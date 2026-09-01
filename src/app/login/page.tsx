import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ donus?: string }>;
}) {
  if (await getCurrentUser()) redirect('/');
  const { donus } = await searchParams;

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">AF</div>
          <div className="logo-text">AJANS<span>flow</span></div>
        </div>
        <p className="login-sub">Yönetim paneline giriş yapın</p>
        <LoginForm donus={donus ?? '/'} />
      </div>
    </div>
  );
}
