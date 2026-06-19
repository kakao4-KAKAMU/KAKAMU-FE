import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchContent } from '@kakamu/api';
import type { ContentSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchContentInfiniteQuery(
  client: ApiClient,
  params: Omit<ContentSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.content(params),
    queryFn: ({ pageParam }) =>
      getSearchContent(
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
