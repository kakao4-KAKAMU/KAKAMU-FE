import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deletePersona } from '@kakamu/api';

import { personaKeys } from '../../../shared/keys/persona.keys';
import { removePersonaDetailCache } from '../lib/persona-cache';

type DeletePersonaVariables = {
  personaId: string;
};

type DeletePersonaContext = {
  previousPersonaIds: string[];
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
      const previousPersonaIds = queryClient.getQueryData<string[]>(personaKeys.list()) ?? [];
      queryClient.setQueryData<string[]>(
        personaKeys.list(),
        previousPersonaIds.filter((id) => id !== personaId),
      );
      removePersonaDetailCache(queryClient, personaId);
      return { previousPersonaIds };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData(personaKeys.list(), context.previousPersonaIds);
    },
    onSettled: (_data, _error, { personaId }) => {
      queryClient.invalidateQueries({ queryKey: personaKeys.detail(personaId) });
      queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
