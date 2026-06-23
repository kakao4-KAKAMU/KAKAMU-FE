import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler'
import { useTranslation } from '@kakamu/i18n';
import type { UserSimpleWithFollow } from '@kakamu/types';
import { Button, Text } from '@kakamu/ui';

import { useProfileFollowActions } from '@/hooks/profile/useProfileFollowActions';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useUserQuery } from '@kakamu/query';
import { SearchPersonCardFallback } from './SearchPersonCard.fallback';
import { ProfileImage } from '../profileScreen/ProfileImage';

type SearchPersonCardProps = {
  userId: UserSimpleWithFollow['id'];
  onPress: () => void;
};

export function SearchPersonCard({ userId, onPress }: SearchPersonCardProps) {
  if (!userId) {
    return <SearchPersonCardFallback />;
  }
  const { t } = useTranslation();
  const apiClient = useBackendApiClient();
  const userQuery = useUserQuery(apiClient, userId);
  const user = userQuery.data;
  const canFollow = user != null;
  const { isPending, onToggleFollow } = useProfileFollowActions({
    userId: userId,
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
          <ProfileImage nickname={user.nickname} url={user.profile_image} size={8} />
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
