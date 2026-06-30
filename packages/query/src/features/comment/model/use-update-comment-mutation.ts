import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updateComment } from '@kakamu/api';
import type { CommentUpdateRequest, CommentUpdateResponse } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';
import {
  applyCommentUpdateBody,
  cancelCommentQueries,
  patchCommentDetailCache,
  restoreCommentDetails,
  snapshotCommentDetail,
  type CommentDetailQuerySnapshot,
} from '../lib/comment-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type UpdateCommentVariables = {
  commentId: number;
  postId: number;
  body: CommentUpdateRequest;
};

type UpdateCommentContext = {
  previousCommentDetails: CommentDetailQuerySnapshot;
};

export function useUpdateCommentMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    CommentUpdateResponse,
    unknown,
    UpdateCommentVariables,
    UpdateCommentContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    CommentUpdateResponse,
    unknown,
    UpdateCommentVariables,
    UpdateCommentContext
  >({
    mutationFn: ({ commentId, body }) => updateComment(client, commentId, body),
    onMutate: async ({ commentId, postId, body }) => {
      await cancelCommentQueries(queryClient, commentId, postId);
      const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
      patchCommentDetailCache(queryClient, commentId, (comment) =>
        applyCommentUpdateBody(comment, body),
      );
      return { previousCommentDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restoreCommentDetails(queryClient, context.previousCommentDetails);
    },
    onSettled: (_data, _error, { commentId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(commentId) });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
