import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { createPersona } from '@kakamu/api';
import type { Persona, PersonaCreateRequest, PersonaCreateResponse } from '@kakamu/types';

import { personaKeys } from '../../../shared/keys/persona.keys';
import {
  removePersonaDetailCache,
  setPersonaDetailCache,
} from '../lib/persona-cache';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type CreatePersonaContext = {
  previousPersonaIds: string[];
  optimisticPersonaId: string;
};

export function useCreatePersonaMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    PersonaCreateResponse,
    Error,
    PersonaCreateRequest,
    CreatePersonaContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PersonaCreateRequest) => createPersona(client, body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: personaKeys.list() });
      const previousPersonaIds = queryClient.getQueryData<string[]>(personaKeys.list()) ?? [];
      const optimisticPersona: Persona = {
        id: `optimistic-persona-${Date.now()}`,
        user_id: '',
        nickname: body.nickname,
        profile_image_url: body.profile_image_url ?? null,
      };
      queryClient.setQueryData<string[]>(personaKeys.list(), [
        ...previousPersonaIds,
        optimisticPersona.id,
      ]);
      setPersonaDetailCache(queryClient, optimisticPersona);
      return { previousPersonaIds, optimisticPersonaId: optimisticPersona.id };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData(personaKeys.list(), context.previousPersonaIds);
      removePersonaDetailCache(queryClient, context.optimisticPersonaId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
