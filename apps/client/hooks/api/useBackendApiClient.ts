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
  const client = useMemo(() => createApiClient(prefixUrl, {
    retry: {
      limit: 3,
      statusCodes: [401]
    }
  }), [prefixUrl]);

  const kyInstance = useMemo(() => {
    return client.extend({
      hooks: {
        beforeError: [
          async (error: HTTPError) => {
            const {response} = error
            let body = { code: 'UNKNOWN_ERROR', message: 'UNKNOWN_ERROR' }
            try {
              const res = await response.json<{code: string, message: string}>()
              body.code = res.code
              body.message = res.message
            } catch {
              const res = error.message
              body.message = res
            }
            error.message = JSON.stringify(body)
            return error
          }
        ],
        beforeRequest: [
          async (request: Request) => {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
          }
        ],
        beforeRetry: [
          async ({ request, error }) => {
            const body = JSON.parse(error.message as string).message || { code: 'UNKNOWN_ERROR' }
            if (body.code !== 'TOKEN_EXPIRED' || !refreshToken) {
              return client.stop
            }
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
