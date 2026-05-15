import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSocialAuthLogin } from '@kakamu/api';
import type { LoginLocalResponse, SocialAuthLoginRequest } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useSocialAuthLoginMutation(
  client: ApiClient,
  options?: UseMutationOptions<LoginLocalResponse, Error, SocialAuthLoginRequest>
) {
  return useMutation({
    mutationFn: (body: SocialAuthLoginRequest) => postSocialAuthLogin(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
