import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { usePathname, useRouter } from 'expo-router';
import { ProfileHero } from './ProfileHero';
import { ProfileStats } from './ProfileStats';
import { ProfileSubTabs } from './ProfileSubTabs';
import { ConditionalRender } from '@/components/utils';
import { ProfileSettingsHeader } from '../header';
import { ProfileSubpageHeader } from '../header';
import { Settings } from 'lucide-react-native';
import { usePersonaStore } from '@kakamu/store';
import { usePersonaQuery } from '@kakamu/query';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

type ProfileScreenLayoutProps = {
  isMy: boolean;
  userId?: string;
  children: ReactNode;
};

export function ProfileScreenLayout({ isMy, userId, children }: ProfileScreenLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const apiClient = useBackendApiClient();
  const selectedPersonaId = usePersonaStore((state) => state.selectedPersonaId);
  const personaId = (isMy ? selectedPersonaId : userId) ?? '';
  const personaQuery = usePersonaQuery(apiClient, personaId);
  const persona = personaQuery.data

  const userStatus = useMemo(() => {
    return {
      feed: 0,
      save: 0,
      following: 0,
      persona: 0,
    }
  }, [])

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
        stickyHeaderIndices={[2]}
        contentContainerClassName='px-4 gap-2.5'
        className="flex-1"
      >
        <ProfileHero user={persona} />
        <ProfileStats user={userStatus} />

        <ProfileSubTabs isMy={isMy} userId={personaId} />

        <View className="pb-6 pt-2">{children}</View>
      </ScrollView>
    </View>
  );
}
