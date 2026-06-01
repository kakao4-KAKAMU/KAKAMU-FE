import { View } from 'react-native';
import { Text } from '@kakamu/ui';
import type { ProfileStatKey } from './types';

const STAT_LABELS: Record<ProfileStatKey, string> = {
  feed: 'FEED',
  save: 'FOLLOWER',
  following: 'FOLLOWING',
  persona: 'PERSONA',
};

type ProfileStatsProps = {
  user: Record<ProfileStatKey, number>;
};

export function ProfileStats({ user }: ProfileStatsProps) {
  const entries: ProfileStatKey[] = ['feed', 'save', 'following', 'persona'];

  return (
    <View className="flex-row gap-2">
      {entries.map((key) => (
        <View
          key={key}
          className="flex-1 items-center gap-1 rounded-[10px] bg-secondary px-2.5 py-2.5"
        >
          <Text className="text-xl font-extrabold text-secondary-foreground">
            {user[key]}
          </Text>
          <Text className="text-[10px] font-bold tracking-wide text-muted-foreground">
            {STAT_LABELS[key]}
          </Text>
        </View>
      ))}
    </View>
  );
}
