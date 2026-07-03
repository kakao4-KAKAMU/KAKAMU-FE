export const movieKeys = {
  all: ['movie'] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (movieId: string) => [...movieKeys.details(), movieId] as const,
  detailFulls: () => [...movieKeys.all, 'detailFull'] as const,
  detailFull: (movieId: string) => [...movieKeys.detailFulls(), movieId] as const,
  toEvaluateLists: () => [...movieKeys.all, 'toEvaluate'] as const,
  toEvaluate: (params: import('@kakamu/types').MovieToEvaluateParams) =>
    [...movieKeys.toEvaluateLists(), params] as const,
  savedLists: () => [...movieKeys.all, 'saved'] as const,
  savedList: (params: Omit<import('@kakamu/types').SavedMovieListParams, 'cursor'>) =>
    [...movieKeys.savedLists(), params] as const,
  recommends: () => [...movieKeys.all, 'recommend'] as const,
  recommend: (params: import('@kakamu/types').MovieRecommendParams) =>
    [...movieKeys.recommends(), params] as const,
};
