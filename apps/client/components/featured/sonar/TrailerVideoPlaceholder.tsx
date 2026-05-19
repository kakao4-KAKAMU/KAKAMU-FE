import { Play } from 'lucide-react-native';
import { View } from 'react-native';
import { Icon } from '@kakamu/ui';
import type { TrailerQueueItem } from './types';
import { TrailerVideo } from './TrailerVideo';

type TrailerVideoPlaceholderProps = {
  item: TrailerQueueItem;
  /** 맨 앞 카드일 때만 YouTube 임베드를 마운트해 자동재생합니다. */
  isFront: boolean;
};

export function TrailerVideoPlaceholder({ item, isFront }: TrailerVideoPlaceholderProps) {
  const videoId = item.youtubeVideoId;

  if (videoId && isFront) {
    return <TrailerVideo videoId={videoId} youtubeUrl={item.youtubeVideoId} />;
  }

  return (
    <View className="max-h-[420px] max-w-80vw aspect-video w-full items-center justify-center rounded-2xl bg-muted">
      <Icon as={Play} className="text-foreground" size={42} />
    </View>
  );
}
