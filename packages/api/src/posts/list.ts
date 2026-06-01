import type { PostCursorListResponse, PostListParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toPostListSearchParams } from './build-post-list-params';

/** `GET .../posts/` */
export async function getPostList(
  client: ApiClient,
  params: PostListParams,
): Promise<PostCursorListResponse> {
  return client
    .get(`posts/persona/${params.target_persona_id}`, {
      searchParams: toPostListSearchParams(params)
    })
    .json<PostCursorListResponse>();
}
