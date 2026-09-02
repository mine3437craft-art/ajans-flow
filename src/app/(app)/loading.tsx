/** Sayfa verisi gelene kadar boş ekran yerine bu gösterilir. */
export default function Loading() {
  return (
    <div className="content" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{
          width: 30, height: 30, margin: '0 auto 14px',
          border: '3px solid var(--bg-input)', borderTopColor: 'var(--primary)',
          borderRadius: '50%', animation: 'af-spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13 }}>Yükleniyor…</span>
      </div>
    </div>
  );
}
