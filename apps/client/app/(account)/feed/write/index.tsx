import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function FeedWriteScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '피드 작성' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>피드 작성 페이지</Text>
      </ScrollView>
    </>
  );
}
