import type { PostSearchResponse, TabSearchParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toTabSearchParams } from './build-tab-search-params';

/** `GET /v1/search/for-you` */
export async function getSearchForYou(
  client: ApiClient,
  params: TabSearchParams,
  cursor?: string | null,
): Promise<PostSearchResponse> {
  return client
    .get('v1/search/for-you', { searchParams: toTabSearchParams(params, cursor) })
    .json<PostSearchResponse>();
}
