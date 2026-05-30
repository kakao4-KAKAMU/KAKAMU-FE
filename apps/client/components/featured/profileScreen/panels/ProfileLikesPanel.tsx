import { useState } from 'react';
import { Pressable, View } from 'react-native';
import type { PostItem } from '@kakamu/types';
import { Badge, Text } from '@kakamu/ui';
import { CompactPost } from '../../post/CompactPost';
import type { ProfileLikeSegment } from '../types';

const SEGMENTS: { key: ProfileLikeSegment; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'movie', label: '영화' },
  { key: 'feed', label: 'Feed' },
];

type ProfileLikesPanelProps = {
  posts: PostItem[];
};

export function ProfileLikesPanel({ posts }: ProfileLikesPanelProps) {
  const [segment, setSegment] = useState<ProfileLikeSegment>('all');

  return (
    <View className="gap-2.5">
      <View className="flex-row flex-wrap gap-1.5">
        {SEGMENTS.map(({ key, label }) => {
          const isActive = segment === key;
          return (
            <Pressable key={key} onPress={() => setSegment(key)} accessibilityRole="button">
              <Badge variant={isActive ? 'default' : 'secondary'}>
                <Text>{label}</Text>
              </Badge>
            </Pressable>
          );
        })}
      </View>

      {posts.map((post) => (
        <CompactPost key={post.id} post={post} />
      ))}
    </View>
  );
}
