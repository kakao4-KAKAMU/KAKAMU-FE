import { useCallback, useMemo } from 'react';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';

import {
  DEFAULT_SEARCH_TAB,
  getSearchTabFromPathname,
  SEARCH_TAB_ROUTES,
  type SearchTab,
} from '@/lib/search/search-tabs';

function normalizeSearchParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return '';
}

export function useSearchNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { q } = useGlobalSearchParams<{ q?: string | string[] }>();
  const activeTab = getSearchTabFromPathname(pathname);
  const query = useMemo(() => normalizeSearchParam(q), [q]);

  const navigateToTab = useCallback(
    (tab: SearchTab, keyword = query) => {
      const trimmed = keyword.trim();
      if (!trimmed) {
        router.push('/search');
        return;
      }
      router.push({
        pathname: SEARCH_TAB_ROUTES[tab],
        params: { q: trimmed },
      });
    },
    [query, router],
  );

  const submitSearch = useCallback(
    (keyword: string, tab: SearchTab = DEFAULT_SEARCH_TAB) => {
      const trimmed = keyword.trim();
      if (!trimmed) {
        router.push('/search');
        return;
      }
      router.push({
        pathname: SEARCH_TAB_ROUTES[tab],
        params: { q: trimmed },
      });
    },
    [router],
  );

  const openKeyword = useCallback(
    (keyword: string, tab: SearchTab = DEFAULT_SEARCH_TAB) => {
      submitSearch(keyword, tab);
    },
    [submitSearch],
  );

  return {
    query,
    activeTab,
    navigateToTab,
    submitSearch,
    openKeyword,
  };
}
