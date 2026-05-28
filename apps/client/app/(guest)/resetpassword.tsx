import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import { useUserPhoneVerificationMutation, useUserResetPasswordMutation } from '@kakamu/query';
import type {
  ResetPasswordEmailFormInput,
  PhoneValidationFormInput,
  ResetPasswordFormInput,
} from '@kakamu/schema';
import { Stack, useRouter } from 'expo-router';
import { useErrorAlertDialog } from '@kakamu/ui';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Text } from '@kakamu/ui';
import {
  AuthHeader,
  ResetPasswordForm,
  ResetPasswordVerificationForm,
} from '@/components/featured/auth';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { firebaseSignOut, usePhoneValidation } from '@/hooks/auth';
import { parseApiError } from '@/lib/auth/parse-api-error';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

type Step1Values = ResetPasswordEmailFormInput & PhoneValidationFormInput;
type ResetPasswordStep = 1 | 2;

const STEP1_DEFAULT_VALUES: Step1Values = {
  email: '',
  phone: '',
  phoneValid: false,
};

const STEP2_DEFAULT_VALUES: ResetPasswordFormInput = {
  password: '',
  passwordConfirm: '',
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const apiClient = useBackendApiClient();
  const { t } = useTranslation();
  const authForms = useAuthFormValidationKit(t);
  const { open: openErrorAlert } = useErrorAlertDialog();

  const step1Resolver = useMemo(
    () => zodResolver(authForms.resetPasswordEmail.merge(authForms.phoneValidation)),
    [authForms.resetPasswordEmail, authForms.phoneValidation]
  );
  const step2Resolver = useMemo(() => zodResolver(authForms.resetPassword), [authForms.resetPassword]);

  const step1Form = useForm<Step1Values>({
    resolver: step1Resolver,
    defaultValues: STEP1_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const step2Form = useForm<ResetPasswordFormInput>({
    resolver: step2Resolver,
    defaultValues: STEP2_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [step, setStep] = useState<ResetPasswordStep>(1);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verifiedFirebaseIdToken, setVerifiedFirebaseIdToken] = useState<string | null>(null);

  const phone = step1Form.watch('phone');
  const phoneValid = step1Form.watch('phoneValid');

  const handlePhoneChange = useCallback(() => {
    if (step === 2) {
      setStep(1);
      setVerifiedEmail(null);
      setVerifiedFirebaseIdToken(null);
      step2Form.reset(STEP2_DEFAULT_VALUES);
    }
  }, [step, step2Form]);

  const phoneValidation = usePhoneValidation({
    getPhone: () => step1Form.getValues('phone'),
    setPhoneValid: (value) => step1Form.setValue('phoneValid', value),
    triggerPhone: () => step1Form.trigger('phone'),
    triggerPhoneStep: () => step1Form.trigger(['phone', 'phoneValid']),
    phone,
    phoneValid,
    onPhoneChange: handlePhoneChange,
  });

  const handleBackToSignIn = useCallback(() => {
    router.replace('/signin');
  }, [router]);

  const phoneVerificationMutation = useUserPhoneVerificationMutation(apiClient, {
    onSuccess: (_, variables) => {
      setVerifiedEmail(variables.email);
      setVerifiedFirebaseIdToken(variables.firebase_id_token);
      setStep(2);
    },
    onError: (err) => {
      const fallback = t('guest.resetPassword.error.default.description');
      let title = t('guest.resetPassword.error.default.title');
      let { message, code: errorCode } = parseApiError(err, fallback);

      if (errorCode === 'USER_NOT_FOUND') {
        title = t('guest.resetPassword.error.USER_NOT_FOUND.title');
        message = t('guest.resetPassword.error.USER_NOT_FOUND.description');
      }

      openErrorAlert({ title, description: message });
    },
  });

  const resetPasswordMutation = useUserResetPasswordMutation(apiClient, {
    onSuccess: () => {
      router.replace('/signin');
    },
    onError: (err) => {
      const fallback = t('guest.resetPassword.error.default.description');
      let title = t('guest.resetPassword.error.default.title');
      let { message, code: errorCode } = parseApiError(err, fallback);

      switch (errorCode) {
        case 'USER_NOT_FOUND':
          title = t('guest.resetPassword.error.USER_NOT_FOUND.title');
          message = t('guest.resetPassword.error.USER_NOT_FOUND.description');
          break;
        case 'INVALID_FIREBASE_TOKEN':
          title = t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.title');
          message = t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.description');
          break;
        case 'AUTH_MISMATCH':
          title = t('guest.resetPassword.error.AUTH_MISMATCH.title');
          message = t('guest.resetPassword.error.AUTH_MISMATCH.description');
          break;
      }

      openErrorAlert({ title, description: message });
    },
    onSettled: async () => {
      await firebaseSignOut(phoneValidation.firebasePhoneDepsRef ?? undefined);
    },
  });

  const handleContinueToReset = useCallback(async () => {
    const phoneStepOk = await phoneValidation.validatePhoneStep();
    if (!phoneStepOk) {
      return;
    }

    const emailOk = await step1Form.trigger('email');
    if (!emailOk) {
      return;
    }

    const { firebaseIdToken } = phoneValidation.getRegisterPhoneAuth();
    if (!firebaseIdToken) {
      step1Form.setError('root', {
        type: 'manual',
        message: t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.description'),
      });
      setStep(1);
      return;
    }

    step1Form.clearErrors('root');
    phoneVerificationMutation.mutate({
      email: step1Form.getValues('email').trim(),
      firebase_id_token: firebaseIdToken,
    });
  }, [phoneValidation, step1Form, t, phoneVerificationMutation]);

  const handleResetPassword = useCallback(
    (values: ResetPasswordFormInput) => {
      if (!verifiedEmail || !verifiedFirebaseIdToken) {
        setStep(1);
        return;
      }
      resetPasswordMutation.mutate({
        email: verifiedEmail.trim(),
        firebase_id_token: verifiedFirebaseIdToken,
        password: values.password,
      });
    },
    [
      resetPasswordMutation,
      verifiedEmail,
      verifiedFirebaseIdToken,
    ]
  );

  const isBusy =
    phoneValidation.isPhoneBusy || phoneVerificationMutation.isPending || resetPasswordMutation.isPending;
  const stepHeader =
    step === 1
      ? { title: t('guest.resetPassword.step1Title'), description: t('guest.resetPassword.step1Description') }
      : { title: t('guest.resetPassword.step2Title'), description: t('guest.resetPassword.step2Description') };

  return (
    <>
      <Stack.Screen options={{ title: t('guest.layout.resetPassword') }} />
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
              <ResetPasswordVerificationForm
                control={step1Form.control}
                onSendSms={phoneValidation.sendSms}
                onVerifyOtp={phoneValidation.verifyOtp}
                onContinue={handleContinueToReset}
                smsSending={phoneValidation.smsSending}
                otpVerifying={phoneValidation.otpVerifying}
                phoneVerified={phoneValidation.phoneVerified}
                smsError={phoneValidation.smsError}
                otpError={phoneValidation.otpError}
                submitting={isBusy}
                canSubmit={phoneValidation.phoneVerified}
              />
            ) : (
              <ResetPasswordForm
                control={step2Form.control}
                onSubmit={step2Form.handleSubmit(handleResetPassword)}
                submitting={resetPasswordMutation.isPending}
                canSubmit={step2Form.formState.isValid && !resetPasswordMutation.isPending}
              />
            )}

            <View className="items-center">
              <Pressable
                accessibilityRole="link"
                onPress={handleBackToSignIn}
                hitSlop={8}
                className="active:opacity-70"
              >
                <Text className="text-sm font-normal text-muted-foreground text-center">
                  {t('guest.resetPassword.backToSignIn')}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
