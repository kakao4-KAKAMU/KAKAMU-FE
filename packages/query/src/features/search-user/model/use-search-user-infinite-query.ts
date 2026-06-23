import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchUser } from '@kakamu/api';
import type { TabSearchParams, UserSearchResponse } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';
import { userKeys } from '../../../shared/keys/user.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

const DEFAULT_LIMIT = 20;

function selectUserSearchIds(data: {
  pages: UserSearchResponse[];
  pageParams: unknown[];
}) {
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

export function useSearchUserInfiniteQuery(
  client: ApiClient,
  params: Omit<TabSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: searchKeys.user(params),
    queryFn: async ({ pageParam }) => {
      const response = await getSearchUser(
        client,
        { ...params, limit: DEFAULT_LIMIT },
        pageParam as string | null | undefined,
      );
      seedDetailCache(queryClient, response.items, (item) => item.id, userKeys.detail);
      return response;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next ? (lastPage.meta.next_cursor as string | null) : undefined,
    enabled: enabled && params.q.trim().length > 0,
    select: selectUserSearchIds,
  });
}
