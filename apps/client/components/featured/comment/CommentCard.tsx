import { useRef, useState } from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import type { CommentItem } from '@kakamu/types';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Text,
  TextClassProvider,
} from '@kakamu/ui';
import { Ellipsis, Heart, MessageCircle, User } from 'lucide-react-native';

import { ConditionalRender } from '@/components/utils/ConditionalRender';
import { CompactPostSpoilerBadge } from '@/components/featured/post/CompactPostSpoilerBadge';
import { formatRelativeTime } from '@/lib/time';

type CommentCardProps = {
  comment: CommentItem;
  replyCount: number;
  isOwner: boolean;
  anonymousLabel: string;
  deleteLabel: string;
  reportLabel: string;
  onToggleLike: () => void;
  onReply: () => void;
  onDelete: () => void;
  onReport: () => void;
  onRevealSpoiler: () => void;
  isLikePending?: boolean;
};

function getAuthorInitials(author: string): string {
  const trimmed = author.replace(/^@/, '').trim();
  if (!trimmed) {
    return '?';
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function CommentCard({
  comment,
  replyCount,
  isOwner,
  anonymousLabel,
  deleteLabel,
  reportLabel,
  onToggleLike,
  onReply,
  onDelete,
  onReport,
  onRevealSpoiler,
  isLikePending = false,
}: CommentCardProps) {
  const blurTargetRef = useRef<View>(null);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const isAnonymous = !comment.author;
  const timeLabel = formatRelativeTime(comment.created_at);
  const isSpoilerHidden = comment.is_spoiler && !spoilerRevealed;

  const handleSpoilerToggle = () => {
    if (comment.is_spoiler && !spoilerRevealed) {
      onRevealSpoiler();
    }
    setSpoilerRevealed((prev) => !prev);
  };

  return (
    <View className="gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="gap-2.5">
        <View className="flex-row items-center gap-3">
          <Avatar className="size-10 border border-border bg-muted" alt={comment.author || anonymousLabel}>
            <AvatarFallback className="bg-muted">
              {isAnonymous ? (
                <Icon as={User} size={16} className="text-muted-foreground" />
              ) : (
                <Text className="text-xs font-semibold text-muted-foreground">
                  {getAuthorInitials(comment.author)}
                </Text>
              )}
            </AvatarFallback>
          </Avatar>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-sm font-semibold text-foreground">
              {isAnonymous ? anonymousLabel : comment.author}
            </Text>
            {timeLabel ? (
              <Text className="text-xs text-muted-foreground">{timeLabel}</Text>
            ) : null}
          </View>
        </View>

        <View className="relative" ref={blurTargetRef}>
          <View
            className="rounded-lg bg-muted px-3 py-2.5"
            pointerEvents={isSpoilerHidden ? 'none' : 'auto'}
          >
            <Text className="text-sm leading-relaxed text-foreground">{comment.content}</Text>
          </View>
          <ConditionalRender.Boolean
            condition={comment.is_spoiler}
            render={{
              true: (
                <BlurView
                  className="absolute inset-0 rounded-lg bg-background/0!"
                  intensity={isSpoilerHidden ? 17 : 0}
                  blurTarget={blurTargetRef}
                >
                  <CompactPostSpoilerBadge
                    className="absolute right-2 top-2"
                    revealed={spoilerRevealed}
                    onToggle={handleSpoilerToggle}
                  />
                </BlurView>
              ),
              false: null,
            }}
          />
        </View>

        <View className="flex-row items-center gap-4">
          <TextClassProvider value="text-muted-foreground">
            <Button size="text" variant="ghost" onPress={onReply}>
              <View className="flex-row items-center gap-1">
                <Icon as={MessageCircle} size={16} />
                <Text className="text-xs">{replyCount}</Text>
              </View>
            </Button>
            <Button
              size="text"
              variant="ghost"
              onPress={onToggleLike}
              disabled={isLikePending}
            >
              <View className="flex-row items-center gap-1">
                <Icon
                  as={Heart}
                  size={16}
                  fill={comment.is_liked ? 'currentColor' : 'none'}
                />
                <Text className="text-xs">{comment.like_count}</Text>
              </View>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="text" variant="ghost">
                  <Icon as={Ellipsis} size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ConditionalRender.Boolean
                  condition={isOwner}
                  render={{
                    true: (
                      <DropdownMenuItem onPress={onDelete}>
                        <Text>{deleteLabel}</Text>
                      </DropdownMenuItem>
                    ),
                    false: (
                      <DropdownMenuItem onPress={onReport}>
                        <Text>{reportLabel}</Text>
                      </DropdownMenuItem>
                    ),
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </TextClassProvider>
        </View>
      </View>
    </View>
  );
}
