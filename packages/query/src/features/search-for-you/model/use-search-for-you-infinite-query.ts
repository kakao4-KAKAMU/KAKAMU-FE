import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchForYou } from '@kakamu/api';
import type { TabSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchForYouInfiniteQuery(
  client: ApiClient,
  params: Omit<TabSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.forYou(params),
    queryFn: ({ pageParam }) =>
      getSearchForYou(
        client,
        { ...params, limit: DEFAULT_LIMIT },
        pageParam as string | null | undefined,
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next ? (lastPage.meta.next_cursor as string | null) : undefined,
    enabled: enabled && params.q.trim().length > 0,
  });
}
