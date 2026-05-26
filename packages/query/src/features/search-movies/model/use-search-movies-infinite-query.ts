import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchMovies } from '@kakamu/api';
import type { MovieSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchMoviesInfiniteQuery(
  client: ApiClient,
  params: Omit<MovieSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.movies(params),
    queryFn: ({ pageParam }) =>
      getSearchMovies(client, {
        ...params,
        cursor: pageParam,
        limit: DEFAULT_LIMIT,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled,
  });
}
