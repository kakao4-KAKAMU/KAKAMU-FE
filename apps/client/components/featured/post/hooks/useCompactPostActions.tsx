import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useDeletePostMutation, usePersonasQuery } from '@kakamu/query';
import { PostItem } from '@kakamu/types';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

export function useCompactPostActions(post: PostItem) {
  const client = useBackendApiClient();
  const { data: personas } = usePersonasQuery(client);
  const deletePostMutation = useDeletePostMutation(client, {

  });

  const isOwner = useMemo(() => {
    if (post.author_id == null) {
      return false;
    }
    return personas?.some((persona) => persona.id === post.author_id) ?? false;
  }, [post.author_id, personas]);

  const onToggleLike = useCallback(() => {
    console.log('onToggleLike', post.id);
  }, [post.id]);
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
    console.log('onModify', post.id);
  }, [post.id]);
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