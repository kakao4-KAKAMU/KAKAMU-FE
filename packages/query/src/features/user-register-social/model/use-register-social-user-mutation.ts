import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postUserRegisterSocial } from '@kakamu/api';
import type { LoginLocalResponse, SignUpSNS } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useRegisterSocialUserMutation(
  client: ApiClient,
  options?: UseMutationOptions<LoginLocalResponse, Error, SignUpSNS>,
) {
  return useMutation({
    mutationFn: (body: SignUpSNS) => postUserRegisterSocial(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
