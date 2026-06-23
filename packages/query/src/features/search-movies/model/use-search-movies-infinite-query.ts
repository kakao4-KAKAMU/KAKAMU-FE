import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSearchMovies } from '@kakamu/api';
import type { MovieFilterSearchResponse, MovieSearchParams } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';
import { searchKeys } from '../../../shared/keys/search.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

const DEFAULT_LIMIT = 20;

function selectMovieFilterSearchIds(data: {
  pages: MovieFilterSearchResponse[];
  pageParams: unknown[];
}) {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => item.id),
    })),
  };
}

export function useSearchMoviesInfiniteQuery(
  client: ApiClient,
  params: Omit<MovieSearchParams, 'skip' | 'limit'>,
  enabled = true,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: searchKeys.movies(params),
    queryFn: async ({ pageParam }) => {
      const response = await postSearchMovies(client, {
        ...params,
        skip: pageParam,
        limit: DEFAULT_LIMIT,
      });
      seedDetailCache(queryClient, response.items, (item) => item.id, movieKeys.detail);
      return response;
    },
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
    select: selectMovieFilterSearchIds,
  });
}
