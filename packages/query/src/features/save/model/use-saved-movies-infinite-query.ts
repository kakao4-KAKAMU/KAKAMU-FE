import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSavedMovieList } from '@kakamu/api';
import type { SavedMovieListParams } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';
import {
  seedSavedMovieDetailCache,
  toSavedMovieIdListPage,
  type SavedMovieCursorIdListResponse,
  type SavedMovieInfiniteData,
} from '../lib/saved-movie-cache';

export function useSavedMoviesInfiniteQuery(
  client: ApiClient,
  params: Omit<SavedMovieListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      SavedMovieCursorIdListResponse,
      unknown,
      SavedMovieInfiniteData,
      ReturnType<typeof movieKeys.savedList>,
      number | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: movieKeys.savedList(params),
    queryFn: async ({ pageParam }) => {
      const response = await getSavedMovieList(client, {
        ...params,
        cursor: pageParam,
      });
      seedSavedMovieDetailCache(queryClient, response.items);
      return toSavedMovieIdListPage(response);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? (lastPage.next_cursor ?? undefined) : undefined,
    ...options,
  });
}
