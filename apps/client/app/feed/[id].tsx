import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '피드 상세' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{`피드 ${id ?? '-'}의 상세 페이지`}</Text>
      </ScrollView>
    </>
  );
}
