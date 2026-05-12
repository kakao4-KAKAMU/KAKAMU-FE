import { createApiClient, type ApiClient } from '@kakamu/api';

/** `EXPO_PUBLIC_BACKEND_API_URL` 기준 ky 클라이언트 (끝 슬래시 제거) */
export function createBackendApiClient(): ApiClient {
  const raw = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  if (!raw || typeof raw !== 'string') {
    throw new Error('[api] EXPO_PUBLIC_BACKEND_API_URL 가 설정되어 있어야 합니다.');
  }
  const prefixUrl = raw.replace(/\/$/, '');
  return createApiClient(prefixUrl);
}
