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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
            <View className="relative">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('guest.form.reset.passwordPlaceholder')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                aria-labelledby="reset-password-label"
                className="h-12 rounded-md pr-12"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? t('guest.form.reset.a11yHidePassword') : t('guest.form.reset.a11yShowPassword')
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
          <View className="gap-1.5">
            <Label
              nativeID="reset-password-confirm-label"
              className="text-sm font-medium text-foreground"
            >
              {t('guest.form.reset.newPasswordConfirm')}
            </Label>
            <View className="relative">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('guest.form.reset.passwordConfirmPlaceholder')}
                secureTextEntry={!showPasswordConfirm}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                aria-labelledby="reset-password-confirm-label"
                className="h-12 rounded-md pr-12"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPasswordConfirm
                    ? t('guest.form.reset.a11yHidePasswordConfirm')
                    : t('guest.form.reset.a11yShowPasswordConfirm')
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
