import type { PaginatedResponse, PersonSearchItem, PersonSearchParams } from '@kakamu/types';

import type { ApiClient } from '../client';

import { buildSearchParams } from './build-search-params';

function toPersonSearchParams(params: PersonSearchParams) {
  return buildSearchParams({
    name: params.name?.trim() || undefined,
    job: params.job?.length ? params.job : undefined,
    sort: params.sort,
    cursor: params.cursor,
    limit: params.limit,
  });
}

/** `GET .../search/person` */
export async function getSearchPersons(
  client: ApiClient,
  params: PersonSearchParams = {},
): Promise<PaginatedResponse<PersonSearchItem>> {
  return client
    .get('search/person', { searchParams: toPersonSearchParams(params) })
    .json<PaginatedResponse<PersonSearchItem>>();
}
