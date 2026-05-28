import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type {
  ResetPasswordEmailFormInput,
  PhoneValidationFormInput,
  ResetPasswordFormInput,
} from '@kakamu/schema';
import { Stack, useRouter } from 'expo-router';
import { useErrorAlertDialog } from '@kakamu/ui';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Input, Label, Text } from '@kakamu/ui';
import { AuthHeader, ResetPasswordForm, SignUpPhoneVerificationForm } from '@/components/featured/auth';
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
  const [submitting, setSubmitting] = useState(false);
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
      step1Form.setError('root', { type: 'manual', message: t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.description') });
      return;
    }

    setSubmitting(true);
    step1Form.clearErrors('root');

    try {
      const email = step1Form.getValues('email').trim();
      await apiClient.post('users/local/phone-verification', {
        json: {
          email,
          firebase_id_token: firebaseIdToken,
        },
      });

      setVerifiedEmail(email);
      setVerifiedFirebaseIdToken(firebaseIdToken);
      setStep(2);
    } catch (err) {
      const fallback = t('guest.resetPassword.error.default.description');
      let title = t('guest.resetPassword.error.default.title');
      let { message, code: errorCode } = parseApiError(err, fallback);

      if (errorCode === 'USER_NOT_FOUND') {
        title = t('guest.resetPassword.error.USER_NOT_FOUND.title');
        message = t('guest.resetPassword.error.USER_NOT_FOUND.description');
      }

      openErrorAlert({ title, description: message });
    } finally {
      setSubmitting(false);
    }
  }, [apiClient, openErrorAlert, phoneValidation, step1Form, t]);

  const handleResetPassword = useCallback(
    async (values: ResetPasswordFormInput) => {
      if (!verifiedEmail || !verifiedFirebaseIdToken) {
        setStep(1);
        return;
      }

      setSubmitting(true);
      try {
        await apiClient.post('users/local/reset-password', {
          json: {
            email: verifiedEmail,
            firebase_id_token: verifiedFirebaseIdToken,
            password: values.password,
          },
        });
        router.replace('/signin');
      } catch (err) {
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
      } finally {
        setSubmitting(false);
        await firebaseSignOut(phoneValidation.firebasePhoneDepsRef ?? undefined);
      }
    },
    [
      apiClient,
      openErrorAlert,
      phoneValidation.firebasePhoneDepsRef,
      router,
      t,
      verifiedEmail,
      verifiedFirebaseIdToken,
    ]
  );

  const isBusy = submitting || phoneValidation.isPhoneBusy;
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
              <View className="gap-4">
                <Controller
                  control={step1Form.control}
                  name="email"
                  render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <View className="gap-1.5">
                      <Label nativeID="resetpassword-email-label" className="text-sm font-medium text-foreground">
                        {t('guest.resetPassword.emailLabel')}
                      </Label>
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('guest.resetPassword.emailPlaceholder')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        aria-labelledby="resetpassword-email-label"
                        className="h-12 rounded-md"
                      />
                      {error?.message ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
                    </View>
                  )}
                />

                <SignUpPhoneVerificationForm
                  control={step1Form.control}
                  onSendSms={phoneValidation.sendSms}
                  onVerifyOtp={phoneValidation.verifyOtp}
                  onContinue={handleContinueToReset}
                  smsSending={phoneValidation.smsSending}
                  otpVerifying={phoneValidation.otpVerifying}
                  phoneVerified={phoneValidation.phoneVerified}
                  smsError={phoneValidation.smsError}
                  otpError={phoneValidation.otpError}
                  continuing={isBusy}
                  canContinue={phoneValidation.phoneVerified}
                />
              </View>
            ) : (
              <ResetPasswordForm
                control={step2Form.control}
                onSubmit={step2Form.handleSubmit(handleResetPassword)}
                submitting={submitting}
                canSubmit={step2Form.formState.isValid}
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
