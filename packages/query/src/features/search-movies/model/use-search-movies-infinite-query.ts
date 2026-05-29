import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSearchMovies } from '@kakamu/api';
import type { MovieSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';

const DEFAULT_LIMIT = 20;

export function useSearchMoviesInfiniteQuery(
  client: ApiClient,
  params: Omit<MovieSearchParams, 'skip' | 'limit'>,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: searchKeys.movies(params),
    queryFn: ({ pageParam }) =>
      postSearchMovies(client, {
        ...params,
        skip: pageParam,
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
