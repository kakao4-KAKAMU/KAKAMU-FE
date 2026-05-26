import {
  createApiClient,
  postUserLoginRefresh,
  type ApiClient,
} from '@kakamu/api';

import { getRefreshToken } from './refresh-token-storage';
import { clearAuthSession, setAuthTokens } from './set-auth-tokens';

/**
 * 콜드 스타트: refresh만 있고 access가 없을 때 access를 복원합니다.
 */
export async function restoreSessionFromRefreshToken(prefixUrl: string): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  const bareClient: ApiClient = createApiClient(prefixUrl, { retry: { limit: 0 } });

  try {
    const tokens = await postUserLoginRefresh(bareClient, refreshToken);
    await setAuthTokens(tokens.access_token, tokens.refresh_token);
    return true;
  } catch {
    await clearAuthSession();
    return false;
  }
}
