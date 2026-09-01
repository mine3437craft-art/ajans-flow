'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Giriş yapılıyor…' : 'Giriş Yap'}
    </button>
  );
}

export default function LoginForm({ donus }: { donus: string }) {
  const [error, formAction] = useActionState(login, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="donus" value={donus} />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">Kullanıcı Adı</label>
        <input
          id="username" name="username" className="form-control"
          autoComplete="username" autoFocus required
          placeholder="örn. beyza"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Şifre</label>
        <input
          id="password" name="password" type="password" className="form-control"
          autoComplete="current-password" required
        />
      </div>

      <SubmitButton />
    </form>
  );
}
