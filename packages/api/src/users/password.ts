import type { ChangePasswordRequest } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `PATCH .../users/password` — 로그인 사용자의 비밀번호 변경 */
export async function patchUserPassword(
  client: ApiClient,
  body: ChangePasswordRequest
): Promise<void> {
  await client.patch('users/password', { json: body });
}
