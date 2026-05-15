import type { LoginLocalResponse, SocialAuthLoginRequest } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../social-auth/login` — SNS provider + OAuth token */
export async function postSocialAuthLogin(
  client: ApiClient,
  body: SocialAuthLoginRequest
): Promise<LoginLocalResponse> {
  return client.post('social-auth/login', { json: body }).json();
}
