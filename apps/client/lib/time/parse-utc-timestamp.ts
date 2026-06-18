const HAS_TIMEZONE_SUFFIX = /(?:Z|[+-]\d{2}:?\d{2})$/i;
const ISO_DATE_TIME_WITHOUT_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function normalizeUtcIso(value: string): string {
  if (ISO_DATE_ONLY.test(value)) {
    return `${value}T00:00:00Z`;
  }

  if (ISO_DATE_TIME_WITHOUT_TZ.test(value)) {
    return `${value}Z`;
  }

  return value;
}

/** API가 내려주는 UTC ISO 문자열을 일관되게 Date로 파싱합니다. */
export function parseUtcTimestamp(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = HAS_TIMEZONE_SUFFIX.test(trimmed)
    ? trimmed
    : normalizeUtcIso(trimmed);

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getUtcTimestampMs(value: string): number | null {
  const date = parseUtcTimestamp(value);
  return date ? date.getTime() : null;
}

export function compareUtcTimestamps(left: string, right: string): number {
  const leftMs = getUtcTimestampMs(left) ?? 0;
  const rightMs = getUtcTimestampMs(right) ?? 0;
  return leftMs - rightMs;
}
