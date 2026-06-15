import { useMemo } from 'react';
import type { ApiClient } from '@kakamu/api';
import { useUserQuery } from '@kakamu/query';
import type { UserInfo } from '@kakamu/types';
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
  user: UserInfo | undefined;
  isLoading: boolean;
  stats: ProfileUserStats;
};

const EMPTY_STATS: ProfileUserStats = {
  feed: 0,
  save: 0,
  following: 0,
};

/** 프로필 화면용 user 조회 — 내 프로필은 JWT, 타인 프로필은 route param userId 사용 */
export function useProfileUserQuery({
  client,
  isMy,
  userId,
}: UseProfileUserQueryParams): UseProfileUserQueryResult {
  const currentUserId = useCurrentUserId();
  const targetUserId = isMy ? currentUserId : userId ?? null;

  const userQuery = useUserQuery(client, targetUserId ?? '', {
    enabled: !!targetUserId,
  });

  const stats = useMemo<ProfileUserStats>(() => {
    if (!userQuery.data) {
      return EMPTY_STATS;
    }

    return {
      feed: userQuery.data.post_count,
      save: userQuery.data.follower_count,
      following: userQuery.data.following_count,
    };
  }, [userQuery.data]);

  return {
    userId: targetUserId ?? '',
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    stats,
  };
}
