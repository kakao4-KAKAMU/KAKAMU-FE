import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

export function ProfileHeroSkeleton() {
  return (
    <View className="items-center gap-2.5 rounded-[14px] border border-border bg-card p-4">
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-3.5 w-40" />
    </View>
  );
}
