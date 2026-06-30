import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getFeedPostList } from '@kakamu/api';
import type { FeedPostListParams } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  seedPostDetailCacheFromList,
  toPostIdListPage,
  type PostCursorIdListResponse,
  type PostInfiniteData,
} from '../lib/post-infinite-cache';

export function useFeedPostsInfiniteQuery(
  client: ApiClient,
  params: Omit<FeedPostListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PostCursorIdListResponse,
      unknown,
      PostInfiniteData,
      ReturnType<typeof postKeys.feedList>,
      number | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: postKeys.feedList(params),
    queryFn: async ({ pageParam }) => {
      const response = await getFeedPostList(client, {
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
