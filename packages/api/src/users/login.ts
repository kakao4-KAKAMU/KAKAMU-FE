import type { LoginLocalResponse, SignIn } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../users/login/local` — 이메일·비밀번호 로그인 */
export async function postUserLoginLocal(client: ApiClient, body: SignIn): Promise<LoginLocalResponse> {
  return client.post('local-auth/login', { json: body }).json();
}
