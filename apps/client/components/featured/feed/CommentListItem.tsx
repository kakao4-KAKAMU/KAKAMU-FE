import { useCallback } from 'react';
import { useCommentByIdQuery } from '@kakamu/query';
import type { CommentItem } from '@kakamu/types';

import { CommentCard } from '@/components/featured/comment/CommentCard';
import { useCommentAction } from '@/hooks/comment/useCommentAction';

type CommentListItemProps = {
  postId: number;
  commentId: number;
  currentUserId: string | null;
  replyCount: number;
  anonymousLabel: string;
  deleteLabel: string;
  reportLabel: string;
  onReply: (comment: CommentItem) => void;
};

export function CommentListItem({
  postId,
  commentId,
  currentUserId,
  replyCount,
  anonymousLabel,
  deleteLabel,
  reportLabel,
  onReply,
}: CommentListItemProps) {
  const commentQuery = useCommentByIdQuery(commentId);
  const comment = commentQuery.data;
  const isOwner = comment.user.id != null && comment.user.id === currentUserId;

  const {
    onToggleLike,
    onDelete,
    onRevealSpoiler,
    onReport,
    isLikePending,
  } = useCommentAction({ postId, commentId });

  const handleReply = useCallback(() => onReply(comment), [comment, onReply]);

  return (
    <CommentCard
      comment={comment}
      replyCount={replyCount}
      isOwner={isOwner}
      anonymousLabel={anonymousLabel}
      deleteLabel={deleteLabel}
      reportLabel={reportLabel}
      onToggleLike={onToggleLike}
      onReply={handleReply}
      onDelete={onDelete}
      onReport={onReport}
      onRevealSpoiler={onRevealSpoiler}
      isLikePending={isLikePending}
    />
  );
}
