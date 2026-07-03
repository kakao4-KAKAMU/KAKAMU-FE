import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { type Href, usePathname, useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { Text, cn } from '@kakamu/ui';

import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';
import {
  RECOMMEND_TAB_ROUTES,
  resolveActiveRecommendTab,
  type RecommendTab,
} from '@/lib/search/recommend-tabs';

const TAB_ITEMS: RecommendTab[] = ['feed', 'movie'];

export function RecommendSubTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { query } = useSearchNavigation();
  const activeTab = resolveActiveRecommendTab(pathname);

  const labels: Record<RecommendTab, string> = {
    feed: t('account.search.tabs.feed'),
    movie: t('account.search.tabs.movie'),
  };

  const onTabPress = useCallback(
    (tab: RecommendTab) => {
      const href = RECOMMEND_TAB_ROUTES[tab];
      if (pathname !== href) {
        router.replace({
          pathname: href,
          params: query.trim() ? { q: query.trim() } : undefined,
        } as Href);
      }
    },
    [pathname, query, router],
  );

  return (
    <View className="border-b border-border bg-background pb-0 pt-1">
      <View className="flex-row gap-1 rounded-md bg-secondary p-1">
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => onTabPress(tab)}
              className={cn(
                'flex-1 items-center justify-center rounded-sm py-1.5',
                isActive && 'bg-background shadow-sm shadow-black/5',
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {labels[tab]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
