import type { LoginResponse, SignUpSNS } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../users/register/social` — SNS OAuth token + 프로필로 가입 */
export async function postUserRegisterSocial(
  client: ApiClient,
  body: SignUpSNS,
): Promise<LoginResponse> {
  return client.post('users/register/social', { json: body }).json();
}
