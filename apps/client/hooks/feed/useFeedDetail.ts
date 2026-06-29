import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  buildCommentFormValidationMessages,
  useTranslation,
} from '@kakamu/i18n';
import {
  commentKeys,
  useCommentsByPostInfiniteQuery,
  useCreateCommentMutation,
  usePostByIdQuery,
  useUserQuery,
} from '@kakamu/query';
import { createCommentFormSchema, type CommentFormInput } from '@kakamu/schema';
import type { CommentItem } from '@kakamu/types';
import { useErrorAlertDialog } from '@kakamu/ui';

import {
  mapCommentCreateError,
  mapCommentListError,
} from '@/lib/error-message-map/comment/comment-error';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';

const DEFAULT_VALUES: CommentFormInput = {
  content: '',
  is_spoiler: false,
};

export function useFeedDetail(postId: number) {
  const client = useBackendApiClient();
  const queryClient = useQueryClient();
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

  const allCommentIds = useMemo(
    () => commentsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [commentsQuery.data?.pages],
  );

  const topLevelCommentIds = useMemo(() => {
    return allCommentIds.filter((commentId) => {
      const comment = queryClient.getQueryData<CommentItem>(commentKeys.detail(commentId));
      return comment?.parent_id == null;
    });
  }, [allCommentIds, commentsQuery.dataUpdatedAt, queryClient]);

  const replyCountById = useMemo(() => {
    const counts = new Map<number, number>();
    for (const commentId of allCommentIds) {
      const comment = queryClient.getQueryData<CommentItem>(commentKeys.detail(commentId));
      if (comment?.parent_id != null) {
        counts.set(comment.parent_id, (counts.get(comment.parent_id) ?? 0) + 1);
      }
    }
    return counts;
  }, [allCommentIds, commentsQuery.dataUpdatedAt, queryClient]);

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

  const onReply = useCallback((comment: CommentItem) => {
    setReplyParentId(comment.id);
  }, []);

  const loadMoreComments = useCallback(() => {
    if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
      void commentsQuery.fetchNextPage();
    }
  }, [commentsQuery]);

  const commentsErrorView = commentsQuery.isError ? mapCommentListError(commentsQuery.error, t) : null;

  return {
    post: postQuery.data,
    topLevelCommentIds,
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
    onReply,
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
      editComment: t('shared.feedDetail.editComment'),
      reportComment: t('shared.feedDetail.reportComment'),
    },
  };
}
