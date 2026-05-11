import { Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Text } from '@kakamu/ui';

export type SignUpPromptVariant = 'toSignUp' | 'toSignIn';

type SignUpPromptProps = {
  variant: SignUpPromptVariant;
  onPress?: () => void;
};

export function SignUpPrompt({ variant, onPress }: SignUpPromptProps) {
  const { t } = useTranslation();
  const question =
    variant === 'toSignUp' ? t('guest.footer.toSignUpPrompt') : t('guest.footer.toSignInPrompt');
  const actionLabel =
    variant === 'toSignUp' ? t('guest.footer.toSignUpAction') : t('guest.footer.toSignInAction');

  return (
    <View className="flex-row items-center justify-center gap-1.5">
      <Text className="text-sm text-muted-foreground">{question}</Text>
      <Pressable
        accessibilityRole="link"
        onPress={onPress}
        hitSlop={8}
        className="active:opacity-70"
      >
        <Text className="text-sm font-bold text-foreground">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
