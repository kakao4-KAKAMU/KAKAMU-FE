import type { CommentUpdateRequest, CommentUpdateResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `PUT .../comments/{comment_id}` */
export async function updateComment(
  client: ApiClient,
  commentId: number,
  body: CommentUpdateRequest,
): Promise<CommentUpdateResponse> {
  return client.put(`comments/${commentId}`, { json: body }).json<CommentUpdateResponse>();
}
