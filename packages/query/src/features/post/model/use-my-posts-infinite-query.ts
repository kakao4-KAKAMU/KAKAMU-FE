import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getMyPostList } from '@kakamu/api';
import type { PostCursorListResponse, PostListParams } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  seedPostDetailCacheFromList,
  type PostInfiniteData,
} from '../lib/post-infinite-cache';

export function useMyPostsInfiniteQuery(
  client: ApiClient,
  params: Omit<PostListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PostCursorListResponse,
      unknown,
      PostInfiniteData,
      ReturnType<typeof postKeys.myList>,
      number | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: postKeys.myList(params),
    queryFn: async ({ pageParam }) => {
      const response = await getMyPostList(client, {
        ...params,
        cursor: pageParam,
      });
      seedPostDetailCacheFromList(queryClient, response.items);
      return response;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.next_cursor : undefined),
    ...options,
  });
}
