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
  createOptimisticPost,
  prependPostToMyLists,
  restorePostInfiniteLists,
  snapshotPostInfiniteLists,
  type PostListQuerySnapshot,
} from '../lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type CreatePostVariables = PostCreateRequest & {
  userId?: string;
};

type CreatePostContext = {
  previousMyLists: PostListQuerySnapshot;
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
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.lists());
      prependPostToMyLists(queryClient, createOptimisticPost(body));

      let previousUserDetails: UserDetailQuerySnapshot | undefined;
      if (userId) {
        await cancelUserQueries(queryClient, userId);
        previousUserDetails = snapshotUserDetail(queryClient, userId);
        adjustUserPostCountInCache(queryClient, userId, 1);
      }

      return { previousMyLists, previousUserDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostInfiniteLists(queryClient, context.previousMyLists);
      if (context.previousUserDetails) {
        restoreUserDetails(queryClient, context.previousUserDetails);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feedLists() });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      }
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
