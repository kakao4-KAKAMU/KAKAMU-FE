import { useCallback, useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@kakamu/ui';
import { FindPasswordForm, type FindPasswordFormValues } from '@/components/featured/auth';

const INITIAL_VALUES: FindPasswordFormValues = {
  email: '',
};

export default function FindPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [values, setValues] = useState<FindPasswordFormValues>(INITIAL_VALUES);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    setSubmitting(false);
    router.replace('/findpassword/done');
  }, [router]);

  const handleBackToSignIn = useCallback(() => {
    router.replace('/signin');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: t('guest.layout.findPassword') }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="min-h-full grow justify-center px-6 pt-6 pb-7 gap-3.5">
            <View className="gap-2">
              <Text className="text-3xl font-extrabold text-foreground leading-tight">
                {t('guest.findPassword.title')}
              </Text>
              <Text className="text-sm font-normal text-muted-foreground leading-snug">
                {t('guest.findPassword.description')}
              </Text>
            </View>

            <FindPasswordForm
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              submitting={submitting}
            />

            <View className="items-center">
              <Pressable
                accessibilityRole="link"
                onPress={handleBackToSignIn}
                hitSlop={8}
                className="active:opacity-70"
              >
                <Text className="text-sm font-normal text-muted-foreground text-center">
                  {t('guest.findPassword.backToSignIn')}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
