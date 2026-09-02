'use client';

/**
 * Kök yerleşimin kendisi çökerse devreye girer. Bu noktada uygulamanın
 * CSS'i yüklenmemiş olabileceği için stiller satır içinde yazılır.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body style={{
        margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: '#F4F5F9', color: '#1A1A2E',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        <div style={{
          maxWidth: 380, padding: 32, background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,.10)', textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Uygulama açılamadı</h1>
          <p style={{ color: '#5C5C7A', fontSize: 13.5, margin: '0 0 22px' }}>
            Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <button type="button" onClick={reset} style={{
            width: '100%', padding: 11, border: 'none', borderRadius: 8,
            background: '#FF6B35', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', font: 'inherit',
          }}>
            Tekrar Dene
          </button>
          {error.digest && (
            <p style={{ marginTop: 18, fontSize: 11, color: '#9898B0' }}>
              Hata kodu: <code>{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
