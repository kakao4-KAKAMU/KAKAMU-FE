import { Image, Pressable, ScrollView, View } from 'react-native';
import type { TFunction } from '@kakamu/i18n';
import type { MovieItem } from '@kakamu/types';
import { cn, Text } from '@kakamu/ui';
import { useCallback } from 'react';

import { convertImagePath } from '@/lib/upload/convert-image-path';
import { useMovieDetailDialog } from '@/providers/MovieDetailDialogProvider';

type ChatMessageMoviePosterListProps = {
  movies: MovieItem[];
  align: 'start' | 'end';
  t: TFunction;
};

export function ChatMessageMoviePosterList({
  movies,
  align,
  t,
}: ChatMessageMoviePosterListProps) {
  if (movies.length === 0) {
    return null;
  }

  const { open } = useMovieDetailDialog();
  const onMoviePress = useCallback((movieId: string) => {
    open(movieId);
  }, [open]);

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      className={cn('w-full', align === 'end' ? 'self-end' : 'self-start')}
      contentContainerClassName="gap-2"
    >
      {movies.map((movie) => (
        <Pressable
          onPress={() => onMoviePress(movie.id)}
          key={movie.id}
          accessibilityRole="image"
          accessibilityLabel={t('account.chat.message.chip.movieA11y', {
            title: movie.title?.trim() || movie.id,
          })}
          className="overflow-hidden rounded-md border border-border bg-card"
        >
          {movie.poster_url ? (
            <Image
              source={{ uri: convertImagePath(movie.poster_url) }}
              className="h-[84px] w-[56px]"
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View className="h-[84px] w-[56px] items-center justify-center bg-muted px-1">
              <Text className="text-center text-[10px] text-muted-foreground" numberOfLines={3}>
                {movie.title}
              </Text>
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}
