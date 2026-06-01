import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deletePostById } from '@kakamu/api';
import type { PostDeleteResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
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
};

type DeletePostContext = {
  previousMyLists: PostListQuerySnapshot;
  previousLikedLists: PostListQuerySnapshot;
  previousDetails: PostDetailQuerySnapshot;
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
    onMutate: async ({ postId }) => {
      await cancelPostQueries(queryClient, postId);
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.lists());
      const previousLikedLists = snapshotPostInfiniteLists(
        queryClient,
        postKeys.likedLists(),
      );
      const previousDetails = snapshotPostDetail(queryClient, postId);
      removePostFromCaches(queryClient, postId);
      return { previousMyLists, previousLikedLists, previousDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostInfiniteLists(queryClient, context.previousMyLists);
      restorePostInfiniteLists(queryClient, context.previousLikedLists);
      restorePostDetails(queryClient, context.previousDetails);
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.likedLists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
