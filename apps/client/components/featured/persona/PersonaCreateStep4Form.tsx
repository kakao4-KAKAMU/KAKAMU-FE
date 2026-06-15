import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import { Controller, type Control } from 'react-hook-form';
import { Label, Text } from '@kakamu/ui';

import { PersonaCreateStepActions } from './PersonaCreateStepActions';
import { PersonSearchSheet } from '../search/person/PersonSearchSheet';
import { SearchTrigger } from '../search/SearchTrigger';
import { SelectedPersonRow } from '../search/person/SelectedPersonRow';
import type { PersonSearchControl, PersonaPersonSearchQuery } from '../search/search-sheet.types';

type PersonaCreateStep4FormProps = {
  control: Control<PersonaCreateFormInput>;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  canSubmit?: boolean;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: PersonSearchControl;
  searchQuery: PersonaPersonSearchQuery;
};

export function PersonaCreateStep4Form({
  control,
  onBack,
  onSubmit,
  submitting = false,
  canSubmit = true,
  sheetOpen,
  onSheetOpenChange,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
}: PersonaCreateStep4FormProps) {
  const { t } = useTranslation();

  const togglePerson = useCallback(
    (
      person: PersonaCreateFormInput['selectedPersons'][number],
      current: PersonaCreateFormInput['selectedPersons'],
      onChange: (items: PersonaCreateFormInput['selectedPersons']) => void,
    ) => {
      const exists = current.some((item) => item.id === person.id);
      if (exists) {
        onChange(current.filter((item) => item.id !== person.id));
      } else {
        onChange([...current, person]);
      }
    },
    [],
  );

  return (
    <View className="flex-1 gap-8 justify-between">
      <Controller
        control={control}
        name="selectedPersons"
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selected = value ?? [];

          return (
            <>
              <View className="gap-3">
                <Label className="text-base font-semibold text-foreground">
                  {t('account.persona.create.personsLabel')}
                </Label>
                <SearchTrigger
                  placeholder={t('account.persona.create.personSearchTrigger')}
                  onPress={() => onSheetOpenChange(true)}
                />
                {selected.length > 0 ? (
                  <View className="gap-3">
                    {selected.map((person) => (
                      <SelectedPersonRow
                        key={person.id}
                        name={person.name}
                        job={person.job}
                        profile_image={person.profile_image}
                        checked
                        onToggle={() => togglePerson(person, selected, onChange)}
                      />
                    ))}
                  </View>
                ) : null}
                {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
              </View>

              <PersonSearchSheet
                visible={sheetOpen}
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
          primaryLabel={t('account.persona.create.complete')}
          onBack={onBack}
          onPrimary={onSubmit}
          backDisabled={submitting}
          primaryDisabled={submitting || !canSubmit}
        />
      </View>
    </View>
  );
}
