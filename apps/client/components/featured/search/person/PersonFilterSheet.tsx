import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import type { PersonSort } from '@kakamu/types';
import { Badge, Button, cn, Label, Text, BottomSheet } from '@kakamu/ui';

import {
  getFilterSortLabel,
  PERSON_FILTER_SORT_OPTIONS,
  PERSON_SEARCH_JOBS,
  type PersonSearchJob,
} from '../../persona/persona-create.constants';
import { PersonaFilterSortList } from '../PersonaFilterSortList';

type PersonFilterSheetProps = {
  visible: boolean;
  jobs: PersonSearchJob[];
  sort: PersonSort;
  onClose: () => void;
  onApply: (values: { jobs: PersonSearchJob[]; sort: PersonSort }) => void;
};

export function PersonFilterSheet({
  visible,
  jobs,
  sort,
  onClose,
  onApply,
}: PersonFilterSheetProps) {
  const { t } = useTranslation();
  const [draftJobs, setDraftJobs] = useState(jobs);
  const [draftSort, setDraftSort] = useState(sort);

  useEffect(() => {
    if (visible) {
      setDraftJobs(jobs);
      setDraftSort(sort);
    }
  }, [visible, jobs, sort]);

  const sortOptions = useMemo(
    () =>
      PERSON_FILTER_SORT_OPTIONS.map((option) => ({
        value: option.value,
        label: getFilterSortLabel(t, option.labelKey),
      })),
    [t],
  );

  const toggleJob = (job: PersonSearchJob) => {
    setDraftJobs((current) =>
      current.includes(job) ? current.filter((item) => item !== job) : [...current, job],
    );
  };

  const handleReset = () => {
    setDraftJobs([]);
    setDraftSort('name_asc');
  };

  const handleApply = () => {
    onApply({ jobs: draftJobs, sort: draftSort });
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      title={t('account.persona.create.personFilterTitle')}
      onClose={onClose}
      footer={
        <View className="flex-row gap-2.5">
          <Button className="flex-1" variant="outline" onPress={handleReset} size="lg">
            <Text>{t('account.persona.create.filterReset')}</Text>
          </Button>
          <Button className="flex-1" onPress={handleApply} size="lg">
            <Text>{t('account.persona.create.filterApply')}</Text>
          </Button>
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[420px]">
        <View className="gap-5 pb-2">
          <View className="gap-2.5">
            <Label className="text-[13px] font-semibold text-muted-foreground">
              {t('account.persona.create.filterJob')}
            </Label>
            <View className="flex-row flex-wrap gap-1.5">
              {PERSON_SEARCH_JOBS.map((job) => {
                const active = draftJobs.includes(job);
                return (
                  <Pressable key={job} accessibilityRole="button" onPress={() => toggleJob(job)}>
                    <Badge
                      variant={active ? 'default' : 'outline'}
                      className={cn('h-7 rounded-full px-2.5', active && 'bg-primary')}
                    >
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
          </View>
          <View className="gap-2.5">
            <Label className="text-[13px] font-semibold text-muted-foreground">
              {t('account.persona.create.filterSortSection')}
            </Label>
            <PersonaFilterSortList
              options={sortOptions}
              value={draftSort}
              onChange={(value) => setDraftSort(value as PersonSort)}
            />
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
