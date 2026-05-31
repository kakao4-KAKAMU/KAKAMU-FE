import { View } from 'react-native';
import type { PostItem } from '@kakamu/types';
import { Avatar, AvatarFallback, AvatarImage, cn, Icon, Text } from '@kakamu/ui';
import { formatPostRelativeTime } from './utils/formatPostRelativeTime';
import { User } from 'lucide-react-native';
import { convertImagePath } from '@/lib/upload/convert-image-path';

export function CompactPostAuthorRow({ post }: { post: PostItem }) {
  const ANONYMOUS_AUTHOR_LABEL = '알 수 없음';
  const isAnonymous = post.author == null;
  const timeLabel = formatPostRelativeTime(post.created_at);
  const metaLabel = isAnonymous
    ? timeLabel
    : timeLabel;
    // : [post.author_id ? `@${post.author_id}` : null, timeLabel].filter(Boolean).join(' · ');

  return (
    <View className="flex-row items-center gap-2.5">
      <Avatar
        className={cn('size-9 border border-border bg-muted', isAnonymous && 'opacity-60')}
        alt={post.author ?? ANONYMOUS_AUTHOR_LABEL}
      >
        {post.author_image ? (
          <AvatarImage source={{ uri: convertImagePath(post.author_image) }} />
        ) : null}
        <AvatarFallback className="bg-muted">
          <Icon as={User} size={16} className="text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 gap-0.5">
        <Text
          className={cn(
            'text-sm text-foreground',
            isAnonymous ? 'font-normal text-muted-foreground' : 'font-bold'
          )}
        >
          {isAnonymous ? ANONYMOUS_AUTHOR_LABEL : post.author}
        </Text>
        {metaLabel ? (
          <Text className="text-xs text-muted-foreground">{metaLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}