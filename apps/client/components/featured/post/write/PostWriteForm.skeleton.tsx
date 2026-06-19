import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

export function PostWriteFormSkeleton() {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full rounded-md" />
      </View>
      <View className="gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-28 w-full rounded-md" />
      </View>
      <View className="flex-row flex-wrap gap-2">
        <Skeleton className="size-20 rounded-lg" />
        <Skeleton className="size-20 rounded-lg" />
        <Skeleton className="size-20 rounded-lg" />
      </View>
      <Skeleton className="h-10 w-full rounded-md" />
      <View className="flex-row gap-2">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </View>
    </View>
  );
}
