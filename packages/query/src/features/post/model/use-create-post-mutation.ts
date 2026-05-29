import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { createPost } from '@kakamu/api';
import type { PostCreateRequest, PostCreateResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
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

type CreatePostContext = {
  previousMyLists: PostListQuerySnapshot;
  previousDetails: PostDetailQuerySnapshot;
};

export function useCreatePostMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    PostCreateResponse,
    unknown,
    PostCreateRequest,
    CreatePostContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PostCreateRequest) => createPost(client, body),
    onMutate: async (body) => {
      await cancelPostQueries(queryClient, OPTIMISTIC_POST_ID);
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.myLists());
      const previousDetails = snapshotPostDetail(queryClient, OPTIMISTIC_POST_ID);
      prependPostToMyLists(queryClient, createOptimisticPost(body));
      return { previousMyLists, previousDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostInfiniteLists(queryClient, context.previousMyLists);
      restorePostDetails(queryClient, context.previousDetails);
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: postKeys.detail(OPTIMISTIC_POST_ID) });
      queryClient.invalidateQueries({ queryKey: postKeys.myLists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
