import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getCommentSpoilerDetail } from '@kakamu/api';
import type { CommentSpoilerDetailResponse } from '@kakamu/types';

import {
  patchCommentDetailCache,
  restoreCommentDetails,
  snapshotCommentDetail,
  type CommentDetailQuerySnapshot,
} from '../lib/comment-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type RevealCommentSpoilerVariables = {
  commentId: number;
  postId: number;
};

type RevealCommentSpoilerContext = {
  previousCommentDetails: CommentDetailQuerySnapshot;
};

export function useRevealCommentSpoilerMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    CommentSpoilerDetailResponse,
    unknown,
    RevealCommentSpoilerVariables,
    RevealCommentSpoilerContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    CommentSpoilerDetailResponse,
    unknown,
    RevealCommentSpoilerVariables,
    RevealCommentSpoilerContext
  >({
    mutationFn: ({ commentId }) => getCommentSpoilerDetail(client, commentId),
    onMutate: async ({ commentId }) => {
      const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
      return { previousCommentDetails };
    },
    onSuccess: (data, { commentId }) => {
      patchCommentDetailCache(queryClient, commentId, (comment) => ({
        ...comment,
        content: data.content,
      }));
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restoreCommentDetails(queryClient, context.previousCommentDetails);
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
