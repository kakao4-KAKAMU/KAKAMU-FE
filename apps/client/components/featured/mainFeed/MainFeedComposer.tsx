import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { Text } from '@kakamu/ui';

import { ProfileImage } from '@/components/featured/profileScreen/ProfileImage';
import { useCurrentUserSuspenseQuery } from '@kakamu/query';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

export function MainFeedComposer() {
  const { t } = useTranslation();
  const router = useRouter();
  const client = useBackendApiClient();
  const currentUserQuery = useCurrentUserSuspenseQuery(client);
  const currentUser = currentUserQuery.data;

  const handlePress = useCallback(() => {
    router.push('/(account)/feed/write');
  }, [router]);

  return (
    <Pressable
      className="flex-row items-center gap-2.5 border-b border-border py-2.5 active:opacity-80"
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={t('account.layout.feedWrite')}
    >
      <ProfileImage
        nickname={currentUser.nickname}
        url={currentUser.profile_image}
        size={9}
      />
      <Text className="flex-1 text-sm text-muted-foreground">
        {t('account.mainFeed.composerPlaceholder')}
      </Text>
    </Pressable>
  );
}
