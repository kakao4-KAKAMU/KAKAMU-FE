import { Image, Pressable, View } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { Icon, Text } from '@kakamu/ui';

type PostWriteImageGridProps = {
  urls: string[];
  maxCount: number;
  onAddPress: () => void;
  onRemovePress: (url: string) => void;
  addAccessibilityLabel: string;
  removeAccessibilityLabel: string;
};

export function PostWriteImageGrid({
  urls,
  maxCount,
  onAddPress,
  onRemovePress,
  addAccessibilityLabel,
  removeAccessibilityLabel,
}: PostWriteImageGridProps) {
  const canAdd = urls.length < maxCount;

  return (
    <View className="flex-row flex-wrap gap-2">
      {urls.map((url) => (
        <View key={url} className="relative size-[88px]">
          <Image
            source={{ uri: url }}
            className="size-[88px] rounded-md"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={removeAccessibilityLabel}
            onPress={() => onRemovePress(url)}
            className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 active:opacity-70"
          >
            <Icon as={X} size={14} className="text-foreground" />
          </Pressable>
        </View>
      ))}
      {canAdd ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={addAccessibilityLabel}
          onPress={onAddPress}
          className="size-[88px] items-center justify-center rounded-md border border-border bg-card active:opacity-70"
        >
          <Icon as={Plus} size={20} className="text-muted-foreground" />
        </Pressable>
      ) : null}
    </View>
  );
}
