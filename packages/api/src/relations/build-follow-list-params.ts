import type { FollowListParams } from '@kakamu/types';

export function toFollowListSearchParams(
  params: Pick<FollowListParams, 'cursor' | 'limit'>,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  searchParams.set('limit', params.limit.toString());
  return searchParams;
}
