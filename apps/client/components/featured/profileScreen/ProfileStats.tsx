import { Pressable, View } from 'react-native';
import { Text } from '@kakamu/ui';
import type { ProfileStatKey } from './types';

const STAT_LABELS: Record<ProfileStatKey, string> = {
  feed: 'FEED',
  save: 'FOLLOWER',
  following: 'FOLLOWING',
};

type ProfileStatsProps = {
  user: Record<ProfileStatKey, number>;
  onFollowersPress?: () => void;
  onFollowingsPress?: () => void;
};

export function ProfileStats({ user, onFollowersPress, onFollowingsPress }: ProfileStatsProps) {
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
              {user[key]}
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
