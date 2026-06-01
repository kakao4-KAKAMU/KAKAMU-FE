import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updatePostById } from '@kakamu/api';
import type { PostUpdateRequest, PostUpdateResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  applyPostWriteBody,
  cancelPostQueries,
  patchPostInCaches,
  restorePostDetails,
  restorePostInfiniteLists,
  snapshotPostDetail,
  snapshotPostInfiniteLists,
  type PostDetailQuerySnapshot,
  type PostListQuerySnapshot,
} from '../lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type UpdatePostVariables = {
  postId: number;
  body: PostUpdateRequest;
};

type UpdatePostContext = {
  previousMyLists: PostListQuerySnapshot;
  previousLikedLists: PostListQuerySnapshot;
  previousDetails: PostDetailQuerySnapshot;
};

export function useUpdatePostMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    PostUpdateResponse,
    unknown,
    UpdatePostVariables,
    UpdatePostContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, body }) => updatePostById(client, postId, body),
    onMutate: async ({ postId, body }) => {
      await cancelPostQueries(queryClient, postId);
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.lists());
      const previousLikedLists = snapshotPostInfiniteLists(
        queryClient,
        postKeys.likedLists(),
      );
      const previousDetails = snapshotPostDetail(queryClient, postId);
      patchPostInCaches(queryClient, postId, (post) => applyPostWriteBody(post, body));
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
