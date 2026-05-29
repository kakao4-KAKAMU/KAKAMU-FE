import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonSearchItem } from '@kakamu/types';
import { Button, Icon, Input, Text, TextClassContext } from '@kakamu/ui';

import type { PersonaCreateFormInput } from '@kakamu/schema';

import { PersonaBottomSheet } from './PersonaBottomSheet';
import { PersonaPersonFilterSheet } from './PersonaPersonFilterSheet';
import { PersonaSelectedPersonRow } from './PersonaSelectedPersonRow';
import type { PersonaPersonSearchControl, PersonaPersonSearchQuery } from './persona-search-sheet.types';

type SelectedPerson = PersonaCreateFormInput['selectedPersons'][number];

type PersonaPersonSearchSheetProps = {
  visible: boolean;
  selected: SelectedPerson[];
  onConfirm: (persons: SelectedPerson[]) => void;
  onClose: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: PersonaPersonSearchControl;
  searchQuery: PersonaPersonSearchQuery;
};

export function PersonaPersonSearchSheet({
  visible,
  selected,
  onConfirm,
  onClose,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
}: PersonaPersonSearchSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SelectedPerson[]>(selected);

  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  const isSelected = useCallback((id: number) => draft.some((item) => item.id === id), [draft]);

  const toggleItem = useCallback((item: PersonSearchItem) => {
    setDraft((current) => {
      const exists = current.some((person) => person.id === item.id);
      if (exists) {
        return current.filter((person) => person.id !== item.id);
      }
      return [...current, { id: item.id, name: item.name, job: item.job }];
    });
  }, []);

  const handleConfirm = () => {
    onConfirm(draft);
    onClose();
  };

  const items = search.items;

  return (
    <>
      <PersonaBottomSheet
        visible={visible}
        title={t('account.persona.create.personSearchTitle')}
        onClose={onClose}
        footer={
          <Button onPress={handleConfirm} className="h-11 w-full rounded-md">
            <Text>{t('account.persona.create.confirmSelection')}</Text>
          </Button>
        }
      >
        <View className="flex-row items-center gap-2">
          <Input
            value={search.keyword}
            onChangeText={search.setKeyword}
            placeholder={t('account.persona.create.searchPlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
            className="h-11 flex-1 rounded-md"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => onFilterOpenChange(true)}
            className="h-11 w-11 items-center justify-center rounded-md border border-border bg-card active:opacity-80"
          >
            <TextClassContext.Provider value="text-foreground">
              <Icon as={SlidersHorizontal} size={18} />
            </TextClassContext.Provider>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="max-h-[360px]">
          <View className="gap-2 py-1">
            {searchQuery.isLoading ? (
              <Text className="py-6 text-center text-sm text-muted-foreground">…</Text>
            ) : items.length === 0 ? (
              <Text className="py-6 text-center text-sm text-muted-foreground">
                {t('account.persona.create.emptyResults')}
              </Text>
            ) : (
              items.map((item) => (
                <PersonaSelectedPersonRow
                  key={item.id}
                  name={item.name}
                  job={item.job}
                  checked={isSelected(item.id)}
                  onToggle={() => toggleItem(item)}
                />
              ))
            )}
            {searchQuery.hasNextPage ? (
              <Button
                variant="ghost"
                onPress={() => searchQuery.fetchNextPage()}
                disabled={searchQuery.isFetchingNextPage}
              >
                <Text>
                  {searchQuery.isFetchingNextPage ? '…' : t('account.persona.create.loadMore')}
                </Text>
              </Button>
            ) : null}
          </View>
        </ScrollView>
      </PersonaBottomSheet>

      <PersonaPersonFilterSheet
        visible={filterOpen}
        jobs={search.filterJobs}
        sort={search.sort}
        onClose={() => onFilterOpenChange(false)}
        onApply={({ jobs, sort }) => {
          search.setFilterJobs(jobs);
          search.setSort(sort);
        }}
      />
    </>
  );
}
