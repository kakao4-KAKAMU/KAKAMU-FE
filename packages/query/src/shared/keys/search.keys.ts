import type { MovieSearchParams, PersonSearchParams } from '@kakamu/types';

export const searchKeys = {
  all: ['search'] as const,
  movies: (params: MovieSearchParams) => [...searchKeys.all, 'movies', params] as const,
  persons: (params: PersonSearchParams) => [...searchKeys.all, 'persons', params] as const,
};
