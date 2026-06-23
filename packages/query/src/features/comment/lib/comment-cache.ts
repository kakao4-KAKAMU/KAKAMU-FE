import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type {
  CommentCreateRequest,
  CommentItem,
  CommentListResponse,
  PostItem,
  UserSimple,
} from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';
import { postKeys } from '../../../shared/keys/post.keys';

export const OPTIMISTIC_COMMENT_ID = -1;
export const DEFAULT_COMMENT_PAGE_SIZE = 20;

export type CommentIdListResponse = Omit<CommentListResponse, 'items'> & {
  items: number[];
};

export type CommentInfiniteData = InfiniteData<CommentIdListResponse, number>;

export type CommentListQuerySnapshot = [QueryKey, CommentInfiniteData | undefined][];

export type CommentDetailQuerySnapshot = [QueryKey, CommentItem | undefined][];

function enrichCommentItem(
  item: Omit<CommentItem, 'post_id' | 'like_count' | 'is_liked'>,
  postId: number,
): CommentItem {
  return {
    ...item,
    post_id: postId,
    like_count: 0,
    is_liked: false,
  };
}

export function toCommentIdListPage(response: CommentListResponse): CommentIdListResponse {
  return {
    ...response,
    items: response.items.map((item) => item.id),
  };
}

function filterCommentIdsFromPages(
  data: CommentInfiniteData,
  commentId: number,
): CommentInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((id) => id !== commentId && id !== OPTIMISTIC_COMMENT_ID),
      meta: {
        ...page.meta,
        total_count: Math.max(
          0,
          page.meta.total_count -
            page.items.filter((id) => id === commentId || id === OPTIMISTIC_COMMENT_ID).length,
        ),
      },
    })),
  };
}

function prependCommentIdToFirstPage(data: CommentInfiniteData, commentId: number): CommentInfiniteData {
  if (data.pages.length === 0) {
    return {
      ...data,
      pages: [
        {
          items: [commentId],
          meta: {
            total_count: 1,
            current_page: 1,
            page_size: DEFAULT_COMMENT_PAGE_SIZE,
            total_pages: 1,
          },
        },
      ],
    };
  }

  const [firstPage, ...restPages] = data.pages;
  const withoutDuplicate = firstPage.items.filter((id) => id !== commentId);
  return {
    ...data,
    pages: [
      {
        ...firstPage,
        items: [commentId, ...withoutDuplicate],
        meta: {
          ...firstPage.meta,
          total_count: firstPage.meta.total_count + (firstPage.items.includes(commentId) ? 0 : 1),
        },
      },
      ...restPages,
    ],
  };
}

function replaceCommentIdInPages(
  data: CommentInfiniteData,
  fromId: number,
  toId: number,
): CommentInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((id) => (id === fromId ? toId : id)),
    })),
  };
}

export function createOptimisticComment(
  postId: number,
  body: CommentCreateRequest,
  author?: { id?: string | null; nickname?: string; tag?: string },
): CommentItem {
  const user: UserSimple = {
    id: author?.id ?? null,
    nickname: author?.nickname ?? '',
    tag: author?.tag ?? '',
    profile_image: null,
    created_at: new Date().toISOString(),
  };

  return {
    id: OPTIMISTIC_COMMENT_ID,
    post_id: postId,
    parent_id: body.parent_id ?? null,
    user,
    content: body.content,
    is_spoiler: body.is_spoiler === 1,
    like_count: 0,
    is_liked: false,
    hashtags: [],
    mentions: [],
    created_at: new Date().toISOString(),
  };
}

export function seedCommentDetailCacheFromList(
  queryClient: QueryClient,
  _postId: number,
  items: CommentItem[],
): void {
  for (const item of items) {
    queryClient.setQueryData(commentKeys.detail(item.id), item);
  }
}

export function snapshotCommentByPostLists(
  queryClient: QueryClient,
  postId: number,
): CommentListQuerySnapshot {
  return queryClient.getQueriesData<CommentInfiniteData>({
    queryKey: commentKeys.byPostLists(),
    predicate: (query) => {
      const key = query.queryKey;
      return key[0] === 'comment' && key[1] === 'by-post' && key[2] === postId;
    },
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

export function prependCommentToPostLists(
  queryClient: QueryClient,
  postId: number,
  comment: CommentItem,
): void {
  queryClient.setQueriesData<CommentInfiniteData>(
    {
      queryKey: commentKeys.byPostLists(),
      predicate: (query) => {
        const key = query.queryKey;
        return key[0] === 'comment' && key[1] === 'by-post' && key[2] === postId;
      },
    },
    (old) => (old ? prependCommentIdToFirstPage(old, comment.id) : old),
  );
  queryClient.setQueryData(commentKeys.detail(comment.id), comment);
}

export function removeCommentFromCaches(
  queryClient: QueryClient,
  commentId: number,
  postId: number,
): void {
  queryClient.setQueriesData<CommentInfiniteData>(
    {
      queryKey: commentKeys.byPostLists(),
      predicate: (query) => {
        const key = query.queryKey;
        return key[0] === 'comment' && key[1] === 'by-post' && key[2] === postId;
      },
    },
    (old) => (old ? filterCommentIdsFromPages(old, commentId) : old),
  );
  queryClient.removeQueries({ queryKey: commentKeys.detail(commentId) });
}

export function replaceOptimisticCommentInCaches(
  queryClient: QueryClient,
  postId: number,
  commentId: number,
): void {
  queryClient.setQueriesData<CommentInfiniteData>(
    {
      queryKey: commentKeys.byPostLists(),
      predicate: (query) => {
        const key = query.queryKey;
        return key[0] === 'comment' && key[1] === 'by-post' && key[2] === postId;
      },
    },
    (old) => (old ? replaceCommentIdInPages(old, OPTIMISTIC_COMMENT_ID, commentId) : old),
  );
  const optimistic = queryClient.getQueryData<CommentItem>(commentKeys.detail(OPTIMISTIC_COMMENT_ID));
  if (optimistic) {
    queryClient.removeQueries({ queryKey: commentKeys.detail(OPTIMISTIC_COMMENT_ID) });
    queryClient.setQueryData(commentKeys.detail(commentId), { ...optimistic, id: commentId });
  }
}

export function patchCommentDetailCache(
  queryClient: QueryClient,
  commentId: number,
  patch: (comment: CommentItem) => CommentItem,
): void {
  queryClient.setQueryData<CommentItem>(commentKeys.detail(commentId), (old) =>
    old ? patch(old) : old,
  );
}

/** @deprecated use {@link patchCommentDetailCache} */
export function patchCommentInCaches(
  queryClient: QueryClient,
  commentId: number,
  _postId: number,
  patch: (comment: CommentItem) => CommentItem,
): void {
  patchCommentDetailCache(queryClient, commentId, patch);
}

export function toggleCommentLikeInCaches(
  queryClient: QueryClient,
  commentId: number,
): number | null {
  const detail = queryClient.getQueryData<CommentItem>(commentKeys.detail(commentId));
  if (!detail?.post_id) {
    return null;
  }

  const nextIsLiked = !detail.is_liked;
  patchCommentDetailCache(queryClient, commentId, () => ({
    ...detail,
    is_liked: nextIsLiked,
    like_count: detail.like_count + (detail.is_liked ? -1 : 1),
  }));

  return detail.post_id;
}

export function adjustPostCommentCountInCache(
  queryClient: QueryClient,
  postId: number,
  delta: number,
): void {
  queryClient.setQueryData<PostItem>(postKeys.detail(postId), (old) =>
    old ? { ...old, comment_count: Math.max(0, old.comment_count + delta) } : old,
  );
}

export async function cancelCommentDetailQueries(
  queryClient: QueryClient,
  commentId: number,
): Promise<void> {
  await queryClient.cancelQueries({ queryKey: commentKeys.detail(commentId) });
}

export async function cancelCommentQueries(
  queryClient: QueryClient,
  commentId: number,
  postId?: number,
): Promise<void> {
  await Promise.all([
    postId != null
      ? queryClient.cancelQueries({
          queryKey: commentKeys.byPostLists(),
          predicate: (query) => {
            const key = query.queryKey;
            return key[0] === 'comment' && key[1] === 'by-post' && key[2] === postId;
          },
        })
      : Promise.resolve(),
    queryClient.cancelQueries({ queryKey: commentKeys.detail(commentId) }),
  ]);
}

export function mapCommentListResponse(
  postId: number,
  response: CommentListResponse,
): CommentListResponse {
  return {
    ...response,
    items: response.items.map((item) => enrichCommentItem(item, postId)),
  };
}
