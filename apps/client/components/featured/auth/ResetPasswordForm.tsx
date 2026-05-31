import { useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { ResetPasswordFormInput } from '@kakamu/schema';
import { Pressable, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Controller, type Control } from 'react-hook-form';
import {
  Button,
  Icon,
  Input,
  Label,
  PasswordInput,
  Text,
  TextClassProvider,
} from '@kakamu/ui';

export type ResetPasswordFormValues = ResetPasswordFormInput;

type ResetPasswordFormProps = {
  control: Control<ResetPasswordFormValues>;
  onSubmit: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function ResetPasswordForm({
  control,
  onSubmit,
  submitting = false,
  canSubmit = true,
}: ResetPasswordFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-3.5">
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-1.5">
            <Label nativeID="reset-password-label" className="text-sm font-medium text-foreground">
              {t('guest.form.reset.newPassword')}
            </Label>
            <PasswordInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.reset.passwordPlaceholder')}
              autoComplete="new-password"
              aria-labelledby="reset-password-label"
              passwordAccessibilityLabelHidden={t('guest.form.reset.a11yHidePassword')}
              passwordAccessibilityLabelShown={t('guest.form.reset.a11yShowPassword')}
            />
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
          <View className="gap-1.5">
            <Label
              nativeID="reset-password-confirm-label"
              className="text-sm font-medium text-foreground"
            >
              {t('guest.form.reset.newPasswordConfirm')}
            </Label>
            <PasswordInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.reset.passwordConfirmPlaceholder')}
              autoComplete="new-password"
              aria-labelledby="reset-password-confirm-label"
              passwordAccessibilityLabelHidden={t('guest.form.reset.a11yHidePasswordConfirm')}
              passwordAccessibilityLabelShown={t('guest.form.reset.a11yShowPasswordConfirm')}
            />
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
        className="h-12 rounded-md"
      >
        <Text className="text-sm font-medium">{t('guest.form.reset.submit')}</Text>
      </Button>
    </View>
  );
}
