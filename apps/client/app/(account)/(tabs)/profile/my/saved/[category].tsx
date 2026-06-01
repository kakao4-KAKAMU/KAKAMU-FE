import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SavedFeedByCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '저장한 피드 카테고리' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{`카테고리 ${category ?? '-'}의 저장 피드 목록 페이지`}</Text>
      </ScrollView>
    </>
  );
}
