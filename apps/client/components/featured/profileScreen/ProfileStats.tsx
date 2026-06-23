import { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@kakamu/ui';
import { useUserQuery } from '@kakamu/query';
import type { ProfileStatKey } from './types';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

const STAT_LABELS: Record<ProfileStatKey, string> = {
  feed: 'FEED',
  save: 'FOLLOWER',
  following: 'FOLLOWING',
};

type ProfileStatsProps = {
  userId: string;
  onFollowersPress?: () => void;
  onFollowingsPress?: () => void;
};

function ProfileStatsComponent({ userId, onFollowersPress, onFollowingsPress }: ProfileStatsProps) {
  const apiClient = useBackendApiClient();
  const userQuery = useUserQuery(apiClient, userId);
  const user = userQuery.data;
  const stats = useMemo(() => ({
    feed: user.post_count,
    save: user.follower_count,
    following: user.following_count,
  }), [user]);

  const entries: ProfileStatKey[] = ['feed', 'save', 'following'];

  return (
    <View className="flex-row gap-2">
      {entries.map((key) => {
        const isPressable =
          (key === 'save' && onFollowersPress != null) ||
          (key === 'following' && onFollowingsPress != null);
        const onPress =
          key === 'save' ? onFollowersPress : key === 'following' ? onFollowingsPress : undefined;

        const content = (
          <>
            <Text className="text-xl font-extrabold text-secondary-foreground">
              {stats[key]}
            </Text>
            <Text className="text-[10px] font-bold tracking-wide text-muted-foreground">
              {STAT_LABELS[key]}
            </Text>
          </>
        );

        if (!isPressable || !onPress) {
          return (
            <View
              key={key}
              className="flex-1 items-center gap-1 rounded-[10px] bg-secondary px-2.5 py-2.5"
            >
              {content}
            </View>
          );
        }

        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            onPress={onPress}
            className="flex-1 items-center gap-1 rounded-[10px] bg-secondary px-2.5 py-2.5 active:opacity-70"
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

export const ProfileStats = memo(ProfileStatsComponent);