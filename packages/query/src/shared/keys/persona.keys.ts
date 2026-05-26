export const personaKeys = {
  all: ['persona'] as const,
  genres: () => [...personaKeys.all, 'genres'] as const,
};
