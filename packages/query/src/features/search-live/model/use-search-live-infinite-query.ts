import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchLive } from '@kakamu/api';
import type { PostSearchResponse, TabSearchParams } from '@kakamu/types';

import { searchKeys } from '../../../shared/keys/search.keys';
import { seedPostDetailCacheFromList } from '../../post/lib/post-infinite-cache';

const DEFAULT_LIMIT = 20;

function selectPostSearchIds(data: {
  pages: PostSearchResponse[];
  pageParams: unknown[];
}) {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => item.id),
    })),
  };
}

export function useSearchLiveInfiniteQuery(
  client: ApiClient,
  params: Omit<TabSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: searchKeys.live(params),
    queryFn: async ({ pageParam }) => {
      const response = await getSearchLive(
        client,
        { ...params, limit: DEFAULT_LIMIT },
        pageParam as number | null | undefined,
      );
      seedPostDetailCacheFromList(queryClient, response.items);
      return response;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next ? (lastPage.meta.next_cursor as number | null) : undefined,
    enabled: enabled && params.q.trim().length > 0,
    select: selectPostSearchIds,
  });
}
