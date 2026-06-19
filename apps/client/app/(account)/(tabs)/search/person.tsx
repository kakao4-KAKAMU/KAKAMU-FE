import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { useSearchUserInfiniteQuery } from '@kakamu/query';
import { Text } from '@kakamu/ui';

import { SearchPersonCard } from '@/components/featured/search/SearchPersonCard';
import { SearchResultsFrame } from '@/components/featured/search/SearchResultsFrame';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';
import { useSearchRecentHistory } from '@/hooks/search/useSearchRecentHistory';

export default function SearchPersonScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const client = useBackendApiClient();
  const { query } = useSearchNavigation();
  const { recordSelection } = useSearchRecentHistory();
  const searchQuery = useSearchUserInfiniteQuery(client, { q: query });

  const users = useMemo(
    () => searchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [searchQuery.data?.pages],
  );

  const onUserPress = useCallback(
    (userId: string) => {
      void recordSelection(query, 'person');
      router.push(`/profile/${userId}`);
    },
    [query, recordSelection, router],
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
      items={users}
      isLoading={searchQuery.isLoading}
      isFetchingNextPage={searchQuery.isFetchingNextPage}
      hasNextPage={searchQuery.hasNextPage ?? false}
      onLoadMore={() => {
        if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
          void searchQuery.fetchNextPage();
        }
      }}
      keyExtractor={(user) => user.id ?? user.nickname}
      renderItem={(user) => (
        <SearchPersonCard
          user={user}
          onPress={() => {
            if (user.id) {
              onUserPress(user.id);
            }
          }}
        />
      )}
    />
  );
}
