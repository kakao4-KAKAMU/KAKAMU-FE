import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { usePathname, useRouter } from 'expo-router';
import { ProfileHero } from './ProfileHero';
import { ProfileStats } from './ProfileStats';
import { ProfileFollowButton } from './ProfileFollowButton';
import { ProfileSubTabs } from './ProfileSubTabs';
import { ConditionalRender } from '@/components/utils';
import { ProfileSettingsHeader } from '../header';
import { ProfileSubpageHeader } from '../header';
import { Settings } from 'lucide-react-native';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useProfileUserQuery } from '@/hooks/profile/useProfileUserQuery';
import { useProfileFollowActions } from '@/hooks/profile/useProfileFollowActions';
import { useProfileRelationListDialog } from '@/hooks/profile/useProfileRelationListDialog';
import { ProfileRelationListDialog } from './ProfileRelationListDialog';

type ProfileScreenLayoutProps = {
  isMy: boolean;
  userId?: string;
  children: ReactNode;
};

export function ProfileScreenLayout({ isMy, userId, children }: ProfileScreenLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const apiClient = useBackendApiClient();
  const { user, userId: targetUserId, stats } = useProfileUserQuery({
    client: apiClient,
    isMy,
    userId,
  });

  const { isPending: isFollowPending, onToggleFollow } = useProfileFollowActions({
    userId: targetUserId,
    isFollowing: user?.is_following ?? false,
  });

  const relationList = useProfileRelationListDialog(targetUserId);

  const onRelationUserPress = useCallback(
    (selectedUserId: string) => {
      relationList.onOpenChange(false);
      router.push(`/profile/${selectedUserId}`);
    },
    [relationList, router],
  );

  const relationDialogTitle =
    relationList.activeList === 'followers'
      ? t('account.profile.relations.followersTitle')
      : t('account.profile.relations.followingsTitle');

  const isSettings = useMemo(() => pathname.startsWith('/profile/setting'), [pathname]);

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-1 bg-background">
      <ConditionalRender.Boolean
        condition={isMy}
        render={{
          true: <ProfileSettingsHeader
            title={t('account.layout.profile')}
            isDropdownMenu={!isSettings}
            actionIcon={Settings}
            actionAccessibilityLabel={t('account.layout.profileSettings')}
            addFeedAccessibilityLabel={t('account.layout.feedWrite')}
          />,
          false: (
            <ProfileSubpageHeader
              title={t('account.layout.profile')}
              onBackPress={onBackPress}
            />
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]}
        contentContainerClassName='px-4 gap-2.5'
        className="flex-1"
      >
        <ProfileHero user={user} />
        <ConditionalRender.Boolean
          condition={!isMy && user}
          render={{
            true: <ProfileFollowButton
              isFollowing={user?.is_following ?? false}
              isPending={isFollowPending}
              followLabel={t('account.profile.actions.follow')}
              unfollowLabel={t('account.profile.actions.unfollow')}
              onPress={onToggleFollow}
            />
          }}
        />
        <ProfileStats
          user={stats}
          onFollowersPress={targetUserId ? relationList.openFollowers : undefined}
          onFollowingsPress={targetUserId ? relationList.openFollowings : undefined}
        />

        <ProfileSubTabs isMy={isMy} userId={targetUserId} />

        <View className="pb-6 pt-2">{children}</View>
      </ScrollView>

      <ProfileRelationListDialog
        open={relationList.open}
        onOpenChange={relationList.onOpenChange}
        title={relationDialogTitle}
        emptyLabel={t('account.profile.relations.empty')}
        loadMoreLabel={t('account.profile.relations.loadMore')}
        loadingMoreLabel={t('account.profile.relations.loadingMore')}
        users={relationList.users}
        isLoading={relationList.isLoading}
        hasNextPage={relationList.hasNextPage}
        isFetchingNextPage={relationList.isFetchingNextPage}
        onLoadMore={relationList.onLoadMore}
        onUserPress={onRelationUserPress}
      />
    </View>
  );
}
