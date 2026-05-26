import { View } from 'react-native';
import type { TrailerQueueItem } from './types';
import { TrailerMovieRow } from './TrailerMovieRow';
import { TrailerSwipeGuide } from './TrailerSwipeGuide';
import { TrailerVideoPlaceholder } from './TrailerVideoPlaceholder';

type TrailerSwipeCardProps = {
  item: TrailerQueueItem;
  isFront: boolean;
};

export function TrailerSwipeCard({ item, isFront }: TrailerSwipeCardProps) {
  return (
    <View className="w-full flex-col gap-3.5 rounded-3xl border border-border bg-card p-[18px] shadow-black/10 shadow-md android:elevation-4">
      <TrailerVideoPlaceholder isFront={isFront} item={item} />
      <TrailerMovieRow item={item} />
      <TrailerSwipeGuide />
    </View>
  );
}
