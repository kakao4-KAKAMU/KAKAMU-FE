import type { TokenBridge } from '@kakamu/api';
import { useAuthStore } from '@kakamu/store';

import { getRefreshToken } from './refresh-token-storage';
import { clearAuthSession, setAuthTokens } from './set-auth-tokens';

/** `@kakamu/api` `createAuthenticatedApiClient`용 TokenBridge (getter 기반, 싱글톤 안전) */
export function createTokenBridge(): TokenBridge {
  return {
    getAccessToken: () => useAuthStore.getState().accessToken,
    getRefreshToken,
    setTokens: async (access, refresh) => {
      await setAuthTokens(access, refresh);
    },
    clearSession: async () => {
      await clearAuthSession();
    },
  };
}
