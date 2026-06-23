import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { postSearchPersons } from '@kakamu/api';
import type { PersonFilterSearchResponse, PersonSearchParams } from '@kakamu/types';

import { personKeys } from '../../../shared/keys/person.keys';
import { searchKeys } from '../../../shared/keys/search.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

const DEFAULT_LIMIT = 20;

function selectPersonFilterSearchIds(data: {
  pages: PersonFilterSearchResponse[];
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

export function useSearchPersonsInfiniteQuery(
  client: ApiClient,
  params: Omit<PersonSearchParams, 'skip' | 'limit'>,
  enabled = true,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: searchKeys.persons(params),
    queryFn: async ({ pageParam }) => {
      const response = await postSearchPersons(client, {
        ...params,
        skip: pageParam,
        limit: DEFAULT_LIMIT,
      });
      seedDetailCache(queryClient, response.items, (item) => item.id, personKeys.detail);
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length < lastPage.limit) {
        return undefined;
      }
      if (lastPage.total_count != null && lastPage.skip * lastPage.limit >= lastPage.total_count) {
        return undefined;
      }
      return lastPage.skip + lastPage.limit;
    },
    enabled,
    select: selectPersonFilterSearchIds,
  });
}
