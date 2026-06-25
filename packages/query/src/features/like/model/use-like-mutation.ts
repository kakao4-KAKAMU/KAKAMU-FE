import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postLike } from '@kakamu/api';
import type { LikeRequestBody, LikeResponse } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';
import { postKeys } from '../../../shared/keys/post.keys';
import {
  cancelCommentDetailQueries,
  restoreCommentDetails,
  snapshotCommentDetail,
  toggleCommentLikeInCaches,
  type CommentDetailQuerySnapshot,
} from '../../comment/lib/comment-cache';
import {
  cancelPostDetailQueries,
  restorePostDetails,
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
  previousLikedLists: PostListQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

type CommentLikeContext = {
  targetType: 'COMMENT';
  commentPostId: number;
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
        await cancelPostDetailQueries(queryClient, postId);
        await queryClient.cancelQueries({ queryKey: postKeys.likedLists() });
        const previousLikedLists = snapshotPostInfiniteLists(
          queryClient,
          postKeys.likedLists(),
        );
        const previousPostDetails = snapshotPostDetail(queryClient, postId);
        togglePostLikeInCaches(queryClient, postId);
        return {
          targetType: body.target_type,
          postId,
          previousLikedLists,
          previousPostDetails,
        };
      }

      const commentId = body.target_id;
      await cancelCommentDetailQueries(queryClient, commentId);
      const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
      toggleCommentLikeInCaches(queryClient, commentId);
      return {
        targetType: body.target_type,
        commentPostId: body.target_id,
        previousCommentDetails,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      if (context.targetType === 'POST') {
        restorePostDetails(queryClient, context.previousPostDetails);
        return;
      }

      restoreCommentDetails(queryClient, context.previousCommentDetails);
    },
    onSuccess: (_data, _error, body) => {
      if (body.targetType === 'POST') {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(body.postId) });
        return;
      }

      queryClient.invalidateQueries({ queryKey: commentKeys.detail(body.commentPostId) });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
