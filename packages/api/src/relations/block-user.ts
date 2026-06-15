import type { BlockRequest, RelationResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `POST .../relations/blocks/{blocked_id}` */
export async function postBlockUser(
  client: ApiClient,
  blockedId: string,
  body: BlockRequest = {},
): Promise<RelationResponse> {
  return client.post(`relations/blocks/${blockedId}`, { json: body }).json<RelationResponse>();
}
