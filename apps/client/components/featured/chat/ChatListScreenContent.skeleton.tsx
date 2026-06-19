import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

function ChatThreadRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3.5">
      <Skeleton className="size-10 rounded-full" />
      <View className="min-w-0 flex-1 gap-1.5">
        <View className="flex-row items-center justify-between gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-10" />
        </View>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </View>
    </View>
  );
}

export function ChatListScreenContentSkeleton() {
  return (
    <View className="gap-2.5 px-4">
      <ChatThreadRowSkeleton />
      <ChatThreadRowSkeleton />
      <ChatThreadRowSkeleton />
      <ChatThreadRowSkeleton />
      <ChatThreadRowSkeleton />
    </View>
  );
}
