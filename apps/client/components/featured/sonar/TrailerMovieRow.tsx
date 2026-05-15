import { Film } from 'lucide-react-native';
import { View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';
import type { TrailerQueueItem } from './types';

type TrailerMovieRowProps = {
  item: TrailerQueueItem;
};

export function TrailerMovieRow({ item }: TrailerMovieRowProps) {
  return (
    <View className="w-full flex-row items-center gap-3 rounded-lg border border-border bg-background p-3">
      <View className="size-15 items-center justify-center rounded border border-border bg-muted">
        <Icon as={Film} className="text-muted-foreground" size={24} />
      </View>
      <View className="min-w-0 flex-1 flex-col gap-0.5">
        <Text className="text-sm font-semibold leading-tight text-foreground" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-xs font-normal leading-tight text-muted-foreground">{item.durationLabel}</Text>
      </View>
    </View>
  );
}
