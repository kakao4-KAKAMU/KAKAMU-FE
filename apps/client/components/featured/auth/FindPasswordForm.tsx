import { useTranslation } from '@kakamu/i18n';
import type { FindPasswordFormInput } from '@kakamu/schema';
import { View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Button, Input, Label, Text } from '@kakamu/ui';

export type FindPasswordFormValues = FindPasswordFormInput;

type FindPasswordFormProps = {
  control: Control<FindPasswordFormValues>;
  onSubmit: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function FindPasswordForm({
  control,
  onSubmit,
  submitting = false,
  canSubmit = true,
}: FindPasswordFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-3.5">
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-1.5">
            <Label nativeID="findpassword-email-label" className="text-sm font-medium text-foreground">
              {t('guest.form.findPassword.email')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('guest.form.findPassword.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              aria-labelledby="findpassword-email-label"
              className="h-12 rounded-md"
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
        <Text className="text-sm font-medium">{t('guest.form.findPassword.submit')}</Text>
      </Button>
    </View>
  );
}
