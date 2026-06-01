import type { PostCursorListResponse, LikedPostListParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toPostListSearchParams } from './build-post-list-params';

/** `GET .../posts/liked` */
export async function getLikedPostList(
  client: ApiClient,
  params: LikedPostListParams,
): Promise<PostCursorListResponse> {
  return client
    .get('posts/liked', { searchParams: toPostListSearchParams(params) })
    .json<PostCursorListResponse>();
}
