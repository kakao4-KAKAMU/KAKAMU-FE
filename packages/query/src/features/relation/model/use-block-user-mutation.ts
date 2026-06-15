import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postBlockUser } from '@kakamu/api';
import type { BlockRequest, RelationResponse } from '@kakamu/types';

import { relationKeys } from '../../../shared/keys/relation.keys';
import { userKeys } from '../../../shared/keys/user.keys';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

type BlockUserVariables = {
  blockedId: string;
  body?: BlockRequest;
};

export function useBlockUserMutation(
  client: ApiClient,
  options?: UseMutationOptions<RelationResponse, unknown, BlockUserVariables>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blockedId, body }) => postBlockUser(client, blockedId, body),
    onSettled: (_data, _error, { blockedId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(blockedId) });
      queryClient.invalidateQueries({ queryKey: relationKeys.followingsLists() });
      queryClient.invalidateQueries({ queryKey: relationKeys.followersLists() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
