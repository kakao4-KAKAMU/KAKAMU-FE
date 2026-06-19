import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getGenreList } from '@kakamu/api';
import type { GenreListResponse } from '@kakamu/types';

import { personaKeys } from '../../../shared/keys/persona.keys';

export function useGenreListQuery(
  client: ApiClient,
  options?: Omit<UseSuspenseQueryOptions<GenreListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: personaKeys.genres(),
    queryFn: () => getGenreList(client),
    ...options,
  });
}
