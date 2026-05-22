import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileHero } from './ProfileHero';
import { ProfileStats } from './ProfileStats';
import { ProfileSubTabs } from './ProfileSubTabs';
import { useProfileScreenData } from './useProfileScreenData';

type ProfileScreenLayoutProps = {
  isMy: boolean;
  userId?: string;
  children: ReactNode;
};

export function ProfileScreenLayout({ isMy, userId, children }: ProfileScreenLayoutProps) {
  const router = useRouter();
  const { user } = useProfileScreenData({ isMy, userId });

  const onSettingsPress = useCallback(() => {
    router.push('/profile/setting');
  }, [router]);

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        className="flex-1"
      >
        <View className="gap-2.5 px-4 pb-2 pt-1">
          <ProfileHero
            user={user}
            isMy={isMy}
            onSettingsPress={onSettingsPress}
            onBackPress={onBackPress}
          />
          <ProfileStats user={user} />
        </View>

        <ProfileSubTabs isMy={isMy} userId={userId} />

        <View className="px-4 pb-6 pt-2">{children}</View>
      </ScrollView>
    </View>
  );
}
