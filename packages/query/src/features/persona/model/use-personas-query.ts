import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPersonas } from '@kakamu/api';
import type { PersonaListResponse } from '@kakamu/types';
import { personaKeys } from '../../../shared/keys/persona.keys';

export function usePersonasQuery(
  client: ApiClient,
  options?: Omit<UseSuspenseQueryOptions<PersonaListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: personaKeys.list(),
    queryFn: () => getPersonas(client),
    ...options,
  });
}
