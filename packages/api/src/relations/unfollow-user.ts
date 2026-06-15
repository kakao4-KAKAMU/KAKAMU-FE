import type { RelationResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `DELETE .../relations/follows/{following_id}` */
export async function deleteUnfollowUser(
  client: ApiClient,
  followingId: string,
): Promise<RelationResponse> {
  return client.delete(`relations/follows/${followingId}`).json<RelationResponse>();
}
