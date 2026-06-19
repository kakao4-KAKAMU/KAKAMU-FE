import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

import { PersonaGridSkeleton } from './PersonaGrid.skeleton';

export function PersonaListScreenContentSkeleton() {
  return (
    <View className="flex-col gap-6 px-5 pb-8 pt-7">
      <View className="gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </View>
      <PersonaGridSkeleton />
      <Skeleton className="h-10 w-full rounded-md" />
    </View>
  );
}
