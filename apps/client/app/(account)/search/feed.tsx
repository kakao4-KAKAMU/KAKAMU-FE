import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SearchFeedResultScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '피드 검색 결과' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{`"${q ?? ''}" 피드 검색 결과 페이지`}</Text>
      </ScrollView>
    </>
  );
}
