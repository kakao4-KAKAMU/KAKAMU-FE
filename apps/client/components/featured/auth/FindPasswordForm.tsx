import { useCallback, useMemo } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { View } from 'react-native';
import { Button, Input, Label, Text } from '@kakamu/ui';

type FindPasswordFormValues = {
  email: string;
};

type FindPasswordFormProps = {
  values: FindPasswordFormValues;
  onChange: (values: FindPasswordFormValues) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export function FindPasswordForm({
  values,
  onChange,
  onSubmit,
  submitting = false,
}: FindPasswordFormProps) {
  const { t } = useTranslation();
  const isSubmitDisabled = useMemo(() => {
    return submitting || !values.email.trim();
  }, [submitting, values.email]);

  const handleEmailChange = useCallback(
    (email: string) => onChange({ ...values, email }),
    [onChange, values]
  );

  return (
    <View className="gap-3.5">
      <View className="gap-1.5">
        <Label nativeID="findpassword-email-label" className="text-sm font-medium text-foreground">
          {t('guest.form.findPassword.email')}
        </Label>
        <Input
          value={values.email}
          onChangeText={handleEmailChange}
          placeholder={t('guest.form.findPassword.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          aria-labelledby="findpassword-email-label"
          className="h-12 rounded-md"
        />
      </View>

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={isSubmitDisabled}
        accessibilityRole="button"
        className="h-12 rounded-md"
      >
        <Text className="text-sm font-medium">{t('guest.form.findPassword.submit')}</Text>
      </Button>
    </View>
  );
}

export type { FindPasswordFormValues };
