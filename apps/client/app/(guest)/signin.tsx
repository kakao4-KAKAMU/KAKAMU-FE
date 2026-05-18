import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import { useLoginUserMutation, useSocialAuthLoginMutation } from '@kakamu/query';
import type { SignInWithRememberFormInput } from '@kakamu/schema';
import { useAuthStore } from '@kakamu/store';
import { Stack, useRouter } from 'expo-router';
import { HTTPError } from 'ky';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useErrorAlertDialog } from '@kakamu/ui';
import {
  AuthHeader,
  SignInForm,
  SocialAuthList,
  SignUpPrompt,
  type SignInFormValues,
} from '@/components/featured/auth';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';
import { useKakaoLogin } from '@/lib/kakao-login';

const DEFAULT_VALUES: SignInFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setPendingSnsSignUp = useAuthStore((s) => s.setPendingSnsSignUp);
  const { open: openErrorAlert } = useErrorAlertDialog();

  const apiClient = useBackendApiClient();
  const socialAuthLoginMutation = useSocialAuthLoginMutation(apiClient, {
    onSuccess: (res, variables) => {
      if(res.is_new_user) {
        setPendingSnsSignUp(variables.provider, variables.provided_token);
        router.push('./signup-sns');
        return;
      }
      setAccessToken(res.access_token);
      setSubmitting(false);
    },
    onError: async (err, variables) => {
      setSubmitting(false);
      let message = t('guest.form.signIn.failedRequest.description');
      let title = t('guest.form.signIn.failedRequest.title');
      let errorCode: string | null = null;
      if (err instanceof HTTPError) {
        try {
          const body: unknown = await err.response.json();
          if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
            message = body.message;
          }
          if (body && typeof body === 'object' && 'code' in body) {
            const c = (body as { code: unknown }).code;
            errorCode = typeof c === 'string' ? c : null;
          }
        } catch {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      if (errorCode === 'SOCIAL_ACCOUNT_NOT_REGISTERED') {
        setPendingSnsSignUp(variables.provider, variables.provided_token);
        router.push('./signup-sns');
        return;
      }

      openErrorAlert({ title, description: message });
    },
  });

  const loginMutation = useLoginUserMutation(apiClient, {
    onSuccess: (res) => {
      setAccessToken(res.access_token);
      setSubmitting(false);
    },
    onError: async (err) => {
      setSubmitting(false);
      let message = t('guest.form.signIn.failedRequest.description');
      let title = t('guest.form.signIn.failedRequest.title');
      let errorCode: string | null = null;
      if (err instanceof HTTPError) {
        try {
          const body: unknown = await err.response.json();
          if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
            message = body.message;
          }
          if (body && typeof body === 'object' && 'code' in body) {
            const c = (body as { code: unknown }).code;
            errorCode = typeof c === 'string' ? c : null;
          }
        } catch {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      switch (errorCode) {
        case 'INVALID_CREDENTIALS':
        case 'UNAUTHORIZED':
        case 'WRONG_PASSWORD':
        case 'USER_NOT_FOUND':
          title = t('guest.form.signIn.invalidCredentials.title');
          message = t('guest.form.signIn.invalidCredentials.description');
          break;
        case 'LOGIN_FAILED':
          title = t('guest.form.signIn.failedRequest.title');
          message = t('guest.form.signIn.failedRequest.description');
          break;
        default:
          break;
      }

      openErrorAlert({ title, description: message });
    },
  });

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

  const onValid = useCallback(
    (data: SignInWithRememberFormInput) => {
      const { email, password } = data;
      setSubmitting(true);
      loginMutation.mutate(
        { email: email.trim(), password: password.trim() }
      );
    },
    [loginMutation, openErrorAlert, setAccessToken, t]
  );

  const handleForgotPassword = useCallback(() => {
    router.push('./findpassword');
  }, [router]);

  const { login: loginWithKakao } = useKakaoLogin();
  const handleKakaoLogin = useCallback(() => {
    setSubmitting(true);
    loginWithKakao()
      .then((token) => {
        socialAuthLoginMutation.mutate({
          provider: 'kakao',
          provided_token: token.accessToken,
        });
      })
      .catch((error) => {
        setSubmitting(false);
        console.error(error);
      });
  }, [loginWithKakao, socialAuthLoginMutation]);

  const handleGoogleLogin = useCallback(() => {}, []);

  const handleNavigateSignUp = useCallback(() => {
    router.push('/signup');
  }, [router]);

  const isBusy =
    submitting || loginMutation.isPending || socialAuthLoginMutation.isPending;

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
              submitting={isBusy}
              canSubmit={formState.isValid && !loginMutation.isPending}
            />

            <SocialAuthList
              onPressKakao={handleKakaoLogin}
              onPressGoogle={handleGoogleLogin}
              disabled={isBusy}
            />

            <SignUpPrompt variant="toSignUp" onPress={handleNavigateSignUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
