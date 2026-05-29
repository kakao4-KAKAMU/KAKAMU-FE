export const personaKeys = {
  all: ['persona'] as const,
  lists: () => [...personaKeys.all, 'list'] as const,
  list: () => [...personaKeys.lists(), 'all'] as const,
  detail: (personaId: string) => [...personaKeys.all, 'detail', personaId] as const,
  genres: () => [...personaKeys.all, 'genres'] as const,
};
