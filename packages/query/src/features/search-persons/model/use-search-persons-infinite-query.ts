import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSearchPersons } from '@kakamu/api';
import type { PersonSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchPersonsInfiniteQuery(
  client: ApiClient,
  params: Omit<PersonSearchParams, 'skip' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.persons(params),
    queryFn: ({ pageParam }) =>
      postSearchPersons(client, {
        ...params,
        skip: pageParam,
        limit: DEFAULT_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length < lastPage.limit) {
        return undefined;
      }
      if (lastPage.total_count != null && lastPage.skip * lastPage.limit >= lastPage.total_count) {
        return undefined;
      }
      return lastPage.skip + lastPage.limit;
    },
    enabled,
  });
}
