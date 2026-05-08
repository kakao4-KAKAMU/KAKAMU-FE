import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SearchMovieResultScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '영화 검색 결과' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{`"${q ?? ''}" 영화 검색 결과 페이지`}</Text>
      </ScrollView>
    </>
  );
}
