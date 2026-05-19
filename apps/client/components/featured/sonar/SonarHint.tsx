import { useTranslation } from '@kakamu/i18n';
import { View } from 'react-native';
import { Text } from '@kakamu/ui';

type SonarHintProps = {
  children?: string;
};

export function SonarHint({ children }: SonarHintProps) {
  const { t } = useTranslation();
  const text = children ?? t('account.sonar.hint');

  return (
    <View className="px-5 pb-4">
      <Text className="text-xs font-normal leading-tight text-muted-foreground">{text}</Text>
    </View>
  );
}
