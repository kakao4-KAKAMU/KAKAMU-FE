import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SearchHistoryScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '검색' }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>최근 검색 이력 페이지</Text>
      </ScrollView>
    </>
  );
}
