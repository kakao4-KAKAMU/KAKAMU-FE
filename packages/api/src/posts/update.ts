import type { PostUpdateRequest, PostUpdateResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `PUT .../posts/{id}` */
export async function updatePostById(
  client: ApiClient,
  postId: number,
  body: PostUpdateRequest,
): Promise<PostUpdateResponse> {
  return client.put(`posts/${postId}`, { json: body }).json<PostUpdateResponse>();
}
