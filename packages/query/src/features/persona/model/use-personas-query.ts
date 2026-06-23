import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPersonas } from '@kakamu/api';

import { personaKeys } from '../../../shared/keys/persona.keys';
import { seedPersonaDetailCacheFromList } from '../lib/persona-cache';

export function usePersonasQuery(
  client: ApiClient,
  options?: Omit<UseSuspenseQueryOptions<string[]>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: personaKeys.list(),
    queryFn: async () => {
      const personas = await getPersonas(client);
      seedPersonaDetailCacheFromList(queryClient, personas);
      return personas.map((persona) => persona.id);
    },
    ...options,
  });
}
