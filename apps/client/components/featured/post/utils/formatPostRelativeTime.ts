export function formatPostRelativeTime(iso: string): string {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return '';

  const diffMs = Math.max(0, Date.now() - created);
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
