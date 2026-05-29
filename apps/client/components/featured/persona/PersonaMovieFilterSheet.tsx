import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { Genre } from '@kakamu/types';
import type { MovieSort } from '@kakamu/types';
import { Button, Input, Label, Text } from '@kakamu/ui';

import {
  getFilterSortLabel,
  MOVIE_FILTER_SORT_OPTIONS,
} from './persona-create.constants';
import { PersonaBottomSheet } from './PersonaBottomSheet';
import { PersonaFilterSortList } from './PersonaFilterSortList';
import { GenreMultiSelect } from './GenreMultiSelect';

type PersonaMovieFilterSheetProps = {
  visible: boolean;
  genres: Genre[];
  genreIds: number[];
  year: string;
  sort: MovieSort;
  onClose: () => void;
  onApply: (values: { genreIds: number[]; year: string; sort: MovieSort }) => void;
};

export function PersonaMovieFilterSheet({
  visible,
  genres,
  genreIds,
  year,
  sort,
  onClose,
  onApply,
}: PersonaMovieFilterSheetProps) {
  const { t } = useTranslation();
  const [draftGenreIds, setDraftGenreIds] = useState(genreIds);
  const [draftYear, setDraftYear] = useState(year);
  const [draftSort, setDraftSort] = useState(sort);

  useEffect(() => {
    if (visible) {
      setDraftGenreIds(genreIds);
      setDraftYear(year);
      setDraftSort(sort);
    }
  }, [visible, genreIds, year, sort]);

  const sortOptions = useMemo(
    () =>
      MOVIE_FILTER_SORT_OPTIONS.map((option) => ({
        value: option.value,
        label: getFilterSortLabel(t, option.labelKey),
      })),
    [t],
  );

  const toggleGenre = (id: number) => {
    setDraftGenreIds((current) =>
      current.includes(id) ? current.filter((genreId) => genreId !== id) : [...current, id],
    );
  };

  const handleReset = () => {
    setDraftGenreIds([]);
    setDraftYear('');
    setDraftSort('year_desc');
  };

  const handleApply = () => {
    onApply({ genreIds: draftGenreIds, year: draftYear, sort: draftSort });
    onClose();
  };

  return (
    <PersonaBottomSheet
      visible={visible}
      title={t('account.persona.create.movieFilterTitle')}
      onClose={onClose}
      footer={
        <View className="flex-row gap-2.5">
          <Button variant="outline" onPress={handleReset} className="h-11 flex-1 rounded-md">
            <Text>{t('account.persona.create.filterReset')}</Text>
          </Button>
          <Button onPress={handleApply} className="h-11 flex-1 rounded-md">
            <Text>{t('account.persona.create.filterApply')}</Text>
          </Button>
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[420px]">
        <View className="gap-5 pb-2">
          <View className="gap-2.5">
            <Label className="text-[13px] font-semibold text-muted-foreground">
              {t('account.persona.create.filterGenre')}
            </Label>
            <GenreMultiSelect
              genres={genres}
              selectedIds={draftGenreIds}
              onToggle={toggleGenre}
            />
          </View>
          <View className="gap-2.5">
            <Label className="text-[13px] font-semibold text-muted-foreground">
              {t('account.persona.create.filterYear')}
            </Label>
            <Input
              value={draftYear}
              onChangeText={setDraftYear}
              placeholder={t('account.persona.create.yearPlaceholder')}
              keyboardType="number-pad"
              className="h-11 rounded-md"
            />
          </View>
          <View className="gap-2.5">
            <Label className="text-[13px] font-semibold text-muted-foreground">
              {t('account.persona.create.filterSortSection')}
            </Label>
            <PersonaFilterSortList
              options={sortOptions}
              value={draftSort}
              onChange={(value) => setDraftSort(value as MovieSort)}
            />
          </View>
        </View>
      </ScrollView>
    </PersonaBottomSheet>
  );
}
