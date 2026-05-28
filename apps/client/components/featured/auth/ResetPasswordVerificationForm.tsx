import { useTranslation } from '@kakamu/i18n';
import type { PhoneValidationFormInput, ResetPasswordEmailFormInput } from '@kakamu/schema';
import { View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Input, Label, Text } from '@kakamu/ui';
import { SignUpPhoneVerificationForm } from './SignUpPhoneVerificationForm';

export type ResetPasswordVerificationFormValues = ResetPasswordEmailFormInput & PhoneValidationFormInput;

type ResetPasswordVerificationFormProps = {
  control: Control<ResetPasswordVerificationFormValues>;
  onSendSms: () => void | Promise<void>;
  onVerifyOtp: (otp: string) => void | Promise<void>;
  onContinue: () => void | Promise<void>;
  smsSending?: boolean;
  otpVerifying?: boolean;
  phoneVerified?: boolean;
  smsError?: string | null;
  otpError?: string | null;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function ResetPasswordVerificationForm({
  control,
  onSendSms,
  onVerifyOtp,
  onContinue,
  smsSending = false,
  otpVerifying = false,
  phoneVerified = false,
  smsError = null,
  otpError = null,
  submitting = false,
  canSubmit = false,
}: ResetPasswordVerificationFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <Controller
        control={control}
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
        control={control}
        onSendSms={onSendSms}
        onVerifyOtp={onVerifyOtp}
        onContinue={onContinue}
        smsSending={smsSending}
        otpVerifying={otpVerifying}
        phoneVerified={phoneVerified}
        smsError={smsError}
        otpError={otpError}
        continuing={submitting}
        canContinue={canSubmit}
      />
    </View>
  );
}
