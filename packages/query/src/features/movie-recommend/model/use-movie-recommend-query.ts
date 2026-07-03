import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getMovieRecommend } from '@kakamu/api';
import type { MovieRecommendParams, MovieRecommendationResponse } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

export function useMovieRecommendQuery(
  client: ApiClient,
  params: MovieRecommendParams = {},
  options?: Omit<UseQueryOptions<MovieRecommendationResponse>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();
  const queryParams = { query: params.query?.trim() || undefined };

  return useQuery({
    queryKey: movieKeys.recommend(queryParams),
    queryFn: async () => {
      const response = await getMovieRecommend(client, queryParams);
      seedDetailCache(
        queryClient,
        response.movies,
        (item) => item.id,
        movieKeys.detail,
      );
      return response;
    },
    staleTime: 60_000,
    ...options,
  });
}
