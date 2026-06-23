import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { createComment } from '@kakamu/api';
import type { CommentCreateRequest, CommentIdResponse } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';
import { postKeys } from '../../../shared/keys/post.keys';
import {
  adjustPostCommentCountInCache,
  cancelCommentQueries,
  createOptimisticComment,
  OPTIMISTIC_COMMENT_ID,
  prependCommentToPostLists,
  replaceOptimisticCommentInCaches,
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

export type CreateCommentVariables = CommentCreateRequest & {
  postId: number;
  authorId?: string;
  authorName?: string;
};

type CreateCommentContext = {
  postId: number;
  previousCommentLists: CommentListQuerySnapshot;
  previousCommentDetails: CommentDetailQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

export function useCreateCommentMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    CommentIdResponse,
    unknown,
    CreateCommentVariables,
    CreateCommentContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    CommentIdResponse,
    unknown,
    CreateCommentVariables,
    CreateCommentContext
  >({
    mutationFn: ({ postId, ...body }) =>
      createComment(client, postId, body),
    onMutate: async ({ postId, authorId, authorName, ...body }) => {
      await cancelCommentQueries(queryClient, OPTIMISTIC_COMMENT_ID, postId);
      await cancelPostQueries(queryClient, postId);
      const previousCommentLists = snapshotCommentByPostLists(queryClient, postId);
      const previousCommentDetails = snapshotCommentDetail(queryClient, OPTIMISTIC_COMMENT_ID);
      const previousPostDetails = snapshotPostDetail(queryClient, postId);
      const optimisticComment = createOptimisticComment(body, {
        id: authorId,
        nickname: authorName,
      });
      prependCommentToPostLists(queryClient, postId, optimisticComment);
      adjustPostCommentCountInCache(queryClient, postId, 1);
      return {
        postId,
        previousCommentLists,
        previousCommentDetails,
        previousPostDetails,
      };
    },
    onSuccess: (data, { postId }) => {
      replaceOptimisticCommentInCaches(queryClient, postId, data.comment_id);
    },
    onError: (_error, { postId }, context) => {
      if (!context) {
        return;
      }
      restoreCommentByPostLists(queryClient, context.previousCommentLists);
      restoreCommentDetails(queryClient, context.previousCommentDetails);
      restorePostDetails(queryClient, context.previousPostDetails);
      adjustPostCommentCountInCache(queryClient, postId, -1);
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.removeQueries({ queryKey: commentKeys.detail(OPTIMISTIC_COMMENT_ID) });
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostLists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
