import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

export function CompactPostSkeleton() {
  return (
    <View className="gap-2.5 border-b border-border py-3">
      <View className="flex-row items-center gap-2.5">
        <Skeleton className="size-9 rounded-full" />
        <View className="min-w-0 flex-1 gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </View>
        <Skeleton className="h-8 w-14 rounded-md" />
      </View>

      <Skeleton className="h-4 w-3/4" />
      <View className="gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-4/5" />
      </View>

      <View className="flex-row gap-4 pt-1">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </View>
    </View>
  );
}
