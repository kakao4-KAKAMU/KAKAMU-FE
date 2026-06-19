import type { ContentSearchParams, TabSearchParams } from '@kakamu/types';

const DEFAULT_LIMIT = 20;

export function toTabSearchParams(
  params: TabSearchParams,
  cursor?: string | number | null,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  searchParams.set('q', params.q.trim());
  if (cursor != null && cursor !== '') {
    searchParams.set('cursor', String(cursor));
  }
  searchParams.set('limit', String(params.limit ?? DEFAULT_LIMIT));
  return searchParams;
}

export function toContentSearchParams(
  params: ContentSearchParams,
  cursor?: string | number | null,
): URLSearchParams {
  const searchParams = toTabSearchParams(params, cursor);
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }
  return searchParams;
}
