import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deletePersona } from '@kakamu/api';
import type { Persona } from '@kakamu/types';
import { personaKeys } from '../../../shared/keys/persona.keys';

type DeletePersonaVariables = {
  personaId: string;
};

type DeletePersonaContext = {
  previousPersonas: Persona[];
};

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useDeletePersonaMutation(
  client: ApiClient,
  options?: UseMutationOptions<void, Error, DeletePersonaVariables, DeletePersonaContext>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personaId }) => deletePersona(client, personaId),
    onMutate: async ({ personaId }) => {
      await queryClient.cancelQueries({ queryKey: personaKeys.list() });
      const previousPersonas =
        queryClient.getQueryData<Persona[]>(personaKeys.list()) ?? [];
      queryClient.setQueryData<Persona[]>(
        personaKeys.list(),
        previousPersonas.filter((persona) => persona.id !== personaId),
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
