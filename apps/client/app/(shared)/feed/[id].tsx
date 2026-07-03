import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FeedDetailScreenContent } from '@/components/featured/feed/FeedDetailScreenContent';
import { useCurrentUser } from '@/hooks/auth/useCurrentUserId';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const currentUser = useCurrentUser();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        {postId > 0 ? (
          <FeedDetailScreenContent
            postId={postId}
            showCommentComposer={currentUser != null}
          />
        ) : null}
      </View>
    </>
  );
}
