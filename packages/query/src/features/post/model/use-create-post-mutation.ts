import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { createPost } from '@kakamu/api';
import type { PostCreateRequest, PostCreateResponse } from '@kakamu/types';

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
  createOptimisticPost,
  OPTIMISTIC_POST_ID,
  prependPostToMyLists,
  restorePostDetails,
  restorePostInfiniteLists,
  snapshotPostDetail,
  snapshotPostInfiniteLists,
  type PostDetailQuerySnapshot,
  type PostListQuerySnapshot,
} from '../lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type CreatePostVariables = PostCreateRequest & {
  userId?: string;
};

type CreatePostContext = {
  previousMyLists: PostListQuerySnapshot;
  previousDetails: PostDetailQuerySnapshot;
  previousUserDetails: UserDetailQuerySnapshot | undefined;
};

export function useCreatePostMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    PostCreateResponse,
    unknown,
    CreatePostVariables,
    CreatePostContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ...body }: CreatePostVariables) => createPost(client, body),
    onMutate: async ({ userId, ...body }) => {
      await cancelPostQueries(queryClient, OPTIMISTIC_POST_ID);
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.lists());
      const previousDetails = snapshotPostDetail(queryClient, OPTIMISTIC_POST_ID);
      prependPostToMyLists(queryClient, createOptimisticPost(body));

      let previousUserDetails: UserDetailQuerySnapshot | undefined;
      if (userId) {
        await cancelUserQueries(queryClient, userId);
        previousUserDetails = snapshotUserDetail(queryClient, userId);
        adjustUserPostCountInCache(queryClient, userId, 1);
      }

      return { previousMyLists, previousDetails, previousUserDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostInfiniteLists(queryClient, context.previousMyLists);
      restorePostDetails(queryClient, context.previousDetails);
      if (context.previousUserDetails) {
        restoreUserDetails(queryClient, context.previousUserDetails);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(OPTIMISTIC_POST_ID) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      }
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
