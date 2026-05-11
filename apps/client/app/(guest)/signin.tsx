import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { SignInWithRememberFormInput } from '@kakamu/schema';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  AuthHeader,
  SignInForm,
  SocialAuthList,
  SignUpPrompt,
  type SignInFormValues,
} from '@/components/featured/auth';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: SignInFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(
    () => zodResolver(authForms.signInWithRemember),
    [authForms.signInWithRemember]
  );

  const { control, handleSubmit, formState } = useForm<SignInWithRememberFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [submitting, setSubmitting] = useState(false);

  const onValid = useCallback((_data: SignInWithRememberFormInput) => {
    setSubmitting(true);
    setSubmitting(false);
  }, []);

  const handleForgotPassword = useCallback(() => {
    router.push('./findpassword');
  }, [router]);

  const handleKakaoLogin = useCallback(() => {
  }, []);

  const handleGoogleLogin = useCallback(() => {
  }, []);

  const handleNavigateSignUp = useCallback(() => {
    router.push('/signup');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: t('guest.layout.signIn') }} />
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
              title={t('guest.signIn.headerTitle')}
              description={t('guest.signIn.headerDescription')}
            />

            <SignInForm
              control={control}
              onSubmit={handleSubmit(onValid)}
              onForgotPassword={handleForgotPassword}
              submitting={submitting}
              canSubmit={formState.isValid}
            />

            <SocialAuthList
              onPressKakao={handleKakaoLogin}
              onPressGoogle={handleGoogleLogin}
              disabled={submitting}
            />

            <SignUpPrompt variant="toSignUp" onPress={handleNavigateSignUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
