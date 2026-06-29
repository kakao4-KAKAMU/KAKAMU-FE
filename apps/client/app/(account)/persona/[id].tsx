import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { ProfileSubpageHeader } from '@/components/featured/header';
import { PersonaEditScreenContent, PersonaCreateStep1FormSkeleton } from '@/components/featured/persona';

export default function PersonaEditScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={t('account.layout.personaEdit')} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >
            <AppSuspenseBoundary fallback={<PersonaCreateStep1FormSkeleton />}>
              <PersonaEditScreenContent />
            </AppSuspenseBoundary>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
