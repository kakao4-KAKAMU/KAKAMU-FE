import { useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { Platform, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Button, Input, Label, Text } from '@kakamu/ui';
import { SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID } from '@/hooks/auth';

type SignUpPhoneVerificationFormProps = {
  control: Control<SignUpWithTermsFormInput>;
  onSendSms: () => void | Promise<void>;
  onVerifyOtp: (otp: string) => void | Promise<void>;
  onContinue?: () => void;
  smsSending?: boolean;
  otpVerifying?: boolean;
  phoneVerified?: boolean;
  smsError?: string | null;
  otpError?: string | null;
  continuing?: boolean;
  canContinue?: boolean;
};

export function SignUpPhoneVerificationForm({
  control,
  onSendSms,
  onVerifyOtp,
  onContinue,
  smsSending = false,
  otpVerifying = false,
  phoneVerified = false,
  smsError = null,
  otpError = null,
  continuing = false,
  canContinue = false,
}: SignUpPhoneVerificationFormProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');

  const handleSendSms = async () => {
    await onSendSms();
    setOtp('');
  };

  const handleVerifyOtp = async () => {
    await onVerifyOtp(otp.trim());
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="phone"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-phone-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.phone')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.signUp.phonePlaceholder')}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="tel"
              textContentType="telephoneNumber"
              editable={!phoneVerified}
              aria-labelledby="signup-phone-label"
              className="h-12 rounded-xl"
            />
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
            {smsError ? <Text className="text-sm text-destructive">{smsError}</Text> : null}

            {Platform.OS === 'web' ? (
              <View className="gap-1">
                <Text className="text-xs text-muted-foreground">{t('guest.form.signUp.webRecaptchaHint')}</Text>
                <View
                  {...(Platform.OS === 'web'
                    ? { id: SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID }
                    : { nativeID: SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID })}
                  className="h-px w-full overflow-hidden opacity-0"
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              </View>
            ) : null}

            <View className="flex-row gap-2">
              <Button
                variant="secondary"
                size="default"
                onPress={handleSendSms}
                disabled={smsSending || phoneVerified || continuing}
                className="shrink rounded-xl"
              >
                <Text className="text-sm font-semibold">
                  {smsSending ? t('guest.form.signUp.smsSending') : t('guest.form.signUp.sendSms')}
                </Text>
              </Button>
            </View>

            {!phoneVerified ? (
              <View className="gap-2">
                <Label nativeID="signup-otp-label" className="text-sm text-muted-foreground">
                  {t('guest.form.signUp.otpLabel')}
                </Label>
                <Input
                  value={otp}
                  onChangeText={setOtp}
                  placeholder={t('guest.form.signUp.otpPlaceholder')}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="oneTimeCode"
                  aria-labelledby="signup-otp-label"
                  className="h-12 rounded-xl"
                />
                {otpError ? <Text className="text-sm text-destructive">{otpError}</Text> : null}
                <Button
                  variant="secondary"
                  size="default"
                  onPress={handleVerifyOtp}
                  disabled={otpVerifying || otp.trim().length < 4 || continuing}
                  className="self-start rounded-xl"
                >
                  <Text className="text-sm font-semibold">
                    {otpVerifying ? t('guest.form.signUp.otpVerifying') : t('guest.form.signUp.verifyOtp')}
                  </Text>
                </Button>
              </View>
            ) : (
              <Text className="text-sm text-emerald-600 dark:text-emerald-400">
                {t('guest.form.signUp.phoneVerified')}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="phoneValid"
        render={({ fieldState: { error } }) =>
          error?.message ? (
            <Text className="text-sm text-destructive">{error.message}</Text>
          ) : <></>
        }
      />

      {onContinue ? (
        <Button
          variant="default"
          size="lg"
          onPress={onContinue}
          disabled={continuing || !canContinue}
          accessibilityRole="button"
          className="h-12 rounded-xl"
        >
          <Text className="text-base font-bold">{t('guest.form.signUp.continue')}</Text>
        </Button>
      ) : null}
    </View>
  );
}
