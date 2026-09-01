export default function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <h1>{title}</h1>
      {children ? <div style={{ display: 'flex', gap: 10 }}>{children}</div> : null}
    </header>
  );
}
