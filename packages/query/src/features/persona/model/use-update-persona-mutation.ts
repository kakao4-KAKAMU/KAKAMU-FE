import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updatePersona } from '@kakamu/api';
import type { Persona, PersonaUpdateRequest, PersonaUpdateResponse } from '@kakamu/types';
import { personaKeys } from '../../../shared/keys/persona.keys';
import { userKeys } from '../../../shared/keys/user.keys';
import {
  cancelUserQueries,
  patchUserProfileInCache,
  restoreUserDetails,
  snapshotUserDetail,
  type UserDetailQuerySnapshot,
} from '../../user/lib/user-cache';

type UpdatePersonaVariables = {
  personaId: string;
  body: PersonaUpdateRequest;
  userId?: string;
};

type UpdatePersonaContext = {
  previousPersonas: Persona[];
  previousUserDetails: UserDetailQuerySnapshot | undefined;
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
    onMutate: async ({ personaId, body, userId }) => {
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
              }
            : persona,
        ),
      );

      let previousUserDetails: UserDetailQuerySnapshot | undefined;
      if (userId) {
        await cancelUserQueries(queryClient, userId);
        previousUserDetails = snapshotUserDetail(queryClient, userId);
        patchUserProfileInCache(queryClient, userId, {
          nickname: body.nickname ?? undefined,
          profile_image: body.profile_image_url ?? undefined,
        });
      }

      return { previousPersonas, previousUserDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData(personaKeys.list(), context.previousPersonas);
      if (context.previousUserDetails) {
        restoreUserDetails(queryClient, context.previousUserDetails);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      }
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
