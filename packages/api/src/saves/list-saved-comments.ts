import type { CommentListResponse, SavedCommentListParams } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toSavedCommentListSearchParams } from './build-save-list-params';

/** `GET .../saves/comments` */
export async function getSavedCommentList(
  client: ApiClient,
  params: SavedCommentListParams,
): Promise<CommentListResponse> {
  return client
    .get('saves/comments', { searchParams: toSavedCommentListSearchParams(params) })
    .json<CommentListResponse>();
}
