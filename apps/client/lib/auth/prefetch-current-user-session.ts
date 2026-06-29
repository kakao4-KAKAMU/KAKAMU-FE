import { createAuthenticatedApiClient, type ApiClient } from '@kakamu/api';
import { prefetchCurrentUser } from '@kakamu/query';

import { getBackendApiPrefixUrl } from '@/lib/env/backend-api-url';
import { appQueryClient } from '@/lib/query/query-client';

import { createTokenBridge } from './create-token-bridge';

export async function prefetchCurrentUserSession(client?: ApiClient): Promise<void> {
  const apiClient =
    client ??
    createAuthenticatedApiClient(getBackendApiPrefixUrl(), createTokenBridge());

  await prefetchCurrentUser(appQueryClient, apiClient);
}
