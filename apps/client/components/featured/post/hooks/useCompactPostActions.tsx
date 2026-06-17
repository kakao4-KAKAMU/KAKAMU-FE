import { mapPostLikeError } from '@/lib/error-message-map/post/post-like-error';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { useTranslation } from '@kakamu/i18n';
import { useDeletePostMutation, useLikeMutation } from '@kakamu/query';
import { PostItem } from '@kakamu/types';
import { useErrorAlertDialog } from '@kakamu/ui';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

export function useCompactPostActions(post: PostItem) {
  const client = useBackendApiClient();
  const currentUserId = useCurrentUserId();
  const router = useRouter();
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const deletePostMutation = useDeletePostMutation(client);
  const likeMutation = useLikeMutation(client, {
    onError: (err) => {
      openErrorAlert(mapPostLikeError(err, t));
    },
  });

  const isOwner = useMemo(() => {
    if (post.author_id == null) {
      return false;
    }
    return post.author_id === currentUserId;
  }, [post.author_id, currentUserId]);

  const onToggleLike = useCallback(() => {
    if (likeMutation.isPending) {
      return;
    }
    likeMutation.mutate({ target_type: 'POST', target_id: post.id });
  }, [likeMutation, post.id]);
  const onComment = useCallback(() => {
    console.log('onComment', post.id);
  }, [post.id]);
  const onToggleBookmark = useCallback(() => {
    console.log('onToggleBookmark', post.id);
  }, [post.id]);
  const onDelete = useCallback(() => {
    deletePostMutation.mutate({
      postId: post.id,
      userId: currentUserId ?? undefined,
    });
  }, [currentUserId, deletePostMutation, post.id]);
  const onModify = useCallback(() => {
    router.push(`/feed/write/${post.id}`);
  }, [post.id, router]);
  const onReport = useCallback(() => {
    console.log('onReport', post.id);
  }, [post.id]);
  return {
    isOwner,
    onToggleLike,
    onComment,
    onToggleBookmark,
    onDelete,
    onModify,
    onReport,
  };
}
