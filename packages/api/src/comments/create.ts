import type { CommentCreateRequest, CommentIdResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../posts/{post_id}/comments/` */
export async function createComment(
  client: ApiClient,
  postId: number,
  body: CommentCreateRequest,
): Promise<CommentIdResponse> {
  return client.post(`posts/${postId}/comments/`, { json: body }).json<CommentIdResponse>();
}
