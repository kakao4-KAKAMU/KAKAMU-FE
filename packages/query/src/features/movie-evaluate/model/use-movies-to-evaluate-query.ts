import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getMoviesToEvaluate } from '@kakamu/api';
import type { MovieToEvaluateListResponse, MovieToEvaluateParams } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';

const DEFAULT_LIMIT = 20;

export function useMoviesToEvaluateQuery(
  client: ApiClient,
  params: MovieToEvaluateParams = {},
  options?: Omit<UseQueryOptions<MovieToEvaluateListResponse>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = { ...params, limit: params.limit ?? DEFAULT_LIMIT };

  return useQuery({
    queryKey: movieKeys.toEvaluate(queryParams),
    queryFn: () => getMoviesToEvaluate(client, queryParams),
    staleTime: 30_000,
    ...options,
  });
}
