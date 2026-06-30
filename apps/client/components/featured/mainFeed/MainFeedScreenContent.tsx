import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { useFeedPostsInfiniteQuery } from '@kakamu/query';
import { Text } from '@kakamu/ui';

import { HeaderTemplate } from '@/components/featured/header/HeaderTemplate';
import { CompactPost } from '@/components/featured/post/CompactPost';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

import { MainFeedComposer } from './MainFeedComposer';

const FEED_PAGE_LIMIT = 20;

export function MainFeedScreenContent() {
  const { t } = useTranslation();
  const client = useBackendApiClient();
  const feedQuery = useFeedPostsInfiniteQuery(client, { limit: FEED_PAGE_LIMIT });

  const postIds = useMemo(
    () => feedQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [feedQuery.data?.pages],
  );

  const handleLoadMore = useCallback(() => {
    if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
      void feedQuery.fetchNextPage();
    }
  }, [feedQuery]);

  const listHeader = useMemo(
    () => (
      <View className="gap-2 bg-background">
        <HeaderTemplate title={t('account.mainFeed.title')} />
        <MainFeedComposer />
      </View>
    ),
    [t],
  );

  if (feedQuery.isLoading) {
    return (
      <View className="flex-1 bg-background px-4 pb-4">
        {listHeader}
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator />
          <Text className="mt-3 text-sm text-muted-foreground">
            {t('account.mainFeed.loading')}
          </Text>
        </View>
      </View>
    );
  }

  if (postIds.length === 0) {
    return (
      <View className="flex-1 bg-background px-4 pb-4">
        {listHeader}
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-sm text-muted-foreground">
            {t('account.mainFeed.empty')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      data={postIds}
      keyExtractor={(postId) => String(postId)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={listHeader}
      renderItem={({ item: postId }) => <CompactPost postId={postId} />}
      ListFooterComponent={
        feedQuery.hasNextPage ? (
          <Pressable
            className="items-center rounded-md py-3 active:opacity-80"
            onPress={handleLoadMore}
            disabled={feedQuery.isFetchingNextPage}
          >
            {feedQuery.isFetchingNextPage ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-sm text-muted-foreground">
                {t('account.search.loadMore')}
              </Text>
            )}
          </Pressable>
        ) : null
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
    />
  );
}
