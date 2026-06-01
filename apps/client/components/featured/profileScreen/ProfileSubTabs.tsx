import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { Pressable, View } from 'react-native';
import { type Href, usePathname, useRouter } from 'expo-router';
import { Text } from '@kakamu/ui';
import { cn } from '@kakamu/ui';
import { getProfileTabHref, resolveActiveProfileTab } from './profileScreen.routes';
import type { ProfileTab } from './types';

type ProfileSubTabsProps = {
  isMy: boolean;
  userId?: string;
};

export function ProfileSubTabs({ isMy, userId }: ProfileSubTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const activeTab = resolveActiveProfileTab(pathname);
  const tabItems: { key: ProfileTab; label: string }[] = isMy ? [
    { key: 'feed', label: t('account.profile.tabs.feed') },
    { key: 'like', label: t('account.profile.tabs.like') },
    { key: 'saved', label: t('account.profile.tabs.saved') },
  ] : [
    { key: 'feed', label: t('account.profile.tabs.feed') }
  ]

  const onTabPress = useCallback(
    (tab: ProfileTab) => {
      const href = getProfileTabHref(isMy, userId, tab);
      if (pathname !== href) {
        router.replace(href as Href);
      }
    },
    [isMy, pathname, router, userId],
  );

  return (
    <View className="border-b border-border bg-background pb-0 pt-1">
      <View className="flex-row gap-1 rounded-md bg-secondary p-1">
        {tabItems.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <Pressable
              key={`${key}-${isActive}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => onTabPress(key)}
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
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
