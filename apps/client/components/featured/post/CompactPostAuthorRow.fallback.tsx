import { Skeleton } from "@kakamu/ui";
import { View } from "react-native";


export function CompactPostAuthorRowFallback() {
  return (
    <View className="flex-row items-center gap-2.5">
      <Skeleton className="size-9 rounded-full" />
      <View className="min-w-0 flex-1 gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </View>
    </View>
  );
}