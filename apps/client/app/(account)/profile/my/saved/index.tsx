import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SavedFeedScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '저장한 피드' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>사용자가 저장한 피드 목록 페이지</Text>
      </ScrollView>
    </>
  );
}
