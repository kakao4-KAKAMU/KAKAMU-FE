import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updatePostById } from '@kakamu/api';
import type { PostUpdateRequest, PostUpdateResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  applyPostWriteBody,
  cancelPostDetailQueries,
  patchPostDetailCache,
  restorePostDetails,
  snapshotPostDetail,
  type PostDetailQuerySnapshot,
} from '../lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type UpdatePostVariables = {
  postId: number;
  body: PostUpdateRequest;
};

type UpdatePostContext = {
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
      await cancelPostDetailQueries(queryClient, postId);
      const previousDetails = snapshotPostDetail(queryClient, postId);
      patchPostDetailCache(queryClient, postId, (post) => applyPostWriteBody(post, body));
      return { previousDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePostDetails(queryClient, context.previousDetails);
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
