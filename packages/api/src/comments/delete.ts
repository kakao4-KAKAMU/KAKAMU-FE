import type { CommentDeleteResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `DELETE .../comments/{comment_id}` */
export async function deleteComment(
  client: ApiClient,
  commentId: number,
): Promise<CommentDeleteResponse> {
  return client.delete(`comments/${commentId}`).json<CommentDeleteResponse>();
}
