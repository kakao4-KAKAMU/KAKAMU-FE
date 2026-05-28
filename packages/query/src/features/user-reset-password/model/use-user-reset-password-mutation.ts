import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { postUserResetPassword, type ApiClient } from '@kakamu/api';
import type { ResetPasswordRequest } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useUserResetPasswordMutation(
  client: ApiClient,
  options?: UseMutationOptions<void, Error, ResetPasswordRequest>
) {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => postUserResetPassword(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
