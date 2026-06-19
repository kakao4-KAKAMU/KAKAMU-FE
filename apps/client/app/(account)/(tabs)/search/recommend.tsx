import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { useSearchForYouInfiniteQuery } from '@kakamu/query';
import { Text } from '@kakamu/ui';

import { CompactPost } from '@/components/featured/post/CompactPost';
import { SearchResultsFrame } from '@/components/featured/search/SearchResultsFrame';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';
import { useSearchRecentHistory } from '@/hooks/search/useSearchRecentHistory';

export default function SearchRecommendScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const client = useBackendApiClient();
  const currentUserId = useCurrentUserId();
  const { query } = useSearchNavigation();
  const { recordSelection } = useSearchRecentHistory();
  const searchQuery = useSearchForYouInfiniteQuery(client, { q: query }, currentUserId != null);

  const posts = useMemo(
    () => searchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [searchQuery.data?.pages],
  );

  const onPostPress = useCallback(
    (postId: number) => {
      void recordSelection(query, 'recommend');
      router.push(`/feed/${postId}`);
    },
    [query, recordSelection, router],
  );

  if (currentUserId == null) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="px-4 text-center text-sm text-muted-foreground">
          {t('account.search.recommend.loginRequired')}
        </Text>
      </View>
    );
  }

  if (!query.trim()) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-sm text-muted-foreground">{t('account.search.emptyQuery')}</Text>
      </View>
    );
  }

  return (
    <SearchResultsFrame
      items={posts}
      isLoading={searchQuery.isLoading}
      isFetchingNextPage={searchQuery.isFetchingNextPage}
      hasNextPage={searchQuery.hasNextPage ?? false}
      onLoadMore={() => {
        if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) {
          void searchQuery.fetchNextPage();
        }
      }}
      keyExtractor={(post) => String(post.id)}
      renderItem={(post) => (
        <Pressable accessibilityRole="button" onPress={() => onPostPress(post.id)}>
          <CompactPost post={post} />
        </Pressable>
      )}
    />
  );
}
