import type { UserAccount, UserUpdate } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `PUT .../users/me` */
export async function updateCurrentUser(
  client: ApiClient,
  body: UserUpdate,
): Promise<UserAccount> {
  return client.put('users/me', { json: body }).json<UserAccount>();
}
