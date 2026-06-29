import type { QueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getCurrentUser } from '@kakamu/api';
import type { UserPublic } from '@kakamu/types';

import { userKeys } from '../../../shared/keys/user.keys';
import { seedCurrentUserDetailCache } from './current-user-cache';

export async function fetchCurrentUser(
  queryClient: QueryClient,
  client: ApiClient,
): Promise<UserPublic> {
  const user = await getCurrentUser(client);
  seedCurrentUserDetailCache(queryClient, user);
  return user;
}

export async function prefetchCurrentUser(
  queryClient: QueryClient,
  client: ApiClient,
): Promise<UserPublic | undefined> {
  try {
    return await queryClient.fetchQuery({
      queryKey: userKeys.me(),
      queryFn: () => fetchCurrentUser(queryClient, client),
    });
  } catch {
    return undefined;
  }
}
