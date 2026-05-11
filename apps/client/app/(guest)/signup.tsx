import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  AuthHeader,
  SignUpForm,
  SignUpPrompt,
  SocialAuthList,
  type SignUpFormValues,
} from '@/components/featured/auth';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: SignUpFormValues = {
  username: '',
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agreedToTerms: false,
};

export default function SignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(
    () => zodResolver(authForms.signUpWithTerms),
    [authForms.signUpWithTerms]
  );

  const { control, handleSubmit, formState } = useForm<SignUpWithTermsFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [submitting, setSubmitting] = useState(false);

  const onValid = useCallback((_data: SignUpWithTermsFormInput) => {
    setSubmitting(true);
    setSubmitting(false);
  }, []);

  const handleShowTerms = useCallback(() => {
  }, []);

  const handleKakaoSignUp = useCallback(() => {
  }, []);

  const handleGoogleSignUp = useCallback(() => {
  }, []);

  const handleNavigateSignIn = useCallback(() => {
    router.push('/signin');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: t('guest.layout.signUp') }} />
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
          <View className="min-h-full grow justify-center px-6 py-8 gap-8">
            <AuthHeader
              title={t('guest.signUp.headerTitle')}
              description={t('guest.signUp.headerDescription')}
            />

            <SignUpForm
              control={control}
              onSubmit={handleSubmit(onValid)}
              onPressTerms={handleShowTerms}
              submitting={submitting}
              canSubmit={formState.isValid}
            />

            <SocialAuthList
              onPressKakao={handleKakaoSignUp}
              onPressGoogle={handleGoogleSignUp}
              disabled={submitting}
            />

            <SignUpPrompt variant="toSignIn" onPress={handleNavigateSignIn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
