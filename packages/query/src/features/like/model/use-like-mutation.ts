import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postLike } from '@kakamu/api';
import type { LikeRequestBody, LikeResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  cancelPostQueries,
  restorePostDetails,
  restorePostInfiniteLists,
  snapshotPostDetail,
  snapshotPostInfiniteLists,
  togglePostLikeInCaches,
  type PostDetailQuerySnapshot,
  type PostListQuerySnapshot,
} from '../../post/lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type LikeContext = {
  postId: number;
  previousMyLists: PostListQuerySnapshot;
  previousLikedLists: PostListQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

export function useLikeMutation(
  client: ApiClient,
  options?: UseMutationOptions<LikeResponse, unknown, LikeRequestBody, LikeContext>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => postLike(client, body),
    onMutate: async (body) => {
      const postId = body.target_id;
      await cancelPostQueries(queryClient, postId);
      const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.myLists());
      const previousLikedLists = snapshotPostInfiniteLists(
        queryClient,
        postKeys.likedLists(),
      );
      const previousPostDetails = snapshotPostDetail(queryClient, postId);
      togglePostLikeInCaches(queryClient, postId);
      return { postId, previousMyLists, previousLikedLists, previousPostDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostInfiniteLists(queryClient, context.previousMyLists);
      restorePostInfiniteLists(queryClient, context.previousLikedLists);
      restorePostDetails(queryClient, context.previousPostDetails);
    },
    onSettled: (_data, _error, body) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(body.target_id) });
      queryClient.invalidateQueries({ queryKey: postKeys.myLists() });
      queryClient.invalidateQueries({ queryKey: postKeys.likedLists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
