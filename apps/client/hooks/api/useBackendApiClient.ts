import { createApiClient, type ApiClient } from '@kakamu/api';
import { useAuthStore } from '@kakamu/store';
import { LoginResponse } from '@kakamu/types';
import { HTTPError } from 'ky';
import { useMemo } from 'react';

const raw = process.env.EXPO_PUBLIC_BACKEND_API_URL;

/** `EXPO_PUBLIC_BACKEND_API_URL` 기준 ky 클라이언트 (끝 슬래시 제거) */
export function useBackendApiClient(): ApiClient {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);


  const prefixUrl = raw?.replace(/\/$/, '') ?? '';
  const client = useMemo(() => createApiClient(prefixUrl, {}), [prefixUrl]);

  const kyInstance = useMemo(() => {

    return client.extend({
      hooks: {
        beforeRequest: [
          async (request: Request) => {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
          }
        ],
        beforeRetry: [
          async ({ request }) => {
            if (!refreshToken) return client.stop
            const tokens = await client.post('users/login/refresh', {
              json: {
                refresh_token: refreshToken
              }
            }).json<LoginResponse>()
            setAccessToken(tokens.access_token, tokens.refresh_token)
            request.headers.set('Authorization', `Bearer ${tokens.access_token}`)
          }
        ]
      }

    })
  }, [accessToken]);

  
  return kyInstance
}
