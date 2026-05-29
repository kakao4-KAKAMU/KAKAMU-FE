import { useMemo, useState } from 'react';
import { useSearchMoviesInfiniteQuery } from '@kakamu/query';
import type { MovieSort } from '@kakamu/types';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function usePersonaMovieSearch(enabled: boolean) {
  const client = useBackendApiClient();
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState<MovieSort>('year_desc');
  const [filterGenreIds, setFilterGenreIds] = useState<number[]>([]);

  const debouncedKeyword = useDebouncedValue(keyword);

  const parsedYear = useMemo(() => {
    const value = Number.parseInt(year.trim(), 10);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }, [year]);

  const searchQuery = useSearchMoviesInfiniteQuery(
    client,
    {
      genre: filterGenreIds.length > 0 ? filterGenreIds : undefined,
      name: debouncedKeyword || undefined,
      year: parsedYear,
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
    year,
    setYear,
    sort,
    setSort,
    filterGenreIds,
    setFilterGenreIds,
    searchQuery,
    items,
  };
}
