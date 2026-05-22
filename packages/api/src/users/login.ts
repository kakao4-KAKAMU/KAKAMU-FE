import type { LoginResponse, SignIn, SignInSocial } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../users/login/local` — 이메일·비밀번호 로그인 */
export async function postUserLoginLocal(client: ApiClient, body: SignIn): Promise<LoginResponse> {
  return client.post('users/login/', { json: body }).json();
}

export async function postUserLoginSocial(client: ApiClient, body: SignInSocial): Promise<LoginResponse> {
  return client.post('users/login/social', { json: body }).json();
}
