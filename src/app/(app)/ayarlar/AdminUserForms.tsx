'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createUser, resetUserPassword } from './actions';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
      {pending ? '…' : label}
    </button>
  );
}

export function ResetPasswordForm({ users }: { users: Array<{ id: number; display_name: string }> }) {
  const [result, formAction] = useActionState(resetUserPassword, null);
  const ok = result === 'ok';

  return (
    <form action={formAction}>
      {ok && (
        <div className="alert alert-success">
          Şifre sıfırlandı. Kullanıcı ilk girişte kendi şifresini belirleyecek.
        </div>
      )}
      {result && !ok && <div className="alert alert-danger">{result}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="user_id">Kullanıcı</label>
          <select id="user_id" name="user_id" className="form-control" required>
            {users.map((u) => <option key={u.id} value={u.id}>{u.display_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reset_next">Yeni Şifre</label>
          <input id="reset_next" name="next" type="password" className="form-control"
                 autoComplete="new-password" minLength={8} required />
        </div>
      </div>
      <div className="form-actions"><Submit label="Şifreyi Sıfırla" /></div>
    </form>
  );
}

export function NewUserForm() {
  const [result, formAction] = useActionState(createUser, null);
  const ok = result === 'ok';

  return (
    <form action={formAction}>
      {ok && <div className="alert alert-success">Kullanıcı oluşturuldu.</div>}
      {result && !ok && <div className="alert alert-danger">{result}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="display_name">Ad Soyad</label>
          <input id="display_name" name="display_name" className="form-control" required maxLength={100} />
        </div>
        <div className="form-group">
          <label htmlFor="new_username">Kullanıcı Adı</label>
          <input id="new_username" name="username" className="form-control" required
                 placeholder="örn. ayse" pattern="[a-z0-9._\-]{3,30}" />
        </div>
        <div className="form-group">
          <label htmlFor="new_password">Başlangıç Şifresi</label>
          <input id="new_password" name="password" type="password" className="form-control"
                 autoComplete="new-password" minLength={8} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select id="role" name="role" className="form-control" defaultValue="staff">
            <option value="staff">Personel (finansı göremez)</option>
            <option value="admin">Yönetici (her şeyi görür)</option>
          </select>
        </div>
      </div>
      <div className="form-actions"><Submit label="Kullanıcı Ekle" /></div>
    </form>
  );
}
