import type { FeedPostListParams, PostCursorListResponse } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toPostListSearchParams } from './build-post-list-params';

/** `GET .../posts/` */
export async function getFeedPostList(
  client: ApiClient,
  params: FeedPostListParams,
): Promise<PostCursorListResponse> {
  return client
    .get('posts/', { searchParams: toPostListSearchParams(params) })
    .json<PostCursorListResponse>();
}
