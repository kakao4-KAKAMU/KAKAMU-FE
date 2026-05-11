import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
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

type SignUpFormValues = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreedToTerms: boolean;
};

type SignUpFormProps = {
  values: SignUpFormValues;
  onChange: (values: SignUpFormValues) => void;
  onSubmit: () => void;
  onPressTerms?: () => void;
  submitting?: boolean;
};

export function SignUpForm({
  values,
  onChange,
  onSubmit,
  onPressTerms,
  submitting = false,
}: SignUpFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return (
      submitting ||
      !values.nickname.trim() ||
      !values.email.trim() ||
      !values.password ||
      !values.passwordConfirm ||
      values.password !== values.passwordConfirm ||
      !values.agreedToTerms
    );
  }, [submitting, values]);

  const handleNicknameChange = useCallback(
    (nickname: string) => onChange({ ...values, nickname }),
    [onChange, values]
  );

  const handleEmailChange = useCallback(
    (email: string) => onChange({ ...values, email }),
    [onChange, values]
  );

  const handlePasswordChange = useCallback(
    (password: string) => onChange({ ...values, password }),
    [onChange, values]
  );

  const handlePasswordConfirmChange = useCallback(
    (passwordConfirm: string) => onChange({ ...values, passwordConfirm }),
    [onChange, values]
  );

  const handleTermsChange = useCallback(
    (agreedToTerms: boolean) => onChange({ ...values, agreedToTerms }),
    [onChange, values]
  );

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Label nativeID="signup-nickname-label" className="text-sm text-muted-foreground">
          {t('guest.form.signUp.nickname')}
        </Label>
        <Input
          value={values.nickname}
          onChangeText={handleNicknameChange}
          placeholder={t('guest.form.signUp.nicknamePlaceholder')}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="nickname"
          aria-labelledby="signup-nickname-label"
          className="h-12 rounded-xl"
        />
      </View>

      <View className="gap-2">
        <Label nativeID="signup-email-label" className="text-sm text-muted-foreground">
          {t('guest.form.signUp.email')}
        </Label>
        <Input
          value={values.email}
          onChangeText={handleEmailChange}
          placeholder={t('guest.form.signUp.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          aria-labelledby="signup-email-label"
          className="h-12 rounded-xl"
        />
      </View>

      <View className="gap-2">
        <Label nativeID="signup-password-label" className="text-sm text-muted-foreground">
          {t('guest.form.signUp.password')}
        </Label>
        <View className="relative">
          <Input
            value={values.password}
            onChangeText={handlePasswordChange}
            placeholder={t('guest.form.signUp.passwordPlaceholder')}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            aria-labelledby="signup-password-label"
            className="h-12 rounded-xl pr-12"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? t('guest.form.signUp.a11yHidePassword') : t('guest.form.signUp.a11yShowPassword')
            }
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

      <View className="gap-2">
        <Label nativeID="signup-password-confirm-label" className="text-sm text-muted-foreground">
          {t('guest.form.signUp.passwordConfirm')}
        </Label>
        <View className="relative">
          <Input
            value={values.passwordConfirm}
            onChangeText={handlePasswordConfirmChange}
            placeholder={t('guest.form.signUp.passwordConfirmPlaceholder')}
            secureTextEntry={!showPasswordConfirm}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            aria-labelledby="signup-password-confirm-label"
            className="h-12 rounded-xl pr-12"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showPasswordConfirm
                ? t('guest.form.signUp.a11yHidePasswordConfirm')
                : t('guest.form.signUp.a11yShowPasswordConfirm')
            }
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

      <View className="gap-3">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: values.agreedToTerms }}
          onPress={() => handleTermsChange(!values.agreedToTerms)}
          hitSlop={8}
          className="flex-row items-start gap-2 active:opacity-70"
        >
          <Checkbox checked={values.agreedToTerms} onCheckedChange={handleTermsChange} />
          <View className="shrink">
            <Text className="text-sm text-muted-foreground leading-5">
              {t('guest.form.signUp.termsAgreement')}
            </Text>
            <Pressable
              accessibilityRole="link"
              onPress={onPressTerms}
              hitSlop={8}
              className="self-start mt-1 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-foreground">
                {t('guest.form.signUp.viewTerms')}
              </Text>
            </Pressable>
          </View>
        </Pressable>

        {values.passwordConfirm && values.password !== values.passwordConfirm ? (
          <Text className="text-sm text-destructive">{t('guest.form.signUp.passwordMismatch')}</Text>
        ) : null}
      </View>

      <Button
        variant="default"
        size="lg"
        onPress={onSubmit}
        disabled={isSubmitDisabled}
        accessibilityRole="button"
        className="h-12 rounded-xl"
      >
        <Text className="text-base font-bold">{t('guest.form.signUp.submit')}</Text>
      </Button>
    </View>
  );
}

export type { SignUpFormValues };
