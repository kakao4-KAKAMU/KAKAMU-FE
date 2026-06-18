import type { CommentListParams, CommentListResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `GET .../posts/{post_id}/comments/` */
export async function getCommentsByPost(
  client: ApiClient,
  postId: number,
  params: CommentListParams = {},
): Promise<CommentListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page != null) {
    searchParams.set('page', String(params.page));
  }
  if (params.size != null) {
    searchParams.set('size', String(params.size));
  }
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  return client.get(`posts/${postId}/comments/${suffix}`).json<CommentListResponse>();
}
