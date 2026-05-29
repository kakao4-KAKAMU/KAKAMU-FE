import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { Genre } from '@kakamu/types';
import { Controller, type Control } from 'react-hook-form';
import { Label, Text } from '@kakamu/ui';

import { PERSONA_GENRE_MAX } from './persona-create.constants';
import { GenreMultiSelect } from './GenreMultiSelect';
import { PersonaCreateStepActions } from './PersonaCreateStepActions';

type PersonaCreateStep2FormProps = {
  control: Control<PersonaCreateFormInput>;
  onBack: () => void;
  onContinue: () => void;
  continuing?: boolean;
  genres: Genre[];
  genresLoading?: boolean;
};

export function PersonaCreateStep2Form({
  control,
  onBack,
  onContinue,
  continuing = false,
  genres,
  genresLoading = false,
}: PersonaCreateStep2FormProps) {
  const { t } = useTranslation();

  const toggleGenre = useCallback(
    (genreId: number, current: number[], onChange: (ids: number[]) => void) => {
      if (current.includes(genreId)) {
        onChange(current.filter((id) => id !== genreId));
        return;
      }
      if (current.length >= PERSONA_GENRE_MAX) {
        return;
      }
      onChange([...current, genreId]);
    },
    [],
  );

  return (
    <View className="flex-1 gap-8">
      <Controller
        control={control}
        name="selectedGenreIds"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View className="gap-3">
            <View className="gap-1">
              <Label className="text-base font-semibold text-foreground">
                {t('account.persona.create.genresLabel')}
              </Label>
              <Text className="text-xs text-muted-foreground">{t('account.persona.create.genresHint')}</Text>
            </View>
            <GenreMultiSelect
              genres={genres}
              selectedIds={value ?? []}
              onToggle={(id) => toggleGenre(id, value ?? [], onChange)}
              isLoading={genresLoading}
              maxCount={PERSONA_GENRE_MAX}
            />
            {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
          </View>
        )}
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
