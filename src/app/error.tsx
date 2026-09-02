'use client';

import { useEffect } from 'react';

/**
 * Sayfa içinde beklenmedik bir hata olursa bu ekran gösterilir.
 * Ham çökme ekranı yerine ne olduğunu söyleyen bir sayfa çıkar.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[hata]', error.message, error.digest);
  }, [error]);

  return (
    <div className="login-wrap">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h1 style={{ fontSize: 18, marginBottom: 8 }}>Bir şeyler ters gitti</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 22 }}>
          Sayfa yüklenirken bir hata oluştu. Tekrar denemek genelde işe yarar.
        </p>

        <button type="button" className="btn btn-primary" onClick={reset}
                style={{ width: '100%', justifyContent: 'center' }}>
          Tekrar Dene
        </button>

        <a href="/" className="btn btn-secondary"
           style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
          Panoya Dön
        </a>

        {error.digest && (
          <p style={{ marginTop: 18, fontSize: 11, color: 'var(--text-muted)' }}>
            Hata kodu: <code>{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}
