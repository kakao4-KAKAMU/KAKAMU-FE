import { Image, Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { useMovieByIdQuery } from '@kakamu/query';
import { Text } from '@kakamu/ui';
import type { MovieItem } from '@kakamu/types';

import { convertImagePath } from '@/lib/upload/convert-image-path';
import { useMovieDetailDialog } from '@/providers/MovieDetailDialogProvider';

type CompactPostMovieCardProps = {
  movieId: MovieItem['id'];
};

export function CompactPostMovieCard({ movieId }: CompactPostMovieCardProps) {
  const { t } = useTranslation();
  const { open } = useMovieDetailDialog();
  const movieQuery = useMovieByIdQuery(movieId);
  const movie = movieQuery.data;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('account.movie.detail.openA11y', { title: movie.title })}
      onPress={() => open(movieId)}
      className="gap-4 rounded-[10px] border border-border bg-card p-4 shadow-sm shadow-black/5"
    >
      <View className="flex-row items-center gap-3">
        {movie.poster_url ? (
          <Image
            source={{ uri: convertImagePath(movie.poster_url) }}
            className="h-[60px] w-[45px] rounded-md"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="h-[60px] w-[45px] items-center justify-center rounded-md bg-muted" />
        )}
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-foreground">{movie.title}</Text>
          {movie.release_date ? (
            <Text className="text-xs text-muted-foreground">{movie.release_date}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
