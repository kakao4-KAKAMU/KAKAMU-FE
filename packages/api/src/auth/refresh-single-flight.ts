import type { LoginResponse } from '@kakamu/types';

import type { ApiClient } from '../client';
import { postUserLoginRefresh } from '../users/refresh';
import type { TokenBridge } from './token-bridge';

let inflightRefresh: Promise<LoginResponse> | null = null;

/**
 * 동시 401 시 refresh API를 한 번만 호출하고 결과를 공유합니다.
 * `bareClient`는 인증 훅이 없는 클라이언트여야 합니다.
 */
export function refreshTokensSingleFlight(
  bareClient: ApiClient,
  tokenBridge: TokenBridge,
): Promise<LoginResponse> {
  if (inflightRefresh) {
    return inflightRefresh;
  }

  inflightRefresh = (async () => {
    const refreshToken = await tokenBridge.getRefreshToken();
    if (!refreshToken) {
      await tokenBridge.clearSession();
      throw new Error('No refresh token');
    }

    try {
      const tokens = await postUserLoginRefresh(bareClient, refreshToken);
      await tokenBridge.setTokens(tokens.access_token, tokens.refresh_token);
      return tokens;
    } catch (error) {
      await tokenBridge.clearSession();
      throw error;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
}

/** 테스트용 — 모듈 스코프 refresh Promise 초기화 */
export function resetRefreshSingleFlightForTests(): void {
  inflightRefresh = null;
}
