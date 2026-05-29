import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { Genre } from '@kakamu/types';
import { Controller, type Control } from 'react-hook-form';
import { Label, Text } from '@kakamu/ui';

import { PersonaCreateStepActions } from './PersonaCreateStepActions';
import { PersonaMovieSearchSheet } from './PersonaMovieSearchSheet';
import { PersonaSearchTrigger } from './PersonaSearchTrigger';
import { PersonaSelectedMovieRow } from './PersonaSelectedMovieRow';
import type { PersonaMovieSearchControl, PersonaMovieSearchQuery } from './persona-search-sheet.types';

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
  search: PersonaMovieSearchControl;
  searchQuery: PersonaMovieSearchQuery;
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
    <View className="flex-1 gap-8">
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
                <PersonaSearchTrigger
                  placeholder={t('account.persona.create.movieSearchTrigger')}
                  onPress={() => onSheetOpenChange(true)}
                />
                {selected.length > 0 ? (
                  <View className="gap-3">
                    {selected.map((movie) => (
                      <PersonaSelectedMovieRow
                        key={movie.id}
                        name={movie.name}
                        year={movie.year}
                        checked
                        onToggle={() => toggleMovie(movie, selected, onChange)}
                      />
                    ))}
                  </View>
                ) : null}
                {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
              </View>

              <PersonaMovieSearchSheet
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

      <View className="mt-auto">
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
