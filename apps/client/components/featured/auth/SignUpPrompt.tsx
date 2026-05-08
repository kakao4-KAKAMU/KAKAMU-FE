import { Pressable, View } from 'react-native';
import { Text } from '@kakamu/ui';

type SignUpPromptProps = {
  question?: string;
  actionLabel?: string;
  onPress?: () => void;
};

export function SignUpPrompt({
  question = '아직 계정이 없으신가요?',
  actionLabel = '회원가입',
  onPress,
}: SignUpPromptProps) {
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
