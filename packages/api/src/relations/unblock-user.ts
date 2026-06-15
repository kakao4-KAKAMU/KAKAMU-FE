import type { RelationResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `DELETE .../relations/blocks/{blocked_id}` */
export async function deleteUnblockUser(
  client: ApiClient,
  blockedId: string,
): Promise<RelationResponse> {
  return client.delete(`relations/blocks/${blockedId}`).json<RelationResponse>();
}
