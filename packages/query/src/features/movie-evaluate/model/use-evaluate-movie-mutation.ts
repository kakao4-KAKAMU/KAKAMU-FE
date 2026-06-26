import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postMovieEvaluate } from '@kakamu/api';
import type { MovieEvaluationRequest, MovieEvaluationResponse } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useEvaluateMovieMutation(
  client: ApiClient,
  options?: UseMutationOptions<MovieEvaluationResponse, unknown, MovieEvaluationRequest>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => postMovieEvaluate(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
    onSettled: (...args) => {
      void queryClient.invalidateQueries({ queryKey: movieKeys.toEvaluateLists() });
      options?.onSettled?.(...args);
    },
  });
}
