import { useMemo } from 'react';
import type { ApiClient } from '@kakamu/api';
import { useUserQuery } from '@kakamu/query';
import type { UserPublic } from '@kakamu/types';
import type { ProfileStatKey } from '@/components/featured/profileScreen/types';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';

type UseProfileUserQueryParams = {
  client: ApiClient;
  isMy: boolean;
  userId?: string;
};

type ProfileUserStats = Record<ProfileStatKey, number>;

type UseProfileUserQueryResult = {
  userId: string;
  user: UserPublic;
  stats: ProfileUserStats;
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

  const stats = useMemo<ProfileUserStats>(() => ({
    feed: userQuery.data.post_count,
    save: userQuery.data.follower_count,
    following: userQuery.data.following_count,
  }), [userQuery.data]);

  return {
    userId: targetUserId,
    user: userQuery.data,
    stats,
  };
}
