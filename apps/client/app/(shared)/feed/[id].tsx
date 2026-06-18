import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FeedDetailScreenContent } from '@/components/featured/feed/FeedDetailScreenContent';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        {postId > 0 ? <FeedDetailScreenContent postId={postId} /> : null}
      </View>
    </>
  );
}
