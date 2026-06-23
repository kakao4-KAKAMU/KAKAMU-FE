import type { ApiClient } from '@kakamu/api';
import { useUserQuery } from '@kakamu/query';
import type { UserPublic } from '@kakamu/types';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';

type UseProfileUserQueryParams = {
  client: ApiClient;
  isMy: boolean;
  userId?: string;
};


type UseProfileUserQueryResult = {
  userId: string;
  user: UserPublic;
};

/** 프로필 화면용 user 조회 — 내 프로필은 JWT, 타인 프로필은 route param userId 사용 */
export function useProfileUserQuery({
  client,
  isMy,
  userId,
}: UseProfileUserQueryParams): UseProfileUserQueryResult {
  const currentUserId = useCurrentUserId();
  const targetUserId = isMy ? currentUserId : userId;
  
  if(!targetUserId) {
    throw new Error('Target user ID not found');
  }

  const userQuery = useUserQuery(client, targetUserId);

  return {
    userId: targetUserId,
    user: userQuery.data
  };
}
