import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getCommentSpoilerDetail } from '@kakamu/api';
import type { CommentSpoilerDetailResponse } from '@kakamu/types';

import {
  patchCommentInCaches,
  type CommentDetailQuerySnapshot,
  type CommentListQuerySnapshot,
  restoreCommentByPostLists,
  restoreCommentDetails,
  snapshotCommentByPostLists,
  snapshotCommentDetail,
} from '../lib/comment-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type RevealCommentSpoilerVariables = {
  commentId: number;
  postId: number;
};

type RevealCommentSpoilerContext = {
  previousCommentLists: CommentListQuerySnapshot;
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
    onMutate: async ({ commentId, postId }) => {
      const previousCommentLists = snapshotCommentByPostLists(queryClient, postId);
      const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
      return { previousCommentLists, previousCommentDetails };
    },
    onSuccess: (data, { commentId, postId }) => {
      patchCommentInCaches(queryClient, commentId, postId, (comment) => ({
        ...comment,
        content: data.content,
      }));
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restoreCommentByPostLists(queryClient, context.previousCommentLists);
      restoreCommentDetails(queryClient, context.previousCommentDetails);
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
