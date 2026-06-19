import { View } from 'react-native';
import { Skeleton } from '@kakamu/ui';

import { ProfileHeroSkeleton } from './ProfileHero.skeleton';

export function ProfileScreenLayoutSkeleton() {
  return (
    <View className="gap-2.5 px-4">
      <ProfileHeroSkeleton />
      <Skeleton className="h-10 w-full rounded-[10px]" />
      <View className="flex-row gap-2">
        <Skeleton className="h-16 flex-1 rounded-[10px]" />
        <Skeleton className="h-16 flex-1 rounded-[10px]" />
        <Skeleton className="h-16 flex-1 rounded-[10px]" />
      </View>
      <View className="flex-row gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </View>
      <Skeleton className="h-24 w-full rounded-xl" />
    </View>
  );
}
