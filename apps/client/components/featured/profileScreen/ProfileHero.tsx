import { View } from 'react-native';
import { Settings, User } from 'lucide-react-native';
import { Icon, Text } from '@kakamu/ui';
import type { ProfileScreenUser } from './types';

type ProfileHeroProps = {
  user: ProfileScreenUser;
};

export function ProfileHero({ user }: ProfileHeroProps) {
  return (
    <View className="items-center gap-2.5 rounded-[14px] border border-border bg-card p-4">
      <View className="h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
        <Icon as={User} size={22} className="text-muted-foreground" />
      </View>
      <Text className="text-xl font-extrabold text-foreground">{user.displayName}</Text>
      <Text className="text-center text-xs text-muted-foreground">{user.bio}</Text>
    </View>
  );
}
