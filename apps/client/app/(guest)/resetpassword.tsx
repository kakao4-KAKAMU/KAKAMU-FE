import { useTranslation } from '@kakamu/i18n';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Text } from '@kakamu/ui';
import {
  AuthHeader,
  ResetPasswordForm,
  ResetPasswordVerificationForm,
} from '@/components/featured/auth';
import { useResetPasswordFlow } from '@/hooks/auth';
import { useCallback } from 'react';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    step,
    stepHeader,
    step1Form,
    step2Form,
    phoneValidation,
    handleContinueToReset,
    handleResetPassword,
    isBusy,
    resetPasswordMutation,
  } = useResetPasswordFlow({
    t,
    onResetCompleted: () => router.replace('./signin'),
  });

  const handleBackToSignIn = useCallback(() => {
      router.replace('./signin');
    },
    [router],
  );

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
                onSubmit={handleContinueToReset}
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
              <Button
                variant='text'
                size='text'
                accessibilityRole="link"
                onPress={handleBackToSignIn}
              >
                <Text className="text-sm font-normal text-muted-foreground text-center">
                  {t('guest.resetPassword.backToSignIn')}
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
