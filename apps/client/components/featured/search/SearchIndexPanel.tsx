import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler'
import { useTranslation } from '@kakamu/i18n';
import type { TrendItem } from '@kakamu/types';
import { Text } from '@kakamu/ui';

import type { RecentSearchEntry } from '@/lib/search/recent-search-storage';

type SearchIndexPanelProps = {
  trends: TrendItem[];
  isTrendLoading: boolean;
  recentEntries: RecentSearchEntry[];
  isRecentLoading: boolean;
  onTrendPress: (keyword: string) => void;
  onRecentPress: (entry: RecentSearchEntry) => void;
  onClearRecent: () => void;
};

export function SearchIndexPanel({
  trends,
  isTrendLoading,
  recentEntries,
  isRecentLoading,
  onTrendPress,
  onRecentPress,
  onClearRecent,
}: SearchIndexPanelProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-6 pt-2">
      <View className="gap-3">
        <Text className="text-sm font-semibold text-foreground">
          {t('account.search.trend.title')}
        </Text>
        {isTrendLoading ? (
          <Text className="text-sm text-muted-foreground">{t('account.search.loading')}</Text>
        ) : (
          <View className="gap-2">
            {trends.map((item) => (
              <Pressable
                key={item.rank}
                accessibilityRole="button"
                onPress={() => onTrendPress(item.keyword)}
                className="flex-row items-center gap-3 active:opacity-70"
              >
                <Text className="w-5 text-sm font-bold text-primary">{item.rank}</Text>
                <Text className="flex-1 text-sm text-foreground">{item.keyword}</Text>
                <Text className="text-xs text-muted-foreground">{item.search_count}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-foreground">
            {t('account.search.recent.title')}
          </Text>
          {recentEntries.length > 0 ? (
            <Pressable accessibilityRole="button" onPress={onClearRecent} hitSlop={8}>
              <Text className="text-xs text-muted-foreground">{t('account.search.recent.clear')}</Text>
            </Pressable>
          ) : null}
        </View>
        {isRecentLoading ? (
          <Text className="text-sm text-muted-foreground">{t('account.search.loading')}</Text>
        ) : recentEntries.length === 0 ? (
          <Text className="text-sm text-muted-foreground">{t('account.search.recent.empty')}</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {recentEntries.map((entry) => (
              <Pressable
                key={`${entry.keyword}-${entry.selectedAt}`}
                accessibilityRole="button"
                onPress={() => onRecentPress(entry)}
                className="rounded-full bg-secondary px-3 py-1.5 active:opacity-70"
              >
                <Text className="text-xs text-secondary-foreground">{entry.keyword}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
