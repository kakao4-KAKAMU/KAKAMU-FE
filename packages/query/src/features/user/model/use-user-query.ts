import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getUserById } from '@kakamu/api';
import type { UserPublic } from '@kakamu/types';
import { userKeys } from '../../../shared/keys/user.keys';

export function useUserQuery(
  client: ApiClient,
  userId: string,
  options?: Omit<UseSuspenseQueryOptions<UserPublic>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => {
      return getUserById(client, userId);
     },
    ...options,
  });
}
