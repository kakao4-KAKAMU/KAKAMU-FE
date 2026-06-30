import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSaveToggle } from '@kakamu/api';
import type { SaveToggleRequest, SaveToggleResponse } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  cancelCommentSaveQueries,
  restoreCommentDetails,
  restoreCommentSavedLists,
  setCommentSaveInCaches,
  snapshotCommentDetail,
  snapshotCommentSavedLists,
  toggleCommentSaveInCaches,
  type CommentDetailQuerySnapshot,
  type CommentListQuerySnapshot,
} from '../../comment/lib/comment-cache';
import {
  cancelPostSaveQueries,
  restorePostDetails,
  restorePostInfiniteLists,
  setPostSaveInCaches,
  snapshotPostDetail,
  snapshotPostInfiniteLists,
  togglePostSaveInCaches,
  type PostDetailQuerySnapshot,
  type PostListQuerySnapshot,
} from '../../post/lib/post-infinite-cache';
import {
  cancelMovieSaveQueries,
  restoreMovieDetailFulls,
  restoreSavedMovieInfiniteLists,
  setMovieSaveInCaches,
  snapshotMovieDetailFull,
  snapshotSavedMovieInfiniteLists,
  toggleMovieSaveInCaches,
  type MovieDetailQuerySnapshot,
  type SavedMovieListQuerySnapshot,
} from '../lib/saved-movie-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type PostSaveContext = {
  targetType: 'POST';
  postId: number;
  previousSavedLists: PostListQuerySnapshot;
  previousPostDetails: PostDetailQuerySnapshot;
};

type CommentSaveContext = {
  targetType: 'COMMENT';
  commentId: number;
  previousCommentDetails: CommentDetailQuerySnapshot;
  previousSavedLists: CommentListQuerySnapshot;
};

type MovieSaveContext = {
  targetType: 'MOVIE';
  movieId: string;
  previousMovieDetails: MovieDetailQuerySnapshot;
  previousSavedLists: SavedMovieListQuerySnapshot;
};

type SaveContext = PostSaveContext | CommentSaveContext | MovieSaveContext;

export function useSaveMutation(
  client: ApiClient,
  options?: UseMutationOptions<SaveToggleResponse, unknown, SaveToggleRequest, SaveContext>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => postSaveToggle(client, body),
    onMutate: async (body) => {
      if (body.target_type === 'POST') {
        const postId = body.target_id!;
        await cancelPostSaveQueries(queryClient, postId);
        const previousSavedLists = snapshotPostInfiniteLists(
          queryClient,
          postKeys.savedLists(),
        );
        const previousPostDetails = snapshotPostDetail(queryClient, postId);
        togglePostSaveInCaches(queryClient, postId);
        return {
          targetType: body.target_type,
          postId,
          previousSavedLists,
          previousPostDetails,
        };
      }

      if (body.target_type === 'COMMENT') {
        const commentId = body.target_id!;
        await cancelCommentSaveQueries(queryClient, commentId);
        const previousCommentDetails = snapshotCommentDetail(queryClient, commentId);
        const previousSavedLists = snapshotCommentSavedLists(queryClient);
        toggleCommentSaveInCaches(queryClient, commentId);
        return {
          targetType: body.target_type,
          commentId,
          previousCommentDetails,
          previousSavedLists,
        };
      }

      const movieId = body.movie_id!;
      await cancelMovieSaveQueries(queryClient, movieId);
      const previousMovieDetails = snapshotMovieDetailFull(queryClient, movieId);
      const previousSavedLists = snapshotSavedMovieInfiniteLists(queryClient);
      toggleMovieSaveInCaches(queryClient, movieId);
      return {
        targetType: body.target_type,
        movieId,
        previousMovieDetails,
        previousSavedLists,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      if (context.targetType === 'POST') {
        restorePostInfiniteLists(queryClient, context.previousSavedLists);
        restorePostDetails(queryClient, context.previousPostDetails);
        return;
      }

      if (context.targetType === 'COMMENT') {
        restoreCommentSavedLists(queryClient, context.previousSavedLists);
        restoreCommentDetails(queryClient, context.previousCommentDetails);
        return;
      }

      restoreSavedMovieInfiniteLists(queryClient, context.previousSavedLists);
      restoreMovieDetailFulls(queryClient, context.previousMovieDetails);
    },
    onSuccess: (data, variables, context) => {
      if (!context) {
        return;
      }

      if (context.targetType === 'POST') {
        setPostSaveInCaches(queryClient, context.postId, data.is_saved);
        return;
      }

      if (context.targetType === 'COMMENT') {
        setCommentSaveInCaches(queryClient, context.commentId, data.is_saved);
        return;
      }

      setMovieSaveInCaches(queryClient, context.movieId, data.is_saved);
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
