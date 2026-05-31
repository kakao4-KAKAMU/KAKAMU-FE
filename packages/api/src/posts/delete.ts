import type { PostDeleteResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `DELETE .../posts/{id}` */
export async function deletePostById(
  client: ApiClient,
  postId: number,
): Promise<PostDeleteResponse> {
  return client.delete(`posts/${postId}`).json<PostDeleteResponse>();
}
