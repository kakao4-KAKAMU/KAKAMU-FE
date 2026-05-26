import type { TFunction } from 'i18next';
import type { MovieSort, PersonSort } from '@kakamu/types';

export const PERSON_SEARCH_JOBS = ['actor', 'director', 'writer', 'producer'] as const;

export type PersonSearchJob = (typeof PERSON_SEARCH_JOBS)[number];

export const MOVIE_SORT_OPTIONS: MovieSort[] = ['year-desc', 'year-asc', 'name-desc', 'name-asc'];

export const PERSON_SORT_OPTIONS: PersonSort[] = ['name-desc', 'name-asc'];

const SORT_LABEL_KEYS = {
  'year-desc': 'account.persona.create.sort.yearDesc',
  'year-asc': 'account.persona.create.sort.yearAsc',
  'name-desc': 'account.persona.create.sort.nameDesc',
  'name-asc': 'account.persona.create.sort.nameAsc',
} as const;

export function getSortLabel(t: TFunction, sort: string): string {
  const key = SORT_LABEL_KEYS[sort as keyof typeof SORT_LABEL_KEYS];
  return key ? t(key) : sort;
}
