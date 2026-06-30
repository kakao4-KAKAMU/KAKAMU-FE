import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSavedPostList } from '@kakamu/api';
import type { SavedPostListParams } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import {
  seedPostDetailCacheFromList,
  toPostIdListPage,
  type PostCursorIdListResponse,
  type PostInfiniteData,
} from '../../post/lib/post-infinite-cache';

export function useSavedPostsInfiniteQuery(
  client: ApiClient,
  params: Omit<SavedPostListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PostCursorIdListResponse,
      unknown,
      PostInfiniteData,
      ReturnType<typeof postKeys.savedList>,
      number | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: postKeys.savedList(params),
    queryFn: async ({ pageParam }) => {
      const response = await getSavedPostList(client, {
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
