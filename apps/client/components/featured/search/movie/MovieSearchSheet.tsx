import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from '@kakamu/i18n';
import type { Genre, MovieItem } from '@kakamu/types';
import { Button, Icon, Input, Text, BottomSheet } from '@kakamu/ui';

import type { PersonaCreateFormInput } from '@kakamu/schema';

import { MovieFilterSheet } from './MovieFilterSheet';
import { SelectedMovieRow } from './SelectedMovieRow';
import type { MovieSearchControl, MovieSearchQuery } from '../search-sheet.types';

type SelectedMovie = PersonaCreateFormInput['selectedMovies'][number];

type MovieSearchSheetProps = {
  visible: boolean;
  genres: Genre[];
  selected: SelectedMovie[];
  onConfirm: (movies: SelectedMovie[]) => void;
  onClose: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  search: MovieSearchControl;
  searchQuery: MovieSearchQuery;
};

export function MovieSearchSheet({
  visible,
  genres,
  selected,
  onConfirm,
  onClose,
  filterOpen,
  onFilterOpenChange,
  search,
  searchQuery,
}: MovieSearchSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SelectedMovie[]>(selected);

  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  const isSelected = useCallback((id: number) => draft.some((item) => item.id === id), [draft]);

  const toggleItem = useCallback((item: MovieItem) => {
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
      <BottomSheet
        visible={visible}
        title={t('account.persona.create.movieSearchTitle')}
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
                <SelectedMovieRow
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
      </BottomSheet>

      <MovieFilterSheet
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
