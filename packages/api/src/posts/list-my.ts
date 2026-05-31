import type { PostCursorListResponse, PostListParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toPostListSearchParams } from './build-post-list-params';

/** `GET .../posts/` */
export async function getMyPostList(
  client: ApiClient,
  params: PostListParams,
): Promise<PostCursorListResponse> {
  return client
    .get('posts/', { searchParams: toPostListSearchParams(params) })
    .json<PostCursorListResponse>();
}
