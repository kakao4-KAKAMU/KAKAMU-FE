import type { PostListParams } from '@kakamu/types';

export function toPostListSearchParams(params: PostListParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.cursor != null) {
    searchParams.set('cursor', params.cursor.toString());
  }
  searchParams.set('limit', params.limit.toString());
  return searchParams;
}
