import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FeedDetailScreenContent } from '@/components/featured/feed/FeedDetailScreenContent';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const currentUserId = useCurrentUserId();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        {postId > 0 ? (
          <FeedDetailScreenContent
            postId={postId}
            showCommentComposer={currentUserId != null}
          />
        ) : null}
      </View>
    </>
  );
}
