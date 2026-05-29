import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function PersonaChatScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('account.personaChat.title') }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{t('account.personaChat.description')}</Text>
      </ScrollView>
    </>
  );
}
