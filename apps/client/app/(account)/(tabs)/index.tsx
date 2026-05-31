import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function MainFeedScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>{t('account.mainFeed.description')}</Text>
      </ScrollView>
    </View>
  );
}
