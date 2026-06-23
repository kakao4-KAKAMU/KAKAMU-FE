import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { updatePersona } from '@kakamu/api';
import type { PersonaUpdateRequest, PersonaUpdateResponse } from '@kakamu/types';

import { personaKeys } from '../../../shared/keys/persona.keys';
import { userKeys } from '../../../shared/keys/user.keys';
import {
  cancelUserQueries,
  patchUserProfileInCache,
  restoreUserDetails,
  snapshotUserDetail,
  type UserDetailQuerySnapshot,
} from '../../user/lib/user-cache';
import {
  patchPersonaDetailCache,
  type PersonaDetailQuerySnapshot,
  restorePersonaDetails,
  snapshotPersonaDetail,
} from '../lib/persona-cache';

type UpdatePersonaVariables = {
  personaId: string;
  body: PersonaUpdateRequest;
  userId?: string;
};

type UpdatePersonaContext = {
  previousPersonaDetails: PersonaDetailQuerySnapshot;
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
      await queryClient.cancelQueries({ queryKey: personaKeys.detail(personaId) });
      const previousPersonaDetails = snapshotPersonaDetail(queryClient, personaId);
      patchPersonaDetailCache(queryClient, personaId, (persona) => ({
        ...persona,
        nickname: body.nickname ?? persona.nickname,
        profile_image_url: body.profile_image_url ?? persona.profile_image_url,
      }));

      let previousUserDetails: UserDetailQuerySnapshot | undefined;
      if (userId) {
        await cancelUserQueries(queryClient, userId);
        previousUserDetails = snapshotUserDetail(queryClient, userId);
        patchUserProfileInCache(queryClient, userId, {
          nickname: body.nickname ?? undefined,
          profile_image: body.profile_image_url ?? undefined,
        });
      }

      return { previousPersonaDetails, previousUserDetails };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }
      restorePersonaDetails(queryClient, context.previousPersonaDetails);
      if (context.previousUserDetails) {
        restoreUserDetails(queryClient, context.previousUserDetails);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: personaKeys.detail(variables.personaId) });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      }
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
