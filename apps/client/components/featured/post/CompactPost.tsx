import { useRef, useState, useMemo } from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import type { PostItem } from '@kakamu/types';
import { Text } from '@kakamu/ui';
import { CompactPostAuthorRow } from './CompactPostAuthorRow';
import { CompactPostSpoilerBadge } from './CompactPostSpoilerBadge';
import { CompactPostImageList } from './CompactPostImageList';
import { CompactPostMovieCard } from './CompactPostMovieCard';
import { CompactPostActions } from './CompactPostActions';
import { ConditionalRender } from '@/components/utils';
import { useCompactPostActions } from './hooks/useCompactPostActions';

type CompactPostProps = {
  post: PostItem;
};

export function CompactPost({ post }: CompactPostProps) {
  const blurTargetRef = useRef<View>(null);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const actions = useCompactPostActions(post);
  const isSpoilerHidden = useMemo(() => post.is_spoiler && !spoilerRevealed, [post.is_spoiler, spoilerRevealed]);
  const primaryMovie = post.movies;

  return (
    <View className="gap-2.5 border-b border-border py-3" ref={blurTargetRef}>
      <CompactPostAuthorRow post={post} />
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
          className="gap-2.5 relative"
          pointerEvents={isSpoilerHidden ? 'none' : 'auto'}
        >
          <ConditionalRender.Boolean
            condition={post.content}
            render={{
              true: <Text className="text-sm leading-relaxed text-foreground">
                {post.content}
              </Text>
            }}
          />
          <CompactPostImageList urls={post.image_urls} />
        </View>
        <BlurView className="absolute -m-1 inset-0 bg-background/0!" intensity={isSpoilerHidden ? 17 : 0} blurTarget={blurTargetRef}>
          <ConditionalRender.Boolean
            condition={post.is_spoiler}
            render={{
              true: <CompactPostSpoilerBadge
                className="absolute top-2 right-2"
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
            <CompactPostMovieCard key={movie.id} movie={movie} />
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
