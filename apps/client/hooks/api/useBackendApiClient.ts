import { createApiClient, type ApiClient } from '@kakamu/api';
import { useAuthStore } from '@kakamu/store';
import { HTTPError } from 'ky';
import { useMemo } from 'react';

const raw = process.env.EXPO_PUBLIC_BACKEND_API_URL;

/** `EXPO_PUBLIC_BACKEND_API_URL` 기준 ky 클라이언트 (끝 슬래시 제거) */
export function useBackendApiClient(): ApiClient {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);

  const prefixUrl = raw?.replace(/\/$/, '') ?? '';

  const kyInstance = useMemo(() => {
    return createApiClient(prefixUrl, {
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
      },
      hooks: {
        beforeError: [
          async (error: HTTPError) => {
            if (error.response.status === 401) {
              setAccessToken(null);
            }
            return error;
          }
        ]
      }
    });
  }, [accessToken]);
  
  return kyInstance
}
