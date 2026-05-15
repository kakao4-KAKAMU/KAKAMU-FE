import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postUserRegister } from '@kakamu/api';
import type { RegisterUserRequest } from '@kakamu/types';

import { userKeys } from '../../../shared/keys/user.keys';

export function useRegisterUserMutation(client: ApiClient, options: UseMutationOptions<unknown, Error, RegisterUserRequest>) {
  return useMutation({
    mutationKey: userKeys.register(),
    mutationFn: (body: RegisterUserRequest) => postUserRegister(client, body),
    ...options,
  });
}
