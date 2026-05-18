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
  SignUpPhoneVerificationForm,
  SignUpPrompt,
  SignUpSnsForm,
} from '@/components/featured/auth';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import {
  SIGNUP_SNS_PHONE_RECAPTCHA_CONTAINER_ID,
  firebaseSignOut,
  usePhoneValidation,
} from '@/hooks/auth';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: SnsSignUpFormInput = {
  username: '',
  nickname: '',
  email: '',
  phone: '',
  phoneValid: false,
  snsType: 'kakao',
  token: '',
};

type SignUpSnsStep = 1 | 2;

export default function SignUpSnsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const pendingSnsProvider = useAuthStore((s) => s.pendingSnsProvider);
  const pendingSnsToken = useAuthStore((s) => s.pendingSnsToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearPendingSnsSignUp = useAuthStore((s) => s.clearPendingSnsSignUp);

  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(
    () => zodResolver(authForms.snsSignUp) as Resolver<SnsSignUpFormInput>,
    [authForms.snsSignUp],
  );

  const { control, handleSubmit, formState, setValue, getValues, trigger, setError, clearErrors, watch } =
    useForm<SnsSignUpFormInput>({
      resolver,
      defaultValues: DEFAULT_VALUES,
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
    });

  const [step, setStep] = useState<SignUpSnsStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [formReady, setFormReady] = useState(false);

  const phone = watch('phone');
  const phoneValid = watch('phoneValid');

  useEffect(() => {
    if (!pendingSnsProvider || !pendingSnsToken) {
      router.replace('/signin');
      return;
    }
    setValue('snsType', pendingSnsProvider);
    setValue('token', pendingSnsToken);
    setFormReady(true);
  }, [pendingSnsProvider, pendingSnsToken, router, setValue]);

  const handlePhoneChange = useCallback(() => {
    if (step === 2) {
      setStep(1);
    }
  }, [step]);

  const phoneValidation = usePhoneValidation({
    getPhone: () => getValues('phone'),
    setPhoneValid: (value) => setValue('phoneValid', value),
    triggerPhone: () => trigger('phone'),
    triggerPhoneStep: () => trigger(['phone', 'phoneValid']),
    phone,
    phoneValid,
    onPhoneChange: handlePhoneChange,
    recaptchaContainerId: SIGNUP_SNS_PHONE_RECAPTCHA_CONTAINER_ID,
  });

  const handleContinueToDetails = useCallback(async () => {
    const ok = await phoneValidation.validatePhoneStep();
    if (ok) {
      setStep(2);
    }
  }, [phoneValidation]);

  const handleBackToPhone = useCallback(() => {
    setStep(1);
  }, []);

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
    onSettled: async () => {
      await firebaseSignOut(phoneValidation.firebasePhoneDepsRef ?? undefined);
    },
    onSuccess: (res) => {
      clearPendingSnsSignUp();
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
      const { firebaseIdToken } = phoneValidation.getRegisterPhoneAuth();
      if (!firebaseIdToken) {
        setError('root', { type: 'manual', message: t('guest.validation.token.required') });
        setStep(1);
        return;
      }
      clearErrors('root');
      setSubmitting(true);
      registerMutation.mutate({
        username: data.username.trim(),
        nickname: data.nickname.trim(),
        email: data.email.trim(),
        provider: pendingSnsProvider,
        provided_token: pendingSnsToken,
        firebase_id_token: firebaseIdToken,
        ...(data.profile ? { profile: data.profile } : {}),
      });
    },
    [
      clearErrors,
      pendingSnsProvider,
      pendingSnsToken,
      phoneValidation,
      registerMutation,
      router,
      setError,
      t,
    ],
  );

  const handleNavigateSignIn = useCallback(() => {
    router.push('/signin');
  }, [router]);

  if (!formReady || !pendingSnsProvider || !pendingSnsToken) {
    return null;
  }

  const isBusy = submitting || registerMutation.isPending || phoneValidation.isPhoneBusy;

  const stepHeader =
    step === 1
      ? { title: t('guest.signUp.stepPhoneTitle'), description: t('guest.signUp.stepPhoneDescription') }
      : {
          title: t('guest.signUpSns.headerTitle'),
          description: headerDescription,
        };

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
            <AuthHeader title={stepHeader.title} description={stepHeader.description} />

            {step === 1 ? (
              <SignUpPhoneVerificationForm
                control={control}
                onSendSms={phoneValidation.sendSms}
                onVerifyOtp={phoneValidation.verifyOtp}
                onContinue={handleContinueToDetails}
                smsSending={phoneValidation.smsSending}
                otpVerifying={phoneValidation.otpVerifying}
                phoneVerified={phoneValidation.phoneVerified}
                smsError={phoneValidation.smsError}
                otpError={phoneValidation.otpError}
                continuing={isBusy}
                canContinue={phoneValidation.phoneVerified}
                recaptchaContainerId={SIGNUP_SNS_PHONE_RECAPTCHA_CONTAINER_ID}
              />
            ) : (
              <SignUpSnsForm
                control={control}
                onSubmit={handleSubmit(onValid)}
                onBack={handleBackToPhone}
                submitting={submitting || registerMutation.isPending}
                canSubmit={formState.isValid && !registerMutation.isPending}
              />
            )}

            <SignUpPrompt variant="toSignIn" onPress={handleNavigateSignIn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
