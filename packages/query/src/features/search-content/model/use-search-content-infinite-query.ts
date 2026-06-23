import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSearchContent } from '@kakamu/api';
import type { ContentSearchParams, MovieTabSearchResponse } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';
import { searchKeys } from '../../../shared/keys/search.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

const DEFAULT_LIMIT = 20;

function selectMovieTabSearchIds(data: {
  pages: MovieTabSearchResponse[];
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

export function useSearchContentInfiniteQuery(
  client: ApiClient,
  params: Omit<ContentSearchParams, 'cursor' | 'limit'>,
  enabled = true,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: searchKeys.content(params),
    queryFn: async ({ pageParam }) => {
      const response = await getSearchContent(
        client,
        { ...params, limit: DEFAULT_LIMIT },
        pageParam as string | null | undefined,
      );
      seedDetailCache(queryClient, response.items, (item) => item.id, movieKeys.detail);
      return response;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next ? (lastPage.meta.next_cursor as string | null) : undefined,
    enabled: enabled && params.q.trim().length > 0,
    select: selectMovieTabSearchIds,
  });
}
