import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

function ChatMessageBubbleSkeleton({ align }: { align: 'left' | 'right' }) {
  return (
    <View className={align === 'right' ? 'items-end' : 'items-start'}>
      <Skeleton
        className={`h-12 rounded-2xl ${align === 'right' ? 'w-48' : 'w-56'}`}
      />
    </View>
  );
}

export function ChatConversationScreenContentSkeleton() {
  return (
    <View className="flex-1 gap-3 px-4 pt-2">
      <ChatMessageBubbleSkeleton align="left" />
      <ChatMessageBubbleSkeleton align="right" />
      <ChatMessageBubbleSkeleton align="left" />
      <ChatMessageBubbleSkeleton align="right" />
      <View className="mt-auto gap-2 pb-2">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </View>
    </View>
  );
}
