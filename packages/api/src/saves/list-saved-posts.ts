import type { PostCursorListResponse, SavedPostListParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toSavedPostListSearchParams } from './build-save-list-params';

/** `GET .../saves/posts` */
export async function getSavedPostList(
  client: ApiClient,
  params: SavedPostListParams,
): Promise<PostCursorListResponse> {
  return client
    .get('saves/posts', { searchParams: toSavedPostListSearchParams(params) })
    .json<PostCursorListResponse>();
}
