import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { ProfileSubpageHeader } from '@/components/featured/header';
import { AccountSetupScreenContent } from '@/components/featured/profile/AccountSetupScreenContent';
import { AccountSetupScreenContentSkeleton } from '@/components/featured/profile/AccountSetupScreenContent.skeleton';

export default function AccountSetupScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={t('account.setup.pageTitle')} />
        <AppSuspenseBoundary fallback={<AccountSetupScreenContentSkeleton />}>
          <AccountSetupScreenContent />
        </AppSuspenseBoundary>
      </View>
    </>
  );
}
