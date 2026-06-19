import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type {
  PostCursorListResponse,
  PostItem,
  PostUpdateRequest,
  UserSimple,
} from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';

export const OPTIMISTIC_POST_ID = -1;

export type PostInfiniteData = InfiniteData<PostCursorListResponse, number | undefined>;

export type PostListQuerySnapshot = [QueryKey, PostInfiniteData | undefined][];

export type PostDetailQuerySnapshot = [QueryKey, PostItem | undefined][];

const EMPTY_USER: UserSimple = {
  id: null,
  nickname: '',
  tag: '',
  profile_image: null,
  created_at: new Date().toISOString(),
};

function toPostSpoiler(value: number | boolean | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return value === 1;
}

export function createOptimisticPost(body: PostUpdateRequest): PostItem {
  return {
    id: OPTIMISTIC_POST_ID,
    user: EMPTY_USER,
    title: body.title,
    content: body.content,
    image_urls: body.image_urls ?? [],
    is_spoiler: toPostSpoiler(body.is_spoiler),
    movies: [],
    hashtags: [],
    mentions: [],
    like_count: 0,
    is_liked: false,
    is_following: false,
    comment_count: 0,
    created_at: new Date().toISOString(),
    updated_at: null,
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
    image_urls: body.image_urls ?? [],
    is_spoiler: toPostSpoiler(body.is_spoiler),
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
    { queryKey: postKeys.lists() },
    (old) => (old ? prependToFirstPage(old, item) : old),
  );
}

export function prependPostToLikedLists(queryClient: QueryClient, item: PostItem): void {
  setPostDetailCache(queryClient, item);
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) => (old ? prependToFirstPage(old, item) : old),
  );
}

export function removePostFromLikedLists(queryClient: QueryClient, postId: number): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) =>
      old ? mapInfinitePages(old, (item) => (item.id === postId ? null : item)) : old,
  );
}

export function togglePostLikeInCaches(queryClient: QueryClient, postId: number): void {
  const detail = queryClient.getQueryData<PostItem>(postKeys.detail(postId));
  if (!detail) {
    return;
  }

  const nextIsLiked = !detail.is_liked;
  const patched: PostItem = {
    ...detail,
    is_liked: nextIsLiked,
    like_count: detail.like_count + (detail.is_liked ? -1 : 1),
  };

  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.lists() },
    (old) =>
      old
        ? mapInfinitePages(old, (item) => (item.id === postId ? patched : item))
        : old,
  );
  queryClient.setQueryData<PostItem>(postKeys.detail(postId), patched);

  if (nextIsLiked) {
    queryClient.setQueriesData<PostInfiniteData>(
      { queryKey: postKeys.likedLists() },
      (old) => {
        if (!old) {
          return old;
        }
        const existsInLiked = old.pages.some((page) =>
          page.items.some((item) => item.id === postId),
        );
        if (existsInLiked) {
          return mapInfinitePages(old, (item) => (item.id === postId ? patched : item));
        }
        return prependToFirstPage(old, patched);
      },
    );
  } else {
    removePostFromLikedLists(queryClient, postId);
  }
}

export function patchPostInCaches(
  queryClient: QueryClient,
  postId: number,
  patch: (post: PostItem) => PostItem,
): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.lists() },
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

export function setPostFollowByAuthorInCaches(
  queryClient: QueryClient,
  authorId: string,
  isFollowing: boolean,
): void {
  const patchAuthorPosts = (post: PostItem): PostItem =>
    post.user.id === authorId ? { ...post, is_following: isFollowing } : post;

  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.lists() },
    (old) => (old ? mapInfinitePages(old, patchAuthorPosts) : old),
  );
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) => (old ? mapInfinitePages(old, patchAuthorPosts) : old),
  );
  queryClient.setQueriesData<PostItem>(
    { queryKey: postKeys.details() },
    (old) => (old ? patchAuthorPosts(old) : old),
  );
}

export function removePostFromCaches(queryClient: QueryClient, postId: number): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.lists() },
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
    queryClient.cancelQueries({ queryKey: postKeys.lists() }),
    queryClient.cancelQueries({ queryKey: postKeys.likedLists() }),
    postId != null
      ? queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
      : Promise.resolve(),
  ]);
}
