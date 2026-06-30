import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { View } from 'react-native';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { ProfileSubpageHeader } from '@/components/featured/header';
import { PersonaListScreenContent } from '@/components/featured/persona/PersonaListScreenContent';
import { PersonaListScreenContentSkeleton } from '@/components/featured/persona/PersonaListScreenContent.skeleton';

export default function PersonaScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={t('account.layout.persona')} />
        <AppSuspenseBoundary fallback={<PersonaListScreenContentSkeleton />}>
          <PersonaListScreenContent />
        </AppSuspenseBoundary>
      </View>
    </>
  );
}
