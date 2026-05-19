import { useTranslation } from '@kakamu/i18n';
import { Info } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';

type SonarHeaderProps = {
  title?: string;
  onInfoPress?: () => void;
};

export function SonarHeader({ title, onInfoPress }: SonarHeaderProps) {
  const { t } = useTranslation();
  const displayTitle = title ?? t('account.sonar.headerTitle');

  return (
    <View className="flex-row items-center justify-between px-4 pb-1 pt-1">
      <Text className="text-[22px] font-bold text-foreground leading-tight">{displayTitle}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('account.sonar.headerInfoA11y')}
        hitSlop={8}
        onPress={onInfoPress}
        className="size-8 items-center justify-center rounded-full bg-muted active:opacity-80"
      >
        <Icon as={Info} className="text-foreground" size={18} />
      </Pressable>
    </View>
  );
}
