import { useAuthStore } from '@kakamu/store';
import { useCurrentUserQuery } from '@kakamu/query';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { UserPublic } from '@kakamu/types';

/** GET /users/me 캐시에서 현재 로그인 user_id를 반환합니다. */
export function useCurrentUser(): UserPublic | null {
  const client = useBackendApiClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data } = useCurrentUserQuery(client, { enabled: !!accessToken });

  return data ?? null;
}

export function useCurrentUserOrThrow(): UserPublic {
  const currentUser = useCurrentUser();
  if (!currentUser) {
    throw new Error('Current user ID not found');
  }
  return currentUser;
}
