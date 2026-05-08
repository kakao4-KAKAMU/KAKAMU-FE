import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SignUpScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '회원가입' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>회원가입 페이지</Text>
      </ScrollView>
    </>
  );
}