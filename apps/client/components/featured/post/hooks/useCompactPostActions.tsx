import { mapPostLikeError } from '@/lib/error-message-map/post/post-like-error';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useTranslation } from '@kakamu/i18n';
import { useDeletePostMutation, useLikeMutation, usePersonasQuery } from '@kakamu/query';
import { PostItem } from '@kakamu/types';
import { useErrorAlertDialog } from '@kakamu/ui';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

export function useCompactPostActions(post: PostItem) {
  const client = useBackendApiClient();
  const router = useRouter();
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { data: personas } = usePersonasQuery(client);
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
    return personas?.some((persona) => persona.id === post.author_id) ?? false;
  }, [post.author_id, personas]);

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
    deletePostMutation.mutate({ postId: post.id });
  }, [deletePostMutation, post.id]);
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
