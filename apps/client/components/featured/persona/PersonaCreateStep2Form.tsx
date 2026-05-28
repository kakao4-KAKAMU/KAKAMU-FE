import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { MovieSearchItem, MovieSort, PersonSearchItem, PersonSort } from '@kakamu/types';
import { Controller, type Control, useWatch } from 'react-hook-form';
import { Badge, Button, Input, Label, Text } from '@kakamu/ui';
import { cn } from '@kakamu/ui';

import {
  getSortLabel,
  MOVIE_SORT_OPTIONS,
  PERSON_SEARCH_JOBS,
  PERSON_SORT_OPTIONS,
  type PersonSearchJob,
} from './persona-create.constants';
import { EntitySearchSection } from './EntitySearchSection';
import { GenreMultiSelect } from './GenreMultiSelect';

type PersonaCreateStep2FormProps = {
  control: Control<PersonaCreateFormInput>;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
  genres: { id: string; name: string }[];
  genresLoading?: boolean;
  movieKeyword: string;
  onMovieKeywordChange: (value: string) => void;
  movieYear: string;
  onMovieYearChange: (value: string) => void;
  movieSort: MovieSort;
  onMovieSortChange: (value: MovieSort) => void;
  movieItems: MovieSearchItem[];
  movieLoading?: boolean;
  movieFetchingNext?: boolean;
  movieHasNextPage?: boolean;
  onLoadMoreMovies?: () => void;
  personKeyword: string;
  onPersonKeywordChange: (value: string) => void;
  personSort: PersonSort;
  onPersonSortChange: (value: PersonSort) => void;
  selectedJobs: PersonSearchJob[];
  onToggleJob: (job: PersonSearchJob) => void;
  personItems: PersonSearchItem[];
  personLoading?: boolean;
  personFetchingNext?: boolean;
  personHasNextPage?: boolean;
  onLoadMorePersons?: () => void;
};

export function PersonaCreateStep2Form({
  control,
  onBack,
  onSubmit,
  submitting = false,
  canSubmit = true,
  genres,
  genresLoading = false,
  movieKeyword,
  onMovieKeywordChange,
  movieYear,
  onMovieYearChange,
  movieSort,
  onMovieSortChange,
  movieItems,
  movieLoading = false,
  movieFetchingNext = false,
  movieHasNextPage = false,
  onLoadMoreMovies,
  personKeyword,
  onPersonKeywordChange,
  personSort,
  onPersonSortChange,
  selectedJobs,
  onToggleJob,
  personItems,
  personLoading = false,
  personFetchingNext = false,
  personHasNextPage = false,
  onLoadMorePersons,
}: PersonaCreateStep2FormProps) {
  const { t } = useTranslation();

  const selectedGenreIds = useWatch({ control, name: 'selectedGenreIds' }) ?? [];
  const selectedMovies = useWatch({ control, name: 'selectedMovies' }) ?? [];
  const selectedPersons = useWatch({ control, name: 'selectedPersons' }) ?? [];

  const movieSortOptions = useMemo(
    () =>
      MOVIE_SORT_OPTIONS.map((value) => ({
        value,
        label: getSortLabel(t, value),
      })),
    [t],
  );

  const personSortOptions = useMemo(
    () =>
      PERSON_SORT_OPTIONS.map((value) => ({
        value,
        label: getSortLabel(t, value),
      })),
    [t],
  );

  const toggleGenre = useCallback(
    (genreId: string, current: string[], onChange: (ids: string[]) => void) => {
      if (current.includes(genreId)) {
        onChange(current.filter((id) => id !== genreId));
      } else {
        onChange([...current, genreId]);
      }
    },
    [],
  );

  const toggleMovie = useCallback(
    (item: MovieSearchItem, onChange: (items: { id: string; name: string }[]) => void) => {
      const exists = selectedMovies.some((m) => m.id === item.id);
      if (exists) {
        onChange(selectedMovies.filter((m) => m.id !== item.id));
      } else {
        onChange([...selectedMovies, { id: item.id, name: item.name }]);
      }
    },
    [selectedMovies],
  );

  const togglePerson = useCallback(
    (item: PersonSearchItem, onChange: (items: { id: string; name: string }[]) => void) => {
      const exists = selectedPersons.some((p) => p.id === item.id);
      if (exists) {
        onChange(selectedPersons.filter((p) => p.id !== item.id));
      } else {
        onChange([...selectedPersons, { id: item.id, name: item.name }]);
      }
    },
    [selectedPersons],
  );

  return (
    <View className="gap-6">
      <Controller
        control={control}
        name="selectedGenreIds"
        render={({ field: { value, onChange } }) => (
          <View className="gap-2">
            <Label className="text-sm font-semibold text-foreground">
              {t('account.persona.create.genresLabel')}
            </Label>
            <Text className="text-xs text-muted-foreground">{t('account.persona.create.genresHint')}</Text>
            <GenreMultiSelect
              genres={genres}
              selectedIds={value ?? []}
              onToggle={(id) => toggleGenre(id, value ?? [], onChange)}
              isLoading={genresLoading}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="selectedMovies"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <EntitySearchSection
            title={t('account.persona.create.moviesLabel')}
            searchPlaceholder={t('account.persona.create.searchPlaceholder')}
            sortOptions={movieSortOptions}
            sort={movieSort}
            onSortChange={(value) => onMovieSortChange(value as MovieSort)}
            keyword={movieKeyword}
            onKeywordChange={onMovieKeywordChange}
            filterSlot={
              <Input
                value={movieYear}
                onChangeText={onMovieYearChange}
                placeholder={t('account.persona.create.yearPlaceholder')}
                keyboardType="number-pad"
                className="h-11 rounded-xl"
              />
            }
            items={movieItems}
            selected={selectedMovies}
            onToggle={(item) => toggleMovie(item, onChange)}
            getSubtitle={(item) => (item.year != null ? String(item.year) : undefined)}
            isLoading={movieLoading}
            isFetchingNextPage={movieFetchingNext}
            hasNextPage={movieHasNextPage}
            onLoadMore={onLoadMoreMovies}
            emptyLabel={t('account.persona.create.emptyResults')}
            loadMoreLabel={t('account.persona.create.loadMore')}
            errorMessage={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="selectedPersons"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <EntitySearchSection
            title={t('account.persona.create.personsLabel')}
            searchPlaceholder={t('account.persona.create.searchPlaceholder')}
            sortOptions={personSortOptions}
            sort={personSort}
            onSortChange={(value) => onPersonSortChange(value as PersonSort)}
            keyword={personKeyword}
            onKeywordChange={onPersonKeywordChange}
            filterSlot={
              <View className="flex-row flex-wrap gap-2">
                {PERSON_SEARCH_JOBS.map((job) => {
                  const active = selectedJobs.includes(job);
                  return (
                    <Pressable key={job} onPress={() => onToggleJob(job)} accessibilityRole="button">
                      <Badge variant={active ? 'default' : 'outline'} className={cn('px-3 py-1')}>
                        <Text
                          className={cn(
                            'text-xs',
                            active ? 'text-primary-foreground' : 'text-foreground',
                          )}
                        >
                          {t(`account.persona.create.job.${job}`)}
                        </Text>
                      </Badge>
                    </Pressable>
                  );
                })}
              </View>
            }
            items={personItems}
            selected={selectedPersons}
            onToggle={(item) => togglePerson(item, onChange)}
            getSubtitle={(item) => item.job}
            isLoading={personLoading}
            isFetchingNextPage={personFetchingNext}
            hasNextPage={personHasNextPage}
            onLoadMore={onLoadMorePersons}
            emptyLabel={t('account.persona.create.emptyResults')}
            loadMoreLabel={t('account.persona.create.loadMore')}
            errorMessage={error?.message}
          />
        )}
      />

      <View className="flex-row gap-3">
        <Button variant="outline" onPress={onBack} disabled={submitting} className="h-12 flex-1 rounded-xl">
          <Text>{t('account.persona.create.back')}</Text>
        </Button>
        <Button onPress={onSubmit} disabled={submitting || !canSubmit} className="h-12 flex-1 rounded-xl">
          <Text>{t('account.persona.create.submit')}</Text>
        </Button>
      </View>
    </View>
  );
}
