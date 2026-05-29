import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type {
  PostCursorListResponse,
  PostItem,
  PostUpdateRequest,
} from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';

export const OPTIMISTIC_POST_ID = -1;

export type PostInfiniteData = InfiniteData<PostCursorListResponse, number | undefined>;

export type PostListQuerySnapshot = [QueryKey, PostInfiniteData | undefined][];

export type PostDetailQuerySnapshot = [QueryKey, PostItem | undefined][];

export function createOptimisticPost(body: PostUpdateRequest): PostItem {
  return {
    id: OPTIMISTIC_POST_ID,
    author_id: null,
    author: null,
    author_image: null,
    title: body.title,
    content: body.content,
    image_urls: body.image_urls,
    is_spoiler: body.is_spoiler,
    movies: [],
    hashtags: [],
    like_count: 0,
    comment_count: 0,
    created_at: new Date().toISOString(),
  };
}

export function seedPostDetailCacheFromList(
  queryClient: QueryClient,
  items: PostItem[],
): void {
  for (const item of items) {
    queryClient.setQueryData(postKeys.detail(item.id), item);
  }
}

export function setPostDetailCache(queryClient: QueryClient, item: PostItem): void {
  queryClient.setQueryData(postKeys.detail(item.id), item);
}

export function applyPostWriteBody(post: PostItem, body: PostUpdateRequest): PostItem {
  return {
    ...post,
    title: body.title,
    content: body.content,
    image_urls: body.image_urls,
    is_spoiler: body.is_spoiler,
  };
}

function mapInfinitePages(
  data: PostInfiniteData,
  mapItem: (item: PostItem) => PostItem | null,
): PostInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items
        .map(mapItem)
        .filter((item): item is PostItem => item != null),
    })),
  };
}

function prependToFirstPage(data: PostInfiniteData, item: PostItem): PostInfiniteData {
  if (data.pages.length === 0) {
    return {
      ...data,
      pages: [
        {
          items: [item],
          next_cursor: 0,
          has_next: false,
        },
      ],
    };
  }

  const [firstPage, ...restPages] = data.pages;
  return {
    ...data,
    pages: [{ ...firstPage, items: [item, ...firstPage.items] }, ...restPages],
  };
}

export function snapshotPostInfiniteLists(
  queryClient: QueryClient,
  listKey: readonly unknown[],
): PostListQuerySnapshot {
  return queryClient.getQueriesData<PostInfiniteData>({ queryKey: listKey });
}

export function restorePostInfiniteLists(
  queryClient: QueryClient,
  snapshots: PostListQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function snapshotPostDetail(
  queryClient: QueryClient,
  postId: number,
): PostDetailQuerySnapshot {
  return queryClient.getQueriesData<PostItem>({ queryKey: postKeys.detail(postId) });
}

export function restorePostDetails(
  queryClient: QueryClient,
  snapshots: PostDetailQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function prependPostToMyLists(queryClient: QueryClient, item: PostItem): void {
  setPostDetailCache(queryClient, item);
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.myLists() },
    (old) => (old ? prependToFirstPage(old, item) : old),
  );
}

export function patchPostInCaches(
  queryClient: QueryClient,
  postId: number,
  patch: (post: PostItem) => PostItem,
): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.myLists() },
    (old) =>
      old
        ? mapInfinitePages(old, (item) => (item.id === postId ? patch(item) : item))
        : old,
  );
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) =>
      old
        ? mapInfinitePages(old, (item) => (item.id === postId ? patch(item) : item))
        : old,
  );
  queryClient.setQueryData<PostItem>(postKeys.detail(postId), (old) =>
    old ? patch(old) : old,
  );
}

export function removePostFromCaches(queryClient: QueryClient, postId: number): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.myLists() },
    (old) =>
      old ? mapInfinitePages(old, (item) => (item.id === postId ? null : item)) : old,
  );
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) =>
      old ? mapInfinitePages(old, (item) => (item.id === postId ? null : item)) : old,
  );
  queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
}

export async function cancelPostQueries(queryClient: QueryClient, postId?: number): Promise<void> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: postKeys.myLists() }),
    queryClient.cancelQueries({ queryKey: postKeys.likedLists() }),
    postId != null
      ? queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
      : Promise.resolve(),
  ]);
}
