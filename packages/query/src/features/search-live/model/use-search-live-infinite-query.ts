import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchLive } from '@kakamu/api';
import type { TabSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchLiveInfiniteQuery(
  client: ApiClient,
  params: Omit<TabSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.live(params),
    queryFn: ({ pageParam }) =>
      getSearchLive(
        client,
        { ...params, limit: DEFAULT_LIMIT },
        pageParam as number | null | undefined,
      ),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next ? (lastPage.meta.next_cursor as number | null) : undefined,
    enabled: enabled && params.q.trim().length > 0,
  });
}
