import { Image, Pressable, View } from 'react-native';
import { Text } from '@kakamu/ui';

type PostWriteSelectedMovieCardProps = {
  title: string;
  releaseDate?: string;
  posterUrl?: string;
  onPress?: () => void;
};

export function PostWriteSelectedMovieCard({
  title,
  releaseDate,
  posterUrl,
  onPress,
}: PostWriteSelectedMovieCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-lg active:opacity-70"
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          className="h-[45px] w-[60px] rounded-md"
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View className="h-[45px] w-[60px] items-center justify-center rounded-md bg-muted">
          <Text className="text-xs text-muted-foreground">16:9</Text>
        </View>
      )}
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-semibold text-foreground">{title}</Text>
        {releaseDate ? (
          <Text className="text-xs text-muted-foreground">{releaseDate}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
