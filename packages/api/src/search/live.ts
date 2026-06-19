import type { PostSearchResponse, TabSearchParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toTabSearchParams } from './build-tab-search-params';

/** `GET /v1/search/live` */
export async function getSearchLive(
  client: ApiClient,
  params: TabSearchParams,
  cursor?: number | null,
): Promise<PostSearchResponse> {
  return client
    .get('v1/search/live', { searchParams: toTabSearchParams(params, cursor) })
    .json<PostSearchResponse>();
}
