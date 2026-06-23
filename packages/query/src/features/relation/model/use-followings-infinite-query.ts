import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getFollowings } from '@kakamu/api';
import type { FollowListParams, FollowListResponse } from '@kakamu/types';

import { relationKeys } from '../../../shared/keys/relation.keys';
import { userKeys } from '../../../shared/keys/user.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

export type FollowListIdResponse = Omit<FollowListResponse, 'items'> & {
  items: string[];
};

export type FollowListIdInfiniteData = InfiniteData<FollowListIdResponse, string | undefined>;

function selectFollowListIds(
  data: InfiniteData<FollowListResponse, string | undefined>,
): FollowListIdInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items
        .map((item) => item.id)
        .filter((id): id is string => id != null),
    })),
  };
}

export function useFollowingsInfiniteQuery(
  client: ApiClient,
  params: Omit<FollowListParams, 'cursor'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      FollowListResponse,
      unknown,
      FollowListIdInfiniteData,
      ReturnType<typeof relationKeys.followingsList>,
      string | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: relationKeys.followingsList(params),
    queryFn: async ({ pageParam }) => {
      const response = await getFollowings(client, {
        ...params,
        cursor: pageParam,
      });
      seedDetailCache(
        queryClient,
        response.items,
        (item) => item.id,
        userKeys.detail,
      );
      return response;
    },
    enabled: !!params.target_user_id,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_next && lastPage.next_cursor ? lastPage.next_cursor : undefined,
    select: selectFollowListIds,
    ...options,
  });
}
