import { View } from 'react-native';
import type { PostItem } from '@kakamu/types';
import { CompactPost } from '../../post/CompactPost';

type ProfileFeedPanelProps = {
  postsIds: PostItem['id'][];
};

export function ProfileFeedPanel({ postsIds }: ProfileFeedPanelProps) {
  return (
    <View className="gap-0">
      {postsIds.map((postId) => (
        <CompactPost key={postId} postId={postId} />
      ))}
    </View>
  );
}
