import type { PostItem } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `GET .../posts/{id}` */
export async function getPostById(client: ApiClient, postId: number): Promise<PostItem> {
  return client.get(`posts/${postId}`).json<PostItem>();
}
