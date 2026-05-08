import { useState, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Label,
  Text,
  TextClassContext,
} from '@kakamu/ui';

type SignInFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type SignInFormProps = {
  values: SignInFormValues;
  onChange: (values: SignInFormValues) => void;
  onSubmit: () => void;
  onForgotPassword?: () => void;
  submitting?: boolean;
};

export function SignInForm({
  values,
  onChange,
  onSubmit,
  onForgotPassword,
  submitting = false,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = useCallback(
    (email: string) => onChange({ ...values, email }),
    [onChange, values]
  );

  const handlePasswordChange = useCallback(
    (password: string) => onChange({ ...values, password }),
    [onChange, values]
  );

  const handleRememberChange = useCallback(
    (rememberMe: boolean) => onChange({ ...values, rememberMe }),
    [onChange, values]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Label nativeID="signin-email-label" className="text-sm text-muted-foreground">
          이메일
        </Label>
        <Input
          value={values.email}
          onChangeText={handleEmailChange}
          placeholder="email@kakamu.app"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          aria-labelledby="signin-email-label"
          className="h-12 rounded-xl"
        />
      </View>
      <View className="gap-2">
        <Label nativeID="signin-password-label" className="text-sm text-muted-foreground">
          비밀번호
        </Label>
        <View className="relative">
          <Input
            value={values.password}
            onChangeText={handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
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
            accessibilityLabel={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            onPress={togglePasswordVisibility}
            hitSlop={8}
            className="absolute right-3 top-0 bottom-0 items-center justify-center active:opacity-70"
          >
            <TextClassContext.Provider value="text-muted-foreground">
              <Icon as={showPassword ? EyeOff : Eye} size={18} />
            </TextClassContext.Provider>
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: values.rememberMe }}
          onPress={() => handleRememberChange(!values.rememberMe)}
          hitSlop={8}
          className="flex-row items-center gap-2 active:opacity-70"
        >
          <Checkbox
            checked={values.rememberMe}
            onCheckedChange={handleRememberChange}
          />
          <Text className="text-sm text-muted-foreground">로그인 상태 유지</Text>
        </Pressable>

        <Pressable
          accessibilityRole="link"
          onPress={onForgotPassword}
          hitSlop={8}
          className="active:opacity-70"
        >
          <Text className="text-sm font-semibold text-foreground">비밀번호 찾기</Text>
        </Pressable>
      </View>

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={submitting}
        accessibilityRole="button"
        className="h-12 rounded-xl mt-1"
      >
        <Text className="text-base font-bold">로그인</Text>
      </Button>
    </View>
  );
}

export type { SignInFormValues };
