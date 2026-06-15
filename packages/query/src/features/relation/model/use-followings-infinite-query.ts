import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getFollowings } from '@kakamu/api';
import type { FollowListParams, FollowListResponse } from '@kakamu/types';

import { relationKeys } from '../../../shared/keys/relation.keys';

export type FollowListInfiniteData = InfiniteData<FollowListResponse, string | undefined>;

export function useFollowingsInfiniteQuery(
  client: ApiClient,
  params: Omit<FollowListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      FollowListResponse,
      unknown,
      FollowListInfiniteData,
      ReturnType<typeof relationKeys.followingsList>,
      string | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  return useInfiniteQuery({
    queryKey: relationKeys.followingsList(params),
    queryFn: ({ pageParam }) =>
      getFollowings(client, {
        ...params,
        cursor: pageParam,
      }),
    enabled: !!params.target_user_id,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_next && lastPage.next_cursor ? lastPage.next_cursor : undefined,
    ...options,
  });
}
