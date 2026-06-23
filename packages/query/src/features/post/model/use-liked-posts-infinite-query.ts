import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getLikedPostList } from '@kakamu/api';
import type { PostListParams } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  seedPostDetailCacheFromList,
  toPostIdListPage,
  type PostCursorIdListResponse,
  type PostInfiniteData,
} from '../lib/post-infinite-cache';

export function useLikedPostsInfiniteQuery(
  client: ApiClient,
  params: Omit<PostListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PostCursorIdListResponse,
      unknown,
      PostInfiniteData,
      ReturnType<typeof postKeys.likedList>,
      number | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: postKeys.likedList(params),
    queryFn: async ({ pageParam }) => {
      const response = await getLikedPostList(client, {
        ...params,
        cursor: pageParam,
      });
      seedPostDetailCacheFromList(queryClient, response.items);
      return toPostIdListPage(response);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.next_cursor : undefined),
    ...options,
  });
}
