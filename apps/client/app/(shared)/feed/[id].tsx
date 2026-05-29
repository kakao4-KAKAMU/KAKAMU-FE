import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('shared.feedDetail.title') }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{t('shared.feedDetail.description', { id: id ?? '-' })}</Text>
      </ScrollView>
    </>
  );
}
