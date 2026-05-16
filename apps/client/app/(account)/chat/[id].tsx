import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function PersonaChatScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '페르소나 챗' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>선택된 페르소나 기준으로 LLM과 대화하는 페이지</Text>
      </ScrollView>
    </>
  );
}
