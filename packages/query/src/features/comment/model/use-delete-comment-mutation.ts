import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deleteComment } from '@kakamu/api';
import type { CommentDeleteResponse } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';
import { postKeys } from '../../../shared/keys/post.keys';
import {
  adjustPostCommentCountInCache,
  cancelCommentQueries,
  removeCommentFromCaches,
  restoreCommentByPostLists,
  restoreCommentDetails,
  snapshotCommentByPostLists,
  snapshotCommentDetail,
  type CommentDetailQuerySnapshot,
  type CommentListQuerySnapshot,
} from '../lib/comment-cache';
import {
  cancelPostQueries,
  restorePostDetails,
  snapshotPostDetail,
  type PostDetailQuerySnapshot,
} from '../../post/lib/post-infinite-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type DeleteCommentVariables = {
  commentId: number;
  postId: number;
};

type DeleteCommentContext = {
  postId: number;
  previousCommentLists: CommentListQuerySnapshot;
  previousCommentDetails: CommentDetailQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

export function useDeleteCommentMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    CommentDeleteResponse,
    unknown,
    DeleteCommentVariables,
    DeleteCommentContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    CommentDeleteResponse,
    unknown,
    DeleteCommentVariables,
    DeleteCommentContext
  >({
    mutationFn: ({ commentId }) => deleteComment(client, commentId),
    onMutate: async ({ commentId, postId }) => {
      await cancelCommentQueries(queryClient, commentId, postId);
      await cancelPostQueries(queryClient, postId);
      const previousCommentLists = snapshotCommentByPostLists(queryClient, postId);
      const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
      const previousPostDetails = snapshotPostDetail(queryClient, postId);
      removeCommentFromCaches(queryClient, commentId, postId);
      adjustPostCommentCountInCache(queryClient, postId, -1);
      return {
        postId,
        previousCommentLists,
        previousCommentDetails,
        previousPostDetails,
      };
    },
    onError: (_error, { postId }, context) => {
      if (!context) {
        return;
      }
      restoreCommentByPostLists(queryClient, context.previousCommentLists);
      restoreCommentDetails(queryClient, context.previousCommentDetails);
      restorePostDetails(queryClient, context.previousPostDetails);
      adjustPostCommentCountInCache(queryClient, postId, 1);
    },
    onSettled: (_data, _error, { commentId, postId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(commentId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostLists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
