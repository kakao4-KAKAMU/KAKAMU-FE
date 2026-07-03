import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { useCommentByIdQuery } from '@kakamu/query';
import type { CommentItem } from '@kakamu/types';

import { CommentCard } from '@/components/featured/comment/CommentCard';
import { useCurrentUser } from '@/hooks/auth/useCurrentUserId';
import { useCommentAction } from '@/hooks/comment/useCommentAction';

type ProfileSavedCommentItemProps = {
  commentId: number;
};

function ProfileSavedCommentItem({ commentId }: ProfileSavedCommentItemProps) {
  const { t } = useTranslation();
  const currentUserId = useCurrentUser();
  const commentQuery = useCommentByIdQuery(commentId);
  const comment = commentQuery.data;
  const isOwner = comment.user.id != null && comment.user.id === currentUserId?.id;

  const {
    onToggleLike,
    onToggleSave,
    onDelete,
    onRevealSpoiler,
    onReport,
    isLikePending,
    isSavePending,
  } = useCommentAction({
    postId: 0,
    commentId,
  });

  const onReply = useCallback(() => {}, []);
  const onEdit = useCallback(() => {}, []);

  return (
    <CommentCard
      comment={comment}
      replyCount={0}
      isOwner={isOwner}
      anonymousLabel={t('shared.feedDetail.anonymousAuthor')}
      deleteLabel={t('shared.feedDetail.deleteComment')}
      editLabel={t('shared.feedDetail.editComment')}
      reportLabel={t('shared.feedDetail.reportComment')}
      onToggleLike={onToggleLike}
      onToggleSave={onToggleSave}
      onReply={onReply}
      onEdit={onEdit}
      onDelete={onDelete}
      onReport={onReport}
      onRevealSpoiler={onRevealSpoiler}
      isLikePending={isLikePending}
      isSavePending={isSavePending}
    />
  );
}

type ProfileSavedCommentsPanelProps = {
  commentIds: CommentItem['id'][];
};

export function ProfileSavedCommentsPanel({ commentIds }: ProfileSavedCommentsPanelProps) {
  if (commentIds.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      {commentIds.map((commentId) => (
        <ProfileSavedCommentItem key={commentId} commentId={commentId} />
      ))}
    </View>
  );
}
