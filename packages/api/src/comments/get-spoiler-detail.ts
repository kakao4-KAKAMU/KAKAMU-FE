import type { CommentSpoilerDetailResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `GET .../comments/{comment_id}` — 스포일러 원본 조회 */
export async function getCommentSpoilerDetail(
  client: ApiClient,
  commentId: number,
): Promise<CommentSpoilerDetailResponse> {
  return client.get(`comments/${commentId}`).json<CommentSpoilerDetailResponse>();
}
