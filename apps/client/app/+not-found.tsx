import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@kakamu/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold">This screen doesn't exist.</Text>

        <Link href="/" className="mt-3 py-3">
          <Text className="text-sm text-blue-500">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
