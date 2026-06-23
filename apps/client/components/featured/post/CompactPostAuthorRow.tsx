import { View } from 'react-native';
import type { PostItem, UserSimple } from '@kakamu/types';
import { Avatar, AvatarFallback, AvatarImage, cn, Icon, Text, Button } from '@kakamu/ui';
import { formatRelativeTime } from '@/lib/time';
import { User } from 'lucide-react-native';
import { convertImagePath } from '@/lib/upload/convert-image-path';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { useProfileFollowActions } from '@/hooks/profile/useProfileFollowActions';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useUserQuery } from '@kakamu/query';
import { CompactPostAuthorRowFallback } from './CompactPostAuthorRow.fallback';

export function CompactPostAuthorRow({ userId, createdAt }: { userId: UserSimple['id'], createdAt: string }) {
  const ANONYMOUS_AUTHOR_LABEL = '알 수 없음';
  if (!userId) {
    return <CompactPostAuthorRowFallback />;
  }
  const apiClient = useBackendApiClient();
  const userQuery = useUserQuery(apiClient, userId);
  const user = userQuery.data;
  const router = useRouter();
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();
  const authorId = user.id;
  const authorName = user.nickname;
  const authorImage = user.profile_image;
  const isAnonymous = authorId == null;
  const timeLabel = formatRelativeTime(createdAt);
  const metaLabel = isAnonymous ? timeLabel : timeLabel;

  const isOwnPost = useMemo(
    () => authorId != null && authorId === currentUserId,
    [authorId, currentUserId],
  );

  const showFollowButton = !isAnonymous && !isOwnPost;

  const { isPending: isFollowPending, onToggleFollow } = useProfileFollowActions({
    userId: authorId ?? '',
    isFollowing: user.is_following,
  });

  const onAuthorPress = useCallback(() => {
    if (authorId) {
      router.push(`/profile/${authorId}`);
    }
  }, [authorId, router]);

  const onFollowPress = useCallback(() => {
    onToggleFollow();
  }, [onToggleFollow]);

  return (
    <View className="flex-row items-center gap-2.5">
      <Button size="smIcon" variant="ghost" onPress={onAuthorPress} disabled={isAnonymous}>
        <Avatar
          className={cn('size-full border border-border bg-muted', isAnonymous && 'opacity-60')}
          alt={authorName || ANONYMOUS_AUTHOR_LABEL}
        >
          {authorImage ? (
            <AvatarImage source={{ uri: convertImagePath(authorImage) }} />
          ) : null}
          <AvatarFallback className="size-full bg-muted">
            <Icon as={User} size={16} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </Button>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          className={cn(
            'text-sm text-foreground',
            isAnonymous ? 'font-normal text-muted-foreground' : 'font-bold',
          )}
        >
          {isAnonymous ? ANONYMOUS_AUTHOR_LABEL : authorName}
        </Text>
        {metaLabel ? (
          <Text className="text-xs text-muted-foreground">{metaLabel}</Text>
        ) : null}
      </View>
      {showFollowButton ? (
        <Button
          size="sm"
          variant={user.is_following ? 'secondary' : 'default'}
          disabled={isFollowPending}
          onPress={onFollowPress}
        >
          <Text className="text-xs">
            {user.is_following
              ? t('account.profile.actions.unfollow')
              : t('account.profile.actions.follow')}
          </Text>
        </Button>
      ) : null}
    </View>
  );
}
