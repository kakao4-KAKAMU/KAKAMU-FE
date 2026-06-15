import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postLike } from '@kakamu/api';
import type { LikeRequestBody, LikeResponse } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';
import { postKeys } from '../../../shared/keys/post.keys';
import {
  cancelCommentQueries,
  restoreCommentByPostLists,
  restoreCommentDetails,
  snapshotCommentByPostLists,
  snapshotCommentDetail,
  toggleCommentLikeInCaches,
  type CommentDetailQuerySnapshot,
  type CommentListQuerySnapshot,
} from '../../comment/lib/comment-cache';
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

type PostLikeContext = {
  targetType: 'POST';
  postId: number;
  previousMyLists: PostListQuerySnapshot;
  previousLikedLists: PostListQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

type CommentLikeContext = {
  targetType: 'COMMENT';
  commentPostId?: number;
  previousCommentLists: CommentListQuerySnapshot;
  previousCommentDetails: CommentDetailQuerySnapshot;
};

type LikeContext = PostLikeContext | CommentLikeContext;

export function useLikeMutation(
  client: ApiClient,
  options?: UseMutationOptions<LikeResponse, unknown, LikeRequestBody, LikeContext>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => postLike(client, body),
    onMutate: async (body) => {
      if (body.target_type === 'POST') {
        const postId = body.target_id;
        await cancelPostQueries(queryClient, postId);
        const previousMyLists = snapshotPostInfiniteLists(queryClient, postKeys.lists());
        const previousLikedLists = snapshotPostInfiniteLists(
          queryClient,
          postKeys.likedLists(),
        );
        const previousPostDetails = snapshotPostDetail(queryClient, postId);
        togglePostLikeInCaches(queryClient, postId);
        return {
          targetType: body.target_type,
          postId,
          previousMyLists,
          previousLikedLists,
          previousPostDetails,
        };
      }

      const commentId = body.target_id;
      const commentPostId = queryClient.getQueryData<{ post_id: number }>(
        commentKeys.detail(commentId),
      )?.post_id;
      await cancelCommentQueries(queryClient, commentId, commentPostId);
      const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
      const previousCommentLists =
        commentPostId != null
          ? snapshotCommentByPostLists(queryClient, commentPostId)
          : [];
      toggleCommentLikeInCaches(queryClient, commentId);
      return {
        targetType: body.target_type,
        commentPostId,
        previousCommentLists,
        previousCommentDetails,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      if (context.targetType === 'POST') {
        restorePostInfiniteLists(queryClient, context.previousMyLists);
        restorePostInfiniteLists(queryClient, context.previousLikedLists);
        restorePostDetails(queryClient, context.previousPostDetails);
        return;
      }

      restoreCommentByPostLists(queryClient, context.previousCommentLists);
      restoreCommentDetails(queryClient, context.previousCommentDetails);
    },
    onSettled: (_data, _error, body) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(body.target_id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.likedLists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
