import { useState } from 'react';
import type { ChangePasswordFormInput } from '@kakamu/schema';
import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable, type TextInputProps, View } from 'react-native';
import { Controller, type Control, type FieldPath } from 'react-hook-form';
import { Button, Icon, Input, Label, Text, TextClassContext } from '@kakamu/ui';

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
          <View className="relative">
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={!visible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={autoComplete}
              textContentType={textContentType}
              aria-labelledby={nativeID}
              className="h-12 rounded-md pr-12"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={visible ? hideAccessibilityLabel : showAccessibilityLabel}
              onPress={() => setVisible((prev) => !prev)}
              hitSlop={8}
              className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
            >
              <TextClassContext.Provider value="text-muted-foreground">
                <Icon as={visible ? EyeOff : Eye} size={18} />
              </TextClassContext.Provider>
            </Pressable>
          </View>
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
  return (
    <View className="gap-4">
      <PasswordField
        control={control}
        name="oldPassword"
        label="현재 비밀번호"
        placeholder="현재 비밀번호를 입력하세요"
        nativeID="change-password-old-password-label"
        autoComplete="current-password"
        textContentType="password"
        showAccessibilityLabel="현재 비밀번호 보이기"
        hideAccessibilityLabel="현재 비밀번호 숨기기"
      />

      <PasswordField
        control={control}
        name="newPassword"
        label="새 비밀번호"
        placeholder="새 비밀번호를 입력하세요"
        nativeID="change-password-new-password-label"
        autoComplete="new-password"
        textContentType="newPassword"
        showAccessibilityLabel="새 비밀번호 보이기"
        hideAccessibilityLabel="새 비밀번호 숨기기"
      />

      <PasswordField
        control={control}
        name="newPasswordConfirm"
        label="새 비밀번호 확인"
        placeholder="새 비밀번호를 다시 입력하세요"
        nativeID="change-password-new-password-confirm-label"
        autoComplete="new-password"
        textContentType="newPassword"
        showAccessibilityLabel="새 비밀번호 확인 보이기"
        hideAccessibilityLabel="새 비밀번호 확인 숨기기"
      />

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={submitting || !canSubmit}
        accessibilityRole="button"
        accessibilityLabel="비밀번호 변경"
        className="h-12 rounded-md"
      >
        <Text className="text-sm font-medium">비밀번호 변경</Text>
      </Button>
    </View>
  );
}
