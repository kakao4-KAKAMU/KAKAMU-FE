import type { ApiSuccessResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `DELETE .../users/auth-status/social/{provider}` */
export async function deleteUnlinkSocialAuth(
  client: ApiClient,
  provider: string,
): Promise<ApiSuccessResponse> {
  return client.delete(`users/auth-status/social/${provider}`).json<ApiSuccessResponse>();
}
