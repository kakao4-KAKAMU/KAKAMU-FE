import type { LoginResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../users/login/refresh` — refresh token으로 access·refresh 재발급 */
export async function postUserLoginRefresh(
  client: ApiClient,
  refreshToken: string,
): Promise<LoginResponse> {
  return client
    .post('users/login/refresh', {
      json: { refresh_token: refreshToken },
      retry: { limit: 0 },
    })
    .json();
}
