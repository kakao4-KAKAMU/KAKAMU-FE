import { useCallback } from 'react';
import { useCommentByIdQuery } from '@kakamu/query';
import type { CommentItem } from '@kakamu/types';

import { CommentCard } from '@/components/featured/comment/CommentCard';

type CommentListItemProps = {
  commentId: number;
  currentUserId: string | null;
  replyCount: number;
  anonymousLabel: string;
  deleteLabel: string;
  reportLabel: string;
  onToggleLike: (comment: CommentItem) => void;
  onReply: (comment: CommentItem) => void;
  onDelete: (comment: CommentItem) => void;
  onReport: () => void;
  onRevealSpoiler: (comment: CommentItem) => void;
  isLikePending?: boolean;
};

export function CommentListItem({
  commentId,
  currentUserId,
  replyCount,
  anonymousLabel,
  deleteLabel,
  reportLabel,
  onToggleLike,
  onReply,
  onDelete,
  onReport,
  onRevealSpoiler,
  isLikePending = false,
}: CommentListItemProps) {
  const commentQuery = useCommentByIdQuery(commentId);
  const comment = commentQuery.data;
  const isOwner = comment.user.id != null && comment.user.id === currentUserId;

  const handleToggleLike = useCallback(() => onToggleLike(comment), [comment, onToggleLike]);
  const handleReply = useCallback(() => onReply(comment), [comment, onReply]);
  const handleDelete = useCallback(() => onDelete(comment), [comment, onDelete]);
  const handleRevealSpoiler = useCallback(
    () => onRevealSpoiler(comment),
    [comment, onRevealSpoiler],
  );

  return (
    <CommentCard
      comment={comment}
      replyCount={replyCount}
      isOwner={isOwner}
      anonymousLabel={anonymousLabel}
      deleteLabel={deleteLabel}
      reportLabel={reportLabel}
      onToggleLike={handleToggleLike}
      onReply={handleReply}
      onDelete={handleDelete}
      onReport={onReport}
      onRevealSpoiler={handleRevealSpoiler}
      isLikePending={isLikePending}
    />
  );
}
