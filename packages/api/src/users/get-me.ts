import type { UserPublic } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `GET .../users/me` */
export async function getCurrentUser(client: ApiClient): Promise<UserPublic> {
  return client.get('users/me').json<UserPublic>();
}
