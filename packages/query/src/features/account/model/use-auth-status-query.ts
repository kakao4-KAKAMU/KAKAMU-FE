import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getUserAuthStatus } from '@kakamu/api';
import type { AccountSettingsResponse } from '@kakamu/types';

import { accountKeys } from '../../../shared/keys/account.keys';

export function useAuthStatusQuery(
  client: ApiClient,
  options?: Omit<UseQueryOptions<AccountSettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: accountKeys.authStatus(),
    queryFn: () => getUserAuthStatus(client),
    ...options,
  });
}
