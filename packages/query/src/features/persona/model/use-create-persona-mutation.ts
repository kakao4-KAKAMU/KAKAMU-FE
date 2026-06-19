import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { createPersona } from '@kakamu/api';
import type { Persona, PersonaCreateRequest, PersonaCreateResponse } from '@kakamu/types';
import { personaKeys } from '../../../shared/keys/persona.keys';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;
type CreatePersonaContext = { previousPersonas: Persona[] };

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
      const previousPersonas =
        queryClient.getQueryData<Persona[]>(personaKeys.list()) ?? [];
      const optimisticPersona: Persona = {
        id: `optimistic-persona-${Date.now()}`,
        user_id: '',
        nickname: body.nickname,
        profile_image_url: body.profile_image_url ?? null,
      };
      queryClient.setQueryData<Persona[]>(personaKeys.list(), [
        ...previousPersonas,
        optimisticPersona,
      ]);
      return { previousPersonas };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData(personaKeys.list(), context.previousPersonas);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
