import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSearchPersons } from '@kakamu/api';
import type { PersonSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchPersonsInfiniteQuery(
  client: ApiClient,
  params: Omit<PersonSearchParams, 'page' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.persons(params),
    queryFn: ({ pageParam }) =>
      postSearchPersons(client, {
        ...params,
        page: pageParam,
        limit: DEFAULT_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length < lastPage.limit) {
        return undefined;
      }
      if (lastPage.total != null && lastPage.page * lastPage.limit >= lastPage.total) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    enabled,
  });
}
