import type { TrendSearchResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

export type SearchTrendParams = {
  limit?: number;
};

/** `GET /v1/search/trend` */
export async function getSearchTrend(
  client: ApiClient,
  params: SearchTrendParams = {},
): Promise<TrendSearchResponse> {
  const searchParams = new URLSearchParams();
  if (params.limit != null) {
    searchParams.set('limit', String(params.limit));
  }
  return client.get('v1/search/trend', { searchParams }).json<TrendSearchResponse>();
}
