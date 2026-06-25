import { API_ERROR_CODES } from '@kakamu/types';
import ky, { HTTPError, type Options } from 'ky';
import { fetch } from 'expo/fetch';

import { createApiClient, type ApiClient } from '../client';
import { resolveApiErrorCode, toApiHttpError } from '../errors/api-http-error';
import { refreshTokensSingleFlight } from './refresh-single-flight';
import type { PersonaBridge } from './persona-bridge';
import type { TokenBridge } from './token-bridge';

const REFRESH_PATH = 'users/login/refresh';

const defaultRetry: Options['retry'] = {
  limit: 1,
  statusCodes: [401],
};

function isRefreshRequest(request: Request): boolean {
  const url = request.url;
  return url.includes(REFRESH_PATH);
}

/**
 * JWT 자동 첨부·`TOKEN_EXPIRED` 시 single-flight refresh·`ApiHttpError` 정규화.
 */
export function createAuthenticatedApiClient(
  prefixUrl: string,
  tokenBridge: TokenBridge,
  personaBridge?: PersonaBridge,
  options?: Partial<Options>,
): ApiClient {
  const bareClient = createApiClient(prefixUrl, { retry: { limit: 0 } });

  return createApiClient(prefixUrl, {
    retry: defaultRetry,
    ...options,
    fetch,
    hooks: {
      ...options?.hooks,
      beforeRequest: [
        ...(options?.hooks?.beforeRequest ?? []),
        (request, _opts, { retryCount }) => {
          if (isRefreshRequest(request)) {
            return;
          }
          if (retryCount === 0) {
            const token = tokenBridge.getAccessToken();
            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`);
            }
          }
          const personaId = personaBridge?.getSelectedPersonaId();
          if (personaId) {
            request.headers.set('x-persona-id', personaId);
          }
        },
      ],
      beforeError: [
        ...(options?.hooks?.beforeError ?? []),
        async (error) => {
          if (!(error instanceof HTTPError)) {
            return error;
          }
          return toApiHttpError(error);
        },
      ],
      beforeRetry: [
        ...(options?.hooks?.beforeRetry ?? []),
        async ({ request, error }) => {
          if (isRefreshRequest(request)) {
            return ky.stop;
          }

          if ((await resolveApiErrorCode(error)) !== API_ERROR_CODES.TOKEN_EXPIRED) {
            return ky.stop;
          }

          try {
            const tokens = await refreshTokensSingleFlight(bareClient, tokenBridge);
            request.headers.set('Authorization', `Bearer ${tokens.access_token}`);
          } catch {
            return ky.stop;
          }
        },
      ],
    },
  });
}
