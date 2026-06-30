import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import {
  useDeleteCommentMutation,
  useLikeMutation,
  useRevealCommentSpoilerMutation,
  useSaveMutation,
  useUpdateCommentMutation,
} from '@kakamu/query';
import type { CommentUpdateRequest } from '@kakamu/types';
import { useErrorAlertDialog } from '@kakamu/ui';

import {
  mapCommentDeleteError,
  mapCommentLikeError,
  mapCommentSpoilerError,
  mapCommentUpdateError,
} from '@/lib/error-message-map/comment/comment-error';
import { mapSaveError } from '@/lib/error-message-map/save/save-error';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

type UseCommentActionParams = {
  postId: number;
  commentId: number;
  onUpdateSuccess?: () => void;
};

export function useCommentAction({
  postId,
  commentId,
  onUpdateSuccess,
}: UseCommentActionParams) {
  const client = useBackendApiClient();
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();

  const deleteCommentMutation = useDeleteCommentMutation(client, {
    onError: (error) => {
      openErrorAlert(mapCommentDeleteError(error, t));
    },
  });

  const updateCommentMutation = useUpdateCommentMutation(client, {
    onSuccess: onUpdateSuccess,
    onError: (error) => {
      openErrorAlert(mapCommentUpdateError(error, t));
    },
  });

  const revealSpoilerMutation = useRevealCommentSpoilerMutation(client, {
    onError: (error) => {
      openErrorAlert(mapCommentSpoilerError(error, t));
    },
  });

  const likeMutation = useLikeMutation(client, {
    onError: (error) => {
      openErrorAlert(mapCommentLikeError(error, t));
    },
  });

  const saveMutation = useSaveMutation(client, {
    onError: (error) => {
      openErrorAlert(mapSaveError(error, t));
    },
  });

  const onToggleLike = useCallback(() => {
    if (likeMutation.isPending) {
      return;
    }
    likeMutation.mutate({ target_type: 'COMMENT', target_id: commentId });
  }, [commentId, likeMutation]);

  const onToggleSave = useCallback(() => {
    if (saveMutation.isPending) {
      return;
    }
    saveMutation.mutate({ target_type: 'COMMENT', target_id: commentId });
  }, [commentId, saveMutation]);

  const onDelete = useCallback(() => {
    deleteCommentMutation.mutate({ commentId, postId });
  }, [commentId, deleteCommentMutation, postId]);

  const onUpdate = useCallback(
    (body: CommentUpdateRequest) => {
      if (updateCommentMutation.isPending) {
        return;
      }
      updateCommentMutation.mutate({ commentId, postId, body });
    },
    [commentId, postId, updateCommentMutation],
  );

  const onRevealSpoiler = useCallback(() => {
    if (revealSpoilerMutation.isPending) {
      return;
    }
    revealSpoilerMutation.mutate({ commentId, postId });
  }, [commentId, postId, revealSpoilerMutation]);

  const onReport = useCallback(() => {
    // TODO: 신고 플로우 연결
  }, []);

  return {
    onToggleLike,
    onToggleSave,
    onDelete,
    onUpdate,
    onRevealSpoiler,
    onReport,
    isLikePending: likeMutation.isPending,
    isSavePending: saveMutation.isPending,
    isDeletePending: deleteCommentMutation.isPending,
    isUpdatePending: updateCommentMutation.isPending,
    isRevealSpoilerPending: revealSpoilerMutation.isPending,
  };
}
