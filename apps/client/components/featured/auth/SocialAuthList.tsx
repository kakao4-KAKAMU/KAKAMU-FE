import { View } from 'react-native';
import { MessageCircle, Globe } from 'lucide-react-native';
import { SocialAuthButton } from './SocialAuthButton';

type SocialAuthListProps = {
  onPressKakao?: () => void;
  onPressGoogle?: () => void;
  disabled?: boolean;
};

export function SocialAuthList({
  onPressKakao,
  onPressGoogle,
  disabled,
}: SocialAuthListProps) {
  return (
    <View className="gap-2">
      <SocialAuthButton
        label="카카오로 계속하기"
        icon={MessageCircle}
        iconClassName="text-yellow-600"
        onPress={onPressKakao}
        disabled={disabled}
      />
      <SocialAuthButton
        label="Google로 계속하기"
        icon={Globe}
        iconClassName="text-muted-foreground"
        onPress={onPressGoogle}
        disabled={disabled}
      />
    </View>
  );
}
