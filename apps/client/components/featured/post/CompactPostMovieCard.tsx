import { View } from 'react-native';
import { Image } from 'react-native';
import { Text } from '@kakamu/ui';
import type { MovieItem } from '@kakamu/types';
import { convertImagePath } from '@/lib/upload/convert-image-path';

export function CompactPostMovieCard({ movie }: { movie: MovieItem }) {
  return (
    <View className="gap-4 rounded-[10px] border border-border bg-card p-4 shadow-sm shadow-black/5">
      <View className="flex-row items-center gap-3">
        {movie.poster_url ? (
          <Image
            source={{ uri: convertImagePath(movie.poster_url) }}
            className="h-[45px] w-[60px] rounded-md"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="h-[45px] w-[60px] items-center justify-center rounded-md bg-muted">
            <Text className="text-xs text-muted-foreground">16:9</Text>
          </View>
        )}
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-foreground">{movie.title}</Text>
          {movie.release_date ? (
            <Text className="text-xs text-muted-foreground">{movie.release_date}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
