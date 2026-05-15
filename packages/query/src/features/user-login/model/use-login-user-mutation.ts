import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postUserLoginLocal } from '@kakamu/api';
import type { LoginLocalResponse, SignIn } from '@kakamu/types';

import { userKeys } from '../../../shared/keys/user.keys';

export function useLoginUserMutation(client: ApiClient, options: UseMutationOptions<LoginLocalResponse, Error, SignIn>) {
  return useMutation({
    mutationKey: userKeys.login(),
    mutationFn: (body: SignIn) => postUserLoginLocal(client, body),
    ...options,
  });
}
