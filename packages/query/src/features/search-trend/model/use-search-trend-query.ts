import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchTrend } from '@kakamu/api';
import type { TrendSearchResponse } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 10;

export function useSearchTrendQuery(
  client: ApiClient,
  limit = DEFAULT_LIMIT,
  options?: Omit<UseSuspenseQueryOptions<TrendSearchResponse>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: searchKeys.trend(limit),
    queryFn: () => getSearchTrend(client, { limit }),
    staleTime: 60_000,
    ...options,
  });
}
