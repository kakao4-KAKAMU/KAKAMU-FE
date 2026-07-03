import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native-gesture-handler';
import type { MentionUserItem } from '@kakamu/types';
import { cn, Text } from '@kakamu/ui';

import {
  parseTaggedContent,
  resolveMentionUserId,
} from '@/lib/content/parse-tagged-content';

type TaggedContentTextProps = {
  content: string;
  mentions?: MentionUserItem[];
  className?: string;
  linkClassName?: string;
};

export function TaggedContentText({
  content,
  mentions,
  className,
  linkClassName,
}: TaggedContentTextProps) {
  const router = useRouter();
  const segments = useMemo(() => parseTaggedContent(content), [content]);
  const linkCn = cn('font-medium text-primary', linkClassName);

  const onMentionPress = useCallback(
    (nickname: string, tag: string) => {
      const userId = resolveMentionUserId(mentions, nickname, tag);
      if (userId) {
        router.push(`/profile/${userId}`);
        return;
      }

      router.push({
        pathname: '/search/person',
        params: { q: `@${nickname}#${tag}` },
      });
    },
    [mentions, router],
  );

  const onHashtagPress = useCallback(
    (tag: string) => {
      router.push({
        pathname: '/search/feed',
        params: { q: `#${tag}` },
      });
    },
    [router],
  );

  const onPressTaggedContent = useCallback((segment: typeof segments[number]) => {
    if (segment.type === 'mention') {
      onMentionPress(segment.nickname, segment.tag);
    } else if (segment.type === 'hashtag') {
      onHashtagPress(segment.tag);
    }
  }, [onMentionPress, onHashtagPress, segments]);

  if (segments.length === 0) {
    return null;
  }

  if (segments.length === 1 && segments[0].type === 'text') {
    return <Text className={className}>{segments[0].value}</Text>;
  }

  return (
    <Text className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return segment.value;
        }

        if (segment.type === 'mention') {
          return (
            <Pressable
              key={`mention-${index}`}
              accessibilityRole="link"
              onPress={() => {
                onPressTaggedContent(segment)
              }}
            >
              <Text className={linkCn}>
                @{segment.nickname}#{segment.tag}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={`hashtag-${index}`}
            accessibilityRole="link"
            onPress={() => {
            onPressTaggedContent(segment)
          }}>
            <Text
              className={linkCn}
            >
              #{segment.tag}
            </Text>
          </Pressable>
        );
      })}
    </Text>
  );
}
