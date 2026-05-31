import { useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { ChangePasswordFormInput } from '@kakamu/schema';
import { type TextInputProps, View } from 'react-native';
import { Controller, type Control, type FieldPath } from 'react-hook-form';
import { Button, Label, PasswordInput, Text } from '@kakamu/ui';

export type PasswordChangeFormValues = ChangePasswordFormInput;

type PasswordFieldProps = {
  control: Control<PasswordChangeFormValues>;
  name: FieldPath<PasswordChangeFormValues>;
  label: string;
  placeholder: string;
  nativeID: string;
  autoComplete: TextInputProps['autoComplete'];
  textContentType: TextInputProps['textContentType'];
  showAccessibilityLabel: string;
  hideAccessibilityLabel: string;
};

function PasswordField({
  control,
  name,
  label,
  placeholder,
  nativeID,
  autoComplete,
  textContentType,
  showAccessibilityLabel,
  hideAccessibilityLabel,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Label nativeID={nativeID} className="text-sm font-medium text-foreground">
            {label}
          </Label>
          <PasswordInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            textContentType={textContentType}
            aria-labelledby={nativeID}
            passwordAccessibilityLabelHidden={hideAccessibilityLabel}
            passwordAccessibilityLabelShown={showAccessibilityLabel}
          />
          {error?.message ? (
            <Text selectable className="text-sm text-destructive">
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}

type PasswordChangeFormProps = {
  control: Control<PasswordChangeFormValues>;
  onSubmit: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
};

export function PasswordChangeForm({
  control,
  onSubmit,
  submitting = false,
  canSubmit = true,
}: PasswordChangeFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <PasswordField
        control={control}
        name="oldPassword"
        label={t('account.password.form.currentPassword.label')}
        placeholder={t('account.password.form.currentPassword.placeholder')}
        nativeID="change-password-old-password-label"
        autoComplete="current-password"
        textContentType="password"
        showAccessibilityLabel={t('account.password.form.currentPassword.showA11y')}
        hideAccessibilityLabel={t('account.password.form.currentPassword.hideA11y')}
      />

      <PasswordField
        control={control}
        name="newPassword"
        label={t('account.password.form.newPassword.label')}
        placeholder={t('account.password.form.newPassword.placeholder')}
        nativeID="change-password-new-password-label"
        autoComplete="new-password"
        textContentType="newPassword"
        showAccessibilityLabel={t('account.password.form.newPassword.showA11y')}
        hideAccessibilityLabel={t('account.password.form.newPassword.hideA11y')}
      />

      <PasswordField
        control={control}
        name="newPasswordConfirm"
        label={t('account.password.form.newPasswordConfirm.label')}
        placeholder={t('account.password.form.newPasswordConfirm.placeholder')}
        nativeID="change-password-new-password-confirm-label"
        autoComplete="new-password"
        textContentType="newPassword"
        showAccessibilityLabel={t('account.password.form.newPasswordConfirm.showA11y')}
        hideAccessibilityLabel={t('account.password.form.newPasswordConfirm.hideA11y')}
      />

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={submitting || !canSubmit}
        accessibilityRole="button"
        accessibilityLabel={t('account.password.form.submitA11y')}
        className="h-12 rounded-md"
      >
        <Text className="text-sm font-medium">{t('account.password.form.submit')}</Text>
      </Button>
    </View>
  );
}
