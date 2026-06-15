import type { RelationResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `POST .../relations/follows/{following_id}` */
export async function postFollowUser(
  client: ApiClient,
  followingId: string,
): Promise<RelationResponse> {
  return client.post(`relations/follows/${followingId}`).json<RelationResponse>();
}
