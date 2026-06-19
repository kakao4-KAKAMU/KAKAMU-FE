import type { ContentSearchParams, MovieTabSearchResponse } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toContentSearchParams } from './build-tab-search-params';

/** `GET /v1/search/content` */
export async function getSearchContent(
  client: ApiClient,
  params: ContentSearchParams,
  cursor?: string | null,
): Promise<MovieTabSearchResponse> {
  return client
    .get('v1/search/content', { searchParams: toContentSearchParams(params, cursor) })
    .json<MovieTabSearchResponse>();
}
