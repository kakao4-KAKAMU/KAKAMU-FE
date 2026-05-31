import type { LikeRequestBody, LikeResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../like` */
export async function postLike(
  client: ApiClient,
  body: LikeRequestBody,
): Promise<LikeResponse> {
  return client.post('likes/', { json: body }).json<LikeResponse>();
}
