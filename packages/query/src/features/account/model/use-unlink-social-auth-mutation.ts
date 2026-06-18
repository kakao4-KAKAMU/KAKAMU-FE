import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { deleteUnlinkSocialAuth } from '@kakamu/api';
import type { ApiSuccessResponse } from '@kakamu/types';

import { accountKeys } from '../../../shared/keys/account.keys';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useUnlinkSocialAuthMutation(
  client: ApiClient,
  options?: UseMutationOptions<ApiSuccessResponse, unknown, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider) => deleteUnlinkSocialAuth(client, provider),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.authStatus() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
