import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { MovieSearchItem, MovieSort, PersonSearchItem, PersonSort } from '@kakamu/types';
import {
  useGenreListQuery,
  useSearchMoviesInfiniteQuery,
  useSearchPersonsInfiniteQuery,
} from '@kakamu/query';
import { Controller, type Control, useWatch } from 'react-hook-form';
import { Badge, Button, Input, Label, Text } from '@kakamu/ui';
import { cn } from '@kakamu/ui';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

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
};

export function PersonaCreateStep2Form({
  control,
  onBack,
  onSubmit,
  submitting = false,
}: PersonaCreateStep2FormProps) {
  const { t } = useTranslation();
  const client = useBackendApiClient();

  const selectedGenreIds = useWatch({ control, name: 'selectedGenreIds' }) ?? [];
  const selectedMovies = useWatch({ control, name: 'selectedMovies' }) ?? [];
  const selectedPersons = useWatch({ control, name: 'selectedPersons' }) ?? [];

  const [movieKeyword, setMovieKeyword] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieSort, setMovieSort] = useState<MovieSort>('year-desc');
  const [personKeyword, setPersonKeyword] = useState('');
  const [personSort, setPersonSort] = useState<PersonSort>('name-asc');
  const [selectedJobs, setSelectedJobs] = useState<PersonSearchJob[]>([]);

  const debouncedMovieKeyword = useDebouncedValue(movieKeyword);
  const debouncedPersonKeyword = useDebouncedValue(personKeyword);

  const parsedMovieYear = useMemo(() => {
    const year = Number.parseInt(movieYear.trim(), 10);
    return Number.isFinite(year) && year > 0 ? year : undefined;
  }, [movieYear]);

  const genreQuery = useGenreListQuery(client);
  const movieSearchQuery = useSearchMoviesInfiniteQuery(
    client,
    {
      genre: selectedGenreIds.length > 0 ? selectedGenreIds : undefined,
      name: debouncedMovieKeyword || undefined,
      year: parsedMovieYear,
      sort: movieSort,
    },
    true,
  );
  const personSearchQuery = useSearchPersonsInfiniteQuery(
    client,
    {
      name: debouncedPersonKeyword || undefined,
      job: selectedJobs.length > 0 ? selectedJobs : undefined,
      sort: personSort,
    },
    true,
  );

  const movieItems = useMemo(
    () => movieSearchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [movieSearchQuery.data],
  );
  const personItems = useMemo(
    () => personSearchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [personSearchQuery.data],
  );

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

  const toggleJob = useCallback((job: PersonSearchJob) => {
    setSelectedJobs((current) =>
      current.includes(job) ? current.filter((j) => j !== job) : [...current, job],
    );
  }, []);

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
              genres={genreQuery.data ?? []}
              selectedIds={value ?? []}
              onToggle={(id) => toggleGenre(id, value ?? [], onChange)}
              isLoading={genreQuery.isLoading}
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
            onSortChange={(value) => setMovieSort(value as MovieSort)}
            keyword={movieKeyword}
            onKeywordChange={setMovieKeyword}
            filterSlot={
              <Input
                value={movieYear}
                onChangeText={setMovieYear}
                placeholder={t('account.persona.create.yearPlaceholder')}
                keyboardType="number-pad"
                className="h-11 rounded-xl"
              />
            }
            items={movieItems}
            selected={selectedMovies}
            onToggle={(item) => toggleMovie(item, onChange)}
            getSubtitle={(item) => (item.year != null ? String(item.year) : undefined)}
            isLoading={movieSearchQuery.isLoading}
            isFetchingNextPage={movieSearchQuery.isFetchingNextPage}
            hasNextPage={movieSearchQuery.hasNextPage}
            onLoadMore={() => movieSearchQuery.fetchNextPage()}
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
            onSortChange={(value) => setPersonSort(value as PersonSort)}
            keyword={personKeyword}
            onKeywordChange={setPersonKeyword}
            filterSlot={
              <View className="flex-row flex-wrap gap-2">
                {PERSON_SEARCH_JOBS.map((job) => {
                  const active = selectedJobs.includes(job);
                  return (
                    <Pressable key={job} onPress={() => toggleJob(job)} accessibilityRole="button">
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
            isLoading={personSearchQuery.isLoading}
            isFetchingNextPage={personSearchQuery.isFetchingNextPage}
            hasNextPage={personSearchQuery.hasNextPage}
            onLoadMore={() => personSearchQuery.fetchNextPage()}
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
        <Button onPress={onSubmit} disabled={submitting} className="h-12 flex-1 rounded-xl">
          <Text>{t('account.persona.create.submit')}</Text>
        </Button>
      </View>
    </View>
  );
}
