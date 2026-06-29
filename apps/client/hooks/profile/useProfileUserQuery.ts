import type { ApiClient } from '@kakamu/api';
import { useCurrentUserSuspenseQuery, useUserQuery } from '@kakamu/query';
import type { UserPublic } from '@kakamu/types';

type ProfileUserQueryResult = {
  userId: string;
  user: UserPublic;
};

/** 내 프로필 — GET /users/me */
export function useMyProfileUserQuery(client: ApiClient): ProfileUserQueryResult {
  const meQuery = useCurrentUserSuspenseQuery(client);
  const me = meQuery.data;

  if (!me.id) {
    throw new Error('Current user ID not found');
  }

  return {
    userId: me.id,
    user: me,
  };
}

/** 타인 프로필 — GET /users/{user_id} */
export function useOtherProfileUserQuery(
  client: ApiClient,
  userId: string,
): ProfileUserQueryResult {
  const userQuery = useUserQuery(client, userId);

  return {
    userId,
    user: userQuery.data,
  };
}
