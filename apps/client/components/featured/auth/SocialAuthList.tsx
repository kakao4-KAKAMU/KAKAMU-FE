import { useTranslation } from '@kakamu/i18n';
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
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <SocialAuthButton
        label={t('guest.social.kakao')}
        icon={MessageCircle}
        iconClassName="text-yellow-600"
        onPress={onPressKakao}
        disabled={disabled}
      />
      <SocialAuthButton
        label={t('guest.social.google')}
        icon={Globe}
        iconClassName="text-muted-foreground"
        onPress={onPressGoogle}
        disabled={disabled}
      />
    </View>
  );
}
