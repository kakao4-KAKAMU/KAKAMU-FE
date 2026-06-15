import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { POST_IMAGE_MAX_COUNT, type PostWriteFormInput } from '@kakamu/schema';
import type { Genre } from '@kakamu/types';
import { Controller, type Control } from 'react-hook-form';
import { Button, Input, Label, Switch, Text } from '@kakamu/ui';

import { MovieSearchSheet } from '../../search/movie/MovieSearchSheet';
import type { MovieSearchControl, MovieSearchQuery } from '../../search/search-sheet.types';
import { PostWriteActions } from './PostWriteActions';
import { PostWriteImageGrid } from './PostWriteImageGrid';
import { PostWriteSelectedMovieCard } from './PostWriteSelectedMovieCard';

type SelectedMovie = PostWriteFormInput['selectedMovies'][number];

type PostWriteFormProps = {
  control: Control<PostWriteFormInput>;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
  genres: Genre[];
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: MovieSearchControl;
  searchQuery: MovieSearchQuery;
  onPickImages: (remaining: number) => void;
  onRemoveImage?: (url: string) => void;
};

export function PostWriteForm({
  control,
  submitLabel,
  onCancel,
  onSubmit,
  submitting,
  canSubmit,
  genres,
  sheetOpen,
  onSheetOpenChange,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
  onPickImages,
  onRemoveImage,
}: PostWriteFormProps) {
  const { t } = useTranslation();

  const toggleMovie = useCallback(
    (
      movie: SelectedMovie,
      current: SelectedMovie[],
      onChange: (items: SelectedMovie[]) => void,
    ) => {
      const exists = current.some((item) => item.id === movie.id);
      if (exists) {
        onChange(current.filter((item) => item.id !== movie.id));
        return;
      }
      onChange([...current, movie]);
    },
    [],
  );

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="post-title-label" className="text-sm font-medium text-foreground">
              {t('account.post.write.titleLabel')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('account.post.write.titlePlaceholder')}
              aria-labelledby="post-title-label"
            />
            {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="content"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View className="gap-2">
            <Label nativeID="post-content-label" className="text-sm font-medium text-foreground">
              {t('account.post.write.contentLabel')}
            </Label>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('account.post.write.contentPlaceholder')}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              aria-labelledby="post-content-label"
              className="min-h-[120px] rounded-md py-3"
            />
            {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="selectedMovies"
        render={({ field: { value, onChange } }) => {
          const selected = value ?? [];

          return (
            <>
              <View className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">
                    {t('account.post.write.moviesLabel')}
                  </Label>
                  <Button variant="link" size="sm" onPress={() => onSheetOpenChange(true)}>
                    <Text>{t('account.post.write.moviesAdd')}</Text>
                  </Button>
                </View>
                {selected.length > 0 ? (
                  <View className="gap-2">
                    {selected.map((movie) => (
                      <PostWriteSelectedMovieCard
                        key={movie.id}
                        title={movie.name}
                        releaseDate={movie.release_date}
                        posterUrl={movie.poster_url}
                        onPress={() => toggleMovie(movie, selected, onChange)}
                      />
                    ))}
                  </View>
                ) : (
                  <Text className="text-[13px] text-muted-foreground">
                    {t('account.post.write.moviesEmptyHint')}
                  </Text>
                )}
              </View>

              <MovieSearchSheet
                visible={sheetOpen}
                genres={genres}
                selected={selected.map((movie) => ({
                  id: movie.id,
                  name: movie.name,
                  release_date: movie.release_date,
                  poster_url: movie.poster_url,
                }))}
                onConfirm={(movies) =>
                  onChange(
                    movies.map((movie) => {
                      const fromSearch = search.items.find((item) => item.id === movie.id);
                      const existing = selected.find((item) => item.id === movie.id);
                      return {
                        id: movie.id,
                        name: movie.name,
                        release_date: movie.release_date,
                        poster_url: fromSearch?.poster_url ?? existing?.poster_url,
                      };
                    }),
                  )
                }
                onClose={() => onSheetOpenChange(false)}
                filterOpen={filterOpen}
                onFilterOpenChange={onFilterOpenChange}
                search={search}
                searchQuery={searchQuery}
              />
            </>
          );
        }}
      />

      <Controller
        control={control}
        name="image_urls"
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const urls = value ?? [];

          return (
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  {t('account.post.write.imagesLabel')}
                </Label>
                <Text className="text-xs text-muted-foreground">
                  {t('account.post.write.imagesMaxHint')}
                </Text>
              </View>
              <PostWriteImageGrid
                urls={urls}
                maxCount={POST_IMAGE_MAX_COUNT}
                onAddPress={() => onPickImages(POST_IMAGE_MAX_COUNT - urls.length)}
                onRemovePress={(url) => {
                  onRemoveImage?.(url);
                  onChange(urls.filter((item) => item !== url));
                }}
                addAccessibilityLabel={t('account.post.write.imagesAddA11y')}
                removeAccessibilityLabel={t('account.post.write.imagesRemoveA11y')}
              />
              {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
            </View>
          );
        }}
      />

      <Controller
        control={control}
        name="is_spoiler"
        render={({ field: { value, onChange } }) => (
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-1 gap-0.5 pr-3">
              <Label className="text-sm font-medium text-foreground">
                {t('account.post.write.spoilerLabel')}
              </Label>
              <Text className="text-xs text-muted-foreground">
                {t('account.post.write.spoilerHint')}
              </Text>
            </View>
            <Switch checked={value} onCheckedChange={onChange} />
          </View>
        )}
      />

      <PostWriteActions
        cancelLabel={t('account.post.write.cancel')}
        submitLabel={submitLabel}
        onCancel={onCancel}
        onSubmit={onSubmit}
        submitting={submitting}
        canSubmit={canSubmit}
      />
    </View>
  );
}
