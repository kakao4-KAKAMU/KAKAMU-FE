import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { useRegisterUserMutation } from '@kakamu/query';
import { Stack, useRouter } from 'expo-router';
import { HTTPError } from 'ky';
import { useErrorAlertDialog } from '@kakamu/ui';
import type { RecaptchaVerifier } from 'firebase/auth';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  AuthHeader,
  SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID,
  SignUpForm,
  SignUpPhoneVerificationForm,
  SignUpPrompt,
  type SignUpFormValues,
} from '@/components/featured/auth';
import {
  confirmPhoneSignInCode,
  ensureFirebaseInitialized,
  getFirebaseWebAppOrNull,
  sendPhoneSignInSms,
  type PhoneSignInConfirmation,
} from '@/hooks/firebase';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { getFirebaseIdTokenFromPhoneCredential } from '@/lib/firebase-phone-id-token';
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

  const confirmationRef = useRef<PhoneSignInConfirmation | null>(null);
  const firebaseIdTokenRef = useRef<string | null>(null);
  const firebaseUuidRef = useRef<string | null>(null);
  const prevPhoneRef = useRef<string>(DEFAULT_VALUES.phone);

  const { control, handleSubmit, formState, getValues, setValue, trigger, setError, clearErrors, watch } =
    useForm<SignUpWithTermsFormInput>({
      resolver,
      defaultValues: DEFAULT_VALUES,
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
    });

  const [step, setStep] = useState<SignUpStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const phone = watch('phone');
  const phoneValid = watch('phoneValid');

  useEffect(() => {
    if (prevPhoneRef.current === phone) {
      return;
    }
    prevPhoneRef.current = phone;
    confirmationRef.current = null;
    firebaseIdTokenRef.current = null;
    setValue('phoneValid', false);
    void trigger('phoneValid');
    setSmsError(null);
    setOtpError(null);
    if (step === 2) {
      setStep(1);
    }
  }, [phone, setValue, step, trigger]);

  const handleSendSms = useCallback(async () => {
    setSmsError(null);
    setOtpError(null);
    const ok = await trigger('phone');
    if (!ok) {
      return;
    }
    const phoneE164 = getValues('phone').trim();
    setSmsSending(true);
    let verifier: RecaptchaVerifier | null = null;
    try {
      await ensureFirebaseInitialized();
      if (Platform.OS === 'web') {
        const app = await getFirebaseWebAppOrNull();
        if (!app) {
          throw new Error('[firebase] 웹 앱 초기화에 실패했습니다.');
        }
        const { createWebPhoneRecaptchaVerifier } = await import('@/hooks/firebase/phoneAuthWeb');
        verifier = createWebPhoneRecaptchaVerifier(app, SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID);
        const confirmation = await sendPhoneSignInSms(phoneE164, { app, appVerifier: verifier });
        confirmationRef.current = confirmation;
      } else {
        const confirmation = await sendPhoneSignInSms(phoneE164);
        confirmationRef.current = confirmation;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setSmsError(t('guest.form.signUp.smsError'));
      if (__DEV__) {
        console.warn('[signup] sendSms', message);
      }
      if (verifier) {
        verifier.clear();
      }
    } finally {
      setSmsSending(false);
    }
  }, [getValues, trigger, t]);

  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      setOtpError(null);
      const confirmation = confirmationRef.current;
      if (!confirmation) {
        setOtpError(t('guest.form.signUp.smsError'));
        return;
      }
      setOtpVerifying(true);
      try {
        const credential = await confirmPhoneSignInCode(confirmation, otp);
        const idToken = await getFirebaseIdTokenFromPhoneCredential(credential);

        firebaseUuidRef.current = (credential as { user: { uid: string } }).user.uid ?? null;
        firebaseIdTokenRef.current = idToken;
        setValue('phoneValid', true);
        await trigger(['phone', 'phoneValid']);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setOtpError(t('guest.form.signUp.otpError'));
        if (__DEV__) {
          console.warn('[signup] verifyOtp', message);
        }
      } finally {
        setOtpVerifying(false);
      }
    },
    [setValue, trigger, t]
  );

  const handleContinueToDetails = useCallback(async () => {
    const ok = await trigger(['phone', 'phoneValid']);
    if (ok && phoneValid === true) {
      setStep(2);
    }
  }, [phoneValid, trigger]);

  const handleBackToPhone = useCallback(() => {
    setStep(1);
  }, []);

  const onValid = useCallback(
    (data: SignUpWithTermsFormInput) => {
      const firebaseIdToken = firebaseIdTokenRef.current;
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
        ci_value: firebaseUuidRef.current ?? '',
        firebase_id_token: firebaseIdToken,
        email: data.email.trim(),
        password: data.password,
      });
    },
    [clearErrors, registerMutation, setError, t]
  );

  const handleShowTerms = useCallback(() => {}, []);
  const handleKakaoSignUp = useCallback(() => {}, []);
  const handleGoogleSignUp = useCallback(() => {}, []);
  const handleNavigateSignIn = useCallback(() => {
    router.push('/signin');
  }, [router]);

  const isBusy = submitting || registerMutation.isPending || smsSending || otpVerifying;

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
              <>
                <SignUpPhoneVerificationForm
                  control={control}
                  onSendSms={handleSendSms}
                  onVerifyOtp={handleVerifyOtp}
                  onContinue={handleContinueToDetails}
                  smsSending={smsSending}
                  otpVerifying={otpVerifying}
                  phoneVerified={phoneValid === true}
                  smsError={smsError}
                  otpError={otpError}
                  continuing={isBusy}
                  canContinue={phoneValid === true}
                />
              </>
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
