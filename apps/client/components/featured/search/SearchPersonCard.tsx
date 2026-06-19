import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler'
import { User } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { UserSimpleWithFollow } from '@kakamu/types';
import { Avatar, AvatarFallback, AvatarImage, Button, Icon, Text } from '@kakamu/ui';

import { useProfileFollowActions } from '@/hooks/profile/useProfileFollowActions';
import { convertImagePath } from '@/lib/upload/convert-image-path';

type SearchPersonCardProps = {
  user: UserSimpleWithFollow
  onPress: () => void;
};

export function SearchPersonCard({ user, onPress }: SearchPersonCardProps) {
  const { t } = useTranslation();
  const canFollow = user.id != null;
  const { isPending, onToggleFollow } = useProfileFollowActions({
    userId: user.id ?? '',
    isFollowing: user.is_following ?? false,
  });

  return (
    <View
      className="gap-4 rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/5 active:opacity-90"
    >
      <View className="flex-row items-center justify-between gap-3">
        <Pressable
          className="min-w-0 flex-1 flex-row items-center gap-3"
          accessibilityRole="button"
          onPress={onPress}
        >
          <Avatar className="size-10 border border-border bg-muted" alt={user.nickname}>
            {user.profile_image ? (
              <AvatarImage source={{ uri: convertImagePath(user.profile_image) }} />
            ) : null}
            <AvatarFallback className="bg-muted">
              <Icon as={User} size={16} className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {user.nickname}
            </Text>
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              @{user.nickname}#{user.tag}
            </Text>
          </View>
        </Pressable>
        {canFollow ? (
          <Button
            size="sm"
            variant={user.is_following ? 'secondary' : 'default'}
            disabled={isPending}
            onPress={onToggleFollow}
          >
            <Text className="text-xs">
              {user.is_following
                ? t('account.profile.actions.unfollow')
                : t('account.profile.actions.follow')}
            </Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
