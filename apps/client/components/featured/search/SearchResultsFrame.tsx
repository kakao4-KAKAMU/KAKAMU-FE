import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Text } from '@kakamu/ui';

type SearchResultsFrameProps<T> = {
  items: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement | null;
  emptyMessage?: string;
};

export function SearchResultsFrame<T>({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  keyExtractor,
  renderItem,
  emptyMessage,
}: SearchResultsFrameProps<T>) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator />
        <Text className="mt-3 text-sm text-muted-foreground">{t('account.search.loading')}</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-sm text-muted-foreground">
          {emptyMessage ?? t('account.search.emptyResult')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
      renderItem={({ item }) => renderItem(item)}
      ListFooterComponent={
        hasNextPage ? (
          <Pressable
            className="items-center rounded-md py-3 active:opacity-80"
            onPress={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-sm text-muted-foreground">{t('account.search.loadMore')}</Text>
            )}
          </Pressable>
        ) : null
      }
    />
  );
}
