import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function MainFeedScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('account.mainFeed.title') }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>{t('account.mainFeed.description')}</Text>
      </ScrollView>
    </>
  );
}
