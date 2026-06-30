import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { useSearchContentInfiniteQuery } from '@kakamu/query';
import { Text } from '@kakamu/ui';

import { CompactPostMovieCard } from '@/components/featured/post/CompactPostMovieCard';
import { SearchResultsFrame } from '@/components/featured/search/SearchResultsFrame';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';

export default function SearchMovieScreen() {
  const { t } = useTranslation();
  const client = useBackendApiClient();
  const { query } = useSearchNavigation();
  const searchQuery = useSearchContentInfiniteQuery(client, { q: query });

  const movies = useMemo(
    () => searchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [searchQuery.data?.pages],
  );

  if (!query.trim()) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-sm text-muted-foreground">{t('account.search.emptyQuery')}</Text>
      </View>
    );
  }

  return (
    <SearchResultsFrame
      items={movies}
      isLoading={searchQuery.isLoading}
      isFetchingNextPage={searchQuery.isFetchingNextPage}
      hasNextPage={searchQuery.hasNextPage ?? false}
      onLoadMore={() => {
        if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
          void searchQuery.fetchNextPage();
        }
      }}
      keyExtractor={(movieId) => movieId}
      renderItem={(movieId) => <CompactPostMovieCard movieId={movieId} />}
    />
  );
}
