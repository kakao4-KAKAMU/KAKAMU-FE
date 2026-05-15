import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { useRegisterUserMutation } from '@kakamu/query';
import { Stack, useRouter } from 'expo-router';
import { HTTPError } from 'ky';
import { useErrorAlertDialog } from '@kakamu/ui';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  AuthHeader,
  SignUpForm,
  SignUpPhoneVerificationForm,
  SignUpPrompt,
  type SignUpFormValues,
} from '@/components/featured/auth';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { usePhoneValidation } from '@/hooks/featured/auth/usePhoneValidation';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: SignUpFormValues = {
  username: '',
  phone: '',
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agreedToTerms: false,
  phoneValid: false,
};

type SignUpStep = 1 | 2;

async function signOutFirebaseAfterRegister(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      const { getFirebaseWebApp } = await import('@/hooks/firebase/initWeb');
      const { getAuth, signOut } = await import('firebase/auth');
      await signOut(getAuth(getFirebaseWebApp()));
    } else {
      const { default: rnAuth } = await import('@react-native-firebase/auth');
      await rnAuth().signOut();
    }
  } catch {
    /* 세션 정리 실패는 가입 성공 흐름을 막지 않음 */
  }
}

export default function SignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(
    () => zodResolver(authForms.signUpWithTerms),
    [authForms.signUpWithTerms]
  );

  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();

  const registerMutation = useRegisterUserMutation(apiClient, {
    onSettled: async () => {
      await signOutFirebaseAfterRegister();
    },
    onSuccess: () => {
      setSubmitting(false);
      router.replace('/signin');
    },
    onError: async (err) => {
      setSubmitting(false);
      let message = t('guest.form.signUp.failedRequest.description');
      let title = t('guest.form.signUp.failedRequest.title');
      let errorCode: string | null = null;
      if (err instanceof HTTPError) {
        try {
          const body = await err.response.json();
          if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
            message = body.message;
            errorCode = body.code;
          }
        } catch {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      switch (errorCode) {
        case 'REGISTRATION_FAILED':
          title = t('guest.form.signUp.failedRequest.title');
          message = t('guest.form.signUp.failedRequest.description');
          break;
        case 'INVALID_FIREBASE_TOKEN':
          title = t('guest.form.signUp.invalidFirebaseToken.title');
          message = t('guest.form.signUp.invalidFirebaseToken.description');
          break;
        case 'DUPLICATE_PHONE_NUMBER':
          title = t('guest.form.signUp.duplicatePhoneNumber.title');
          message = t('guest.form.signUp.duplicatePhoneNumber.description');
          break;
        case 'DUPLICATE_CI_VALUE':
          title = t('guest.form.signUp.duplicateCiValue.title');
          message = t('guest.form.signUp.duplicateCiValue.description');
          break;
        case 'DUPLICATE_EMAIL':
          title = t('guest.form.signUp.duplicateEmail.title');
          message = t('guest.form.signUp.duplicateEmail.description');
          break;
      }

      openErrorAlert({ title, description: message });
    },
  });

  const { control, handleSubmit, formState, getValues, setValue, trigger, setError, clearErrors, watch } =
    useForm<SignUpWithTermsFormInput>({
      resolver,
      defaultValues: DEFAULT_VALUES,
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
    });

  const [step, setStep] = useState<SignUpStep>(1);
  const [submitting, setSubmitting] = useState(false);

  const phone = watch('phone');
  const phoneValid = watch('phoneValid');

  const handlePhoneChange = useCallback(() => {
    if (step === 2) {
      setStep(1);
    }
  }, [step]);

  const phoneValidation = usePhoneValidation({
    getValues,
    setValue,
    trigger,
    phone,
    phoneValid,
    onPhoneChange: handlePhoneChange,
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

  const onValid = useCallback(
    (data: SignUpWithTermsFormInput) => {
      const { firebaseIdToken, firebaseUuid } = phoneValidation.getRegisterPhoneAuth();
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
        ci_value: firebaseUuid ?? '',
        firebase_id_token: firebaseIdToken,
        email: data.email.trim(),
        password: data.password,
      });
    },
    [clearErrors, phoneValidation, registerMutation, setError, t]
  );

  const handleShowTerms = useCallback(() => {}, []);
  const handleNavigateSignIn = useCallback(() => {
    router.push('/signin');
  }, [router]);

  const isBusy = submitting || registerMutation.isPending || phoneValidation.isPhoneBusy;

  const stepHeader =
    step === 1
      ? { title: t('guest.signUp.stepPhoneTitle'), description: t('guest.signUp.stepPhoneDescription') }
      : { title: t('guest.signUp.stepDetailsTitle'), description: t('guest.signUp.stepDetailsDescription') };

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
              />
            ) : (
              <SignUpForm
                control={control}
                onSubmit={handleSubmit(onValid)}
                onPressTerms={handleShowTerms}
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
