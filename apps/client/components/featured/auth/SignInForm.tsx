import { useCallback, useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { SignInWithRememberFormInput } from '@kakamu/schema';
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
  TextClassContext,
} from '@kakamu/ui';

export type SignInFormValues = SignInWithRememberFormInput;

type SignInFormProps = {
  control: Control<SignInFormValues>;
  onSubmit: () => void;
  onForgotPassword?: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function SignInForm({
  control,
  onSubmit,
  onForgotPassword,
  submitting = false,
  canSubmit = true,
}: SignInFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signin-email-label" className="text-sm text-muted-foreground">
              {t('guest.form.signIn.email')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.signIn.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              aria-labelledby="signin-email-label"
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
            <Label nativeID="signin-password-label" className="text-sm text-muted-foreground">
              {t('guest.form.signIn.password')}
            </Label>
            <View className="relative">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('guest.form.signIn.passwordPlaceholder')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                aria-labelledby="signin-password-label"
                className="h-12 rounded-xl pr-12"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? t('guest.form.signIn.a11yHidePassword') : t('guest.form.signIn.a11yShowPassword')
                }
                onPress={togglePasswordVisibility}
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
        name="rememberMe"
        render={({ field: { value, onChange } }) => (
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: value }}
              onPress={() => onChange(!value)}
              hitSlop={8}
              className="flex-row items-center gap-2 active:opacity-70"
            >
              <Checkbox
                checked={value}
                onCheckedChange={(checked) => onChange(checked === true)}
              />
              <Text className="text-sm text-muted-foreground">{t('guest.form.signIn.rememberMe')}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="link"
              onPress={onForgotPassword}
              hitSlop={8}
              className="active:opacity-70"
            >
              <Text className="text-sm font-semibold text-foreground">
                {t('guest.form.signIn.forgotPassword')}
              </Text>
            </Pressable>
          </View>
        )}
      />

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={submitting || !canSubmit}
        accessibilityRole="button"
        className="h-12 rounded-xl mt-1"
      >
        <Text className="text-base font-bold">{t('guest.form.signIn.submit')}</Text>
      </Button>
    </View>
  );
}
