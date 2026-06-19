import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  type RecentSearchEntry,
} from '@/lib/search/recent-search-storage';
import type { SearchTab } from '@/lib/search/search-tabs';

export function useSearchRecentHistory() {
  const [entries, setEntries] = useState<RecentSearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await getRecentSearches();
    setEntries(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const recordSelection = useCallback(
    async (keyword: string, tab: SearchTab) => {
      const next = await addRecentSearch(keyword, tab);
      setEntries(next);
    },
    [],
  );

  const clearAll = useCallback(async () => {
    await clearRecentSearches();
    setEntries([]);
  }, []);

  return {
    entries,
    isLoading,
    refresh,
    recordSelection,
    clearAll,
  };
}
