import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { SnsSignUpFormInput } from '@kakamu/schema';
import { useRegisterSocialUserMutation } from '@kakamu/query';
import { useAuthStore } from '@kakamu/store';
import { Stack, useRouter } from 'expo-router';
import { HTTPError } from 'ky';
import { useErrorAlertDialog } from '@kakamu/ui';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm, type Resolver } from 'react-hook-form';
import {
  AuthHeader,
  SignUpPrompt,
  SignUpSnsForm,
} from '@/components/featured/auth';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: SnsSignUpFormInput = {
  username: '',
  nickname: '',
  email: '',
  snsType: 'kakao',
  token: '',
};

export default function SignUpSnsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const pendingSnsProvider = useAuthStore((s) => s.pendingSnsProvider);
  const pendingSnsToken = useAuthStore((s) => s.pendingSnsToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearPendingSnsSignUp = useAuthStore((s) => s.clearPendingSnsSignUp);

  useEffect(() => {
    clearPendingSnsSignUp();
  }, [])

  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(
    () => zodResolver(authForms.snsSignUp) as Resolver<SnsSignUpFormInput>,
    [authForms.snsSignUp],
  );

  const { control, handleSubmit, formState, setValue } = useForm<SnsSignUpFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    if (!pendingSnsProvider || !pendingSnsToken) {
      router.replace('/signin');
      return;
    }
    setValue('snsType', pendingSnsProvider);
    setValue('token', pendingSnsToken);
    setFormReady(true);
  }, [pendingSnsProvider, pendingSnsToken, router, setValue]);

  const headerDescription = useMemo(() => {
    if (pendingSnsProvider === 'kakao') {
      return t('guest.signUpSns.providerKakao');
    }
    if (pendingSnsProvider === 'google') {
      return t('guest.signUpSns.providerGoogle');
    }
    return t('guest.signUpSns.headerDescription');
  }, [pendingSnsProvider, t]);

  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();

  const registerMutation = useRegisterSocialUserMutation(apiClient, {
    onSuccess: (res) => {
      setAccessToken(res.access_token);
      setSubmitting(false);
    },
    onError: async (err) => {
      setSubmitting(false);
      let message = t('guest.form.signUpSns.failedRequest.description');
      let title = t('guest.form.signUpSns.failedRequest.title');
      let errorCode: string | null = null;
      if (err instanceof HTTPError) {
        try {
          const body = await err.response.json();
          if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
            message = body.message;
            errorCode = 'code' in body && typeof body.code === 'string' ? body.code : null;
          }
        } catch {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      switch (errorCode) {
        case 'REGISTRATION_FAILED':
          title = t('guest.form.signUpSns.failedRequest.title');
          message = t('guest.form.signUpSns.failedRequest.description');
          break;
        case 'DUPLICATE_EMAIL':
          title = t('guest.form.signUp.duplicateEmail.title');
          message = t('guest.form.signUp.duplicateEmail.description');
          break;
        default:
          break;
      }

      openErrorAlert({ title, description: message });
    },
  });

  const onValid = useCallback(
    (data: SnsSignUpFormInput) => {
      if (!pendingSnsProvider || !pendingSnsToken) {
        router.replace('/signin');
        return;
      }
      setSubmitting(true);
      registerMutation.mutate({
        username: data.username.trim(),
        nickname: data.nickname.trim(),
        email: data.email.trim(),
        provider: pendingSnsProvider,
        token: pendingSnsToken,
        ...(data.profile ? { profile: data.profile } : {}),
      });
    },
    [pendingSnsProvider, pendingSnsToken, registerMutation, router],
  );

  const handleNavigateSignIn = useCallback(() => {;
    router.push('/signin');
  }, [router]);

  if (!formReady || !pendingSnsProvider || !pendingSnsToken) {
    return null;
  }

  const isBusy = submitting || registerMutation.isPending;

  return (
    <>
      <Stack.Screen options={{ title: t('guest.layout.signUpSns') }} />
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
              title={t('guest.signUpSns.headerTitle')}
              description={headerDescription}
            />

            <SignUpSnsForm
              control={control}
              onSubmit={handleSubmit(onValid)}
              submitting={isBusy}
              canSubmit={formState.isValid && !registerMutation.isPending}
            />

            <SignUpPrompt variant="toSignIn" onPress={handleNavigateSignIn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
