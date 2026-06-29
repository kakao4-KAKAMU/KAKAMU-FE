import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  type UseQueryOptions,
  type UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import type { UserPublic } from '@kakamu/types';

import { userKeys } from '../../../shared/keys/user.keys';
import { fetchCurrentUser } from '../lib/prefetch-current-user';

export function useCurrentUserQuery(
  client: ApiClient,
  options?: Omit<UseQueryOptions<UserPublic>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => fetchCurrentUser(queryClient, client),
    ...options,
  });
}

export function useCurrentUserSuspenseQuery(
  client: ApiClient,
  options?: Omit<UseSuspenseQueryOptions<UserPublic>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: userKeys.me(),
    queryFn: () => fetchCurrentUser(queryClient, client),
    ...options,
  });
}
