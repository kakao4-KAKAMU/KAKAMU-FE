import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getGenreList } from '@kakamu/api';
import type { Genre } from '@kakamu/types';

import { personaKeys } from '../../../shared/keys/persona.keys';

export function useGenreListQuery(
  client: ApiClient,
  options?: Omit<UseSuspenseQueryOptions<Genre[]>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: personaKeys.genres(),
    queryFn: async () => {
      const response = await getGenreList(client);
      return response.genres;
    },
    ...options,
  });
}
