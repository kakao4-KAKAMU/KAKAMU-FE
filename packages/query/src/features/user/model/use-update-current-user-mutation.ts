import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updateCurrentUser } from '@kakamu/api';
import type { UserAccount, UserUpdate } from '@kakamu/types';

import { userKeys } from '../../../shared/keys/user.keys';
import { mergeUserAccountIntoCurrentUserCache } from '../lib/current-user-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useUpdateCurrentUserMutation(
  client: ApiClient,
  options?: UseMutationOptions<UserAccount, Error, UserUpdate>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UserUpdate) => updateCurrentUser(client, body),
    onSettled: (data) => {
      if (data) {
        mergeUserAccountIntoCurrentUserCache(queryClient, data.id, {
          nickname: data.nickname,
          profile_image_url: data.profile_image_url,
          profile_msg: data.profile_msg,
          tag: data.tag,
        });
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      }
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
