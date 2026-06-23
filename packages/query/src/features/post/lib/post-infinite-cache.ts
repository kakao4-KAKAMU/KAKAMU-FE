import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type {
  PostCursorListResponse,
  PostItem,
  PostUpdateRequest,
  UserSimple,
} from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import { movieKeys } from '../../../shared/keys/movie.keys';
import { userKeys } from '../../../shared/keys/user.keys';

export const OPTIMISTIC_POST_ID = -1;

export type PostCursorIdListResponse = Omit<PostCursorListResponse, 'items'> & {
  items: number[];
};

export type PostInfiniteData = InfiniteData<PostCursorIdListResponse, number | undefined>;

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

export function toPostIdListPage(response: PostCursorListResponse): PostCursorIdListResponse {
  return {
    ...response,
    items: response.items.map((item) => item.id),
  };
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
    if (item.movies.length > 0) {
      for (const movie of item.movies) {
        queryClient.setQueryData(movieKeys.detail(movie.id), movie);
      }
    }
    if (item.user.id) {
      queryClient.setQueryData(userKeys.detail(item.user.id), item.user);
    }
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

function filterPostIdFromPages(data: PostInfiniteData, postId: number): PostInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((id) => id !== postId),
    })),
  };
}

function prependPostIdToFirstPage(data: PostInfiniteData, postId: number): PostInfiniteData {
  if (data.pages.length === 0) {
    return {
      ...data,
      pages: [
        {
          items: [postId],
          next_cursor: 0,
          has_next: false,
        },
      ],
    };
  }

  const [firstPage, ...restPages] = data.pages;
  const withoutDuplicate = firstPage.items.filter((id) => id !== postId);
  return {
    ...data,
    pages: [{ ...firstPage, items: [postId, ...withoutDuplicate] }, ...restPages],
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

export function snapshotPostDetails(queryClient: QueryClient): PostDetailQuerySnapshot {
  return queryClient.getQueriesData<PostItem>({ queryKey: postKeys.details() });
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
    (old) => (old ? prependPostIdToFirstPage(old, item.id) : old),
  );
}

export function prependPostToLikedLists(queryClient: QueryClient, item: PostItem): void {
  setPostDetailCache(queryClient, item);
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) => (old ? prependPostIdToFirstPage(old, item.id) : old),
  );
}

export function removePostFromLikedLists(queryClient: QueryClient, postId: number): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) => (old ? filterPostIdFromPages(old, postId) : old),
  );
}

export function togglePostLikeInCaches(queryClient: QueryClient, postId: number): void {
  const detail = queryClient.getQueryData<PostItem>(postKeys.detail(postId));
  if (!detail) {
    return;
  }

  const nextIsLiked = !detail.is_liked;
  queryClient.setQueryData<PostItem>(postKeys.detail(postId), {
    ...detail,
    is_liked: nextIsLiked,
    like_count: detail.like_count + (detail.is_liked ? -1 : 1),
  });

  if (nextIsLiked) {
    queryClient.setQueriesData<PostInfiniteData>(
      { queryKey: postKeys.likedLists() },
      (old) => (old ? prependPostIdToFirstPage(old, postId) : old),
    );
  } else {
    removePostFromLikedLists(queryClient, postId);
  }
}

export function patchPostDetailCache(
  queryClient: QueryClient,
  postId: number,
  patch: (post: PostItem) => PostItem,
): void {
  queryClient.setQueryData<PostItem>(postKeys.detail(postId), (old) =>
    old ? patch(old) : old,
  );
}

/** @deprecated use {@link patchPostDetailCache} */
export function patchPostInCaches(
  queryClient: QueryClient,
  postId: number,
  patch: (post: PostItem) => PostItem,
): void {
  patchPostDetailCache(queryClient, postId, patch);
}

export function setPostFollowByAuthorInCaches(
  queryClient: QueryClient,
  authorId: string,
  isFollowing: boolean,
): void {
  queryClient.setQueriesData<PostItem>(
    { queryKey: postKeys.details() },
    (old) => (old?.user.id === authorId ? { ...old, is_following: isFollowing } : old),
  );
}

export function removePostFromCaches(queryClient: QueryClient, postId: number): void {
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.lists() },
    (old) => (old ? filterPostIdFromPages(old, postId) : old),
  );
  queryClient.setQueriesData<PostInfiniteData>(
    { queryKey: postKeys.likedLists() },
    (old) => (old ? filterPostIdFromPages(old, postId) : old),
  );
  queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
}

export async function cancelPostDetailQueries(
  queryClient: QueryClient,
  postId: number,
): Promise<void> {
  await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
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
