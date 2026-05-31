import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { Genre } from '@kakamu/types';
import { Controller, type Control } from 'react-hook-form';
import { Label, Text } from '@kakamu/ui';

import { PersonaCreateStepActions } from './PersonaCreateStepActions';
import { MovieSearchSheet } from '../search/movie/MovieSearchSheet';
import { SearchTrigger } from '../search/SearchTrigger';
import { SelectedMovieRow } from '../search/movie/SelectedMovieRow';
import type { MovieSearchControl, MovieSearchQuery } from '../search/search-sheet.types';

type PersonaCreateStep3FormProps = {
  control: Control<PersonaCreateFormInput>;
  onBack: () => void;
  onContinue: () => void;
  continuing?: boolean;
  genres: Genre[];
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: MovieSearchControl;
  searchQuery: MovieSearchQuery;
};

export function PersonaCreateStep3Form({
  control,
  onBack,
  onContinue,
  continuing = false,
  genres,
  sheetOpen,
  onSheetOpenChange,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
}: PersonaCreateStep3FormProps) {
  const { t } = useTranslation();

  const toggleMovie = useCallback(
    (
      movie: PersonaCreateFormInput['selectedMovies'][number],
      current: PersonaCreateFormInput['selectedMovies'],
      onChange: (items: PersonaCreateFormInput['selectedMovies']) => void,
    ) => {
      const exists = current.some((item) => item.id === movie.id);
      if (exists) {
        onChange(current.filter((item) => item.id !== movie.id));
      } else {
        onChange([...current, movie]);
      }
    },
    [],
  );

  return (
    <View className="flex-1 gap-8 justify-between">
      <Controller
        control={control}
        name="selectedMovies"
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selected = value ?? [];

          return (
            <>
              <View className="gap-3">
                <Label className="text-base font-semibold text-foreground">
                  {t('account.persona.create.moviesLabel')}
                </Label>
                <SearchTrigger
                  placeholder={t('account.persona.create.movieSearchTrigger')}
                  onPress={() => onSheetOpenChange(true)}
                />
                {selected.length > 0 ? (
                  <View className="gap-3">
                    {selected.map((movie) => (
                      <SelectedMovieRow
                        key={movie.id}
                        title={movie.name}
                        release_date={movie.release_date}
                        checked
                        onToggle={() => toggleMovie(movie, selected, onChange)}
                      />
                    ))}
                  </View>
                ) : null}
                {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
              </View>

              <MovieSearchSheet
                visible={sheetOpen}
                genres={genres}
                selected={selected}
                onConfirm={onChange}
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

      <View>
        <PersonaCreateStepActions
          backLabel={t('account.persona.create.back')}
          primaryLabel={t('account.persona.create.continue')}
          onBack={onBack}
          onPrimary={onContinue}
          backDisabled={continuing}
          primaryDisabled={continuing}
        />
      </View>
    </View>
  );
}
