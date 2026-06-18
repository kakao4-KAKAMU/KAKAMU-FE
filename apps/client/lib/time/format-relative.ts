import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from './constants';
import { parseUtcTimestamp } from './parse-utc-timestamp';

export type FormatRelativeTimeOptions = {
  locale?: string;
  now?: Date;
};

export function formatRelativeTime(
  iso: string,
  options: FormatRelativeTimeOptions = {},
): string {
  const created = parseUtcTimestamp(iso);
  if (!created) {
    return '';
  }

  const now = options.now ?? new Date();
  const diffMs = Math.max(0, now.getTime() - created.getTime());
  const minutes = Math.floor(diffMs / MS_PER_MINUTE);

  if (minutes < 1) {
    return '방금';
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }

  const locale = options.locale ?? 'ko-KR';
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(created);
}
