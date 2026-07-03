import { useRef, useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import type { PostItem } from '@kakamu/types';
import { cn, Text } from '@kakamu/ui';
import { TaggedContentText } from '@/components/featured/content/TaggedContentText';
import { CompactPostAuthorRow } from './CompactPostAuthorRow';
import { CompactPostSpoilerBadge } from './CompactPostSpoilerBadge';
import { CompactPostImageList } from './CompactPostImageList';
import { CompactPostMovieCard } from './CompactPostMovieCard';
import { CompactPostActions } from './CompactPostActions';
import { ConditionalRender } from '@/components/utils';
import { useCompactPostActions } from './hooks/useCompactPostActions';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { usePostByIdQuery } from '@kakamu/query';

type CompactPostProps = {
  postId: PostItem['id'];
  onContentPress?: () => void;
};

export function CompactPost({ postId, onContentPress }: CompactPostProps) {
  const apiClient = useBackendApiClient();
  const postQuery = usePostByIdQuery(apiClient, postId);
  const post = postQuery.data;
  const blurTargetRef = useRef<View>(null);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const actions = useCompactPostActions(post);
  const isSpoilerHidden = useMemo(() => post.is_spoiler && !spoilerRevealed, [post.is_spoiler, spoilerRevealed]);
  const handleContentPress = useCallback(() => {
    onContentPress?.();
    actions.onGotoDetail();
  }, [onContentPress]);
  return (
    <View className="gap-2.5 border-b border-border py-3" ref={blurTargetRef}>
      <CompactPostAuthorRow userId={post.user.id} createdAt={post.created_at} />
      <View className="relative">
        <ConditionalRender.Boolean
          condition={post.title}
          render={{
            true: (
              <Text className="text-[15px] font-bold leading-snug text-foreground">
                {post.title}
              </Text>
            ),
            false: null,
          }}
        />
        <View
          className={cn('gap-2.5 relative', isSpoilerHidden ? 'pointer-events-none' : 'pointer-events-auto')}
        >
          <ConditionalRender.Boolean
            condition={post.content}
            render={{
              true: (
                <TaggedContentText
                  content={post.content}
                  mentions={post.mentions}
                  className="text-sm leading-relaxed text-foreground"
                  onPress={handleContentPress}
                />
              )
            }}
          />
          <CompactPostImageList urls={post.image_urls} />
        </View>
        <BlurView className="absolute -my-1 -mx-4 px-4 inset-0 bg-background/0! pointer-events-none flex justify-start items-end" intensity={isSpoilerHidden ? 17 : 0} blurTarget={blurTargetRef}>
          <ConditionalRender.Boolean
            condition={post.is_spoiler}
            render={{
              true: <CompactPostSpoilerBadge
                className="pointer-events-auto"
                revealed={spoilerRevealed}
                onToggle={() => {
                  setSpoilerRevealed((prev) => !prev)
                }}
              />
            }}
          />
        </BlurView>
      </View>
      <ConditionalRender.Boolean
        condition={post.movies.length}
        render={{
          true: post.movies.map((movie) => (
            <CompactPostMovieCard key={movie.id} movieId={movie.id} />
          )),
        }}
      />
      <CompactPostActions
        post={post}
        {...actions}
      />
    </View>
  );
}
