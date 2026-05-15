import { useTranslation } from '@kakamu/i18n';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';

export function TrailerSwipeGuide() {
  const { t } = useTranslation();

  return (
    <View className="w-full flex-row items-center justify-between">
      <View className="flex-row items-center gap-1.5">
        <Icon as={ArrowLeft} className="text-muted-foreground" size={16} />
        <Text className="text-xs font-semibold text-muted-foreground">
          {t('account.sonar.swipeGuideDislike')}
        </Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <Text className="text-xs font-semibold text-muted-foreground">
          {t('account.sonar.swipeGuideLike')}
        </Text>
        <Icon as={ArrowRight} className="text-muted-foreground" size={16} />
      </View>
    </View>
  );
}
