import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function MemberProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '회원 프로필' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>{`회원 ${id ?? '-'}의 프로필 페이지`}</Text>
      </ScrollView>
    </>
  );
}
