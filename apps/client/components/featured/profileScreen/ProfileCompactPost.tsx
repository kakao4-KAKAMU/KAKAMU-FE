import { View } from 'react-native';
import { Clapperboard, Heart, MessageCircle, MoreHorizontal, User } from 'lucide-react-native';
import { Icon, Text, TextClassContext } from '@kakamu/ui';
import type { ProfileCompactPost as ProfileCompactPostType } from './types';

type ProfileCompactPostProps = {
  post: ProfileCompactPostType;
};

export function ProfileCompactPost({ post }: ProfileCompactPostProps) {
  return (
    <View className="gap-2.5 border-b border-border py-3">
      <View className="flex-row items-center gap-2.5">
        <View className="h-9 w-9 items-center justify-center rounded-full border border-border bg-muted">
          <Icon as={User} size={16} className="text-muted-foreground" />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-bold text-foreground">{post.authorName}</Text>
          <Text className="text-xs text-muted-foreground">
            {post.authorHandle} · {post.timeLabel}
          </Text>
        </View>
      </View>

      <Text className="text-sm leading-relaxed text-foreground">{post.body}</Text>

      <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-3">
        <View className="h-10 w-10 items-center justify-center rounded bg-muted">
          <Icon as={Clapperboard} size={18} className="text-muted-foreground" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{post.movieTitle}</Text>
          <Text className="text-xs text-muted-foreground">{post.movieDurationMin} min</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <TextClassContext.Provider value="text-muted-foreground">
            <Icon as={MessageCircle} size={16} />
          </TextClassContext.Provider>
          <Text className="text-xs text-muted-foreground">{post.commentCount}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <TextClassContext.Provider value="text-muted-foreground">
            <Icon as={Heart} size={16} />
          </TextClassContext.Provider>
          <Text className="text-xs text-muted-foreground">{post.likeCount}</Text>
        </View>
        <TextClassContext.Provider value="text-muted-foreground">
          <Icon as={MoreHorizontal} size={16} />
        </TextClassContext.Provider>
      </View>
    </View>
  );
}
