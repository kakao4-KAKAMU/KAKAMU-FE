import type {
  PersonSearchItem,
  PersonSearchParams,
  PersonSearchRequestBody,
  SearchPageResponse,
} from '@kakamu/types';

import type { ApiClient } from '../client';

const DEFAULT_SORT = 'name_asc' satisfies PersonSearchRequestBody['sort'];
const DEFAULT_LIMIT = 20;

function toPersonSearchParams(params: PersonSearchParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  searchParams.set('name', params.name?.trim() ?? '');
  for (const job of params.job ?? []) {
    searchParams.append('job[]', job);
  }
  searchParams.set('sort', params.sort ?? DEFAULT_SORT);
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? DEFAULT_LIMIT));
  return searchParams;
}

/** `POST .../v1/search/person` */
export async function postSearchPersons(
  client: ApiClient,
  params: PersonSearchParams = {},
): Promise<SearchPageResponse<PersonSearchItem>> {
  return client
    .get('v1/search/person', { searchParams: toPersonSearchParams(params) })
    .json<SearchPageResponse<PersonSearchItem>>();
}
