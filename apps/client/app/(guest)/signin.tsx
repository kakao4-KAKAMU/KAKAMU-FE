import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import { useLoginUserMutation, useSocialAuthLoginMutation } from '@kakamu/query';
import type { SignInWithRememberFormInput } from '@kakamu/schema';
import { useAuthStore } from '@kakamu/store';
import { Stack, useRouter } from 'expo-router';
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
import { mapSignInError, parseSocialSignInError } from '@/lib/error-message-map/auth/sign-in-error';
import { setAuthTokens } from '@/lib/auth/set-auth-tokens';
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
      void setAuthTokens(res.access_token, res.refresh_token);
      setSubmitting(false);
    },
    onError: (err, variables) => {
      setSubmitting(false);
      const socialError = parseSocialSignInError(err, t);

      if (socialError.code === 'SOCIAL_ACCOUNT_NOT_REGISTERED') {
        setPendingSnsSignUp(variables.provider, variables.provided_token);
        router.push('./signup-sns');
        return;
      }

      openErrorAlert(socialError.alert);
    },
  });

  const loginMutation = useLoginUserMutation(apiClient, {
    onSuccess: (res) => {
      void setAuthTokens(res.access_token, res.refresh_token);
      setSubmitting(false);
    },
    onError: (err) => {
      setSubmitting(false);
      openErrorAlert(mapSignInError(err, t));
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
    [loginMutation]
  );

  const handleForgotPassword = useCallback(() => {
    router.push('./resetpassword');
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
      .catch((error: unknown) => {
        setSubmitting(false);
        openErrorAlert(parseSocialSignInError(error, t).alert);
      });
  }, [loginWithKakao, openErrorAlert, socialAuthLoginMutation, t]);

  const handleGoogleLogin = useCallback(() => {}, []);

  const handleNavigateSignUp = useCallback(() => {
    router.push('./signup');
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
