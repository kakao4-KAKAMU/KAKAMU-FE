import { Bot, MessageCircle, Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';

import type { ChatThreadRowViewModel } from '@/hooks/chat/use-chat-list-screen';

type ChatThreadRowProps = {
  thread: ChatThreadRowViewModel;
  onPress: () => void;
};

function ThreadIcon({ sessionId }: { sessionId: string }) {
  const icon =
    sessionId === 'new' ? MessageCircle : sessionId.length % 2 === 0 ? Sparkles : Bot;

  return (
    <View className="size-10 items-center justify-center rounded-full bg-muted">
      <TextClassProvider value="text-foreground">
        <Icon as={icon} size={18} />
      </TextClassProvider>
    </View>
  );
}

export function ChatThreadRow({ thread, onPress }: ChatThreadRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3.5 active:opacity-90"
    >
      <ThreadIcon sessionId={thread.sessionId} />
      <View className="min-w-0 flex-1 gap-0.5">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 font-semibold text-sm text-foreground" numberOfLines={1}>
            {thread.title}
          </Text>
          <Text className="text-[11px] text-muted-foreground">{thread.timeLabel}</Text>
        </View>
        <Text className="text-xs text-muted-foreground" numberOfLines={2}>
          {thread.preview}
        </Text>
      </View>
    </Pressable>
  );
}
