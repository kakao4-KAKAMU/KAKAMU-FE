import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function ChatListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '채팅' }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>채팅 목록 페이지</Text>
      </ScrollView>
    </>
  );
}
