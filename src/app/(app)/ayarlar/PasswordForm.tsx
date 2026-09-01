'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { changeOwnPassword } from './actions';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Kaydediliyor…' : label}
    </button>
  );
}

export default function PasswordForm({ zorunlu }: { zorunlu: boolean }) {
  const [result, formAction] = useActionState(changeOwnPassword, null);
  const ok = result === 'ok';

  return (
    <form action={formAction}>
      {zorunlu && !ok && (
        <div className="alert alert-warning">
          İlk girişiniz. Devam etmek için şifrenizi değiştirmeniz gerekiyor.
        </div>
      )}
      {ok && <div className="alert alert-success">Şifreniz güncellendi.</div>}
      {result && !ok && <div className="alert alert-danger">{result}</div>}

      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor="current">Mevcut Şifre</label>
          <input id="current" name="current" type="password" className="form-control"
                 autoComplete="current-password" required />
        </div>
        <div className="form-group">
          <label htmlFor="next">Yeni Şifre</label>
          <input id="next" name="next" type="password" className="form-control"
                 autoComplete="new-password" minLength={8} required />
        </div>
        <div className="form-group">
          <label htmlFor="repeat">Yeni Şifre (tekrar)</label>
          <input id="repeat" name="repeat" type="password" className="form-control"
                 autoComplete="new-password" minLength={8} required />
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 10 }}>
        En az 8 karakter, en az bir harf ve bir rakam içermeli.
      </p>
      <div className="form-actions"><Submit label="Şifreyi Değiştir" /></div>
    </form>
  );
}
