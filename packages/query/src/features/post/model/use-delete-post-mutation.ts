import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deletePostById } from '@kakamu/api';
import type { PostDeleteResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import { userKeys } from '../../../shared/keys/user.keys';
import {
  adjustUserPostCountInCache,
  cancelUserQueries,
  restoreUserDetails,
  snapshotUserDetail,
  type UserDetailQuerySnapshot,
} from '../../user/lib/user-cache';
import {
  cancelPostQueries,
  removePostFromCaches,
  restorePostDetails,
  restorePostInfiniteLists,
  snapshotPostDetail,
  snapshotPostInfiniteLists,
  type PostDetailQuerySnapshot,
  type PostListQuerySnapshot,
} from '../lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type DeletePostVariables = {
  postId: number;
  userId?: string;
};

type DeletePostContext = {
  previousMyLists: PostListQuerySnapshot;
  previousLikedLists: PostListQuerySnapshot;
  previousDetails: PostDetailQuerySnapshot;
  previousUserDetails: UserDetailQuerySnapshot | undefined;
};

export function useDeletePostMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    PostDeleteResponse,
    unknown,
    DeletePostVariables,
    DeletePostContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }) => deletePostById(client, postId),
    onMutate: async ({ postId, userId }) => {
      await cancelPostQueries(queryClient, postId);
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.lists());
      const previousLikedLists = snapshotPostInfiniteLists(
        queryClient,
        postKeys.likedLists(),
      );
      const previousDetails = snapshotPostDetail(queryClient, postId);
      removePostFromCaches(queryClient, postId);

      let previousUserDetails: UserDetailQuerySnapshot | undefined;
      if (userId) {
        await cancelUserQueries(queryClient, userId);
        previousUserDetails = snapshotUserDetail(queryClient, userId);
        adjustUserPostCountInCache(queryClient, userId, -1);
      }

      return { previousMyLists, previousLikedLists, previousDetails, previousUserDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostInfiniteLists(queryClient, context.previousMyLists);
      restorePostInfiniteLists(queryClient, context.previousLikedLists);
      restorePostDetails(queryClient, context.previousDetails);
      if (context.previousUserDetails) {
        restoreUserDetails(queryClient, context.previousUserDetails);
      }
    },
    onSettled: (_data, _error, { postId, userId }) => {
      removePostFromCaches(queryClient, postId);
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      }
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
