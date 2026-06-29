import type { QueryClient } from '@tanstack/react-query';
import type { UserPublic } from '@kakamu/types';

import { userKeys } from '../../../shared/keys/user.keys';

export function seedCurrentUserDetailCache(
  queryClient: QueryClient,
  user: UserPublic,
): void {
  if (user.id) {
    queryClient.setQueryData(userKeys.detail(user.id), user);
  }
}

export function mergeUserAccountIntoCurrentUserCache(
  queryClient: QueryClient,
  userId: string,
  patch: {
    nickname?: string;
    profile_image_url?: string | null;
    profile_msg?: string | null;
    tag?: string;
  },
): void {
  const profilePatch = {
    nickname: patch.nickname,
    profile_msg: patch.profile_msg,
    tag: patch.tag,
    profile_image: patch.profile_image_url,
  };

  queryClient.setQueryData<UserPublic>(userKeys.me(), (old) => {
    if (!old) {
      return old;
    }
    return {
      ...old,
      ...(patch.nickname != null ? { nickname: patch.nickname } : {}),
      ...(patch.profile_msg !== undefined ? { profile_msg: patch.profile_msg } : {}),
      ...(patch.tag != null ? { tag: patch.tag } : {}),
      ...(patch.profile_image_url !== undefined
        ? { profile_image: patch.profile_image_url }
        : {}),
    };
  });

  queryClient.setQueryData<UserPublic>(userKeys.detail(userId), (old) => {
    if (!old) {
      return old;
    }
    return {
      ...old,
      ...(profilePatch.nickname != null ? { nickname: profilePatch.nickname } : {}),
      ...(profilePatch.profile_msg !== undefined
        ? { profile_msg: profilePatch.profile_msg }
        : {}),
      ...(profilePatch.tag != null ? { tag: profilePatch.tag } : {}),
      ...(profilePatch.profile_image !== undefined
        ? { profile_image: profilePatch.profile_image }
        : {}),
    };
  });
}
