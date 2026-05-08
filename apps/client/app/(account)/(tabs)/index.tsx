import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function MainFeedScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '메인' }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>피드 목록을 조회할 수 있는 메인 페이지</Text>
      </ScrollView>
    </>
  );
}
