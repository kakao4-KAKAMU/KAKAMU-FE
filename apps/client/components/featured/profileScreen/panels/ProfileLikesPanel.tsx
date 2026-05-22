import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Badge, Text } from '@kakamu/ui';
import { ProfileCompactPost } from '../ProfileCompactPost';
import type { ProfileCompactPost as ProfileCompactPostType, ProfileLikeSegment } from '../types';

const SEGMENTS: { key: ProfileLikeSegment; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'movie', label: '영화' },
  { key: 'feed', label: 'Feed' },
];

type ProfileLikesPanelProps = {
  posts: ProfileCompactPostType[];
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
        <ProfileCompactPost key={post.id} post={post} />
      ))}
    </View>
  );
}
