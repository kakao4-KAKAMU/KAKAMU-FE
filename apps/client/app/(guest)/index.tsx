import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function IntroScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Intro' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>비회원 인트로 페이지</Text>
      </ScrollView>
    </>
  );
}