import { useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { Pressable, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Controller, type Control } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Label,
  Text,
  TextClassProvider,
} from '@kakamu/ui';

export type SignUpFormValues = SignUpWithTermsFormInput;

type SignUpFormProps = {
  control: Control<SignUpFormValues>;
  onSubmit: () => void;
  onPressTerms?: () => void;
  onBack?: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function SignUpForm({
  control,
  onSubmit,
  onPressTerms,
  onBack,
  submitting = false,
  canSubmit = true,
}: SignUpFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
                <TextClassProvider value="text-muted-foreground">
                  <Icon as={showPassword ? EyeOff : Eye} size={18} />
                </TextClassProvider>
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
                <TextClassProvider value="text-muted-foreground">
                  <Icon as={showPasswordConfirm ? EyeOff : Eye} size={18} />
                </TextClassProvider>
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

      <View className="flex-row gap-2">
        {onBack ? (
          <Button
            variant="secondary"
            size="lg"
            onPress={onBack}
            disabled={submitting}
            accessibilityRole="button"
            className="h-12 flex-1 rounded-xl"
          >
            <Text className="text-base font-bold">{t('guest.form.signUp.back')}</Text>
          </Button>
        ) : null}
        <Button
          variant="default"
          size="lg"
          onPress={onSubmit}
          disabled={submitting || !canSubmit}
          accessibilityRole="button"
          className={`h-12 rounded-xl ${onBack ? 'flex-1' : ''}`}
        >
          <Text className="text-base font-bold">{t('guest.form.signUp.submit')}</Text>
        </Button>
      </View>
    </View>
  );
}
