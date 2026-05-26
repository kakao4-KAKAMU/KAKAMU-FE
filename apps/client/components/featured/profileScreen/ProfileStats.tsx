import { View } from 'react-native';
import { Text } from '@kakamu/ui';
import type { ProfileScreenUser, ProfileStatKey } from './types';

const STAT_LABELS: Record<ProfileStatKey, string> = {
  feed: 'FEED',
  save: 'SAVE',
  persona: 'PERSONA',
};

type ProfileStatsProps = {
  user: ProfileScreenUser;
};

export function ProfileStats({ user }: ProfileStatsProps) {
  const entries: ProfileStatKey[] = ['feed', 'save', 'persona'];

  return (
    <View className="flex-row gap-2">
      {entries.map((key) => (
        <View
          key={key}
          className="flex-1 items-center gap-1 rounded-[10px] bg-secondary px-2.5 py-2.5"
        >
          <Text className="text-xl font-extrabold text-secondary-foreground">
            {user.stats[key]}
          </Text>
          <Text className="text-[10px] font-bold tracking-wide text-muted-foreground">
            {STAT_LABELS[key]}
          </Text>
        </View>
      ))}
    </View>
  );
}
