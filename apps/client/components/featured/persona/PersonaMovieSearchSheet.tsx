import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { Genre, MovieSearchItem } from '@kakamu/types';
import { Button, Icon, Input, Text, TextClassContext } from '@kakamu/ui';

import type { PersonaCreateFormInput } from '@kakamu/schema';

import { PersonaBottomSheet } from './PersonaBottomSheet';
import { PersonaMovieFilterSheet } from './PersonaMovieFilterSheet';
import { PersonaSelectedMovieRow } from './PersonaSelectedMovieRow';
import type { PersonaMovieSearchControl, PersonaMovieSearchQuery } from './persona-search-sheet.types';

type SelectedMovie = PersonaCreateFormInput['selectedMovies'][number];

type PersonaMovieSearchSheetProps = {
  visible: boolean;
  genres: Genre[];
  selected: SelectedMovie[];
  onConfirm: (movies: SelectedMovie[]) => void;
  onClose: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: PersonaMovieSearchControl;
  searchQuery: PersonaMovieSearchQuery;
};

export function PersonaMovieSearchSheet({
  visible,
  genres,
  selected,
  onConfirm,
  onClose,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
}: PersonaMovieSearchSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SelectedMovie[]>(selected);

  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  const isSelected = useCallback((id: number) => draft.some((item) => item.id === id), [draft]);

  const toggleItem = useCallback((item: MovieSearchItem) => {
    setDraft((current) => {
      const exists = current.some((movie) => movie.id === item.id);
      if (exists) {
        return current.filter((movie) => movie.id !== item.id);
      }
      return [...current, { id: item.id, name: item.title, release_date: item.release_date }];
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
        title={t('account.persona.create.movieSearchTitle')}
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
                <PersonaSelectedMovieRow
                  key={item.id}
                  title={item.title}
                  release_date={item.release_date}
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

      <PersonaMovieFilterSheet
        visible={filterOpen}
        genres={genres}
        genreIds={search.filterGenreIds}
        year={search.year}
        sort={search.sort}
        onClose={() => onFilterOpenChange(false)}
        onApply={({ genreIds, year, sort }) => {
          search.setFilterGenreIds(genreIds);
          search.setYear(year);
          search.setSort(sort);
        }}
      />
    </>
  );
}
