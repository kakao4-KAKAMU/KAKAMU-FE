import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { getPrimaryMovieTitle, useMovieDetailQuery } from '@kakamu/query';
import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  Skeleton,
  Text,
} from '@kakamu/ui';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import {
  formatMovieMetaLine,
  getPreferredMovieOverview,
} from '@/lib/movie/movie-detail-display';
import { convertImagePath } from '@/lib/upload/convert-image-path';

type MovieDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieId: string | null;
};

export function MovieDetailDialog({ open, onOpenChange, movieId }: MovieDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(560px,85vh)] gap-0 overflow-hidden p-0 sm:max-w-md">
        {open && movieId ? (
          <MovieDetailDialogContent movieId={movieId} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function MovieDetailDialogContent({ movieId }: { movieId: string }) {
  const { t } = useTranslation();
  const client = useBackendApiClient();
  const movieQuery = useMovieDetailQuery(client, movieId);

  if (movieQuery.isLoading) {
    return <MovieDetailDialogSkeleton />;
  }

  if (movieQuery.isError || !movieQuery.data) {
    return (
      <View className="gap-3 p-4">
        <DialogHeader>
          <DialogTitle>{t('account.movie.detail.title')}</DialogTitle>
        </DialogHeader>
        <Text className="py-8 text-center text-sm text-muted-foreground">
          {t('account.movie.detail.error.loadFailed')}
        </Text>
      </View>
    );
  }

  const movie = movieQuery.data;
  const title = getPrimaryMovieTitle(movie.titles);
  const metaLine = formatMovieMetaLine({
    releaseDate: movie.release_date,
    nation: movie.nation,
    producingYear: movie.producing_year,
    runtimeLabel:
      movie.runtime != null
        ? t('account.movie.detail.runtime', { minutes: movie.runtime })
        : null,
  });
  const overview = getPreferredMovieOverview(movie.overviews);
  const genres = movie.genres ?? [];
  const staffs = movie.staffs ?? [];

  return (
    <>
      {movie.poster_url ? (
        <AspectRatio ratio={2 / 3} className="w-1/3 bg-muted self-center">
          <Image
            source={{ uri: convertImagePath(movie.poster_url) }}
            className="h-full w-full"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </AspectRatio>
      ) : (
        <View className="aspect-2/3 w-full items-center justify-center bg-muted px-6">
          <Text className="text-center text-base font-semibold text-muted-foreground">{title}</Text>
        </View>
      )}

      <ScrollView
        className="max-h-80"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 p-4"
      >
        <DialogHeader className="gap-2">
          <View className="flex-row flex-wrap items-center gap-2">
            <DialogTitle className="flex-1">{title}</DialogTitle>
            {movie.is_adult ? (
              <Badge variant="destructive">
                <Text>{t('account.movie.detail.adult')}</Text>
              </Badge>
            ) : null}
          </View>
          {metaLine ? (
            <Text className="text-sm text-muted-foreground">{metaLine}</Text>
          ) : null}
        </DialogHeader>

        {genres.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                <Text>{genre.name}</Text>
              </Badge>
            ))}
          </View>
        ) : null}

        {overview ? (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {t('account.movie.detail.overview')}
            </Text>
            <Text className="text-sm leading-6 text-muted-foreground">{overview}</Text>
          </View>
        ) : null}

        {staffs.length > 0 ? (
          <View className="gap-3">
            <Separator />
            <Text className="text-sm font-semibold text-foreground">
              {t('account.movie.detail.staff')}
            </Text>
            <View className="gap-2">
              {staffs.map((staff) => (
                <View key={staff.id} className="flex-row items-center gap-3">
                  <Avatar alt={staff.name} className="size-10">
                    {staff.profile_image ? (
                      <AvatarImage source={{ uri: convertImagePath(staff.profile_image) }} />
                    ) : null}
                    <AvatarFallback>
                      <Text className="text-xs font-medium">{staff.name.slice(0, 1)}</Text>
                    </AvatarFallback>
                  </Avatar>
                  <View className="min-w-0 flex-1 gap-0.5">
                    <Text className="text-sm font-medium text-foreground">{staff.name}</Text>
                    {staff.job ? (
                      <Text className="text-xs text-muted-foreground">{staff.job}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

function MovieDetailDialogSkeleton() {
  return (
    <View className="gap-4 p-4">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      <View className="gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </View>
      <View className="flex-row gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </View>
      <View className="items-center py-4">
        <ActivityIndicator />
      </View>
    </View>
  );
}
