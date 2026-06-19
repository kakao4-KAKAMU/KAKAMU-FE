import type { ContentSearchParams, TabSearchParams } from '@kakamu/types';

export const searchKeys = {
  all: ['search'] as const,
  trend: (limit?: number) => [...searchKeys.all, 'trend', { limit }] as const,
  lists: () => [...searchKeys.all, 'list'] as const,
  movies: (params: import('@kakamu/types').MovieSearchParams) =>
    [...searchKeys.lists(), 'movies', params] as const,
  persons: (params: import('@kakamu/types').PersonSearchParams) =>
    [...searchKeys.lists(), 'persons', params] as const,
  feeds: (params: import('@kakamu/types').FeedSearchParams) =>
    [...searchKeys.lists(), 'feeds', params] as const,
  user: (params: Omit<TabSearchParams, 'cursor'>) =>
    [...searchKeys.lists(), 'user', params] as const,
  live: (params: Omit<TabSearchParams, 'cursor'>) =>
    [...searchKeys.lists(), 'live', params] as const,
  forYou: (params: Omit<TabSearchParams, 'cursor'>) =>
    [...searchKeys.lists(), 'for-you', params] as const,
  content: (params: Omit<ContentSearchParams, 'cursor'>) =>
    [...searchKeys.lists(), 'content', params] as const,
};
