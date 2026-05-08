import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function PersonaScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '페르소나' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>페르소나를 선택할 수 있는 페이지</Text>
      </ScrollView>
    </>
  );
}
