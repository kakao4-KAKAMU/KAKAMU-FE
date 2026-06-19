import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

import { CompactPostSkeleton } from '@/components/featured/post/CompactPost.skeleton';

function CommentCardSkeleton() {
  return (
    <View className="gap-2 rounded-xl border border-border bg-card p-3">
      <View className="flex-row items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <View className="flex-1 gap-1">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3 w-14" />
        </View>
      </View>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
    </View>
  );
}

export function FeedDetailScreenContentSkeleton() {
  return (
    <View className="gap-2.5 px-4 pt-2">
      <CompactPostSkeleton />
      <Skeleton className="mt-2 h-5 w-24" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <View className="gap-2.5">
        <CommentCardSkeleton />
        <CommentCardSkeleton />
        <CommentCardSkeleton />
      </View>
    </View>
  );
}
