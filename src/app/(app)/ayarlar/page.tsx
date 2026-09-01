import { requireSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import { dateShort } from '@/lib/format';
import PasswordForm from './PasswordForm';
import { NewUserForm, ResetPasswordForm } from './AdminUserForms';
import { toggleUserActive } from './actions';

export const dynamic = 'force-dynamic';

type UserRow = {
  id: number; username: string; display_name: string; role: string;
  is_active: boolean; must_change_password: boolean; last_login_at: string | null;
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ilk?: string }>;
}) {
  // requireSession kullanılıyor: şifre değiştirme zorunluyken bu sayfa açılabilmeli.
  const user = await requireSession();
  const { ilk } = await searchParams;
  const isAdmin = user.role === 'admin';

  const users = isAdmin
    ? ((await sql`
        SELECT id, username, display_name, role, is_active, must_change_password, last_login_at
        FROM users ORDER BY role, display_name
      `) as UserRow[])
    : [];

  return (
    <>
      <PageHeader title="Ayarlar" />
      <div className="content">
        <div className="card">
          <div className="card-head">
            <h2><Icon name="lock" style={{ width: 15, height: 15, verticalAlign: '-2px' }} /> Şifremi Değiştir</h2>
          </div>
          <div className="card-body">
            <PasswordForm zorunlu={ilk === '1' || user.must_change_password} />
          </div>
        </div>

        {isAdmin && (
          <>
            <div className="card">
              <div className="card-head"><h2>Kullanıcılar</h2></div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ad Soyad</th><th>Kullanıcı Adı</th><th>Rol</th>
                      <th>Son Giriş</th><th>Durum</th><th style={{ width: 1 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="cell-title">{u.display_name}</td>
                        <td><code>{u.username}</code></td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'b-primary' : 'b-muted'}`}>
                            {u.role === 'admin' ? 'Yönetici' : 'Personel'}
                          </span>
                        </td>
                        <td>{u.last_login_at ? dateShort(u.last_login_at) : 'Hiç girmedi'}</td>
                        <td>
                          {!u.is_active ? (
                            <span className="badge b-danger">Pasif</span>
                          ) : u.must_change_password ? (
                            <span className="badge b-warning">Şifre bekliyor</span>
                          ) : (
                            <span className="badge b-success">Aktif</span>
                          )}
                        </td>
                        <td>
                          {u.id !== user.id && (
                            <form action={toggleUserActive}>
                              <input type="hidden" name="user_id" value={u.id} />
                              <button className="btn btn-sm btn-secondary" type="submit">
                                {u.is_active ? 'Pasife Al' : 'Aktifleştir'}
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-head"><h2>Kullanıcı Şifresi Sıfırla</h2></div>
                <div className="card-body">
                  <ResetPasswordForm users={users.map((u) => ({ id: u.id, display_name: u.display_name }))} />
                </div>
              </div>
              <div className="card">
                <div className="card-head"><h2>Yeni Kullanıcı</h2></div>
                <div className="card-body"><NewUserForm /></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
