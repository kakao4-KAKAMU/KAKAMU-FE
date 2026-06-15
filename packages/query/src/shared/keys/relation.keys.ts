import type { FollowListParams } from '@kakamu/types';

export const relationKeys = {
  all: ['relation'] as const,
  followersLists: () => [...relationKeys.all, 'followers'] as const,
  followersList: (params: Omit<FollowListParams, 'cursor'>) =>
    [...relationKeys.followersLists(), params] as const,
  followingsLists: () => [...relationKeys.all, 'followings'] as const,
  followingsList: (params: Omit<FollowListParams, 'cursor'>) =>
    [...relationKeys.followingsLists(), params] as const,
};
