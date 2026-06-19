import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@kakamu/i18n';
import { Text } from '@kakamu/ui';

import { ProfileSubpageHeader } from '@/components/featured/header/ProfileSubpageHeader';
import { CompactPost } from '@/components/featured/post/CompactPost';
import { CommentCard } from '@/components/featured/comment/CommentCard';
import { CommentComposer } from '@/components/featured/comment/CommentComposer';
import { ConditionalRender } from '@/components/utils/ConditionalRender';
import { useFeedDetail } from '@/hooks/feed/useFeedDetail';
import { AppSuspenseBoundary } from '@/components/error-boundary';
import { FeedDetailScreenContentSkeleton } from './FeedDetailScreenContent.skeleton';

type FeedDetailScreenContentProps = {
  postId: number;
  showCommentComposer?: boolean;
};

export function FeedDetailScreenContent({
  postId,
  showCommentComposer = false,
}: FeedDetailScreenContentProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background">
      <ProfileSubpageHeader title={t('shared.feedDetail.title')} />
      <AppSuspenseBoundary fallback={<FeedDetailScreenContentSkeleton />}>
        <FeedDetailScreenContentInner
          postId={postId}
          showCommentComposer={showCommentComposer}
        />
      </AppSuspenseBoundary>
    </View>
  );
}

function FeedDetailScreenContentInner({
  postId,
  showCommentComposer = false,
}: FeedDetailScreenContentProps) {
  const insets = useSafeAreaInsets();
  const {
    post,
    topLevelComments,
    replyCountById,
    isCommentsLoading,
    commentsErrorView,
    hasMoreComments,
    isLoadingMoreComments,
    loadMoreComments,
    draft,
    setDraft,
    onSubmit,
    canSubmit,
    isSubmitting,
    currentUserId,
    onToggleCommentLike,
    onDeleteComment,
    onRevealSpoiler,
    onReply,
    onReport,
    isLikePending,
    labels,
  } = useFeedDetail(postId);

  const renderComment = useCallback(
    ({ item }: { item: (typeof topLevelComments)[number] }) => (
      <CommentCard
        comment={item}
        replyCount={replyCountById.get(item.id) ?? 0}
        isOwner={item.user.id != null && item.user.id === currentUserId}
        anonymousLabel={labels.anonymousAuthor}
        deleteLabel={labels.deleteComment}
        reportLabel={labels.reportComment}
        onToggleLike={() => onToggleCommentLike(item)}
        onReply={() => onReply(item)}
        onDelete={() => onDeleteComment(item)}
        onReport={onReport}
        onRevealSpoiler={() => onRevealSpoiler(item)}
        isLikePending={isLikePending}
      />
    ),
    [
      currentUserId,
      labels,
      onDeleteComment,
      onReply,
      onReport,
      onRevealSpoiler,
      onToggleCommentLike,
      replyCountById,
      isLikePending,
    ],
  );

  const listHeader = (
    <View className="gap-2.5 pb-2">
      <CompactPost post={post} />
      <Text className="text-base font-bold text-foreground">
        {labels.commentsTitle}
      </Text>
      <ConditionalRender.Boolean
        condition={showCommentComposer}
        render={{
          true: (
            <CommentComposer
              value={draft}
              onChangeText={setDraft}
              onSend={onSubmit}
              canSend={canSubmit}
              isSubmitting={isSubmitting}
              placeholder={labels.placeholder}
              sendA11y={labels.sendA11y}
            />
          ),
          false: null,
        }}
      />
      <ConditionalRender.Boolean
        condition={commentsErrorView}
        render={{
          true: (
            <Text className="text-sm text-destructive">{commentsErrorView?.description}</Text>
          ),
          false: null,
        }}
      />
      <ConditionalRender.Boolean
        condition={isCommentsLoading && topLevelComments.length === 0}
        render={{
          true: (
            <Text className="py-4 text-center text-sm text-muted-foreground">
              {labels.loading}
            </Text>
          ),
          false: null,
        }}
      />
      <ConditionalRender.Boolean
        condition={!isCommentsLoading && topLevelComments.length === 0 && !commentsErrorView}
        render={{
          true: (
            <Text className="py-4 text-center text-sm text-muted-foreground">
              {labels.emptyComments}
            </Text>
          ),
          false: null,
        }}
      />
    </View>
  );

  const listFooter = (
    <ConditionalRender.Boolean
      condition={hasMoreComments}
      render={{
        true: (
          <Pressable
            className="items-center rounded-md py-3 active:opacity-80"
            onPress={loadMoreComments}
            disabled={isLoadingMoreComments}
          >
            <ConditionalRender.Boolean
              condition={isLoadingMoreComments}
              render={{
                true: <ActivityIndicator />,
                false: (
                  <Text className="text-sm text-muted-foreground">
                    {labels.loadMoreComments}
                  </Text>
                ),
              }}
            />
          </Pressable>
        ),
        false: null,
      }}
    />
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
        <FlatList
          data={topLevelComments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderComment}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
            gap: 10,
          }}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          keyboardShouldPersistTaps="handled"
        />

    </KeyboardAvoidingView>
  );
}
