import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Intro' }} />
      <Stack.Screen name="signin" options={{ title: '로그인' }} />
      <Stack.Screen name="signup" options={{ title: '회원가입' }} />
      <Stack.Screen name="findpassword/index" options={{ title: '비밀번호 찾기' }} />
      <Stack.Screen name="findpassword/done" options={{ title: '비밀번호 찾기' }} />
    </Stack>
  );
}
