import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { ProfileHero } from './ProfileHero';
import { ProfileStats } from './ProfileStats';
import { ProfileSubTabs } from './ProfileSubTabs';
import { useProfileScreenData } from './useProfileScreenData';
import { ConditionalRender } from '@/components/utils';
import { ProfileSettingsHeader } from '../header';
import { ProfileSubpageHeader } from '../header';
import { Settings } from 'lucide-react-native';

type ProfileScreenLayoutProps = {
  isMy: boolean;
  userId?: string;
  children: ReactNode;
};

export function ProfileScreenLayout({ isMy, userId, children }: ProfileScreenLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useProfileScreenData({ isMy, userId });

  const isSettings = useMemo(() => pathname === '/profile/my', [pathname]);


  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-1 bg-background">
      <ConditionalRender.Boolean
        render={{
          true: <ProfileSettingsHeader
            title="프로필"
            isDropdownMenu={isSettings}
            actionIcon={Settings}
            actionAccessibilityLabel="프로필 설정"
          />,
          false: <ProfileSubpageHeader title="프로필" onBackPress={onBackPress} />,
        }}
        condition={isMy}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerClassName='px-4 gap-2.5'
        className="flex-1"
      >
        <ProfileHero
          user={user}
          isMy={isMy}
          isSettings={isSettings}
          onBackPress={onBackPress}
        />
        <ProfileStats user={user} />

        <ProfileSubTabs isMy={isMy} userId={userId} />

        <View className="pb-6 pt-2">{children}</View>
      </ScrollView>
    </View>
  );
}
