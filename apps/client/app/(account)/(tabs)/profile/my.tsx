import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function MyProfileScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '내 프로필' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>자신의 프로필 페이지</Text>
      </ScrollView>
    </>
  );
}
