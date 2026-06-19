import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

function PersonaCardSkeleton() {
  return (
    <View className="h-[164px] w-[132px] items-center justify-center gap-2.5 rounded-[18px] border border-border bg-card p-3.5">
      <Skeleton className="size-[72px] rounded-full" />
      <Skeleton className="h-4 w-20" />
    </View>
  );
}

export function PersonaGridSkeleton() {
  return (
    <View className="w-full flex-row flex-wrap items-start justify-center gap-3.5">
      <PersonaCardSkeleton />
      <PersonaCardSkeleton />
      <PersonaCardSkeleton />
      <Skeleton className="h-[164px] w-[132px] rounded-[18px]" />
    </View>
  );
}
