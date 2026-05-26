import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchPersons } from '@kakamu/api';
import type { PersonSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchPersonsInfiniteQuery(
  client: ApiClient,
  params: Omit<PersonSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.persons(params),
    queryFn: ({ pageParam }) =>
      getSearchPersons(client, {
        ...params,
        cursor: pageParam,
        limit: DEFAULT_LIMIT,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled,
  });
}
