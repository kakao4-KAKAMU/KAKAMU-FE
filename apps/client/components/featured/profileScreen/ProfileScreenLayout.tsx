import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
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
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useProfileScreenData({ isMy, userId });

  const isSettings = useMemo(() => pathname.startsWith('/profile/setting'), [pathname]);


  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-1 bg-background">
      <ConditionalRender.Boolean
        condition={isMy}
        render={{
          true: <ProfileSettingsHeader
            title={t('account.layout.profile')}
            isDropdownMenu={!isSettings}
            actionIcon={Settings}
            actionAccessibilityLabel={t('account.layout.profileSettings')}
            addFeedAccessibilityLabel={t('account.layout.feedWrite')}
          />,
          false: (
            <ProfileSubpageHeader
              title={t('account.layout.profile')}
              onBackPress={onBackPress}
            />
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerClassName='px-4 gap-2.5'
        className="flex-1"
      >
        <ProfileHero user={user} />
        <ProfileStats user={user} />

        <ProfileSubTabs isMy={isMy} userId={userId} />

        <View className="pb-6 pt-2">{children}</View>
      </ScrollView>
    </View>
  );
}
