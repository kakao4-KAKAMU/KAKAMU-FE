import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updatePersona } from '@kakamu/api';
import type { Persona, PersonaUpdateRequest, PersonaUpdateResponse } from '@kakamu/types';
import { personaKeys } from '../../../shared/keys/persona.keys';

type UpdatePersonaVariables = {
  personaId: string;
  body: PersonaUpdateRequest;
};

type UpdatePersonaContext = {
  previousPersonas: Persona[];
};

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useUpdatePersonaMutation(
  client: ApiClient,
  options?: UseMutationOptions<
    PersonaUpdateResponse,
    Error,
    UpdatePersonaVariables,
    UpdatePersonaContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personaId, body }) => updatePersona(client, personaId, body),
    onMutate: async ({ personaId, body }) => {
      await queryClient.cancelQueries({ queryKey: personaKeys.list() });
      const previousPersonas =
        queryClient.getQueryData<Persona[]>(personaKeys.list()) ?? [];
      queryClient.setQueryData<Persona[]>(
        personaKeys.list(),
        previousPersonas.map((persona) =>
          persona.id === personaId
            ? {
                ...persona,
                nickname: body.nickname ?? persona.nickname,
                profile_image_url: body.profile_image_url ?? persona.profile_image_url,
                profile_msg: body.profile_msg ?? persona.profile_msg,
              }
            : persona,
        ),
      );
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
