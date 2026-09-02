export default function NotFound() {
  return (
    <div className="login-wrap">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <h1 style={{ fontSize: 18, marginBottom: 8 }}>Sayfa bulunamadı</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 22 }}>
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <a href="/" className="btn btn-primary"
           style={{ width: '100%', justifyContent: 'center' }}>
          Panoya Dön
        </a>
      </div>
    </div>
  );
}
