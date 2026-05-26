import { View } from 'react-native';
import { ProfileCompactPost } from '../ProfileCompactPost';
import type { ProfileCompactPost as ProfileCompactPostType } from '../types';

type ProfileFeedPanelProps = {
  posts: ProfileCompactPostType[];
};

export function ProfileFeedPanel({ posts }: ProfileFeedPanelProps) {
  return (
    <View className="gap-0">
      {posts.map((post) => (
        <ProfileCompactPost key={post.id} post={post} />
      ))}
    </View>
  );
}
