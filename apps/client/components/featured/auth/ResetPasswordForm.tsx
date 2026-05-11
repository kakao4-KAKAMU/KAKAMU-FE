import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import {
  Button,
  Icon,
  Input,
  Label,
  Text,
  TextClassContext,
} from '@kakamu/ui';

type ResetPasswordFormValues = {
  password: string;
  passwordConfirm: string;
};

type ResetPasswordFormProps = {
  values: ResetPasswordFormValues;
  onChange: (values: ResetPasswordFormValues) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export function ResetPasswordForm({
  values,
  onChange,
  onSubmit,
  submitting = false,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return (
      submitting ||
      !values.password ||
      !values.passwordConfirm ||
      values.password !== values.passwordConfirm ||
      values.password.length < 8
    );
  }, [submitting, values.password, values.passwordConfirm]);

  const handlePasswordChange = useCallback(
    (password: string) => onChange({ ...values, password }),
    [onChange, values]
  );

  const handlePasswordConfirmChange = useCallback(
    (passwordConfirm: string) => onChange({ ...values, passwordConfirm }),
    [onChange, values]
  );

  return (
    <View className="gap-3.5">
      <View className="gap-1.5">
        <Label nativeID="reset-password-label" className="text-sm font-medium text-foreground">
          새 비밀번호
        </Label>
        <View className="relative">
          <Input
            value={values.password}
            onChangeText={handlePasswordChange}
            placeholder="8자 이상 입력하세요"
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
            accessibilityLabel={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={8}
            className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
          >
            <TextClassContext.Provider value="text-muted-foreground">
              <Icon as={showPassword ? EyeOff : Eye} size={18} />
            </TextClassContext.Provider>
          </Pressable>
        </View>
      </View>

      <View className="gap-1.5">
        <Label
          nativeID="reset-password-confirm-label"
          className="text-sm font-medium text-foreground"
        >
          새 비밀번호 확인
        </Label>
        <View className="relative">
          <Input
            value={values.passwordConfirm}
            onChangeText={handlePasswordConfirmChange}
            placeholder="비밀번호를 다시 입력하세요"
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
            accessibilityLabel={showPasswordConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 표시'}
            onPress={() => setShowPasswordConfirm((prev) => !prev)}
            hitSlop={8}
            className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
          >
            <TextClassContext.Provider value="text-muted-foreground">
              <Icon as={showPasswordConfirm ? EyeOff : Eye} size={18} />
            </TextClassContext.Provider>
          </Pressable>
        </View>
      </View>

      {values.passwordConfirm && values.password !== values.passwordConfirm ? (
        <Text className="text-sm text-destructive">비밀번호가 일치하지 않습니다.</Text>
      ) : null}

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={isSubmitDisabled}
        accessibilityRole="button"
        className="h-12 rounded-md"
      >
        <Text className="text-sm font-medium">비밀번호 변경</Text>
      </Button>
    </View>
  );
}

export type { ResetPasswordFormValues };
