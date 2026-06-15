import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getFollowers } from '@kakamu/api';
import type { FollowListParams, FollowListResponse } from '@kakamu/types';

import { relationKeys } from '../../../shared/keys/relation.keys';

export type FollowListInfiniteData = InfiniteData<FollowListResponse, string | undefined>;

export function useFollowersInfiniteQuery(
  client: ApiClient,
  params: Omit<FollowListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      FollowListResponse,
      unknown,
      FollowListInfiniteData,
      ReturnType<typeof relationKeys.followersList>,
      string | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  return useInfiniteQuery({
    queryKey: relationKeys.followersList(params),
    queryFn: ({ pageParam }) =>
      getFollowers(client, {
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
