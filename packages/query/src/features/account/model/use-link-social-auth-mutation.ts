import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postLinkSocialAuth } from '@kakamu/api';
import type { ApiSuccessResponse, SocialLinkRequest } from '@kakamu/types';

import { accountKeys } from '../../../shared/keys/account.keys';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useLinkSocialAuthMutation(
  client: ApiClient,
  options?: UseMutationOptions<ApiSuccessResponse, unknown, SocialLinkRequest>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => postLinkSocialAuth(client, body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.authStatus() });
    },
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
