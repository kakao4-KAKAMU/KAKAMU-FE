import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deleteUnfollowUser } from '@kakamu/api';
import type { RelationResponse } from '@kakamu/types';

import { relationKeys } from '../../../shared/keys/relation.keys';
import { postKeys } from '../../../shared/keys/post.keys';
import { setPostFollowByAuthorInCaches, restorePostDetails, snapshotPostDetails, type PostDetailQuerySnapshot } from '../../post/lib/post-infinite-cache';
import { userKeys } from '../../../shared/keys/user.keys';
import {
  cancelUserQueries,
  restoreUserDetails,
  setUserFollowInCache,
  snapshotUserDetail,
  type UserDetailQuerySnapshot,
} from '../../user/lib/user-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type UnfollowUserVariables = {
  userId: string;
};

type UnfollowUserContext = {
  previousUserDetails: UserDetailQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

export function useUnfollowUserMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    RelationResponse,
    unknown,
    UnfollowUserVariables,
    UnfollowUserContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }) => deleteUnfollowUser(client, userId),
    onMutate: async ({ userId }) => {
      await cancelUserQueries(queryClient, userId);
      await queryClient.cancelQueries({ queryKey: postKeys.details() });
      const previousUserDetails = snapshotUserDetail(queryClient, userId);
      const previousPostDetails = snapshotPostDetails(queryClient);
      setUserFollowInCache(queryClient, userId, false);
      setPostFollowByAuthorInCaches(queryClient, userId, false);
      return { previousUserDetails, previousPostDetails };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        restoreUserDetails(queryClient, context.previousUserDetails);
        restorePostDetails(queryClient, context.previousPostDetails);
      }
    },
    onSettled: (_data, _error, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: postKeys.details() });
      queryClient.invalidateQueries({ queryKey: relationKeys.followingsLists() });
      queryClient.invalidateQueries({ queryKey: relationKeys.followersLists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
