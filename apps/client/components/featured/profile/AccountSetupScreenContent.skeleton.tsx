import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

export function AccountSetupScreenContentSkeleton() {
  return (
    <View className="flex-col gap-4 px-5 pb-6">
      <View className="flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <View className="flex-col gap-2.5">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </View>
      </View>
      <View className="flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <View className="flex-col gap-2.5">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </View>
      </View>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </View>
  );
}
