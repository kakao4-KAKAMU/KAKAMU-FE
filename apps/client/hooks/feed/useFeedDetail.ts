import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  buildCommentFormValidationMessages,
  useTranslation,
} from '@kakamu/i18n';
import {
  useCommentsByPostInfiniteQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useLikeMutation,
  usePostByIdQuery,
  useRevealCommentSpoilerMutation,
  useUserQuery,
} from '@kakamu/query';
import { createCommentFormSchema, type CommentFormInput } from '@kakamu/schema';
import type { CommentItem } from '@kakamu/types';
import { useErrorAlertDialog } from '@kakamu/ui';

import {
  mapCommentCreateError,
  mapCommentDeleteError,
  mapCommentLikeError,
  mapCommentListError,
  mapCommentSpoilerError,
} from '@/lib/error-message-map/comment/comment-error';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';

const DEFAULT_VALUES: CommentFormInput = {
  content: '',
  is_spoiler: false,
};

export function useFeedDetail(postId: number) {
  const client = useBackendApiClient();
  const currentUserId = useCurrentUserId();
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const [replyParentId, setReplyParentId] = useState<number | null>(null);

  const commentSchema = useMemo(
    () => createCommentFormSchema(buildCommentFormValidationMessages(t)),
    [t],
  );

  const form = useForm<CommentFormInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const postQuery = usePostByIdQuery(client, postId);
  const commentsQuery = useCommentsByPostInfiniteQuery(client, postId);
  const userQuery = useUserQuery(client, currentUserId ?? '');

  const createCommentMutation = useCreateCommentMutation(client, {
    onSuccess: () => {
      form.reset(DEFAULT_VALUES);
      setReplyParentId(null);
    },
    onError: (error) => {
      openErrorAlert(mapCommentCreateError(error, t));
    },
  });

  const deleteCommentMutation = useDeleteCommentMutation(client, {
    onError: (error) => {
      openErrorAlert(mapCommentDeleteError(error, t));
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

  const allComments = useMemo(
    () => commentsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [commentsQuery.data?.pages],
  );

  const topLevelComments = useMemo(
    () => allComments.filter((comment) => comment.parent_id == null),
    [allComments],
  );

  const replyCountById = useMemo(() => {
    const counts = new Map<number, number>();
    for (const comment of allComments) {
      if (comment.parent_id != null) {
        counts.set(comment.parent_id, (counts.get(comment.parent_id) ?? 0) + 1);
      }
    }
    return counts;
  }, [allComments]);

  const commentCount = postQuery.data?.comment_count ?? commentsQuery.data?.pages[0]?.meta.total_count ?? 0;

  const authorName = useMemo(() => {
    if (!userQuery.data) {
      return undefined;
    }
    return userQuery.data.tag ? `@${userQuery.data.tag}` : userQuery.data.nickname;
  }, [userQuery.data]);

  const canSubmit =
    form.formState.isValid && !createCommentMutation.isPending && !!currentUserId;

  const onSubmit = form.handleSubmit((values) => {
    createCommentMutation.mutate({
      postId,
      content: values.content.trim(),
      parent_id: replyParentId,
      is_spoiler: values.is_spoiler ? 1 : 0,
      authorId: currentUserId ?? undefined,
      authorName,
    });
  });

  const onToggleCommentLike = useCallback(
    (comment: CommentItem) => {
      if (likeMutation.isPending) {
        return;
      }
      likeMutation.mutate({ target_type: 'COMMENT', target_id: comment.id });
    },
    [likeMutation],
  );

  const onDeleteComment = useCallback(
    (comment: CommentItem) => {
      deleteCommentMutation.mutate({ commentId: comment.id, postId });
    },
    [deleteCommentMutation, postId],
  );

  const onRevealSpoiler = useCallback(
    (comment: CommentItem) => {
      if (revealSpoilerMutation.isPending) {
        return;
      }
      revealSpoilerMutation.mutate({ commentId: comment.id, postId });
    },
    [postId, revealSpoilerMutation],
  );

  const onReply = useCallback((comment: CommentItem) => {
    setReplyParentId(comment.id);
  }, []);

  const onReport = useCallback(() => {
    // TODO: 신고 플로우 연결
  }, []);

  const loadMoreComments = useCallback(() => {
    if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
      void commentsQuery.fetchNextPage();
    }
  }, [commentsQuery]);

  const commentsErrorView = commentsQuery.isError ? mapCommentListError(commentsQuery.error, t) : null;

  return {
    post: postQuery.data,
    topLevelComments,
    replyCountById,
    commentCount,
    isCommentsLoading: commentsQuery.isLoading,
    commentsErrorView,
    hasMoreComments: commentsQuery.hasNextPage ?? false,
    isLoadingMoreComments: commentsQuery.isFetchingNextPage,
    loadMoreComments,
    form,
    draft: form.watch('content'),
    setDraft: (value: string) => form.setValue('content', value, { shouldValidate: true }),
    onSubmit,
    canSubmit,
    isSubmitting: createCommentMutation.isPending,
    currentUserId,
    onToggleCommentLike,
    onDeleteComment,
    onRevealSpoiler,
    onReply,
    onReport,
    isLikePending: likeMutation.isPending,
    labels: {
      title: t('shared.feedDetail.title'),
      commentsTitle: t('shared.feedDetail.commentsTitle', { count: commentCount }),
      placeholder: t('shared.feedDetail.commentPlaceholder'),
      sendA11y: t('shared.feedDetail.sendComment'),
      loading: t('shared.feedDetail.loading'),
      loadMoreComments: t('shared.feedDetail.loadMoreComments'),
      emptyComments: t('shared.feedDetail.emptyComments'),
      anonymousAuthor: t('shared.feedDetail.anonymousAuthor'),
      reply: t('shared.feedDetail.reply'),
      deleteComment: t('shared.feedDetail.deleteComment'),
      reportComment: t('shared.feedDetail.reportComment'),
    },
  };
}
