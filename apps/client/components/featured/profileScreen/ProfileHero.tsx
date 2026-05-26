import { View } from 'react-native';
import { Settings, User } from 'lucide-react-native';
import { Icon, Text } from '@kakamu/ui';
import { ProfileSettingsHeader, ProfileSubpageHeader } from '@/components/featured/profile';
import type { ProfileScreenUser } from './types';
import { ConditionalRender } from '@/components/utils';

type ProfileHeroProps = {
  user: ProfileScreenUser;
  isMy: boolean;
  isSettings: boolean;
  onBackPress?: () => void;
};

export function ProfileHero({ user, isMy, isSettings, onBackPress }: ProfileHeroProps) {
  return (
    <View className="gap-2.5">
      <ConditionalRender.Boolean
        render={{
          true: <ProfileSettingsHeader
            title="프로필"
            isDropdownMenu={isSettings}
            actionIcon={Settings}
            actionAccessibilityLabel="프로필 설정"
          />,
          false: <ProfileSubpageHeader title="프로필" onBackPress={onBackPress} />,
        }}
        condition={isMy}
      />
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
