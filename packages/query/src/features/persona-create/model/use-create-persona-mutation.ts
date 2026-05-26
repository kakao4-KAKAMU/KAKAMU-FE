import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postProfilePersona } from '@kakamu/api';
import type { PersonaCreateRequest, PersonaCreateResponse } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useCreatePersonaMutation(
  client: ApiClient,
  options?: UseMutationOptions<PersonaCreateResponse, Error, PersonaCreateRequest>,
) {
  return useMutation({
    mutationFn: (body: PersonaCreateRequest) => postProfilePersona(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
