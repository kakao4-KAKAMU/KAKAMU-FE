import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonSearchItem } from '@kakamu/types';
import { Button, Icon, Input, Text, BottomSheet } from '@kakamu/ui';

import type { PersonaCreateFormInput } from '@kakamu/schema';

import { PersonFilterSheet } from './PersonFilterSheet';
import { SelectedPersonRow } from './SelectedPersonRow';
import type { PersonSearchControl, PersonaPersonSearchQuery } from '../search-sheet.types';

type SelectedPerson = PersonaCreateFormInput['selectedPersons'][number];

type PersonSearchSheetProps = {
  visible: boolean;
  selected: SelectedPerson[];
  onConfirm: (persons: SelectedPerson[]) => void;
  onClose: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: PersonSearchControl;
  searchQuery: PersonaPersonSearchQuery;
};

export function PersonSearchSheet({
  visible,
  selected,
  onConfirm,
  onClose,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
}: PersonSearchSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SelectedPerson[]>(selected);

  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  const isSelected = useCallback((id: string) => draft.some((item) => item.id === id), [draft]);

  const toggleItem = useCallback((item: PersonSearchItem) => {
    setDraft((current) => {
      const exists = current.some((person) => person.id === item.id);
      if (exists) {
        return current.filter((person) => person.id !== item.id);
      }
      return [...current, { id: item.id, name: item.name }];
    });
  }, []);

  const handleConfirm = () => {
    onConfirm(draft);
    onClose();
  };

  const items = search.items;

  return (
    <>
      <BottomSheet
        visible={visible}
        title={t('account.persona.create.personSearchTitle')}
        onClose={onClose}
        footer={
          <Button onPress={handleConfirm} size="lg">
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
            className="flex-1"
          />
          <Button size="lgIcon" variant="outline" onPress={() => onFilterOpenChange(true)}>
            <Icon as={SlidersHorizontal} size={18} />
          </Button>
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
                <SelectedPersonRow
                  key={item.id}
                  name={item.name}
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
      </BottomSheet>

      <PersonFilterSheet
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
