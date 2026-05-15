import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postUserLoginLocal } from '@kakamu/api';
import type { LoginLocalResponse, SignIn } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useLoginUserMutation(
  client: ApiClient,
  options?: UseMutationOptions<LoginLocalResponse, Error, SignIn>
) {
  return useMutation({
    mutationFn: (body: SignIn) => postUserLoginLocal(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
