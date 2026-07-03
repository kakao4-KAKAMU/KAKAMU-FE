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
import { useMyProfileUserQuery, useOtherProfileUserQuery } from '@/hooks/profile/useProfileUserQuery';
import { useProfileFollowActions } from '@/hooks/profile/useProfileFollowActions';
import { useProfileRelationListDialog } from '@/hooks/profile/useProfileRelationListDialog';
import { ProfileRelationListDialog } from './ProfileRelationListDialog';
import { AppSuspenseBoundary } from '@/components/error-boundary';
import type { UserPublic } from '@kakamu/types';
import { ProfileScreenLayoutSkeleton } from './ProfileScreenLayout.skeleton';
import { useCurrentUser } from '@/hooks/auth/useCurrentUserId';

type ProfileScreenLayoutProps = {
  isMy: boolean;
  userId?: string;
  children: ReactNode;
};

export function ProfileScreenLayout({ isMy, userId, children }: ProfileScreenLayoutProps) {
  return (
    <AppSuspenseBoundary fallback={<ProfileScreenLayoutSkeleton />}>
      {isMy ? (
        <MyProfileScreenLayoutContent>{children}</MyProfileScreenLayoutContent>
      ) : userId ? (
        <OtherProfileScreenLayoutContent userId={userId}>{children}</OtherProfileScreenLayoutContent>
      ) : null}
    </AppSuspenseBoundary>
  );
}

function MyProfileScreenLayoutContent({ children }: { children: ReactNode }) {
  const apiClient = useBackendApiClient();
  const { user, userId: targetUserId } = useMyProfileUserQuery(apiClient);

  return (
    <ProfileScreenLayoutBody user={user} targetUserId={targetUserId} isMy>
      {children}
    </ProfileScreenLayoutBody>
  );
}

function OtherProfileScreenLayoutContent({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const apiClient = useBackendApiClient();
  const { user, userId: targetUserId } = useOtherProfileUserQuery(apiClient, userId);

  return (
    <ProfileScreenLayoutBody user={user} targetUserId={targetUserId} isMy={false}>
      {children}
    </ProfileScreenLayoutBody>
  );
}

function ProfileScreenLayoutBody({
  isMy,
  user,
  targetUserId,
  children,
}: {
  isMy: boolean;
  user: UserPublic;
  targetUserId: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentUser = useCurrentUser();
  const { isPending: isFollowPending, onToggleFollow } = useProfileFollowActions({
    userId: targetUserId,
    isFollowing: user.is_following,
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
        <ProfileHero userId={targetUserId} />
        <ConditionalRender.Boolean
          condition={!isMy && currentUser}
          render={{
            true: <ProfileFollowButton
              isFollowing={user.is_following}
              isPending={isFollowPending}
              followLabel={t('account.profile.actions.follow')}
              unfollowLabel={t('account.profile.actions.unfollow')}
              onPress={onToggleFollow}
            />
          }}
        />
        <ProfileStats
          userId={targetUserId}
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
        userIds={relationList.userIds}
        isLoading={relationList.isLoading}
        hasNextPage={relationList.hasNextPage}
        isFetchingNextPage={relationList.isFetchingNextPage}
        onLoadMore={relationList.onLoadMore}
        onUserPress={onRelationUserPress}
      />
    </View>
  );
}
