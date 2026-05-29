import type { PostCreateRequest, PostCreateResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../posts/` */
export async function createPost(
  client: ApiClient,
  body: PostCreateRequest,
): Promise<PostCreateResponse> {
  return client.post('posts/', { json: body }).json<PostCreateResponse>();
}
