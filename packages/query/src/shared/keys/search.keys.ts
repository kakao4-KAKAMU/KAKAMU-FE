import type { FeedSearchParams, MovieSearchParams, PersonSearchParams } from '@kakamu/types';

export const searchKeys = {
  all: ['search'] as const,
  lists: () => [...searchKeys.all, 'list'] as const,
  movies: (params: Omit<MovieSearchParams, 'skip' | 'limit'>) =>
    [...searchKeys.lists(), 'movies', params] as const,
  persons: (params: Omit<PersonSearchParams, 'skip' | 'limit'>) =>
    [...searchKeys.lists(), 'persons', params] as const,
  feeds: (params: Omit<FeedSearchParams, 'cursor' | 'limit'>) =>
    [...searchKeys.lists(), 'feeds', params] as const,
};
