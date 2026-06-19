import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSearchTrendQuery } from '@kakamu/query';

import { SearchIndexPanel } from '@/components/featured/search/SearchIndexPanel';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useSearchRecentHistory } from '@/hooks/search/useSearchRecentHistory';
import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';
import type { RecentSearchEntry } from '@/lib/search/recent-search-storage';

export default function SearchIndexScreen() {
  const client = useBackendApiClient();
  const { openKeyword } = useSearchNavigation();
  const trendQuery = useSearchTrendQuery(client);
  const { entries, isLoading: isRecentLoading, clearAll } = useSearchRecentHistory();

  const onTrendPress = useCallback(
    (keyword: string) => {
      openKeyword(keyword, 'movie');
    },
    [openKeyword],
  );

  const onRecentPress = useCallback(
    (entry: RecentSearchEntry) => {
      openKeyword(entry.keyword, entry.tab);
    },
    [openKeyword],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <SearchIndexPanel
        trends={trendQuery.data?.items ?? []}
        isTrendLoading={trendQuery.isLoading}
        recentEntries={entries}
        isRecentLoading={isRecentLoading}
        onTrendPress={onTrendPress}
        onRecentPress={onRecentPress}
        onClearRecent={clearAll}
      />
    </ScrollView>
  );
}
