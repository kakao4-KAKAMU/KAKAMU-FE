import type { TabSearchParams, UserSearchResponse } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toTabSearchParams } from './build-tab-search-params';

/** `GET /v1/search/user` */
export async function getSearchUser(
  client: ApiClient,
  params: TabSearchParams,
  cursor?: string | null,
): Promise<UserSearchResponse> {
  return client
    .get('v1/search/user', { searchParams: toTabSearchParams(params, cursor) })
    .json<UserSearchResponse>();
}
