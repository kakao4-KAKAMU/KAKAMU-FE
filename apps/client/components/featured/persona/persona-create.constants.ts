import type { TFunction } from 'i18next';
import type { MovieSort, PersonSort } from '@kakamu/types';

export const PERSON_SEARCH_JOBS = ['actor', 'director', 'writer', 'producer'] as const;

export type PersonSearchJob = (typeof PERSON_SEARCH_JOBS)[number];

export const MOVIE_SORT_OPTIONS: MovieSort[] = ['year_desc', 'year_asc', 'name_desc', 'name_asc'];

export const PERSON_SORT_OPTIONS: PersonSort[] = ['name_desc', 'name_asc'];

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
