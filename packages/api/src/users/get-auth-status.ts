import type { AccountSettingsResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `GET .../users/auth-status` */
export async function getUserAuthStatus(client: ApiClient): Promise<AccountSettingsResponse> {
  return client.get('users/auth-status').json<AccountSettingsResponse>();
}
