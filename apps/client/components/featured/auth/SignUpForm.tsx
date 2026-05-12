import { useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { Platform, Pressable, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Controller, type Control } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Label,
  Text,
  TextClassContext,
} from '@kakamu/ui';

/** 웹 전화 인증용 DOM 컨테이너 id — `createWebPhoneRecaptchaVerifier` 와 동일해야 합니다 */
export const SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID = 'signup-phone-recaptcha';

export type SignUpFormValues = SignUpWithTermsFormInput;

type SignUpFormProps = {
  control: Control<SignUpFormValues>;
  onSubmit: () => void;
  onPressTerms?: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
  onSendSms: () => void | Promise<void>;
  onVerifyOtp: (otp: string) => void | Promise<void>;
  smsSending?: boolean;
  otpVerifying?: boolean;
  phoneVerified?: boolean;
  smsError?: string | null;
  otpError?: string | null;
};

export function SignUpForm({
  control,
  onSubmit,
  onPressTerms,
  submitting = false,
  canSubmit = true,
  onSendSms,
  onVerifyOtp,
  smsSending = false,
  otpVerifying = false,
  phoneVerified = false,
  smsError = null,
  otpError = null,
}: SignUpFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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
        name="username"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-username-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.username')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.signUp.usernamePlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              aria-labelledby="signup-username-label"
              className="h-12 rounded-xl"
            />
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

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
                  // Firebase `RecaptchaVerifier` 는 `document.getElementById` 사용 — 웹에서 `id` 필요
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
                disabled={smsSending || phoneVerified || submitting}
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
                  disabled={otpVerifying || otp.trim().length < 4}
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
        render={({ fieldState: { error } }) => (
          <View>
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="nickname"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-nickname-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.nickname')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.signUp.nicknamePlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="nickname"
              aria-labelledby="signup-nickname-label"
              className="h-12 rounded-xl"
            />
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-email-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.email')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.signUp.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              aria-labelledby="signup-email-label"
              className="h-12 rounded-xl"
            />
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-password-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.password')}
            </Label>
            <View className="relative">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('guest.form.signUp.passwordPlaceholder')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                aria-labelledby="signup-password-label"
                className="h-12 rounded-xl pr-12"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? t('guest.form.signUp.a11yHidePassword') : t('guest.form.signUp.a11yShowPassword')
                }
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
                className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
              >
                <TextClassContext.Provider value="text-muted-foreground">
                  <Icon as={showPassword ? EyeOff : Eye} size={18} />
                </TextClassContext.Provider>
              </Pressable>
            </View>
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="passwordConfirm"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-password-confirm-label" className="text-sm text-muted-foreground">
              {t('guest.form.signUp.passwordConfirm')}
            </Label>
            <View className="relative">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('guest.form.signUp.passwordConfirmPlaceholder')}
                secureTextEntry={!showPasswordConfirm}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                aria-labelledby="signup-password-confirm-label"
                className="h-12 rounded-xl pr-12"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPasswordConfirm
                    ? t('guest.form.signUp.a11yHidePasswordConfirm')
                    : t('guest.form.signUp.a11yShowPasswordConfirm')
                }
                onPress={() => setShowPasswordConfirm((prev) => !prev)}
                hitSlop={8}
                className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
              >
                <TextClassContext.Provider value="text-muted-foreground">
                  <Icon as={showPasswordConfirm ? EyeOff : Eye} size={18} />
                </TextClassContext.Provider>
              </Pressable>
            </View>
            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="agreedToTerms"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View className="gap-3">
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: value }}
              onPress={() => onChange(!value)}
              hitSlop={8}
              className="flex-row items-start gap-2 active:opacity-70"
            >
              <Checkbox checked={value} onCheckedChange={(checked) => onChange(checked === true)} />
              <View className="shrink">
                <Text className="text-sm text-muted-foreground leading-5">
                  {t('guest.form.signUp.termsAgreement')}
                </Text>
                <Pressable
                  accessibilityRole="link"
                  onPress={onPressTerms}
                  hitSlop={8}
                  className="self-start mt-1 active:opacity-70"
                >
                  <Text className="text-sm font-semibold text-foreground">
                    {t('guest.form.signUp.viewTerms')}
                  </Text>
                </Pressable>
              </View>
            </Pressable>

            {error?.message ? (
              <Text className="text-sm text-destructive">{error.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={submitting || !canSubmit}
        accessibilityRole="button"
        className="h-12 rounded-xl"
      >
        <Text className="text-base font-bold">{t('guest.form.signUp.submit')}</Text>
      </Button>
    </View>
  );
}
