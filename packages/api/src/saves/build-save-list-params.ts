import type {
  SavedCommentListParams,
  SavedMovieListParams,
  SavedPostListParams,
} from '@kakamu/types';

export function toSavedPostListSearchParams(params: SavedPostListParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.cursor != null) {
    searchParams.set('cursor', params.cursor.toString());
  }
  searchParams.set('limit', params.limit.toString());
  return searchParams;
}

export function toSavedCommentListSearchParams(
  params: SavedCommentListParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.page != null) {
    searchParams.set('page', params.page.toString());
  }
  if (params.size != null) {
    searchParams.set('size', params.size.toString());
  }
  return searchParams;
}

export function toSavedMovieListSearchParams(params: SavedMovieListParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.cursor != null) {
    searchParams.set('cursor', params.cursor.toString());
  }
  searchParams.set('limit', params.limit.toString());
  return searchParams;
}
