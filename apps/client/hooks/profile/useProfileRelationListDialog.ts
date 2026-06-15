import { useCallback, useMemo, useState } from 'react';
import { useFollowersInfiniteQuery, useFollowingsInfiniteQuery } from '@kakamu/query';
import type { UserSimpleInfo } from '@kakamu/types';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

export type ProfileRelationListType = 'followers' | 'followings';

const LIST_LIMIT = 20;

export function useProfileRelationListDialog(userId: string) {
  const client = useBackendApiClient();
  const [activeList, setActiveList] = useState<ProfileRelationListType | null>(null);

  const followersQuery = useFollowersInfiniteQuery(
    client,
    { target_user_id: userId, limit: LIST_LIMIT },
    { enabled: activeList === 'followers' && !!userId },
  );

  const followingsQuery = useFollowingsInfiniteQuery(
    client,
    { target_user_id: userId, limit: LIST_LIMIT },
    { enabled: activeList === 'followings' && !!userId },
  );

  const activeQuery = activeList === 'followers' ? followersQuery : followingsQuery;

  const users = useMemo<UserSimpleInfo[]>(() => {
    if (!activeQuery.data) {
      return [];
    }
    return activeQuery.data.pages.flatMap((page) => page.items);
  }, [activeQuery.data]);

  const openFollowers = useCallback(() => {
    setActiveList('followers');
  }, []);

  const openFollowings = useCallback(() => {
    setActiveList('followings');
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setActiveList(null);
    }
  }, []);

  const onLoadMore = useCallback(() => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      void activeQuery.fetchNextPage();
    }
  }, [activeQuery]);

  return {
    activeList,
    open: activeList != null,
    onOpenChange,
    openFollowers,
    openFollowings,
    users,
    isLoading: activeQuery.isLoading,
    hasNextPage: activeQuery.hasNextPage ?? false,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
    onLoadMore,
  };
}
