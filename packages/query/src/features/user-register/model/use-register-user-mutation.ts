import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postUserRegister } from '@kakamu/api';
import type { RegisterUserRequest } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useRegisterUserMutation(
  client: ApiClient,
  options?: UseMutationOptions<unknown, Error, RegisterUserRequest>
) {
  return useMutation({
    mutationFn: (body: RegisterUserRequest) => postUserRegister(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
