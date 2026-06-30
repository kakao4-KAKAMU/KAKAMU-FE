import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  buildCommentFormValidationMessages,
  useTranslation,
} from '@kakamu/i18n';
import { useCommentByIdQuery } from '@kakamu/query';
import { createCommentFormSchema } from '@kakamu/schema';
import type { CommentItem } from '@kakamu/types';
import { Text } from '@kakamu/ui';

import { CommentCard } from '@/components/featured/comment/CommentCard';
import { CommentComposer } from '@/components/featured/comment/CommentComposer';
import { ConditionalRender } from '@/components/utils/ConditionalRender';
import { useCommentAction } from '@/hooks/comment/useCommentAction';

type CommentListItemProps = {
  postId: number;
  commentId: number;
  currentUserId: string | null;
  replyCount: number;
  anonymousLabel: string;
  deleteLabel: string;
  editLabel: string;
  reportLabel: string;
  placeholder: string;
  sendA11y: string;
  onReply: (comment: CommentItem) => void;
};

export function CommentListItem({
  postId,
  commentId,
  currentUserId,
  replyCount,
  anonymousLabel,
  deleteLabel,
  editLabel,
  reportLabel,
  placeholder,
  sendA11y,
  onReply,
}: CommentListItemProps) {
  const { t } = useTranslation();
  const commentQuery = useCommentByIdQuery(commentId);
  const comment = commentQuery.data;
  const isOwner = comment.user.id != null && comment.user.id === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const commentSchema = useMemo(
    () => createCommentFormSchema(buildCommentFormValidationMessages(t)),
    [t],
  );

  const handleUpdateSuccess = useCallback(() => {
    setIsEditing(false);
    setDraft('');
  }, []);

  const {
    onToggleLike,
    onToggleSave,
    onDelete,
    onUpdate,
    onRevealSpoiler,
    onReport,
    isLikePending,
    isSavePending,
    isUpdatePending,
  } = useCommentAction({
    postId,
    commentId,
    onUpdateSuccess: handleUpdateSuccess,
  });

  const handleReply = useCallback(() => onReply(comment), [comment, onReply]);

  const handleEdit = useCallback(() => {
    setDraft(comment.content);
    setIsEditing(true);
  }, [comment.content]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setDraft('');
  }, []);

  const canSubmit = useMemo(() => {
    const parsed = commentSchema.safeParse({
      content: draft,
      is_spoiler: comment.is_spoiler,
    });
    return (
      parsed.success &&
      draft.trim() !== comment.content.trim() &&
      !isUpdatePending
    );
  }, [comment.content, comment.is_spoiler, commentSchema, draft, isUpdatePending]);

  const handleSubmitEdit = useCallback(() => {
    if (!canSubmit) {
      return;
    }
    onUpdate({
      content: draft.trim(),
      is_spoiler: comment.is_spoiler ? 1 : 0,
    });
  }, [canSubmit, comment.is_spoiler, draft, onUpdate]);

  return (
    <ConditionalRender.Boolean
      condition={isEditing}
      render={{
        true: (
          <View className="gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
            <View className="flex-row items-center justify-end">
              <Pressable onPress={handleCancelEdit} hitSlop={8}>
                <Text className="text-sm text-muted-foreground">
                  {t('account.post.write.cancel')}
                </Text>
              </Pressable>
            </View>
            <CommentComposer
              value={draft}
              onChangeText={setDraft}
              onSend={handleSubmitEdit}
              canSend={canSubmit}
              isSubmitting={isUpdatePending}
              placeholder={placeholder}
              sendA11y={sendA11y}
            />
          </View>
        ),
        false: (
          <CommentCard
            comment={comment}
            replyCount={replyCount}
            isOwner={isOwner}
            anonymousLabel={anonymousLabel}
            deleteLabel={deleteLabel}
            editLabel={editLabel}
            reportLabel={reportLabel}
            onToggleLike={onToggleLike}
            onToggleSave={onToggleSave}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={onDelete}
            onReport={onReport}
            onRevealSpoiler={onRevealSpoiler}
            isLikePending={isLikePending}
            isSavePending={isSavePending}
          />
        ),
      }}
    />
  );
}
