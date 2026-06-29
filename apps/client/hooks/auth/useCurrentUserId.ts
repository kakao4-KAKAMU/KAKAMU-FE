import { useAuthStore } from '@kakamu/store';
import { useCurrentUserQuery } from '@kakamu/query';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

/** GET /users/me 캐시에서 현재 로그인 user_id를 반환합니다. */
export function useCurrentUserId(): string | null {
  const client = useBackendApiClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data } = useCurrentUserQuery(client, { enabled: !!accessToken });

  return data?.id ?? null;
}

export function useCurrentUserIdOrThrow(): string {
  const currentUserId = useCurrentUserId();
  if (!currentUserId) {
    throw new Error('Current user ID not found');
  }
  return currentUserId;
}
