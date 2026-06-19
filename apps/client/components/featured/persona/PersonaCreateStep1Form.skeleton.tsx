import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

export function PersonaCreateStep1FormSkeleton() {
  return (
    <View className="flex-1 gap-8">
      <View className="gap-6">
        <View className="gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </View>
        <View className="items-center gap-3">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </View>
        <View className="gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-24 w-full rounded-md" />
        </View>
      </View>
      <Skeleton className="h-10 w-full rounded-md" />
    </View>
  );
}
