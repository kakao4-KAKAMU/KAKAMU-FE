import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { useFollowUserMutation, useUnfollowUserMutation } from '@kakamu/query';
import { useErrorAlertDialog } from '@kakamu/ui';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

type UseProfileFollowActionsParams = {
  userId: string;
  isFollowing: boolean;
};

export function useProfileFollowActions({ userId, isFollowing }: UseProfileFollowActionsParams) {
  const client = useBackendApiClient();
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();

  const onError = useCallback(() => {
    openErrorAlert({
      title: t('account.profile.actions.followError.title'),
      description: t('account.profile.actions.followError.description'),
    });
  }, [openErrorAlert, t]);

  const followMutation = useFollowUserMutation(client, { onError });
  const unfollowMutation = useUnfollowUserMutation(client, { onError });

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const onToggleFollow = useCallback(() => {
    if (isPending || !userId) {
      return;
    }

    if (isFollowing) {
      unfollowMutation.mutate({ userId });
      return;
    }

    followMutation.mutate({ userId });
  }, [followMutation, isFollowing, isPending, unfollowMutation, userId]);

  return {
    isPending,
    onToggleFollow,
  };
}
