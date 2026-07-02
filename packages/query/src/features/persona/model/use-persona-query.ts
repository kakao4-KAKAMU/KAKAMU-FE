import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { personaKeys } from '../../../shared/keys/persona.keys';
import type { ApiClient } from '@kakamu/api';
import { getPersonaById } from '@kakamu/api';
import type { PersonaDetailResponse } from '@kakamu/types';

export function usePersonaQuery(
  client: ApiClient,
  personaId: string,
  options?: Omit<UseSuspenseQueryOptions<PersonaDetailResponse>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: personaKeys.detail(personaId),
    queryFn: () => getPersonaById(client, personaId),
    ...options,
  });
}
