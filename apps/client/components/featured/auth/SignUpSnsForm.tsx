import { useTranslation } from '@kakamu/i18n';
import type { SnsSignUpFormInput } from '@kakamu/schema';
import { View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Button, Input, Label, Text } from '@kakamu/ui';

export type SignUpSnsFormValues = SnsSignUpFormInput;

type SignUpSnsFormProps = {
  control: Control<SignUpSnsFormValues>;
  onSubmit: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function SignUpSnsForm({
  control,
  onSubmit,
  submitting = false,
  canSubmit = true,
}: SignUpSnsFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="username"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="signup-sns-username-label" className="text-sm text-muted-foreground">
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
              aria-labelledby="signup-sns-username-label"
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
            <Label nativeID="signup-sns-nickname-label" className="text-sm text-muted-foreground">
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
              aria-labelledby="signup-sns-nickname-label"
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
            <Label nativeID="signup-sns-email-label" className="text-sm text-muted-foreground">
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
              aria-labelledby="signup-sns-email-label"
              className="h-12 rounded-xl"
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
        className="h-12 rounded-xl"
      >
        <Text className="text-base font-bold">{t('guest.form.signUpSns.submit')}</Text>
      </Button>
    </View>
  );
}
