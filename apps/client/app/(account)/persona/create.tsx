import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function PersonaCreateScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '페르소나 생성' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>페르소나를 생성하는 페이지</Text>
      </ScrollView>
    </>
  );
}
