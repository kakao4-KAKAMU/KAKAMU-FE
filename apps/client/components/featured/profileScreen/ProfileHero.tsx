import { View } from 'react-native';
import { Settings, User } from 'lucide-react-native';
import { Icon, Text } from '@kakamu/ui';
import { ProfileSettingsHeader, ProfileSubpageHeader } from '@/components/featured/profile';
import type { ProfileScreenUser } from './types';

type ProfileHeroProps = {
  user: ProfileScreenUser;
  isMy: boolean;
  onSettingsPress?: () => void;
  onBackPress?: () => void;
};

export function ProfileHero({ user, isMy, onSettingsPress, onBackPress }: ProfileHeroProps) {
  return (
    <View className="gap-2.5">
      {isMy ? (
        <ProfileSettingsHeader
          title="프로필"
          actionIcon={Settings}
          actionAccessibilityLabel="프로필 설정"
          onActionPress={onSettingsPress}
        />
      ) : (
        <ProfileSubpageHeader title="프로필" onBackPress={onBackPress} />
      )}

      <View className="items-center gap-2.5 rounded-[14px] border border-border bg-card p-4">
        <View className="h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
          <Icon as={User} size={22} className="text-muted-foreground" />
        </View>
        <Text className="text-xl font-extrabold text-foreground">{user.displayName}</Text>
        <Text className="text-center text-xs text-muted-foreground">{user.bio}</Text>
      </View>
    </View>
  );
}
