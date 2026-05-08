import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Intro' }} />
      <Stack.Screen name="signin" options={{ title: '로그인' }} />
      <Stack.Screen name="signup" options={{ title: '회원가입' }} />
    </Stack>
  );
}
