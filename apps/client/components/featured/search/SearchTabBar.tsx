import { ScrollView, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler'
import { Text, cn } from '@kakamu/ui';

import type { SearchTab } from '@/lib/search/search-tabs';

type SearchTabBarProps = {
  activeTab: SearchTab;
  showRecommend: boolean;
  onTabPress: (tab: SearchTab) => void;
  labels: Record<SearchTab, string>;
};

const TAB_ORDER: SearchTab[] = ['movie', 'feed', 'person', 'recommend'];

export function SearchTabBar({
  activeTab,
  showRecommend,
  onTabPress,
  labels,
}: SearchTabBarProps) {
  const tabs = TAB_ORDER.filter((tab) => tab !== 'recommend' || showRecommend);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="grow-0"
    >
      <View className="flex-row gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              onPress={() => onTabPress(tab)}
              className={cn(
                'h-6 items-center justify-center rounded-full px-2',
                isActive ? 'bg-primary' : 'bg-secondary',
              )}
            >
              <Text
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-primary-foreground' : 'text-secondary-foreground',
                )}
              >
                {labels[tab]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
