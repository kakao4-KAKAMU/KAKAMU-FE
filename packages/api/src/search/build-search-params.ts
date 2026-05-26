export function buildSearchParams(
  entries: Record<string, string | number | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) {
    if (value == null) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else {
      params.append(key, String(value));
    }
  }
  return params;
}
