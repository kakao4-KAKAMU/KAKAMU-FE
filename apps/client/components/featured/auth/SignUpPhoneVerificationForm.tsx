import { useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { PhoneValidationFormInput } from '@kakamu/schema';
import { Platform, View } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Button, Input, Label, Text } from '@kakamu/ui';
import { SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID } from '@/hooks/auth';
import { ConditionalRender } from '@/components/utils';

type SignUpPhoneVerificationFormProps<TFieldValues extends FieldValues & PhoneValidationFormInput> = {
  control: Control<TFieldValues>;
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
  recaptchaContainerId?: string
};

export function SignUpPhoneVerificationForm<TFieldValues extends FieldValues & PhoneValidationFormInput>({
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
  recaptchaContainerId = SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID,
}: SignUpPhoneVerificationFormProps<TFieldValues>) {
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
        name={'phone' as Path<TFieldValues>}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-phone-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.phone')}
            </Label>
            <View className="flex-row gap-2">
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
                className="rounded-xl h-11"
              />
              <Button
                variant="secondary"
                size="lg"
                onPress={handleSendSms}
                disabled={smsSending || phoneVerified || continuing}
                className="rounded-xl"
              >
                <Text className="text-sm font-semibold">
                  {smsSending ? t('guest.form.signUp.smsSending') : t('guest.form.signUp.sendSms')}
                </Text>
              </Button>
            </View>
            <ConditionalRender.Boolean
              condition={error?.message}
              render={{
                true: <Text className="text-sm text-destructive">{error?.message}</Text>
              }}
            />
            <ConditionalRender.Boolean
              condition={smsError}
              render={{
                true: <Text className="text-sm text-destructive">{smsError}</Text>
              }}
            />

            <View className="gap-1">
              <Text className="text-xs text-muted-foreground">{t('guest.form.signUp.webRecaptchaHint')}</Text>
              <View
                {...(Platform.OS === 'web'
                  ? { id: recaptchaContainerId }
                  : { nativeID: recaptchaContainerId })}
                className="h-px w-full overflow-hidden opacity-0"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
            </View>

            <ConditionalRender.Boolean
              condition={phoneVerified}
              render={{
                true: <Text className="text-sm text-emerald-600 dark:text-emerald-400">
                  {t('guest.form.signUp.phoneVerified')}
                </Text>,
                false: <View className="gap-2">
                  <Label nativeID="signup-otp-label" className="text-sm text-muted-foreground">
                    {t('guest.form.signUp.otpLabel')}
                  </Label>
                  <View className="flex-row gap-2">
                    <Input
                      value={otp}
                      onChangeText={setOtp}
                      placeholder={t('guest.form.signUp.otpPlaceholder')}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="oneTimeCode"
                      aria-labelledby="signup-otp-label"
                      className="h-11 rounded-xl"
                    />
                    <Button
                      variant="secondary"
                      size="lg"
                      onPress={handleVerifyOtp}
                      disabled={otpVerifying || otp.trim().length < 4 || continuing}
                      className="self-start rounded-xl"
                    >
                      <Text className="text-sm font-semibold">
                        {otpVerifying ? t('guest.form.signUp.otpVerifying') : t('guest.form.signUp.verifyOtp')}
                      </Text>
                    </Button>
                  </View>
                  <ConditionalRender.Boolean
                    condition={otpError}
                    render={{
                      true: <Text className="text-sm text-destructive">{otpError}</Text>
                    }}
                  />
                </View>
              }}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name={'phoneValid' as Path<TFieldValues>}
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
