import { Stack } from 'expo-router';

export default function SharedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="feed/[id]" />
      <Stack.Screen name="profile/[id]" />
    </Stack>
  );
}
