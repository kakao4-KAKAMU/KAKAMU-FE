import { useMemo, useState } from 'react';
import { useSearchPersonsInfiniteQuery } from '@kakamu/query';
import type { PersonSort } from '@kakamu/types';

import type { PersonSearchJob } from '@/components/featured/persona/persona-create.constants';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function usePersonaPersonSearch(enabled: boolean) {
  const client = useBackendApiClient();
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<PersonSort>('name_asc');
  const [filterJobs, setFilterJobs] = useState<PersonSearchJob[]>([]);

  const debouncedKeyword = useDebouncedValue(keyword);

  const searchQuery = useSearchPersonsInfiniteQuery(
    client,
    {
      name: debouncedKeyword || undefined,
      job: filterJobs.length > 0 ? filterJobs : undefined,
      sort,
    },
    enabled,
  );

  const items = useMemo(
    () => searchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [searchQuery.data],
  );

  return {
    keyword,
    setKeyword,
    sort,
    setSort,
    filterJobs,
    setFilterJobs,
    searchQuery,
    items,
  };
}
