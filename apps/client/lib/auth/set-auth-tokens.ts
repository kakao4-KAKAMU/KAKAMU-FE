import { useAuthStore, usePersonaStore } from '@kakamu/store';
import * as Sentry from '@sentry/react-native';

import { appQueryClient } from '@/lib/query/query-client';
import { clearRefreshToken, saveRefreshToken } from './refresh-token-storage';

/** access는 메모리(Zustand), refresh는 플랫폼 저장소에 기록 */
export async function setAuthTokens(
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  useAuthStore.getState().setAccessToken(accessToken);

  if (refreshToken) {
    await saveRefreshToken(refreshToken);
    return;
  }

  await clearRefreshToken();
}

export async function clearAuthSession(): Promise<void> {
  Sentry.addBreadcrumb({
    category: 'auth',
    message: 'session cleared',
    level: 'warning',
  });
  appQueryClient.invalidateQueries();
  useAuthStore.getState().setAccessToken(null);
  usePersonaStore.getState().clearPersonas();
  await clearRefreshToken();
}
