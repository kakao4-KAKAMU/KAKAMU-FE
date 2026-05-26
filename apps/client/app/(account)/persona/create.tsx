import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Text } from '@kakamu/ui';

export default function PersonaCreateScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('account.layout.personaCreate') }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{t('account.persona.create.placeholder')}</Text>
      </ScrollView>
    </>
  );
}
