import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postUserLoginSocial } from '@kakamu/api';
import type { LoginResponse, SignInSocial } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useSocialAuthLoginMutation(
  client: ApiClient,
  options?: UseMutationOptions<LoginResponse, Error, SignInSocial>
) {
  return useMutation({
    mutationFn: (body: SignInSocial) => postUserLoginSocial(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
