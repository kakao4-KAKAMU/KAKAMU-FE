import { View } from 'react-native';
import type { PostItem } from '@kakamu/types';
import { CompactPost } from '../../post/CompactPost';

type ProfileFeedPanelProps = {
  posts: PostItem[];
};

export function ProfileFeedPanel({ posts }: ProfileFeedPanelProps) {
  return (
    <View className="gap-0">
      {posts.map((post) => (
        <CompactPost key={post.id} post={post} />
      ))}
    </View>
  );
}
