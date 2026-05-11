import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { FindPasswordFormInput } from '@kakamu/schema';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Text } from '@kakamu/ui';
import { FindPasswordForm, type FindPasswordFormValues } from '@/components/featured/auth';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: FindPasswordFormValues = {
  email: '',
};

export default function FindPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(() => zodResolver(authForms.findPassword), [authForms.findPassword]);

  const { control, handleSubmit, formState } = useForm<FindPasswordFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [submitting, setSubmitting] = useState(false);

  const onValid = useCallback(
    (_data: FindPasswordFormInput) => {
      setSubmitting(true);
      setSubmitting(false);
      router.replace('/findpassword/done');
    },
    [router]
  );

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
              control={control}
              onSubmit={handleSubmit(onValid)}
              submitting={submitting}
              canSubmit={formState.isValid}
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
