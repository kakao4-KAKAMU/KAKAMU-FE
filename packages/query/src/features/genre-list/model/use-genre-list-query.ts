import { useQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getGenreList } from '@kakamu/api';

import { personaKeys } from '../../../shared/keys/persona.keys';

export function useGenreListQuery(client: ApiClient) {
  return useQuery({
    queryKey: personaKeys.genres(),
    queryFn: () => getGenreList(client),
  });
}
