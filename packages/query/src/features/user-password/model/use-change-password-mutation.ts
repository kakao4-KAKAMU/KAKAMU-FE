import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { patchUserPassword } from '@kakamu/api';
import type { ChangePasswordRequest } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useChangePasswordMutation(
  client: ApiClient,
  options?: UseMutationOptions<void, Error, ChangePasswordRequest>
) {
  return useMutation({
    mutationFn: (body: ChangePasswordRequest) => patchUserPassword(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
