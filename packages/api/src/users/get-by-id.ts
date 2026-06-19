import type { UserPublic } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `GET .../users/{user_id}` */
export async function getUserById(client: ApiClient, userId: string): Promise<UserPublic> {
  return client.get(`users/${userId}`).json<UserPublic>();
}
