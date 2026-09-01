export default function EmptyState({
  icon = '📭',
  title,
  text,
}: {
  icon?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {text ? <div className="empty-text">{text}</div> : null}
    </div>
  );
}
