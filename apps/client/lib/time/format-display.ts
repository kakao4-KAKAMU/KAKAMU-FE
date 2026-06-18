import { MS_PER_DAY } from './constants';
import { isSameLocalCalendarDay } from './calendar';
import { parseUtcTimestamp } from './parse-utc-timestamp';

export type FormatDisplayTimeOptions = {
  now?: Date;
};

export function formatMessageTime(iso: string, locale: string): string {
  const date = parseUtcTimestamp(iso);
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatSessionListTime(
  iso: string,
  locale: string,
  options: FormatDisplayTimeOptions = {},
): string {
  const date = parseUtcTimestamp(iso);
  if (!date) {
    return '';
  }

  const now = options.now ?? new Date();

  if (isSameLocalCalendarDay(date, now)) {
    return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
  }

  const diffMs = now.getTime() - date.getTime();
  if (diffMs < MS_PER_DAY * 7) {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  }

  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);
}
