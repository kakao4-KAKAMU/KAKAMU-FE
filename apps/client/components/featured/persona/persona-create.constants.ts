import type { TFunction } from 'i18next';
import type { MovieSort, PersonSort } from '@kakamu/types';
import { PERSONA_GENRE_MAX_COUNT } from '@kakamu/schema';

export const PERSONA_GENRE_MAX = PERSONA_GENRE_MAX_COUNT;

export const PERSON_SEARCH_JOBS = ['actor', 'director', 'writer', 'producer', 'other'] as const;

export type PersonSearchJob = (typeof PERSON_SEARCH_JOBS)[number];

export const MOVIE_SORT_OPTIONS: MovieSort[] = ['year_desc', 'year_asc', 'name_asc', 'name_desc'];

export const PERSON_SORT_OPTIONS: PersonSort[] = ['name_asc', 'name_desc'];

export const MOVIE_FILTER_SORT_OPTIONS = [
  { value: 'year_desc', labelKey: 'account.persona.create.filterSort.yearDesc' },
  { value: 'year_asc', labelKey: 'account.persona.create.filterSort.yearAsc' },
  { value: 'name_asc', labelKey: 'account.persona.create.filterSort.nameAsc' },
  { value: 'name_desc', labelKey: 'account.persona.create.filterSort.nameDesc' },
] as const satisfies ReadonlyArray<{ value: MovieSort; labelKey: string }>;

export const PERSON_FILTER_SORT_OPTIONS = [
  { value: 'name_asc', labelKey: 'account.persona.create.filterSort.personNameAsc' },
  { value: 'name_desc', labelKey: 'account.persona.create.filterSort.personNameDesc' },
] as const satisfies ReadonlyArray<{ value: PersonSort; labelKey: string }>;

const SORT_LABEL_KEYS = {
  year_desc: 'account.persona.create.sort.yearDesc',
  year_asc: 'account.persona.create.sort.yearAsc',
  name_desc: 'account.persona.create.sort.nameDesc',
  name_asc: 'account.persona.create.sort.nameAsc',
} as const;

export function getSortLabel(t: TFunction, sort: string): string {
  const key = SORT_LABEL_KEYS[sort as keyof typeof SORT_LABEL_KEYS];
  return key ? t(key) : sort;
}

type FilterSortLabelKey =
  | (typeof MOVIE_FILTER_SORT_OPTIONS)[number]['labelKey']
  | (typeof PERSON_FILTER_SORT_OPTIONS)[number]['labelKey'];

export function getFilterSortLabel(t: TFunction, labelKey: FilterSortLabelKey): string {
  return t(labelKey);
}
