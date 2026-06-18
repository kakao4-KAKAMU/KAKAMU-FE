import type { ApiSuccessResponse, SocialLinkRequest } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../users/auth-status/social` */
export async function postLinkSocialAuth(
  client: ApiClient,
  body: SocialLinkRequest,
): Promise<ApiSuccessResponse> {
  return client.post('users/auth-status/social', { json: body }).json<ApiSuccessResponse>();
}
