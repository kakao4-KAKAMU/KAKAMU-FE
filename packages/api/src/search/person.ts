import type {
  PersonSearchItem,
  PersonSearchParams,
  PersonSearchRequestBody,
  SearchPageResponse,
} from '@kakamu/types';

import type { ApiClient } from '../client';

const DEFAULT_SORT = 'name_asc' satisfies PersonSearchRequestBody['sort'];
const DEFAULT_LIMIT = 20;

function toPersonSearchBody(params: PersonSearchParams): PersonSearchRequestBody {
  return {
    name: params.name?.trim() ?? '',
    job: params.job ?? [],
    sort: params.sort ?? DEFAULT_SORT,
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_LIMIT,
  };
}

/** `POST .../search/person` */
export async function postSearchPersons(
  client: ApiClient,
  params: PersonSearchParams = {},
): Promise<SearchPageResponse<PersonSearchItem>> {
  return client
    .post('search/person', { json: toPersonSearchBody(params) })
    .json<SearchPageResponse<PersonSearchItem>>();
}
