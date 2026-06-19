import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { PersonaCreateScreenContent } from '@/components/featured/persona/PersonaCreateScreenContent';
import { PersonaCreateStep1FormSkeleton } from '@/components/featured/persona/PersonaCreateStep1Form.skeleton';

export default function PersonaCreateScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('account.layout.personaCreate') }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <ScrollView
          contentContainerClassName="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <AppSuspenseBoundary fallback={<PersonaCreateStep1FormSkeleton />}>
            <PersonaCreateScreenContent />
          </AppSuspenseBoundary>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
