export const movieKeys = {
  all: ['movie'] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (movieId: string) => [...movieKeys.details(), movieId] as const,
  toEvaluateLists: () => [...movieKeys.all, 'toEvaluate'] as const,
  toEvaluate: (params: import('@kakamu/types').MovieToEvaluateParams) =>
    [...movieKeys.toEvaluateLists(), params] as const,
};
