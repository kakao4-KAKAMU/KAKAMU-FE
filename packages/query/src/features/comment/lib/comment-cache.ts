import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type { CommentCursorListResponse, CommentItem } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';

export type CommentInfiniteData = InfiniteData<
  CommentCursorListResponse,
  number | undefined
>;

export type CommentListQuerySnapshot = [QueryKey, CommentInfiniteData | undefined][];

export type CommentDetailQuerySnapshot = [QueryKey, CommentItem | undefined][];

function mapInfinitePages(
  data: CommentInfiniteData,
  mapItem: (item: CommentItem) => CommentItem | null,
): CommentInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items
        .map(mapItem)
        .filter((item): item is CommentItem => item != null),
    })),
  };
}

export function snapshotCommentByPostLists(
  queryClient: QueryClient,
  postId: number,
): CommentListQuerySnapshot {
  return queryClient.getQueriesData<CommentInfiniteData>({
    queryKey: commentKeys.byPostList(postId),
  });
}

export function restoreCommentByPostLists(
  queryClient: QueryClient,
  snapshots: CommentListQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function snapshotCommentDetail(
  queryClient: QueryClient,
  commentId: number,
): CommentDetailQuerySnapshot {
  return queryClient.getQueriesData<CommentItem>({
    queryKey: commentKeys.detail(commentId),
  });
}

export function restoreCommentDetails(
  queryClient: QueryClient,
  snapshots: CommentDetailQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function patchCommentInCaches(
  queryClient: QueryClient,
  commentId: number,
  postId: number,
  patch: (comment: CommentItem) => CommentItem,
): void {
  queryClient.setQueriesData<CommentInfiniteData>(
    { queryKey: commentKeys.byPostList(postId) },
    (old) =>
      old
        ? mapInfinitePages(old, (item) => (item.id === commentId ? patch(item) : item))
        : old,
  );
  queryClient.setQueryData<CommentItem>(commentKeys.detail(commentId), (old) =>
    old ? patch(old) : old,
  );
}

export function toggleCommentLikeInCaches(
  queryClient: QueryClient,
  commentId: number,
): number | null {
  const detail = queryClient.getQueryData<CommentItem>(commentKeys.detail(commentId));
  if (!detail) {
    return null;
  }

  const nextIsLiked = !detail.is_liked;
  const nextLikeCount = detail.like_count + (detail.is_liked ? -1 : 1);
  patchCommentInCaches(queryClient, commentId, detail.post_id, () => ({
    ...detail,
    is_liked: nextIsLiked,
    like_count: nextLikeCount,
  }));

  return detail.post_id;
}

export async function cancelCommentQueries(
  queryClient: QueryClient,
  commentId: number,
  postId?: number,
): Promise<void> {
  await Promise.all([
    postId != null
      ? queryClient.cancelQueries({ queryKey: commentKeys.byPostList(postId) })
      : Promise.resolve(),
    queryClient.cancelQueries({ queryKey: commentKeys.detail(commentId) }),
  ]);
}
