import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { MovieItem } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';

export function useMovieByIdQuery(
  movieId: string,
  options?: Omit<UseSuspenseQueryOptions<MovieItem>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => {
      const cached = queryClient.getQueryData<MovieItem>(movieKeys.detail(movieId));
      if (!cached) {
        throw new Error(`Movie ${movieId} is not available in cache`);
      }
      return cached;
    },
    ...options,
  });
}
