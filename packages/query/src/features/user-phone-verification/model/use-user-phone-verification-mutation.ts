import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { postUserPhoneVerification, type ApiClient } from '@kakamu/api';
import type { PhoneVerificationRequest } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useUserPhoneVerificationMutation(
  client: ApiClient,
  options?: UseMutationOptions<void, Error, PhoneVerificationRequest>
) {
  return useMutation({
    mutationFn: (body: PhoneVerificationRequest) => postUserPhoneVerification(client, body),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
