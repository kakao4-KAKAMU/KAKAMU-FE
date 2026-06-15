import type { QueryClient } from '@tanstack/react-query';
import type { UserInfo } from '@kakamu/types';
import { userKeys } from '../../../shared/keys/user.keys';

export type UserDetailQuerySnapshot = Array<[readonly unknown[], UserInfo | undefined]>;

export async function cancelUserQueries(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });
}

export function snapshotUserDetail(
  queryClient: QueryClient,
  userId: string,
): UserDetailQuerySnapshot {
  const entries = queryClient.getQueriesData<UserInfo>({
    queryKey: userKeys.detail(userId),
  });
  return entries.map(([queryKey, data]) => [queryKey, data]);
}

export function restoreUserDetails(
  queryClient: QueryClient,
  snapshot: UserDetailQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function patchUserInCache(
  queryClient: QueryClient,
  userId: string,
  patch: Partial<UserInfo> | ((user: UserInfo) => UserInfo),
): void {
  queryClient.setQueryData<UserInfo>(userKeys.detail(userId), (old) => {
    if (!old) {
      return old;
    }
    return typeof patch === 'function' ? patch(old) : { ...old, ...patch };
  });
}

export function adjustUserPostCountInCache(
  queryClient: QueryClient,
  userId: string,
  delta: number,
): void {
  patchUserInCache(queryClient, userId, (user) => ({
    ...user,
    post_count: Math.max(0, user.post_count + delta),
  }));
}

export function toggleUserFollowInCache(
  queryClient: QueryClient,
  userId: string,
): void {
  patchUserInCache(queryClient, userId, (user) => ({
    ...user,
    is_following: !user.is_following,
    follower_count: Math.max(0, user.follower_count + (user.is_following ? -1 : 1)),
  }));
}

export function setUserFollowInCache(
  queryClient: QueryClient,
  userId: string,
  isFollowing: boolean,
): void {
  patchUserInCache(queryClient, userId, (user) => {
    if (user.is_following === isFollowing) {
      return user;
    }
    const delta = isFollowing ? 1 : -1;
    return {
      ...user,
      is_following: isFollowing,
      follower_count: Math.max(0, user.follower_count + delta),
    };
  });
}

export type UserProfilePatch = Pick<
  UserInfo,
  'nickname' | 'profile_image_url' | 'profile_msg' | 'tag'
>;

export function patchUserProfileInCache(
  queryClient: QueryClient,
  userId: string,
  patch: Partial<UserProfilePatch>,
): void {
  patchUserInCache(queryClient, userId, patch);
}
