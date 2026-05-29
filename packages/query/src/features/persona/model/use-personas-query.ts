import { useQuery } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPersonas } from '@kakamu/api';
import type { PersonaListResponse } from '@kakamu/types';
import { personaKeys } from '../../../shared/keys/persona.keys';

export function usePersonasQuery(client: ApiClient) {
  return useQuery<PersonaListResponse>({
    queryKey: personaKeys.list(),
    queryFn: () => getPersonas(client),
  });
}
