import type { RegisterUserRequest } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../users/register` — 서버에서 `firebase_id_token` 검증 */
export async function postUserRegister(
  client: ApiClient,
  body: RegisterUserRequest
): Promise<unknown> {
  return client.post('users/register', { json: body }).json();
}
