import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getMovieById } from '@kakamu/api';
import type { MovieDetail } from '@kakamu/types';

import { seedMovieDetailCache } from '../lib/movie-detail-cache';
import { movieKeys } from '../../../shared/keys/movie.keys';

export function useMovieDetailQuery(
  client: ApiClient,
  movieId: string | null | undefined,
  options?: Omit<UseQueryOptions<MovieDetail>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: movieKeys.detailFull(movieId ?? ''),
    queryFn: async () => {
      const detail = await getMovieById(client, movieId!);
      seedMovieDetailCache(queryClient, detail);
      return detail;
    },
    enabled: Boolean(movieId),
    staleTime: 60_000,
    ...options,
  });
}
