const DEFAULT_API_BASE = 'http://dev.filma.cloud/api';

/** MSW 핸들러 predicate와 ky prefixUrl이 일치해야 합니다. */
export function getApiBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_BACKEND_API_URL ?? DEFAULT_API_BASE;
  return raw.replace(/\/$/, '');
}

export function getUploadApiBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_UPLOAD_API_URL ?? 'http://dev.filma.cloud/upload';
  return raw.replace(/\/$/, '');
}
