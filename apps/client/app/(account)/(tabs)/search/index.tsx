import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SearchHistoryScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('account.searchHistory.title') }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>{t('account.searchHistory.description')}</Text>
      </ScrollView>
    </>
  );
}
