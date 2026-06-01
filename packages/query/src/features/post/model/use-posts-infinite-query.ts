import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPostList } from '@kakamu/api';
import type { PostCursorListResponse, PostListParams } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  seedPostDetailCacheFromList,
  type PostInfiniteData,
} from '../lib/post-infinite-cache';

export function usePostsInfiniteQuery(
  client: ApiClient,
  params: Omit<PostListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PostCursorListResponse,
      unknown,
      PostInfiniteData,
      ReturnType<typeof postKeys.list>,
      number | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: postKeys.list(params),
    enabled: !!params.target_persona_id,
    queryFn: async ({ pageParam }) => {
      const response = await getPostList(client, {
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
