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

function buildOptimisticPersonaPatch(persona: Persona, body: PersonaUpdateRequest): Persona {
  const next: Persona = {
    ...persona,
    nickname: body.nickname ?? persona.nickname,
    profile_image_url: body.profile_image_url ?? persona.profile_image_url,
  };

  if (body.fav_genre_ids != null) {
    const idSet = new Set(body.fav_genre_ids);
    next.fav_genres = (persona.fav_genres ?? []).filter((genre) => idSet.has(genre.id));
  }
  if (body.fav_movie_ids != null) {
    const idSet = new Set(body.fav_movie_ids);
    next.fav_movies = (persona.fav_movies ?? []).filter((movie) => idSet.has(movie.id));
  }
  if (body.fav_people_ids != null) {
    const idSet = new Set(body.fav_people_ids);
    next.fav_people = (persona.fav_people ?? []).filter((person) => idSet.has(person.id));
  }

  return next;
}

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
      patchPersonaDetailCache(queryClient, personaId, (persona) =>
        buildOptimisticPersonaPatch(persona, body),
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
