import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getUserById } from '@kakamu/api';
import type { UserInfo } from '@kakamu/types';
import { userKeys } from '../../../shared/keys/user.keys';

export function useUserQuery(
  client: ApiClient,
  userId: string,
  options?: Omit<UseQueryOptions<UserInfo>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(client, userId),
    enabled: !!userId,
    ...options,
  });
}
